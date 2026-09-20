# knez4.github.io

Portfolio and CV of Veljko Knežević, published at **https://knez4.github.io**.

The site and both CV PDFs are generated from the same data files, so there is one
place to edit and no chance of the printed CV drifting away from the live site.

## How it fits together

```
src/data/          the only place content lives
  profile.ts       name, contact, summary, pitch
  projects.ts      projects, highlights, case studies
  experience.ts    roles and bullets
  education.ts     degree, coursework, self-directed work
  skills.ts        skills, split into "applied" and "coursework"
  schema.ts        the booking data model that drives the interactive diagram
src/pages/
  Home.tsx         the site
  ProjectCase.tsx  one indexable URL per project: /projekti/<id>
  CvPage.tsx       the one-page CV sheet, printed to PDF by scripts/generate-cv.mjs
```

Every text field carries both languages as `{ en, sr }`. `useLang().pick(field)`
picks the right one; UI chrome lives in `src/i18n/ui.ts`.

## Commands

```bash
npm install
npm run dev     # local site on :5173
npm run build   # type-check, bundle, write 404.html and sitemap.xml
npm run cv      # render the CV to public/ and dist/ as A4 PDFs, EN and SR
npm run og      # redraw the social preview card
npm test        # data checks plus the CV PDF assertions
```

`npm run cv` needs Chrome. It uses an installed one if it finds it, and otherwise
falls back to Puppeteer's own download. CI installs one explicitly.

## Decisions worth knowing before editing

**The CV must stay on one page.** `npm run cv` measures the sheet at the printable
width and fails the build if either language spills onto a second page. If you add
a bullet and it fails, the output tells you how many pixels over you are. Trim
something rather than shrinking the type; the sheet is already at 11.5px.

**Fonts are self-hosted as one file per weight.** Google Fonts splits latin and
latin-ext into separate files, so Chrome rendered č, ć, ž, š and đ from a second
font resource. In the PDF that became a separate text run and a parser read the
name as `Kne ž evi ć`. One file per weight keeps the name readable. There is a test
for this.

**The CV is built for applicant tracking systems.** One column, no tables, no text
boxes, no icons, standard section names, and the contact line inside the document
body rather than in a `<header>`. Those are the things parsers get wrong.

**Skills are split into "applied" and "coursework".** Anything under applied was
used to build something that exists on disk and has to survive a "show me" question
in an interview. Coursework is listed separately and honestly. A test keeps tools
with no artifact behind them (Cisco, Wireshark, Docker) out of the applied list.

**Every project needs an image.** `media` is required by the type and asserted by a
test, because the portfolio this was modelled on shipped eleven projects with zero
screenshots and never fixed it.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`: install, build, regenerate
the PDFs, run the tests, then publish `dist/` to GitHub Pages. The tests gate the
deploy, so a two-page CV or an unreadable one stops the release.

This is a user site (`knez4.github.io`), so it serves from the domain root and
`vite.config.ts` needs no `base`. Routing uses real paths; `dist/404.html` is a copy
of `index.html`, which is how GitHub Pages serves a deep link on a cold load.
