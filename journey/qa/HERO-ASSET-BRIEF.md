# 주요 인물 제작·연결 명세

현재 주요 인물 최종 모델은 없다. 일반 NPC는 자체 제작한 경량 절차형 시안이며 마리아·요셉·아기 예수님의 최종 모델을 대신하지 않는다. 현재 탄생 시네마틱은 공간·카메라·자막 연출이며 구유에 아기 모델이 없다. 방문자에게도 해당 장면에 제작 중임을 표시한다.

## 직접 구현한 것과 추가로 필요한 것

직접 구현: Three.js 환경, 이동·충돌, 일반 NPC 상태 머신과 관절 동작, 타임라인 카메라, 자막, 합성 음악과 음량 ducking, GLB를 넣을 장면 좌표와 이벤트 경계.
추가 제작: 해부학적으로 자연스러운 얼굴·손, 튜닉/겉옷의 옷주름, 스키닝, 제한된 표정, 아기 강보 형태와 구유 배치. 현 단계의 구체/lathe 모델로 주요 인물 완료를 선언하지 않는다.

## 무료 제작 시작점

MakeHuman/MPFB의 **core** 자산은 공식 라이선스에서 CC0로 안내한다. 이는 초기 인체 메시 후보이며 고품질 성경 인물이 자동 완성되는 제품은 아니다. 커뮤니티 의복·머리카락·텍스처는 개별 라이선스를 따로 확인해야 한다. 이 프로젝트에 다운로드하거나 포함한 자산은 없다.

- https://www.makehumancommunity.org/about/license.html
- https://download.makehumancommunity.org/makehuman/faq/can_i_sell_models_created_with_makehuman.html
- https://www.blender.org/about/license/

Blender에서 자체 조형·복식 제작 후 GLB로 전달하는 방법을 권장한다. 캐릭터 외모를 실제 역사적 초상으로 제시하지 않는다. 기존 스튜디오 캐릭터를 복제하지 않는다.

## 파일 계약 (향후 도입)

- `/journey/assets/characters/mary.glb`, `joseph.glb`, `infant.glb`
- 별도 `LICENSE.txt`와 `PROVENANCE.md`: 제작자, 원본 URL/버전, 다운로드 날짜, 수정 내역, 상업적 사용·변형·웹 재배포 및 저작자 표시 조건.
- Y-up, 미터 단위. 성인 키 약 1.65~1.8m 기준. 정면 +Z. 발바닥 원점. 아기는 눕는 자세의 기준점 별도 명시.
- Mary/Joseph: `idle_breathe`, `look_manger`, `hand_rest`, `kneel_idle`; Joseph 추가 `stand_idle`; Infant: `rest_breathe`. 강보 내부의 과장된 신체 동작 금지.
- 내레이션을 전제로 입 모양을 움직이지 않는다. 창작 대사를 역사적 발언처럼 추가하지 않는다.
- 초기 예산(검증 목표): 성인 각 15k~25k triangles, LOD 5k~8k; 1K atlas 기본, 얼굴만 필요 시 2K. 본 50개 이하 목표. 아기 5k~10k. 세 인물 총 전송량 8MB 이하부터 평가.
- 원본 `.blend`도 보관. GLB 검사 후 AnimationMixer와 해당 이벤트를 연결한다. 현재 저장소에는 GLTFLoader/decoder를 아직 추가하지 않았다.
- Meshopt/KTX2는 실제 모델 확인 후 Three.js 버전에 맞는 로더와 라이선스를 동봉하고 로딩·메모리·시각 품질을 비교해서 채택한다. 압축했다고 자동으로 품질 완료로 판단하지 않는다.

## 완료 검수

손/팔 관절 꺾임, 구유·의복 관통, 눈동자 시선, 카메라 근접 얼굴, 피부/옷의 달빛·등불 반응, 모바일 LOD 전환, 월드 퇴장 시 텍스처·Mixer 해제까지 검증해야 한다.
