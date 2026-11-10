// Every Albanian string in the film, exactly as written in the brief.
// Keep them here so they can be checked character for character.
import { HASHTAG, REPORT_LINE } from './config';

export const TXT = {
  // Scene 1
  dyKandidate: 'Dy kandidate.',
  njeVendPune: 'Një vend pune.',
  // Scene 2
  njejtaDite: 'E njëjta ditë.',
  njejtiVend: 'I njëjti vend pune.',
  ftese: 'Ftesë për intervistë',
  fteseSuela: 'Ju ftojmë në intervistë sot, në orën 10:00.',
  fteseEra: 'Ju ftojmë në intervistë sot, në orën 10:30.',
  // Scene 3
  njejtatStudime: 'Të njëjtat studime.',
  notaMeTeMira: 'Nota më të mira.',
  meShumePervoje: 'Më shumë përvojë.',
  meShumeCert: 'Më shumë certifikata dhe gjuhë.',
  njeraPakMe: 'Njëra është pak më e përgatitur.',
  // Scene 4
  njeraPret: 'Njëra pret në holl.',
  tjetraTakim: 'Tjetra ka një takim tjetër.',
  // Lobby sign
  sallaTakimeve: 'Salla e takimeve',
  // Scene 5
  neKohe: 'Në kohë.',
  minutaVone: '7 minuta vonë.',
  // Scene 6
  njejtaPyetje: 'E njëjta pyetje.',
  dyPergjigje: 'Dy përgjigje të ndryshme.',
  // Scene 7
  njeraPretPergjigjen: 'Njëra pret përgjigjen.',
  kryetariDel: 'Kryetari i komisionit del për një pije.',
  njejtinNjeri: 'Me të njëjtin njeri.',
  // Scene 8
  rezultati: 'Rezultati i konkursit',
  rezultatiBody: 'Ju falënderojmë për interesimin. Fatkeqësisht, nuk jeni përzgjedhur për këtë pozitë.',
  contactEra: 'Era',
  bubbleEra: 'E mora punën! Faleminderit për gjithçka.',
  // Scene 9
  punaNukShkoi: 'Puna nuk shkoi te kandidatja më e mirë.',
  shkoiTeAjo: 'Shkoi te ajo me lidhje.',
  nepotizmi: 'Nepotizmi është korrupsion.',
  merita: 'Merita duhet të jetë e vetmja lidhje.',
  raportojeni: `Keni parë diçka të tillë? Raportojeni: ${REPORT_LINE}`,
  hashtag: HASHTAG,
} as const;

/** CV labels and values (Scene 3). */
export const CV = {
  labels: {
    studimet: 'Studimet',
    nota: 'Nota mesatare',
    pervoja: 'Përvoja e punës',
    certifikata: 'Certifikata',
    gjuhet: 'Gjuhët e huaja',
  },
  suela: { nota: '9.4', pervoja: '3 vjet', certifikata: 'Menaxhim projektesh; Excel i avancuar', gjuhet: 'Anglisht, gjermanisht' },
  era: { nota: '8.5', pervoja: '2 vjet', certifikata: 'Excel i avancuar', gjuhet: 'Anglisht' },
  master: 'Master',
} as const;

/** The four voice-over lines, and how their subtitles are chunked (8–10 words, at natural pauses). */
export const LINES = {
  question: 'Pse mendoni se jeni kandidatja më e mirë për këtë pozitë?',
  suela:
    'Sepse këtë punë e kam bërë tashmë. Për tre vjet kam menaxhuar katër projekte me partnerë ndërkombëtarë dhe të gjitha i kam përfunduar në afat. Kam certifikatë në menaxhim projektesh dhe flas anglisht e gjermanisht. Që nga dita e parë e di çfarë duhet bërë.',
  era: 'Ëëë... po. Unë... kam përvojë. Kam punuar në... si quhet... në disa projekte, rreth dy vjet. Jam punëtore, mësoj shpejt. Dhe, ëë... më pëlqen puna në ekip.',
} as const;

export const SUBTITLE_CHUNKS = {
  question: [LINES.question],
  suela: [
    'Sepse këtë punë e kam bërë tashmë.',
    'Për tre vjet kam menaxhuar katër projekte me partnerë ndërkombëtarë',
    'dhe të gjitha i kam përfunduar në afat.',
    'Kam certifikatë në menaxhim projektesh dhe flas anglisht e gjermanisht.',
    'Që nga dita e parë e di çfarë duhet bërë.',
  ],
  era: [
    'Ëëë... po. Unë... kam përvojë. Kam punuar në...',
    'si quhet... në disa projekte, rreth dy vjet. Jam punëtore,',
    'mësoj shpejt. Dhe, ëë... më pëlqen puna në ekip.',
  ],
} as const;
