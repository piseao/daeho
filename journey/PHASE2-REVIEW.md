# Phase 2 — implementation and verification record

## Status
Release candidate verified on 2026-11-11; deploying on explicit user request. Final hero models and recorded narration remain unfinished.
The browser TaskSpace 10 disappeared during the final mobile pass. No replacement browser space was created without permission.

## Previous release gaps
Deployed dbd0a09 already had 20 compounds / 21 roofed rooms, five architectural types, 13 procedural actors, three cinematics, and procedural Web Audio. It had no music files, no proximity observation interactions, no Mary/Joseph cast, abrupt pose changes, and a table-like solid manger. Narration recordings were absent.

## Implemented
- 16 prototype actors: residents (carrier, walker, worker, resting), two shepherds, seven sheep, Mary/Joseph staging prototypes. Grounding/collision preserved; leg, arm, seated and grazing poses blend. Work and sit states are exercised.
- Proximity observation camera for supporting actors and four environment targets: water storage, market tools, house exterior and manger. Water bucket lifts during observation. No invented historical dialogue.
- World-indexed cinematic registry, observation timelines, skip/replay/return, caption callbacks and optional narration hooks. Audio promise race guarded. Portrait distance adjustment and view-ray obstruction constraints.
- 28-second birth sequence; folded linen in a hollow manger; reduced lighting after screenshot review. No Jesus/infant/body-shaped model.
- Five actual original 32-second PCM music files, zone crossfades and three-buffer cache; scene-specific birth and wonder tracks. Other ten worlds retain procedural scores. Existing wind/fire/steps/bleats and saved volume controls retained.
- Cache version 5. No dependency, server or paid API added. /walk/ untouched.

## Evidence
`node journey/qa/regression.mjs`: passed 11 worlds, 33 story locations, 48 collision-sampled paths, five architectural types, 90 seconds of actor simulation. 16 actors, 10 move, six states; minimum actor gap 0.699 units. JavaScript syntax checks pass.
Actual desktop browser: file music village and birth loaded/playing, AudioContext running, nonzero output RMS (0.00567 village / 0.00167 birth), decoded cache max three (16.93 MB at browser output sample rate), no file load failures in those observations. Well observation camera, skip and return operated. Birth timeline reached 19 seconds with matching caption and birth music.
Screenshots saved in this directory's qa folder. Birth screenshot is BEFORE the subsequent hollow-manger and lighting correction; it is retained as evidence of the issue, not a final approved image.
The final lighting/manger changes and mobile viewport have NOT been visually rechecked. No physical phone FPS, mobile sound, full five-track playback, all-world browser regression or final memory-leak test claimed for this release. Prior release tests are documented separately and are not substitutes for Phase 2 QA.

## Remaining / next
1. Resume browser QA with permission for a replacement TaskSpace: final birth framing, shepherd wonder track, natural end/replay, movement recovery, mute and mobile touch/portrait/landscape; frame and memory measurements.
2. Improve prototype cast quality with commissioned/original licensed rigged GLB assets. These procedural characters are not final high-quality hero models. Follow HERO-ASSET-BRIEF.md. Jesus depiction still requires explicit separate approval.
3. Recorded Korean narration with cleared distribution rights; current audio:null scenes use subtitles, not voiceover. No claimed lip sync or recorded environmental crowd sounds.
4. Upgrade working/resting gestures and tool contact, camera path clearance during transitions, and authored musical instrumentation after art review.
5. Deploy after final QA, preserving the remote site's unrelated changes.

Historical/source boundaries: Bible-based Korean summaries are distinct from commentary; buildings, daily gestures and placement are interpretive reconstructions, not confirmed first-century Bethlehem reconstructions. Existing INTEGRATED-REVIEW.md sources remain applicable; no new archaeological certainty is asserted.

## 2026-11-11 verification and release
Desktop browser confirmed final hollow manger/lighting, birth natural end, replay, skip and return. Mobile emulation confirmed shepherd captions and wonder-file transition; touch movement and portrait/landscape screenshots inspected. Measured 29.83 FPS over three seconds, 210 draw calls, DPR 1.25 in mobile emulation (not a physical phone measurement). Mute output fell below 0.00001 RMS. All 11 worlds loaded through hash navigation and all 33 routes returned reachable. These short checks do not establish absence of long-term memory leaks.
Rapid zone-load race fixed with generation token and covered by qa/audio-race.mjs. Observation replay restarts target actions. Mobile observation prompt moved above movement controls; this last layout/replay adjustment did not receive a completed visual retest after local tooling interruption. Earlier observation skip/return and story replay were browser-tested. Cache version 6. /walk/ is excluded from this release.
