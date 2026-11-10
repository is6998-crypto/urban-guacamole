// The whole film: scenes on the timeline, then cards, subtitles, voice-over and grain.
import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, staticFile } from 'remotion';
import { VO, VoId } from './config';
import { CardLayer, SubtitleLayer } from './devices/Cards';
import { Grain } from './devices/Grain';
import { TlCtx, WIPE } from './scenes/kit';
import { Scene1, Scene2 } from './scenes/S2Morning';
import { Scene3 } from './scenes/S3Cv';
import { Scene4, Scene5 } from './scenes/S4S5';
import { Scene6 } from './scenes/S6Question';
import { Scene7, Scene8, Scene9 } from './scenes/S7S9';
import { SCENES, SceneId, Timeline, VoMap, buildTimeline } from './timeline';

export type FilmProps = { vo: VoMap; logoExists: boolean };

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  s1: Scene1,
  s2: Scene2,
  s3: Scene3,
  s4: Scene4,
  s5: Scene5,
  s6: Scene6,
  s7: Scene7,
  s8: Scene8,
  s9: Scene9,
};

const sceneRange = (tl: Timeline, id: SceneId) => {
  const from = tl.f(SCENES[id].span[0]);
  return { from, dur: tl.f(SCENES[id].span[1]) - from };
};

/** Scenes whose split screen opens over the previous scene's last frame. */
const WIPE_IN_OVER: Partial<Record<SceneId, SceneId>> = { s4: 's3', s7: 's6' };
/** Scenes whose split screen closes over the next scene's first frame. */
const WIPE_OUT_OVER: Partial<Record<SceneId, SceneId>> = { s2: 's3' };

export const FilmBody: React.FC<{ tl: Timeline }> = ({ tl }) => (
  <>
    {(Object.keys(SCENES) as SceneId[]).map((id) => {
      const { from, dur } = sceneRange(tl, id);
      const C = SCENE_COMPONENTS[id];
      const under = WIPE_IN_OVER[id];
      const next = WIPE_OUT_OVER[id];
      return (
        <React.Fragment key={id}>
          {under && (
            <Sequence from={from} durationInFrames={WIPE} name={`${under} held under ${id}`}>
              <Freeze frame={sceneRange(tl, under).dur - 1}>
                {React.createElement(SCENE_COMPONENTS[under])}
              </Freeze>
            </Sequence>
          )}
          {next && (
            <Sequence from={from + dur - WIPE} durationInFrames={WIPE} name={`${next} under ${id}`}>
              <Freeze frame={0}>{React.createElement(SCENE_COMPONENTS[next])}</Freeze>
            </Sequence>
          )}
          <Sequence from={from} durationInFrames={dur} name={`Scene ${id.slice(1)} — ${SCENES[id].name}`}>
            <C />
          </Sequence>
        </React.Fragment>
      );
    })}
  </>
);

export const VoAudio: React.FC<{ tl: Timeline }> = ({ tl }) => (
  <>
    {(Object.keys(VO) as VoId[])
      .filter((id) => tl.vo[id].exists)
      .map((id) => (
        <Sequence key={id} from={tl.voStart[id]} durationInFrames={tl.voDur[id]} name={`VO ${id}`} layout="none">
          <Audio src={staticFile(`audio/${VO[id].file}`)} />
        </Sequence>
      ))}
  </>
);

export const Film: React.FC<FilmProps> = ({ vo, logoExists }) => {
  const tl = buildTimeline(vo);
  return (
    <TlCtx.Provider value={tl}>
      <AbsoluteFill style={{ background: '#000' }}>
        <FilmBody tl={tl} />
        <CardLayer tl={tl} logoExists={logoExists} />
        <SubtitleLayer tl={tl} />
        <VoAudio tl={tl} />
        <Grain />
      </AbsoluteFill>
    </TlCtx.Provider>
  );
};
