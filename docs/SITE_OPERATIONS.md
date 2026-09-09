# 홈페이지 운영 기준

## 목적

이 홈페이지는 교회·선교단체·예배팀의 공개 정보 전달을 위한 정적 홈페이지로 운영한다.

- 홈페이지: GitHub Pages
- 배포 주소: https://piseao.github.io/daeho/
- 원본 저장소: https://github.com/piseao/daeho
- 배포 방식: `main` 브랜치에 push하면 GitHub Pages에 자동 반영

## 외부 서비스 사용 원칙

- 커뮤니케이션: 각 교회 또는 단체의 기존 카카오톡, 전화, 이메일 채널 사용
- 기도제목: Padlet 사용
- 사진: Google 포토 공유 앨범 사용
- 영상: YouTube 사용
- 후원: 교회 또는 단체 명의 계좌 안내, 필요하면 외부 후원 링크 연결
- 일정: 필요할 때 Google Calendar 공개 일정 연결
- 위치: 예배 장소 확정 후 지도 링크 또는 지도 API 연결

회원 관리, 비공개 게시판, 개인정보 저장 기능은 현재 홈페이지에 직접 만들지 않는다.

## 공개 저장소 보안 기준

저장소에 올려도 되는 항목:

- HTML, CSS, JavaScript
- 공개 공지와 일정
- 공개 이미지
- YouTube 공개 영상 주소
- Padlet 공개 방문 링크
- Google 포토 공개 앨범 링크

저장소에 올리면 안 되는 항목:

- 비밀번호와 계정 인증 정보
- API 비밀키와 관리자 키
- OAuth Client Secret
- 서비스 계정 JSON 파일
- Padlet 관리자 또는 편집 전용 링크
- 후원자 명단과 개인정보
- 결제 처리용 비밀정보

## 콘텐츠 관리 주의사항

- 얼굴이 식별되는 사진은 공개 동의를 확인한다.
- 아동 사진은 보호자 동의와 공개 범위를 특히 주의한다.
- Google 포토 공유 링크는 다른 사람이 재공유할 수 있음을 고려한다.
- Padlet에는 민감한 개인정보를 작성하지 않도록 안내한다.
- Padlet 게시물 승인·삭제를 담당할 관리자를 정한다.
- 후원 계좌는 가능하면 교회 또는 단체 명의 계좌를 사용한다.
- 후원 목적과 사용 내역을 명확하게 안내한다.

## 다른 환경에서 작업하는 방법

처음 작업할 때:

```bash
git clone https://github.com/piseao/daeho.git
cd daeho
```

이미 clone한 저장소에서 다시 작업할 때:

```bash
git pull origin main
```

작업 후:

```bash
git add .
git commit -m "변경 내용"
git push origin main
```

## AI에게 작업을 요청하는 예시

> https://github.com/piseao/daeho 저장소를 clone하고 `docs/SITE_OPERATIONS.md`의 운영 기준을 확인한 다음 홈페이지를 수정해줘. 기존 디자인과 사용자 변경 사항을 유지하고, 검증 후 main 브랜치에 push해서 GitHub Pages 배포까지 확인해줘.

## 작업 전후 확인사항

1. 작업 전에 항상 `git pull origin main`으로 최신 내용을 받는다.
2. 동시에 여러 곳에서 같은 파일을 수정하지 않는다.
3. 변경 전 `git status`로 기존 작업이 있는지 확인한다.
4. 변경 후 모바일과 데스크톱 화면을 확인한다.
5. 외부 링크, YouTube, Padlet, 데이터 파일이 정상 작동하는지 확인한다.
6. GitHub Pages 배포가 완료된 뒤 실제 주소에서 다시 확인한다.

