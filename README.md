# Official AI Foundry Site

Marketing site for AI Foundry, an experiential learning program of the BYU Marriott School of
Business. Next.js 16, Tailwind v4, TypeScript. **No database and no environment variables** —
forms are embedded, so nothing can block a deploy.

## Run it

```sh
npm install
npm run dev      # http://localhost:3000
```

## Before pushing

```sh
npm run lint
npm run check:contrast
npm run build
```

All three must exit 0. CI runs the same three on every pull request.

## Read first

- `SPEC.md` — what this site is, page by page, with the confirmed decisions
- `src/app/globals.css` — the design tokens and the contrast contract that governs them

Brand copy is verbatim. Mission, vision, and values must not be paraphrased, and there are no
em dashes anywhere in site copy.
