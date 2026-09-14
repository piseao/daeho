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

- So Do Not Fear 개혁주의 예배팀
- 5솔라와 튤립, 예수 그리스도의 생명과 하나님의 함께하심
- 교회·선교단체 무료 홈페이지 제작 강의
- 1:1·원격 홈페이지 세팅과 교육
- 그리스도인의 바이브 코딩과 AI·IT 선교 지원

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
