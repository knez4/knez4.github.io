import type { L, LL } from './types';

export const education = {
  institution: {
    en: 'Faculty of Organizational Sciences, University of Belgrade',
    sr: 'Fakultet organizacionih nauka, Univerzitet u Beogradu',
  } as L,
  degree: {
    en: 'BSc Information Systems and Technologies, module: E-Business Technologies',
    sr: 'Informacioni sistemi i tehnologije, modul: Tehnologije elektronskog poslovanja',
  } as L,
  period: { en: 'Oct 2022 – expected 2027', sr: 'okt. 2022 – očekivano 2027' } as L,
  index: '2022/0390', // TODO(veljko): confirm
  location: { en: 'Belgrade', sr: 'Beograd' } as L,

  /** Courses that a recruiter would actually look for. Ordered by relevance, not by year. */
  coursework: {
    en: [
      'Databases (Oracle SQL, relational modelling, normalization)',
      'Software Design (Java, layered architecture, UML and OCL)',
      'Server-Side Web Technologies (PHP, Laravel, MySQL, REST)',
      'Client-Side Web Technologies and Scripting Languages',
      'Computer Networks and Telecommunications (TCP/IP, HTTP, DNS, Ethernet)',
      'Data Structures and Algorithms (Java)',
      'Computer Architecture and Operating Systems',
      'Artificial Intelligence',
      'Cloud Infrastructure and Services',
      'Programming Languages (C#)',
      'Systems Theory (MATLAB)',
      'Probability and Statistics',
      'Information Systems Design',
    ],
    sr: [
      'Baze podataka (Oracle SQL, relaciono modelovanje, normalizacija)',
      'Projektovanje softvera (Java, slojevita arhitektura, UML i OCL)',
      'Serverske veb tehnologije (PHP, Laravel, MySQL, REST)',
      'Klijentske veb tehnologije i skriptni jezici',
      'Računarske mreže i telekomunikacije (TCP/IP, HTTP, DNS, Ethernet)',
      'Strukture podataka i algoritmi (Java)',
      'Arhitektura računara i operativni sistemi',
      'Veštačka inteligencija',
      'Cloud infrastruktura i servisi',
      'Programski jezici (C#)',
      'Teorija sistema (MATLAB)',
      'Teorija verovatnoće i statistika',
      'Projektovanje informacionih sistema',
    ],
  } as LL,

  /** Self-directed work worth its own line: it shows initiative and is checkable. */
  selfDirected: {
    en: [
      'Wrote a 30-problem Oracle SQL workbook over two schemas, drilling self joins, correlated subqueries, EXISTS/ANY/ALL and conditional aggregation with SUM(CASE WHEN ...).',
      'Keep a set of written study notes on the relational model, relational algebra and normalization.',
    ],
    sr: [
      'Napisao zbirku od 30 Oracle SQL zadataka nad dve šeme: self join, korelisani podupiti, EXISTS/ANY/ALL i uslovna agregacija kroz SUM(CASE WHEN ...).',
      'Vodim pisane beleške o relacionom modelu, relacionoj algebri i normalizaciji.',
    ],
  } as LL,
};
