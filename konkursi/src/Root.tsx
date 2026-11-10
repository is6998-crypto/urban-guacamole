import React from 'react';
import { AbsoluteFill, CalculateMetadataFunction, Composition, staticFile } from 'remotion';
import { getAudioDurationInSeconds } from '@remotion/media-utils';
import { FPS, HEIGHT, LOGO_PATH, VO, VoId, WIDTH } from './config';
import { CastTest } from './dev/CastTest';
import { Film, FilmProps } from './Film';
import { FONT } from './fonts';
import { STILL_AT, SceneId, buildTimeline, placeholderVo } from './timeline';

/** Probe public/ for the voice-over files and the logo; size the film from them. */
const probe = async (): Promise<FilmProps> => {
  const vo = placeholderVo();
  await Promise.all(
    (Object.keys(VO) as VoId[]).map(async (id) => {
      try {
        const src = staticFile(`audio/${VO[id].file}`);
        const head = await fetch(src, { method: 'HEAD' });
        if (!head.ok) return;
        const d = await getAudioDurationInSeconds(src);
        if (d > 0) vo[id] = { exists: true, duration: d };
      } catch {
        // missing: keep the placeholder length and render that stretch silent
      }
    }),
  );
  let logoExists = false;
  try {
    logoExists = (await fetch(staticFile(LOGO_PATH), { method: 'HEAD' })).ok;
  } catch {
    logoExists = false;
  }
  return { vo, logoExists };
};

const filmMetadata: CalculateMetadataFunction<FilmProps> = async () => {
  const props = await probe();
  return { durationInFrames: buildTimeline(props.vo).total, props };
};

type StillProps = FilmProps & { scene: SceneId; stillFrame?: number };
/** The film, with the review-still frame for `scene` worked out from the real timeline. */
const stillMetadata: CalculateMetadataFunction<StillProps> = async ({ props }) => {
  const film = await probe();
  const tl = buildTimeline(film.vo);
  return { durationInFrames: tl.total, props: { ...film, scene: props.scene, stillFrame: tl.f(STILL_AT[props.scene]) } };
};

const ReviewStill: React.FC<StillProps> = ({ scene: _scene, stillFrame: _f, ...film }) => <Film {...film} />;

const FontTest: React.FC = () => (
  <AbsoluteFill style={{ background: '#22223B', color: '#F4F1EA', fontFamily: FONT, alignItems: 'center', justifyContent: 'center', gap: 30 }}>
    {[400, 600, 700].map((w) => (
      <div key={w} style={{ fontSize: 96, fontWeight: w }}>
        Ëëë... Çfarë përgjigje
      </div>
    ))}
  </AbsoluteFill>
);

const base = { fps: FPS, width: WIDTH, height: HEIGHT };
const defaultFilm: FilmProps = { vo: placeholderVo(), logoExists: false };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Konkursi" component={Film} durationInFrames={buildTimeline(placeholderVo()).total} defaultProps={defaultFilm} calculateMetadata={filmMetadata} {...base} />
    <Composition id="ReviewStill" component={ReviewStill} durationInFrames={1} defaultProps={{ ...defaultFilm, scene: 's1' as SceneId }} calculateMetadata={stillMetadata} {...base} />
    <Composition id="FontTest" component={FontTest} durationInFrames={1} {...base} />
    <Composition id="CastTest" component={CastTest} durationInFrames={1} {...base} />
  </>
);
