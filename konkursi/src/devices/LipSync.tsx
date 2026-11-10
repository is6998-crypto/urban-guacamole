// Mouth openness for a voice-over line.
// With the real file: driven by the audio's amplitude. Without it: ~8 Hz flaps in the
// placeholder window that pause at every comma and "...".
import React from 'react';
import { staticFile, useCurrentFrame } from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { FPS, VO, VoId } from '../config';
import { planSpeech, placeholderMouth } from '../lib/speech';
import { LINES } from '../text';
import { Timeline } from '../timeline';

const LINE_OF: Record<VoId, string> = { vo1: LINES.question, vo2: LINES.question, vo3: LINES.suela, vo4: LINES.era };

type Props = { vo: VoId; tl: Timeline; shotFrom: number; children: (open: number) => React.ReactNode };

const FromAudio: React.FC<Props> = ({ vo, tl, shotFrom, children }) => {
  const frame = useCurrentFrame() + shotFrom - tl.voStart[vo];
  const audio = useAudioData(staticFile(`audio/${VO[vo].file}`));
  let open = 0;
  if (audio && frame >= 0 && frame < tl.voDur[vo]) {
    const bins = visualizeAudio({ fps: FPS, frame, audioData: audio, numberOfSamples: 32, smoothing: true });
    const level = bins.slice(0, 16).reduce((a, b) => a + b, 0) / 16;
    open = Math.min(1, Math.max(0, (level - 0.01) * 9));
  }
  return <>{children(open)}</>;
};

const FromPlaceholder: React.FC<Props> = ({ vo, tl, shotFrom, children }) => {
  const frame = useCurrentFrame() + shotFrom - tl.voStart[vo];
  const t = frame / FPS;
  const plan = planSpeech(LINE_OF[vo], tl.vo[vo].duration);
  return <>{children(t >= 0 ? placeholderMouth(plan, t) : 0)}</>;
};

export const LipSync: React.FC<Props> = (p) => (p.tl.vo[p.vo].exists ? <FromAudio {...p} /> : <FromPlaceholder {...p} />);
