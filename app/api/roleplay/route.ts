import { env } from 'cloudflare:workers';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import {scenarios,TurnSchema,ScoreSchema,instructions} from '../../../lib/roleplay';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 try{
  if(Number(request.headers.get('content-length')||0)>24000)return json({error:'Conversation is too long.'},413);
  let body:Record<string, any>;try{body=await request.json()}catch{return json({error:'Send a valid JSON conversation.'},400)}
  if(!body||typeof body!=='object')return json({error:'Send a valid JSON conversation.'},400);
  // own keys only, so "constructor" or "__proto__" can't pass as a scenario
  const s=typeof body.scenario==='string'&&Object.hasOwn(scenarios,body.scenario)?scenarios[body.scenario as keyof typeof scenarios]:undefined;
  if(!s||!['A1','A2'].includes(body.level)||!['chat','score'].includes(body.mode))return json({error:'Choose a valid scenario and level.'},400);
  const messages=body.messages;if(!Array.isArray(messages)||messages.length<2||messages.length>18||messages.some((m:any)=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'||!m.content.trim()||m.content.length>800))return json({error:'Send a short conversation with at most 8 replies.'},400);
  const userTurns=messages.filter((m:any)=>m.role==='user').length;if(userTurns<1||userTurns>8)return json({error:'Use between 1 and 8 learner replies.'},400);
  if(messages[0].role!=='assistant'||messages.at(-1).role!=='user'&&body.mode==='chat')return json({error:'Invalid conversation sequence.'},400);
  for(let i=1;i<messages.length;i++)if(messages[i].role===messages[i-1].role)return json({error:'Invalid conversation sequence.'},400);
  const vars=env as unknown as Record<string,string|undefined>;
  const key=vars.ANTHROPIC_API_KEY;
  if(!key)return json({error:'Roleplay is waiting for its server API key.'},503);
  const language=({en:'English',zh:'Simplified Chinese',ms:'Malay'} as Record<string,string>)[body.language]||'English';
  const score=body.mode==='score';
  // The Messages API needs a user turn first; the scenario opener is the character's first line.
  const history:Anthropic.Beta.BetaMessageParam[]=[{role:'user',content:'(The learner enters the scene.)'},...messages.map((m:any)=>({role:m.role,content:m.content}))];
  const client=new Anthropic({apiKey:key,maxRetries:1,timeout:45000});
  let message;
  try{
   message=await client.beta.messages.parse({
    model:vars.CLAUDE_MODEL||'claude-opus-5-5',
    max_tokens:score?8000:4000,
    system:instructions(s,body.level,language,score),
    messages:history,
    // chat turns are latency-sensitive; the scorecard gets a little more thought
    output_config:{effort:score?'medium':'low',format:betaZodOutputFormat(score?ScoreSchema:TurnSchema)},
    // if a safety classifier declines, retry server-side on Anthropic's recommended model
    betas:['server-side-fallback-2026-07-01'],
    fallbacks:'default',
   });
  }catch(error){
   if(error instanceof Anthropic.RateLimitError)return json({error:'The AI service is busy. Please wait briefly and retry.'},429);
   if(error instanceof Anthropic.AuthenticationError||error instanceof Anthropic.PermissionDeniedError)return json({error:'The server API key needs attention.'},502);
   if(error instanceof Anthropic.BadRequestError)return json({error:'Claude could not take this request. The site owner should check the Claude API key and billing. Your chat is saved.'},502);
   if(error instanceof Anthropic.APIConnectionError)return json({error:'Could not reach the AI service. Please retry.'},502);
   throw error;
  }
  if(message.stop_reason==='refusal')return json({error:'The AI declined this reply. Try rephrasing your message.'},502);
  const result=message.parsed_output as Record<string,any>|null;
  if(!result||message.stop_reason==='max_tokens')return json({error:'The model did not return a usable reply. Please retry.'},502);
  if(result.goalsMet?.length!==3)return json({error:'The reply was incomplete. Please retry.'},502);
  if(score)for(const k of ['accuracy','complexity','appropriateness'])result[k]=Math.max(0,Math.min(100,Math.round(result[k])));
  return json(result);
 }catch{return json({error:'Unable to finish this request. Your chat is kept so you can retry.'},502)}
}
