# Bethlehem adventure — verification record (2026-11-12)

Status: final release validation completed in replacement TaskSpace 3 on 2026-11-12, after user authorization. Prepared for push and GitHub Pages deployment. Human enjoyment, physical-device testing and final character assets remain open.

## Problem and selected loop
Phase 2 was primarily walking between story panels/cinematics. Early Phase 3 proximity-only following lacked meaningful choices. Current design focuses on reading animal reactions and reading environmental clues. It does not add eleven sets of generic errands. GAME-DIRECTION.md separates goals from measured results.

## Implemented locally
- Walking acceleration, Shift running, Space jump with gravity and ground clamping; mobile analog joystick and run/jump buttons. Original static collision and click routes reused.
- Mission definitions and prerequisite-based LOCKED / AVAILABLE / ACTIVE / COMPLETED states; separate adventure storage preserves existing story, reflection and audio keys. Partial deliveries, discoveries and completion history persist. Replay clears only the current attempt.
- Five identifiable flock animals: calm approach earns attention; rushing startles, crowding causes retreat, distance causes waiting. Animals navigate around walls and avoid actors; one starts inside a pen with a southern opening. Several animals can be guided together.
- Delivered animals walk toward resting positions away from the main crossing. Shepherd gestures, then rests; restored completion places the flock and resting shepherd accordingly.
- Footprints and narrow stone-wall passage toward the overlook; traversal discovers a new map entry. Market/storage nook has jars and an animated hand mill. These are explicitly interpretive/gameplay props, not archaeological reconstructions.
- Illustrated travel journal separates fictional missions, discoveries and gospel references. Editorial questions connect the actual eleven-world order. Next-world action preserves free selection; no scripture scene is locked behind the invented task.
- Quiet original event cues on the ambience bus, existing five local music files, optional observation and existing scripture cinematics. No new external asset/services.
- Pause menu freezes simulation; original map, reflection notebook, stories and /walk/ preserved.

## Evidence already collected
CPU: qa/regression.mjs passes 11 worlds, 33 stories, 60 collision-sampled routes (including passage), five building types, 90 seconds of NPC simulation. qa/mission.mjs physically simulates all five deliveries in 134 simulated seconds, checks pen-wall obstruction/exit routing, rushing/calm recovery, duplicate delivery rejection, reload/replay history, jumping/landing, partial progress and discovery save, and legacy save isolation. qa/audio-race.mjs passes.
Browser on 2026-11-11: actual pointer/canvas movement and visible UI used to start the mission, guide sheep, collect all five, open completion journal. No teleport, progress mutation, or button-only completion used. Reload partway preserved prior deliveries. The playthrough spans revisions; a repeat from a clean start with the final version remains advisable. Two sheep were led together after finding the pen opening. Screenshots: phase3-start, phase3-field, phase3-guiding, phase3-completed.
Browser waiting failures were diagnosed: one requested screen coordinate was below the viewport; navigation automation switched to visible intermediate ground clicks. Also fixed genuine congestion near delivered flock and a click destination occupied by sheep.

## Final validation update (2026-11-12)
Browser: mobile analog joystick movement, running touch, jump and landing, pause/resume with stable actor state; no horizontal overflow at 390×844. PC Shift running and Space jump passed. The narrow passage was physically traversed; a new map destination appeared, overlook cinematic played, and discovery survived reload. All eleven worlds loaded with all 33 story paths reachable. Music file playback had nonzero RMS and no reported load failures.
Visual inspection corrected low-contrast mission button and an overlook camera pulled down by building avoidance; the final panorama is rechecked in phase3-overlook.png. New module/cache version 8.
Performance: initial mobile emulation sample ~19.63 FPS; repeated measurement ~29.76 FPS (DPR 1.25, 203 draw calls, automatic quality reduction was not triggered in that repeat). Desktop ~29.77 FPS, 329 draw calls. Each sample is ~3 seconds and is not a physical-device or sustained-performance guarantee. Existing slow-device fallback now also disables real-time shadows after sustained slow frames; this fallback branch was not forced during the repeat. Desktop 60 FPS target is not demonstrated.

## Remaining, not claimed complete
- Longer sessions, physical phone performance and long-term memory behavior remain unverified. Latest short browser and frame tests are recorded above.
- Human first-time playtest: enjoyment, ten-minute pacing, retention and difficulty are hypotheses, not validated outcomes. The 134-second scripted CPU route is not a human session duration.
- Hero characters remain procedural prototypes; no professional GLB replacement or recorded narration. No direct depiction of Jesus added.
- A separate resident environment puzzle and more missions are deferred until this core loop receives human feedback.

## Controls
PC: WASD/arrows or ground click; Shift run, Space jump. Drag camera, wheel zoom. Mobile: left joystick, right run/jump actions. Meet shepherd (mission panel can route there), start the clearly labeled fictional task, watch turquoise-collared sheep, approach slowly from two or three steps away, then walk toward the shepherd. Running near sheep frightens them; give space and approach again. Travel journal keeps the completed result and offers optional replay.
