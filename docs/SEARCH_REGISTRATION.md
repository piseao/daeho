# 검색 등록 운영 메모

이 문서는 화면 디자인을 변경하지 않고 검색 등록과 SEO 설정을 관리하기 위한 메모입니다.

## 공식 주소

- 홈페이지: `https://sodonotfear.com/`
- 사이트맵: `https://sodonotfear.com/sitemap.xml`
- robots: `https://sodonotfear.com/robots.txt`

## 적용된 검색 설정

- 대표 URL(canonical)
- 검색 설명(description)과 robots 지시문
- Open Graph 및 소셜 공유 메타 정보
- Organization, WebSite, WebPage, Service와 FAQPage 구조화 데이터
- 네이버 및 구글 소유권 확인 메타 태그

현재 홈페이지가 명확히 설명하는 주제:

- So Do Not Fear 기독교 AI·IT 선교단체
- 교회·선교단체를 위한 AI·IT 선교 지원
- 교회·선교단체 홈페이지 제작과 운영 세팅
- AI 활용 교육, 콘텐츠 정리, 번역·자막과 반복 업무 지원
- 무료 공개 자료와 맞춤형 1:1·원격 지원

이 문구들은 검색어를 반복하기 위한 목록이 아니라 홈페이지의 실제 정체성과 제공 내용을 일관되게 관리하기 위한 기준이다.

## AEO·GEO·SEO 운영 원칙

AEO와 GEO를 위한 별도의 공식 만능 태그는 없다. 검색엔진과 답변형·생성형 서비스가 내용을 정확히 이해하고 인용할 수 있도록 사람에게 유용한 원문을 명확하게 작성하는 것을 우선한다.

- 제목, 설명, 본문의 조직 이름과 사명을 일관되게 유지한다.
- 중요한 정보는 이미지나 영상에만 넣지 않고 HTML 본문 텍스트로 제공한다.
- 질문에는 문맥 없이 읽어도 이해되는 짧고 직접적인 답을 제공한다.
- FAQ 구조화 데이터는 화면에 실제로 보이는 질문과 답변에만 적용한다.
- 신앙, 서비스 범위, 무료·유료 조건과 지원 대상을 구체적으로 구분한다.
- 새로운 강의와 사례는 고유 URL을 가진 글로 발행하고 작성일·수정일·작성 주체를 표시한다.
- 영상에는 제목, 설명, 자막 또는 핵심 내용을 정리한 본문을 함께 제공한다.
- AI로 만든 초안은 사실, 신학, 개인정보와 저작권을 사람이 검토한 뒤 공개한다.
- 검색 순위나 AI 답변 노출을 보장한다고 표현하지 않는다.
- 키워드 반복, 숨겨진 문구와 AI를 조종하려는 지시문을 넣지 않는다.

### 현재 공식 답변 문장

- 정체성: `SO DO NOT FEAR는 기독교 공동체와 선교 현장을 AI·IT 기술로 돕는 선교단체입니다.`
- 지원 대상: `기술 인력과 예산이 부족한 교회·선교단체의 담당자입니다.`
- 주요 지원: `홈페이지 제작, AI 활용 교육, 콘텐츠 정리, 번역·자막과 운영 세팅입니다.`
- 비용 기준: `공개 자료는 무료이며, 맞춤 제작·1:1 교육·원격 세팅은 범위와 비용을 사전에 안내합니다.`

이 문장들은 홈, 소개, AI·IT 선교, 홈페이지 제작·교육과 문의 페이지에서 같은 의미로 유지한다. FAQ는 실제 화면에 보이는 질문과 답변이 있는 `홈페이지 제작·교육` 페이지에만 구조화 데이터로 연결한다.

참고 기준:

