# 검색엔진 등록 안내

## 공식 사이트 정보

- 사이트 이름: So Do Not Fear
- 공식 주소: https://sodonotfear.com/
- Sitemap: https://sodonotfear.com/sitemap.xml
- Robots: https://sodonotfear.com/robots.txt
- AI용 공개 요약: https://sodonotfear.com/llms.txt

## 적용된 최적화

- 고유한 페이지 제목과 설명
- canonical과 한국어 hreflang
- 검색 로봇 색인 허용
- Open Graph와 X(Twitter) 공유 메타데이터
- Organization, WebSite, WebPage, VideoObject, FAQPage JSON-LD 구조화 데이터
- 이미지와 영상 정보가 포함된 XML sitemap
- JavaScript를 실행하지 않아도 읽을 수 있는 핵심 콘텐츠
- 질문과 답변 형식의 공개 안내
- 네이버와 Google 사이트 소유권 확인 태그
- `llms.txt` 보조 요약

`llms.txt`는 커뮤니티 제안 형식이며 검색 순위나 AI 답변 노출을 보장하지 않는다. 실제 페이지의 명확한 콘텐츠, 출처, 구조화 데이터와 최신 정보 유지가 우선이다.

## Google Search Console

1. https://search.google.com/search-console 에 로그인한다.
2. `https://sodonotfear.com/` URL 접두어 속성을 추가한다.
3. HTML 태그 방식으로 소유권 확인을 실행한다.
4. `sitemap.xml`을 제출한다.
5. URL 검사에서 `https://sodonotfear.com/`의 색인 생성을 요청한다.

현재 확인 태그:

```html
<meta name="google-site-verification" content="JJe_kR4Po0XtktfA4Ueo1ctwApZzludMs4xIx9BEOnQ">
```

## 네이버 서치어드바이저

1. https://searchadvisor.naver.com/ 에 로그인한다.
2. `https://sodonotfear.com`을 사이트로 추가한다.
3. HTML 태그 방식으로 소유권 확인을 실행한다.
4. 요청 메뉴에서 `robots.txt`와 `sitemap.xml`을 확인·제출한다.
5. URL 검사 또는 웹 페이지 수집 요청에서 메인 주소를 제출한다.

현재 확인 태그:

```html
<meta name="naver-site-verification" content="90a71179b111dd3c55d1baa24fe77d1b9d9706e1">
```

## Bing Webmaster Tools

1. https://www.bing.com/webmasters/ 에 로그인한다.
2. Google Search Console에서 사이트를 가져오거나 사이트를 직접 추가한다.
3. `https://sodonotfear.com/sitemap.xml`을 제출한다.
4. URL 검사에서 메인 주소를 확인한다.

## 콘텐츠 변경 시

1. 화면에 표시되는 공지와 `content/site-data.json`을 함께 수정한다.
2. 구조화 데이터와 화면 정보가 서로 일치하는지 확인한다.
3. 중요한 본문 변경이 있으면 `sitemap.xml`의 `lastmod`를 실제 변경일로 갱신한다.
4. 배포 후 canonical, robots, sitemap, 구조화 데이터와 외부 링크를 확인한다.
5. 검색엔진 반영에는 시간이 걸릴 수 있으며 색인이나 노출 순위는 보장되지 않는다.
