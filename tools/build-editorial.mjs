import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { buildFiles } from '../editorial/render.mjs';

const d = JSON.parse(await readFile(new URL('../content/editorial.json', import.meta.url), 'utf8'));
const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': 'https://sodonotfear.com/#organization', name: 'SO DO NOT FEAR', url: 'https://sodonotfear.com/', description: d.settings.description, sameAs: [d.settings.youtube, d.settings.instagram, 'https://github.com/piseao/daeho'] },
    { '@type': 'WebSite', '@id': 'https://sodonotfear.com/#website', url: 'https://sodonotfear.com/', name: 'SO DO NOT FEAR', publisher: { '@id': 'https://sodonotfear.com/#organization' }, inLanguage: 'ko-KR' },
    { '@type': 'Service', name: '기독교 선교를 위한 AI·IT 지원', provider: { '@id': 'https://sodonotfear.com/#organization' }, serviceType: ['AI·IT 선교 지원', '교회·선교단체 홈페이지 제작', 'AI 활용 교육과 운영 세팅'], areaServed: '교회와 선교단체', description: '기독교 공동체와 선교 현장이 AI와 디지털 기술을 안전하게 활용하도록 돕는 교육·제작·운영 지원' },
    { '@type': 'FAQPage', mainEntity: [
      { '@type': 'Question', name: 'SO DO NOT FEAR는 어떤 단체인가요?', acceptedAnswer: { '@type': 'Answer', text: 'SO DO NOT FEAR는 기독교 공동체와 선교 현장을 AI·IT 기술로 돕는 선교단체입니다.' } },
      { '@type': 'Question', name: '무엇을 지원하나요?', acceptedAnswer: { '@type': 'Answer', text: '교회·선교단체 홈페이지 제작, AI 활용 교육, 콘텐츠 정리, 번역·자막과 운영 세팅을 지원합니다.' } },
      { '@type': 'Question', name: '무료로 이용할 수 있나요?', acceptedAnswer: { '@type': 'Answer', text: '공개 문서와 예제는 무료로 제공하며, 맞춤 제작·1:1 교육·원격 세팅은 범위와 비용을 사전에 안내합니다.' } },
    ] },
  ],
};

const rewrite = (content, path) => {
  if (typeof content !== 'string') return content;
  let result = content
    .replaceAll('WORSHIP & LIFE JOURNAL', 'AI · IT FOR MISSION')
    .replaceAll('함께하기 ↗', '지원 요청 ↗')
    .replaceAll('예배와 공동체', 'AI·IT 선교')
    .replaceAll('소개와 신앙고백', '우리가 돕는 일')
    .replaceAll('예수 그리스도의 복음 안에서,<br>두려운 일상을 함께 걷습니다.', '복음의 현장을 위한 기술을 만듭니다.<br>교회와 선교단체를 AI·IT로 돕습니다.')
    .replaceAll('© SO DO NOT FEAR · 말씀과 예배로 함께하는 일상', '© SO DO NOT FEAR · AI · IT FOR MISSION')
    .replaceAll('두려운 일상을 함께 걷는 이야기 | So Do Not Fear', '복음의 현장을 위한 기술 | So Do Not Fear')
    .replaceAll('두려운 일상을 함께 걷는 이야기', '복음의 현장을 위한 기술')
    .replace('meta name="theme-color" content="#f8f7f3"', 'meta name="theme-color" content="#1d1d1f"><meta name="robots" content="index,follow"><meta name="author" content="SO DO NOT FEAR"');
  if (path === 'index.html' || path === 'learn/index.html') {
    const schema = path === 'index.html' ? { ...homeSchema, '@graph': homeSchema['@graph'].filter((item) => item['@type'] !== 'FAQPage') } : homeSchema;
    result = result.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script></head>`);
  }
  return result;
};

for (const [path, rawContent] of Object.entries(buildFiles(d))) {
  const url = new URL(`../${path}`, import.meta.url);
  await mkdir(new URL('.', url), { recursive: true });
  await writeFile(url, rewrite(rawContent, path));
}

console.log('Editorial pages built. Existing walk and journey untouched.');