- [Google Search 개발자 가이드](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- [Google SEO 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Bing 웹마스터 가이드라인](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a)

## 월별 검색 점검

1. 홈페이지 제목, 설명과 실제 본문이 일치하는지 확인한다.
2. 구조화 데이터의 JSON 문법과 화면 콘텐츠 일치 여부를 확인한다.
3. 사이트맵에는 공개된 canonical URL만 포함하고 실제 수정일만 기록한다.
4. Search Console과 네이버 서치어드바이저의 수집·색인 오류를 확인한다.
5. 깨진 내부·외부 링크와 모바일 화면을 확인한다.
6. 사람들이 실제로 묻는 반복 질문을 FAQ와 강의 문서에 반영한다.
7. 새 영상에는 자막과 홈페이지 또는 관련 문서 링크를 추가한다.

## 검색 서비스 등록

### 네이버 서치어드바이저

1. `https://sodonotfear.com/` 사이트 소유권 확인
2. 요청 > 사이트맵 제출에서 `sitemap.xml` 제출
3. 검증 > robots.txt에서 수집 가능 여부 확인

현재 확인 코드: `90a71179b111dd3c55d1baa24fe77d1b9d9706e1`

### Google Search Console

1. URL 접두어 속성에 `https://sodonotfear.com/` 등록
2. HTML 태그 방식으로 소유권 확인
3. Sitemaps에서 `sitemap.xml` 제출

현재 확인 코드: `JJe_kR4Po0XtktfA4Ueo1ctwApZzludMs4xIx9BEOnQ`

## 향후 칼럼 운영 원칙

- 칼럼 기능은 홈페이지 디자인과 분리해 별도 목록 및 개별 글 구조로 설계합니다.
- 실제로 제공될 원고가 확정된 뒤 게시하며 임의의 예시 글을 공개하지 않습니다.
- 글마다 고유 URL, 제목, 검색 설명, 작성일과 Article 구조화 데이터를 둡니다.
- 개혁주의 신학 관점의 글은 게시 전 목회·신학 검토를 거칩니다.
- 새 글을 공개한 날짜에만 사이트맵의 `lastmod`를 갱신합니다.

## 디지털 선교 최적화 반영 (2026-11-20)

현재 생성 원본은 `content/editorial.json`과 `editorial/*.mjs`이며 `node tools/build-editorial.mjs`로 HTML과 사이트맵을 생성한다. 대표 가이드는 `editorial/digital-mission.mjs`에서 관리한다. 생성 HTML만 수정하면 다음 발행에서 덮어써진다.

- `/digital-mission/`: 정의·실천 순서·역할·운영 원칙·FAQ·지원 안내와 관련 자료.
- `/stories/start-digital-mission-small-church/`: 새 시작 안내 글.
- 기존 홈페이지 아카이브, SNS 연결, AI 활용, 성과 측정 글은 URL과 최초 발행일을 유지하고 실제 수정일을 표시했다.
- 작성 명의는 기존 글에서 사용하는 SO DO NOT FEAR다. 별도의 실명 작성자나 목회·신학 검토 완료를 주장하지 않는다.
- 기관 @id는 `https://sodonotfear.com/#organization`으로 통일했다. sameAs는 설정에 등록된 YouTube·Instagram만 사용하며 기관의 법적 지위·파트너·실적을 추가하지 않았다. 채널 소유권은 계정 수준에서 재인증하지 않았다.
- 본문과 일치하지 않던 FAQPage는 제거했다. 대표 페이지의 FAQ는 사람이 읽는 HTML로 제공한다.
- 메인에도 Google·네이버 소유권 확인 태그를 복원했다. 태그 존재는 계정 인증 완료나 색인 완료를 뜻하지 않는다.
- robots.txt는 기존의 전체 공개 허용과 `/admin/` 차단을 유지한다. 별도 에이전트 규칙이 없으므로 Googlebot·Bingbot·OAI-SearchBot에도 전체 규칙이 적용된다. GPTBot 정책은 변경하지 않았다. 호스팅 측 IP별 필터링 여부는 확인하지 않았다.

검증 명령: `node qa/seo.test.mjs`, `node qa/editorial.test.mjs`, `node qa/catalog.test.mjs`.

### 등록과 반영 상태

2026-11-20 공개 사이트 확인 시 홈·robots.txt·sitemap.xml은 응답했고 `/digital-mission/`은 404였다. 이 기록은 구현 전 배포 상태이며 새 페이지의 색인·AI 인용이 확인된 것은 아니다. 기존 작업 폴더의 커밋 차이와 미커밋 변경을 보존하기 위해 별도 checkout의 최신 원격 main을 기준으로 이번 SEO·콘텐츠 변경만 통합했다. 검증 후 main에 반영하고 GitHub Pages에서 새 URL의 200 응답을 확인한다.

배포 후 계정 소유자가 확인할 항목:

1. Google Search Console의 `https://sodonotfear.com/` 속성에서 기존 확인 태그로 소유권을 확인하고 `https://sodonotfear.com/sitemap.xml`을 제출한다. URL 검사로 대표 페이지와 새 글의 색인 가능 여부를 확인한다.
2. Bing Webmaster Tools에서 소유권을 확인하거나 Search Console 속성을 가져온 뒤 같은 사이트맵을 제출한다. 별도 확인 코드가 발급되면 임의 코드 대신 실제 값을 적용한다.
3. 네이버 서치어드바이저에서 기존 사이트 소유권과 사이트맵 제출 상태를 확인한다.
4. 이 작업에서는 각 검색 계정에 접근하거나 사이트맵을 제출하지 않았다. 검색 등록·색인·추천 순위·AI 인용은 별도 상태다.

### 측정 기록

주 1회 또는 월 1회 같은 질문을 확인하고 다음 항목을 기록한다: 확인일, 서비스명·모델, 검색 사용 여부, 질문 원문, 브랜드 언급 여부, 실제 인용 URL, 관련성 메모. 질문은 ‘디지털 선교란 무엇인가요?’, ‘작은 교회는 디지털 선교를 어떻게 시작하나요?’, ‘교회와 선교단체의 디지털 선교를 돕는 곳은 어디인가요?’로 시작할 수 있다. 반복 질문만으로 보편적 추천 확률을 추정하지 않는다.

Search Console의 검색어별 노출·클릭·페이지별 색인과 확인된 문의를 함께 본다. 분석 도구·쿠키·추적 코드는 이번에 추가하지 않았다. 외부 폼의 실제 문의 수는 관리자가 확인하며 개인정보는 공개 기록에 포함하지 않는다.

공식 기술 근거:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.openai.com/api/docs/bots
- https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
