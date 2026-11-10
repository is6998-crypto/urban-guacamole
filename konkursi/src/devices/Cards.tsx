// Text cards and subtitles (section 6).
import React from 'react';
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { LOGO_PATH, PANE_W, SHOW_SUBTITLES } from '../config';
import { FONT } from '../fonts';
import { lin } from '../lib/anim';
import { chunkTimes, planSpeech } from '../lib/speech';
import { SUBTITLE_CHUNKS, LINES } from '../text';
import { CARD_FADE, CARDS, Card, sec, Timeline } from '../timeline';

const band: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 600,
  color: '#FFFFFF',
  background: 'rgba(20, 20, 30, 0.6)',
  padding: 24,
  borderRadius: 8,
  lineHeight: 1.2,
  textAlign: 'center',
  whiteSpace: 'pre-wrap',
};

const useFade = (dur: number) => {
  const frame = useCurrentFrame();
  const fd = sec(CARD_FADE);
  return Math.min(lin(frame, 0, fd, 0, 1), lin(frame, dur - fd, dur, 1, 0));
};

const at = (x: number, y: number, maxW: number): React.CSSProperties => ({
  position: 'absolute',
  left: x,
  top: y,
  transform: 'translate(-50%, -50%)',
  maxWidth: maxW,
  width: 'max-content',
});

export const LogoOrBox: React.FC<{ logoExists: boolean }> = ({ logoExists }) =>
  logoExists ? (
    <Img src={staticFile(LOGO_PATH)} style={{ width: 240, height: 120, objectFit: 'contain' }} />
  ) : (
    <div style={{ width: 240, height: 120, border: '2px solid rgba(255,255,255,0.85)', borderRadius: 4, boxSizing: 'border-box' }} />
  );

export const CardView: React.FC<{ card: Card; dur: number; logoExists: boolean }> = ({ card, dur, logoExists }) => {
  const o = useFade(dur);
  const { kind, text } = card;
  if (kind === 'black' || kind === 'hashtag') {
    return (
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: o, flexDirection: 'column', gap: 48 }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 72, color: '#fff', textAlign: 'center', maxWidth: 1600, lineHeight: 1.2 }}>{text}</div>
        {kind === 'hashtag' && <LogoOrBox logoExists={logoExists} />}
      </AbsoluteFill>
    );
  }
  const style: React.CSSProperties =
    kind === 'full'
      ? { ...band, ...at(960, 940, 1700), fontSize: 64 }
      : kind === 'fullCentre'
        ? { ...band, ...at(960, 540, 1700), fontSize: 64 }
        : kind === 'shared'
          ? { ...band, ...at(960, 940, 1600), fontSize: 52 }
          : { ...band, ...at(kind === 'paneL' ? PANE_W / 2 : PANE_W * 1.5, 120, PANE_W - 80), fontSize: 44 };
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={style}>{text}</div>
    </AbsoluteFill>
  );
};

export const CardLayer: React.FC<{ tl: Timeline; logoExists: boolean }> = ({ tl, logoExists }) => (
  <>
    {CARDS.map((c, i) => {
      const { from, dur } = tl.span(c.span);
      return (
        <Sequence key={i} from={from} durationInFrames={dur} name={`card: ${c.text}`} layout="none">
          <CardView card={c} dur={dur} logoExists={logoExists} />
        </Sequence>
      );
    })}
  </>
);

// ---------------------------------------------------------------------------------------
// Subtitles for the four VO lines

const SubtitleText: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  const o = Math.min(lin(frame, 0, 4, 0, 1), lin(frame, dur - 4, dur, 1, 0));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div
        style={{
          ...at(960, 1080 - 110, 1500),
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 40,
          lineHeight: 1.3,
          color: '#fff',
          background: 'rgba(0, 0, 0, 0.6)',
          padding: '12px 24px',
          borderRadius: 6,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const SubtitleLayer: React.FC<{ tl: Timeline }> = ({ tl }) => {
  if (!SHOW_SUBTITLES) return null;
  const items: { text: string; from: number; dur: number }[] = [];
  // The question is shown once over both overlapping voices.
  items.push({ text: SUBTITLE_CHUNKS.question[0], ...tl.questionSubtitle });
  (
    [
      ['vo3', LINES.suela, SUBTITLE_CHUNKS.suela],
      ['vo4', LINES.era, SUBTITLE_CHUNKS.era],
    ] as const
  ).forEach(([id, line, chunks]) => {
    const d = tl.vo[id].duration;
    chunkTimes(planSpeech(line, d), chunks, d).forEach((c) => {
      const from = tl.voStart[id] + sec(c.start);
      items.push({ text: c.text, from, dur: Math.max(1, tl.voStart[id] + sec(c.end) - from) });
    });
  });
  return (
    <>
      {items.map((it, i) => (
        <Sequence key={i} from={it.from} durationInFrames={it.dur} name={`subtitle ${i + 1}`} layout="none">
          <SubtitleText text={it.text} dur={it.dur} />
        </Sequence>
      ))}
    </>
  );
};
