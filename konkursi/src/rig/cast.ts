// The cast. Same rig, different looks. Suela and Era are deliberately equal in
// professionalism: same blazer, blouse and trousers; only hair, earrings, shoes and watch differ.
import { PALETTE } from '../config';
import type { Look } from './Person';

const blazer = { kind: 'blazer' as const, color: PALETTE.navy, shade: '#132541', inner: '#FBFAF6', innerShade: '#DCD8CF' };

export const SUELA: Look = {
  id: 'suela',
  skin: '#EBC3A4',
  skinShade: '#CF9E80',
  lip: '#C07068',
  iris: '#5A3E2B',
  hair: '#3A2A22',
  hairShade: '#2A1E18',
  brow: '#2E211B',
  hairStyle: 'ponytail',
  build: { shoulder: 52, waist: 40, hip: 46, jaw: 0.94 },
  top: blazer,
  trousers: '#25273A',
  trousersShade: '#1A1B2A',
  shoes: '#121218',
  earrings: 'silverStud',
  watch: 'silver',
};

export const ERA: Look = {
  id: 'era',
  skin: '#EEC7A8',
  skinShade: '#D3A283',
  lip: '#C3706A',
  iris: '#4E3A2A',
  hair: '#3D2C22',
  hairShade: '#2B1F19',
  brow: '#2F221C',
  hairStyle: 'loose',
  build: { shoulder: 52, waist: 40, hip: 46, jaw: 0.94 },
  top: blazer,
  trousers: '#25273A',
  trousersShade: '#1A1B2A',
  shoes: '#121218',
  earrings: 'goldHoop',
};

export const QEMAJLI: Look = {
  id: 'qemajli',
  male: true,
  skin: '#DCA683',
  skinShade: '#BE8664',
  lip: '#A9665E',
  iris: '#3E2E22',
  hair: '#A7A5A2',
  hairShade: '#8B8986',
  brow: '#7C7A77',
  hairStyle: 'receding',
  moustache: true,
  build: { shoulder: 64, waist: 56, hip: 54, jaw: 1.1, neck: 12 },
  top: { kind: 'leather', color: '#6B4429', shade: '#4E301C', inner: '#A9C6E3', innerShade: '#86A6C6' },
  trousers: '#3B3A40',
  trousersShade: '#2C2B30',
  shoes: '#2A1D15',
  watch: 'gold',
};

export const KRYETARI: Look = {
  id: 'kryetari',
  male: true,
  skin: '#E6B492',
  skinShade: '#C89272',
  lip: '#AC6B62',
  iris: '#4A4036',
  hair: '#B9B8B6',
  hairShade: '#9A9997',
  brow: '#8E8C89',
  hairStyle: 'combed',
  glasses: true,
  build: { shoulder: 60, waist: 50, hip: 50, jaw: 1.02 },
  top: { kind: 'suit', color: '#7B7F87', shade: '#5F636B', inner: '#F4F3EF', innerShade: '#D7D6D1', tie: '#7A1F2B' },
  trousers: '#6E727A',
  trousersShade: '#585C63',
  shoes: '#1B1A1D',
};

export const ANETARJA: Look = {
  id: 'anetarja',
  skin: '#F0CDB2',
  skinShade: '#D6A98C',
  lip: '#BF6A66',
  iris: '#3F5A3E',
  hair: '#9A4A2A',
  hairShade: '#7A3820',
  brow: '#7A3A24',
  hairStyle: 'bob',
  build: { shoulder: 51, waist: 40, hip: 46, jaw: 0.95 },
  top: { kind: 'cardigan', color: '#4E7A55', shade: '#3B6042', inner: '#EFEBE2', innerShade: '#D3CFC5' },
  trousers: '#3A3A44',
  trousersShade: '#2B2B33',
  shoes: '#2A2A2E',
};

export const ANETARI: Look = {
  id: 'anetari',
  male: true,
  skin: '#D8A07D',
  skinShade: '#BA815F',
  lip: '#A3625A',
  iris: '#3A2A20',
  hair: '#3A2C24',
  hairShade: '#2A1F19',
  brow: '#2E221C',
  hairStyle: 'short',
  beard: true,
  build: { shoulder: 60, waist: 50, hip: 50, jaw: 1.04 },
  top: { kind: 'jacket', color: '#C9B79A', shade: '#AC9A7E', inner: '#EDEDE8', innerShade: '#D2D2CC' },
  trousers: '#4A4A52',
  trousersShade: '#38383F',
  shoes: '#2A1D15',
};

export const SEKRETARJA: Look = {
  id: 'sekretarja',
  skin: '#E9BFA0',
  skinShade: '#CC9C7D',
  lip: '#B8625F',
  iris: '#4A3426',
  hair: '#4A3426',
  hairShade: '#36251B',
  brow: '#3A281E',
  hairStyle: 'bun',
  build: { shoulder: 50, waist: 40, hip: 46, jaw: 0.94 },
  top: { kind: 'cardigan', color: '#7A2E3B', shade: '#5E222D', inner: '#EFE9DF', innerShade: '#D2CBBF' },
  trousers: '#2F2E38',
  trousersShade: '#23222A',
  shoes: '#1C1B20',
};

export const KAMARIERI: Look = {
  id: 'kamarieri',
  male: true,
  skin: '#E2AE8B',
  skinShade: '#C48E6C',
  lip: '#AE6A62',
  iris: '#3A2A20',
  hair: '#2A211C',
  hairShade: '#1C1612',
  brow: '#231B16',
  hairStyle: 'young',
  build: { shoulder: 56, waist: 44, hip: 46, jaw: 0.98 },
  top: { kind: 'shirt', color: '#1E1E24', shade: '#141418', inner: '#1E1E24', apron: '#121216' },
  trousers: '#1A1A1F',
  trousersShade: '#121216',
  shoes: '#0E0E10',
};

/** Muted passers-by. */
export const extra = (i: number): Look => {
  const tops = ['#7D8590', '#8E7F74', '#6F7D73', '#86808F', '#9A8B7A'];
  const hairs = ['#3A2E28', '#6C6560', '#2A2422', '#8A7A6A', '#4A3A30'];
  const skins = ['#E3B694', '#D9A684', '#EBC6A8', '#C99474', '#E6BC9C'];
  const male = i % 2 === 0;
  return {
    id: `extra${i}`,
    simple: true,
    male,
    skin: skins[i % 5],
    skinShade: '#B98A6C',
    lip: '#A86A62',
    iris: '#3A2A20',
    hair: hairs[i % 5],
    hairShade: hairs[(i + 2) % 5],
    brow: hairs[i % 5],
    hairStyle: male ? 'short' : 'bob',
    build: male ? { shoulder: 58, waist: 48, hip: 48, jaw: 1.02 } : { shoulder: 50, waist: 40, hip: 46, jaw: 0.95 },
    top: { kind: 'simple', color: tops[i % 5], shade: tops[(i + 3) % 5], inner: tops[i % 5] },
    trousers: '#4A4C55',
    trousersShade: '#3A3C44',
    shoes: '#2A2A2E',
  };
};
