// Edge-case suite for Bridge's rule-based assess() in public/bridge-app.js.
// Usage: node tests/bridge-edge-cases.mjs [path/to/bridge-app.js]
// "expected" is the pedagogically correct verdict, not what the code currently returns.
import fs from 'node:fs';
const file = process.argv[2] || new URL('../public/bridge-app.js', import.meta.url);
const src = fs.readFileSync(file, 'utf8');
const assess = new Function(src.slice(src.indexOf('function assess('), src.indexOf('function switchPage(')) + '; return assess;')();

const cases = [
  // [id, mode, input, expected, category]
  ['B01','eat','아니요, 여기서 먹을게요.','success','canonical answer'],
  ['B02','eat','아니요, 여기에서 먹을게요.','success','full form -에서 (taught in Guidebook)'],
  ['B03','eat','여기서 먹을게요','success','no punctuation'],
  ['B04','eat','여기에 먹을게요.','location','wrong particle -에'],
  ['B05','eat','아니, 여기서 먹을게.','register','casual ending'],
  ['B06','eat','여기서 먹어.','register','casual ending'],
  ['B07','eat','먹을게요.','clarity','no place stated'],
  ['B08','eat','No, I will eat here.','language','English answer'],
  ['B09','eat','','language','empty'],
  ['B10','eat','   ','language','whitespace only'],
  ['B11','eat','ㅇㅕㄱㅣㅅㅓ ㅁㅓㄱㅇㅡㄹㄱㅔㅇㅛ','language','uncomposed jamo'],
  ['B12','eat','아니요, 매장에서 먹고 갈게요.','success','natural alternative'],
  ['B13','eat','아니요, 먹고 갈게요.','success','common native reply'],
  ['B14','eat','여기서 먹을 거예요.','success','future -을 거예요'],
  ['B15','eat','여기서 식사할게요.','success','formal verb 식사'],
  ['B16','eat','여기서 먹겠습니다.','success','formal -습니다'],
  ['B17','eat','여기서 먹을게요!!','success','trailing punctuation'],
  ['B18','eat','여기서 먹을게요 :)','success','emoticon after ending'],
  ['B19','eat','여기서 먹을게요 ㅎㅎ','success','laughter after ending'],
  ['B20','eat','포장해 주세요.','meaning','opposite intent: takeaway'],
  ['B21','eat','네, 포장해 주세요.','meaning','agrees to takeaway'],
  ['B22','eat','여기서 안 먹을게요.','meaning','negation reverses meaning'],
  ['B23','eat','집에서 먹을게요.','meaning','eat at home = takeaway'],
  ['B24','eat','여기 먹을게요.','clarity','particle dropped'],
  ['B25','eat','여기에서요.','unknown','elliptical answer'],
  ['B26','eat','아니요 여기서 먹을께요.','spelling','misspelling 께요 → 게요'],
  ['B27','eat','<script>alert(1)</script> 여기서 먹을게요.','success','HTML in input (escaped on render)'],
  ['B28','eat','여기서 먹을게요.'.repeat(200),'success','very long input'],
  ['B29','eat','가게 안에서 먹을게요.','success','안에서'],
  ['B30','eat','여기에서 먹을래요.','success','-을래요 ending'],
  ['C01','drink','여기서 마실게요.','success','café transfer'],
  ['C02','drink','여기에 마실게요.','location','café transfer, wrong particle'],
  ['C03','drink','아니요, 커피 여기서 마셔요.','success','café transfer, present tense'],
  ['C04','drink','테이크아웃 아니에요, 여기서 마실게요.','success','refuses takeaway'],
  ['C05','drink','여기서 마실래','register','café transfer, casual'],
];

let pass = 0;
const rows = cases.map(([id, mode, input, expected, category]) => {
  const got = assess(input, mode).kind, ok = got === expected;
  if (ok) pass++;
  return { id, ok: ok ? '✓' : '✗', expected, got, category, input: input.length > 30 ? input.slice(0, 30) + '…' : input };
});
console.table(rows);
console.log(`${pass}/${cases.length} cases match the expected verdict (${Math.round(pass / cases.length * 100)}%).`);
