import type { L } from './types';

export const education = {
  institution: {
    en: 'Faculty of Organizational Sciences, University of Belgrade',
    sr: 'Fakultet organizacionih nauka, Univerzitet u Beogradu',
  } as L,
  degree: {
    en: 'Information Systems and Technologies, E-business Technologies track',
    sr: 'Informacioni sistemi i tehnologije, modul Tehnologije elektronskog poslovanja',
  } as L,
  period: { en: 'October 2022 – expected 2027', sr: 'oktobar 2022 – očekivano 2027' } as L,
  index: '2022/0390', // TODO(veljko): confirm
  location: { en: 'Belgrade', sr: 'Beograd' } as L,

  /**
   * Secondary school. It normally comes off a CV once the degree is under way,
   * and it earns its line here only because it is a technical school on an IT
   * track: it says the subject was chosen at fifteen rather than at eighteen.
   * One line, not two. If the sheet ever needs a line back, this is the first
   * thing to cut.
   */
  secondary: {
    institution: { en: 'Užice Technical School', sr: 'Tehnička škola Užice' } as L,
    degree: { en: 'information technology', sr: 'informacione tehnologije' } as L,
    period: { en: '2018 – 2022', sr: '2018 – 2022' } as L,
    location: { en: 'Užice', sr: 'Užice' } as L,
  },
};
