// Scene 3 — CV-të. Static top-down view of a white table; explicit camera moves only.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PALETTE } from '../config';
import { Full, Shot, View } from '../devices/View';
import { EASE_OUT, kf, prog, s } from '../lib/anim';
import { CV_X, CvPaper, FolderCover, MarkerCircle, PAPER, ROW_Y } from '../sets/CvTable';
import { EVENTS, SCENES, sec } from '../timeline';
import { useTl } from './kit';

const Folder: React.FC<{ who: 'suela' | 'era'; land: number; open: number; frame: number }> = ({ who, land, open, frame }) => {
  // falls from above (bigger = closer to camera), lands with a small bounce
  const fall = EASE_OUT(Math.min(1, Math.max(0, (frame - (land - s(0.5))) / s(0.5))));
  const bounce = frame > land ? Math.sin(Math.min(1, (frame - land) / s(0.35)) * Math.PI) * 0.025 : 0;
  const sc = frame < land - s(0.5) ? 0 : 1.6 - 0.6 * fall + bounce;
  if (sc === 0) return null;
  const x = CV_X[who];
  return (
    <g transform={`translate(${x} 0) scale(${sc}) rotate(${who === 'suela' ? -1.2 : 1.4})`}>
      <rect x={-PAPER.w / 2 - 14} y={-PAPER.h / 2 - 8} width={PAPER.w + 40} height={PAPER.h + 44} rx={10} fill="#000" opacity={0.1 + 0.08 * fall} transform={`translate(${18 * (2 - fall)} ${22 * (2 - fall)})`} />
      <rect x={-PAPER.w / 2 - 20} y={-PAPER.h / 2 - 22} width={PAPER.w + 40} height={PAPER.h + 44} rx={8} fill="#2A4570" />
      <CvPaper who={who} />
      {who === 'suela' && (
        <g>
          {(['nota', 'pervoja', 'certifikata', 'gjuhet'] as const).map((k) => (
            <MarkerCircle key={k} y={ROW_Y[k]} p={0} />
          ))}
        </g>
      )}
      <FolderCover open={open} />
    </g>
  );
};

export const Scene3: React.FC = () => {
  const tl = useTl();
  const frame = useCurrentFrame();
  const s0 = SCENES.s3.span[0];
  const rel = (brief: number) => tl.f(brief) - tl.f(s0);
  const dur = tl.f(SCENES.s3.span[1]) - tl.f(s0);
  const landS = rel(36.6);
  const landE = rel(36.8);
  const open = prog(frame, rel(37.7), rel(38.6));
  const circle = (k: keyof typeof EVENTS.circles) => prog(frame, rel(EVENTS.circles[k]), rel(EVENTS.circles[k]) + sec(EVENTS.circleDraw));
  const cy = kf(frame, [
    [rel(39.6), 0],
    [rel(40.4), -215],
    [rel(42), -95],
    [rel(45), 35],
    [rel(48), 165],
    [rel(51), 295],
    [rel(53), 320],
    [rel(55.4), 0],
  ]);
  const zoom = kf(frame, [
    [rel(39.6), 0.95],
    [rel(40.4), 1.45],
    [rel(53), 1.45],
    [rel(55.4), 0.86],
    [rel(58), 0.96],
  ]);
  const cx = kf(frame, [
    [rel(55.4), 0],
    [rel(58), -130],
  ]);
  return (
    <Shot from={0} dur={dur}>
      <Full>
        <AbsoluteFill>
          <View cam={{ cx, cy, zoom }} still bg={PALETTE.cvTable}>
            <rect x={-940} y={-640} width={1880} height={1280} fill="#000" opacity={0.05} transform="translate(10 14)" />
            <rect x={-940} y={-640} width={1880} height={1280} rx={6} fill="#FFFFFF" />
            <Folder who="suela" land={landS} open={open} frame={frame} />
            <Folder who="era" land={landE} open={open} frame={frame} />
            {/* red circles on Suela's CV only, drawn on over 0.5 s */}
            {frame > landS && (
              <g transform={`translate(${CV_X.suela} 0) rotate(-1.2)`}>
                {(['nota', 'pervoja', 'certifikata', 'gjuhet'] as const).map((k) => (
                  <MarkerCircle key={k} y={ROW_Y[k]} p={circle(k)} />
                ))}
              </g>
            )}
          </View>
        </AbsoluteFill>
      </Full>
    </Shot>
  );
};
