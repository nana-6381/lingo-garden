(function(root){
const L=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'],V=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'],T=['',...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
const vc={'ㅗㅏ':'ㅘ','ㅗㅐ':'ㅙ','ㅗㅣ':'ㅚ','ㅜㅓ':'ㅝ','ㅜㅔ':'ㅞ','ㅜㅣ':'ㅟ','ㅡㅣ':'ㅢ'},tc={'ㄱㅅ':'ㄳ','ㄴㅈ':'ㄵ','ㄴㅎ':'ㄶ','ㄹㄱ':'ㄺ','ㄹㅁ':'ㄻ','ㄹㅂ':'ㄼ','ㄹㅅ':'ㄽ','ㄹㅌ':'ㄾ','ㄹㅍ':'ㄿ','ㄹㅎ':'ㅀ','ㅂㅅ':'ㅄ'};
const reverse=m=>Object.fromEntries(Object.entries(m).map(([k,v])=>[v,[...k]])),vs=reverse(vc),ts=reverse(tc);
function parts(c){const n=c.charCodeAt(0)-44032;return n>=0&&n<11172?[L[Math.floor(n/588)],V[Math.floor(n%588/28)],T[n%28]]:null}function syll(l,v,t=''){return String.fromCharCode(44032+L.indexOf(l)*588+V.indexOf(v)*28+T.indexOf(t))}
function append(text,key){if(!text)return key;const last=text.slice(-1),base=text.slice(0,-1),p=parts(last);if(V.includes(key)){if(L.includes(last))return base+syll(last,key);if(p){if(!p[2])return vc[p[1]+key]?base+syll(p[0],vc[p[1]+key]):text+key;const split=ts[p[2]]||['',p[2]];return base+syll(p[0],p[1],split[0])+syll(split[1],key)}}else if(T.includes(key)&&key){if(p&&!p[2])return base+syll(p[0],p[1],key);if(p&&tc[p[2]+key])return base+syll(p[0],p[1],tc[p[2]+key])}return text+key}
function backspace(text){if(!text)return text;const base=text.slice(0,-1),p=parts(text.slice(-1));if(!p)return base;if(p[2])return base+syll(p[0],p[1],ts[p[2]]?.[0]||'');if(vs[p[1]])return base+syll(p[0],vs[p[1]][0]);return base+p[0]}
const api={append,backspace};root.HangulComposer=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
