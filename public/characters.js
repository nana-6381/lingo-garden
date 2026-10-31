// Original flat characters drawn to the construction rules in the character design guide:
// blocky rounded head and body, detached limbs, big white eyes, brows carry the emotion,
// flat fills with no outlines, one dominant outfit colour, one signature shape, grey ground shadow.
(() => {
const ink = '#3c3c3c';
const cast = {
  // Minji, barista: orange apron, hair bun
  minji: {skin:'#f7c9a6', hair:ink, outfit:'#ff9600', outfitDark:'#e08200', sig:'bun'},
  // Jun, local guide: blue outfit, cap
  jun: {skin:'#dfa57c', hair:ink, outfit:'#1cb0f6', outfitDark:'#1899d6', sig:'cap'},
  // Hana, gift-shop owner: purple bob, yellow headband
  hana: {skin:'#f9d5b9', hair:'#ce82ff', outfit:'#ce82ff', outfitDark:'#a568cc', sig:'headband'},
  // Bridge shopkeeper: red bandana, white apron
  clerk: {skin:'#eab48c', hair:'#4b4b4b', outfit:'#ff4b4b', outfitDark:'#d93a3a', sig:'bandana'}
};
const alias = {cafe:'minji', directions:'jun', shop:'hana'};

function hair(c) {
  switch (c.sig) {
    case 'bun': return `<circle cx="60" cy="10" r="11" fill="${c.hair}"/><path d="M28 40 Q28 14 60 14 Q92 14 92 40 L92 34 Q80 24 60 26 Q40 24 28 34Z" fill="${c.hair}"/>`;
    case 'cap': return `<path d="M26 26 Q26 4 60 4 Q94 4 94 26Z" fill="${c.outfit}"/><rect x="58" y="21" width="46" height="7" rx="3.5" fill="${c.outfitDark}"/><circle cx="60" cy="4" r="4" fill="${c.outfitDark}"/>`;
    case 'headband': return `<path d="M22 70 L22 34 Q22 8 60 8 Q98 8 98 34 L98 70 L89 70 L89 26 L31 26 L31 70Z" fill="${c.hair}"/><rect x="29" y="16" width="62" height="7" rx="3.5" fill="#ffc800"/>`;
    case 'bandana': return `<path d="M28 27 Q28 9 60 9 Q92 9 92 27Z" fill="${c.outfit}"/><path d="M90 20 L104 14 L100 28Z" fill="${c.outfit}"/><circle cx="46" cy="20" r="2.5" fill="#fff"/><circle cx="62" cy="15" r="2.5" fill="#fff"/><circle cx="76" cy="20" r="2.5" fill="#fff"/>`;
  }
  return '';
}

function face(mood) {
  // pupils, brows and mouth carry the emotion
  const look = {idle:[0,1], happy:[0,0], confused:[2,-1], talk:[0,1]}[mood] || [0,1];
  const brows = {
    idle: '<path d="M40 31 L55 31" /><path d="M65 31 L80 31" />',
    happy: '<path d="M40 31 Q47 25 55 30" /><path d="M65 30 Q73 25 80 31" />',
    confused: '<path d="M40 28 L55 33" /><path d="M65 31 Q73 24 80 29" />',
    talk: '<path d="M40 30 Q47 27 55 30" /><path d="M65 30 Q73 27 80 30" />'
  }[mood] || '';
  const mouth = {
    idle: `<path d="M53 62 Q60 66 67 62" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    happy: `<path d="M50 59 Q60 74 70 59Z" fill="#8f2b2b"/><path d="M54 66 Q60 71 66 66 Q60 63 54 66Z" fill="#ff8a8a"/>`,
    confused: `<ellipse cx="62" cy="63" rx="4" ry="3.5" fill="#8f2b2b"/>`,
    talk: `<ellipse cx="60" cy="63" rx="6" ry="5" fill="#8f2b2b"/>`
  }[mood] || '';
  return `<ellipse cx="48" cy="45" rx="8.5" ry="10.5" fill="#fff"/><ellipse cx="72" cy="45" rx="8.5" ry="10.5" fill="#fff"/>
    <circle cx="${49 + look[0]}" cy="${47 + look[1]}" r="4.6" fill="${ink}"/><circle cx="${73 + look[0]}" cy="${47 + look[1]}" r="4.6" fill="${ink}"/>
    <circle cx="${50.5 + look[0]}" cy="${45 + look[1]}" r="1.4" fill="#fff"/><circle cx="${74.5 + look[0]}" cy="${45 + look[1]}" r="1.4" fill="#fff"/>
    <g stroke="${ink}" stroke-width="3.4" stroke-linecap="round" fill="none">${brows}</g>${mouth}`;
}

function svg(id, mood = 'idle', size = 64) {
  const c = cast[alias[id] || id] || cast.clerk;
  const apron = c.sig === 'bandana' || c.sig === 'bun' ? `<rect x="46" y="84" width="28" height="24" rx="6" fill="#fff" opacity=".92"/>` : '';
  return `<svg class="lg-char lg-char-${mood}" viewBox="0 0 120 140" width="${size}" height="${Math.round(size * 140 / 120)}" aria-hidden="true" focusable="false">
    <rect x="28" y="130" width="64" height="7" rx="3.5" fill="#e5e5e5"/>
    <rect x="43" y="110" width="12" height="16" rx="6" fill="${c.outfitDark}"/><rect x="65" y="110" width="12" height="16" rx="6" fill="${c.outfitDark}"/>
    <rect x="39" y="122" width="18" height="7" rx="3.5" fill="#4b4b4b"/><rect x="63" y="122" width="18" height="7" rx="3.5" fill="#4b4b4b"/>
    <rect x="18" y="80" width="11" height="26" rx="5.5" fill="${c.skin}" transform="rotate(${mood === 'happy' ? -28 : 8} 23 80)"/>
    <rect x="91" y="80" width="11" height="26" rx="5.5" fill="${c.skin}" transform="rotate(${mood === 'confused' ? -40 : -8} 97 80)"/>
    <rect x="33" y="74" width="54" height="40" rx="14" fill="${c.outfit}"/>${apron}
    <rect x="28" y="16" width="64" height="62" rx="22" fill="${c.skin}"/>
    ${hair(c)}${face(mood)}</svg>`;
}

window.LGCharacters = { svg, cast: Object.keys(cast) };
})();
