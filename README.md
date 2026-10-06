# Rachana Portfolio

Open `index.html` in a browser. The portfolio is static; no build or server is required. `index.php` is an optional PHP entry point that includes the same page.

## Resume and Themes

- Content follows the supplied latest resume, including education, certifications, and all three projects.
- `assets/RPS.pdf` is a two-page PDF rebuilt from the supplied resume text. Its editable print source is `assets/resume.html`.
- Midnight is the default palette. The palette button opens the eight-theme sidebar; theme and light/dark choices persist in local storage.
- The contact form validates inputs and opens an email draft. It does not send messages from a backend and requires a configured email application.

## External Links

- Smart Navigator and D&D returned HTTP 200 during validation on 2026-10-06. Smart Navigator redirects users to enterprise authentication. Protected workflows were not tested.
- GitHub, YouTube, Instagram, and X responded successfully. LinkedIn blocked automated requests with HTTP 999; verify that profile manually.
- The supplied resume has no Patronus demo URL. Its card intentionally has no demo link.
- Project graphics are labeled illustrations, not authenticated application screenshots. Portrait images were verified to load.
- Google Fonts and Boxicons require network access. The icon stylesheet uses subresource integrity.

## Validation

Browser tooling is installed outside the portfolio so deployment remains dependency-free. To install and run on Windows PowerShell:

```powershell
npm install --prefix "$env:TEMP/rachana-portfolio-validation" playwright pdf-parse
& "$env:TEMP/rachana-portfolio-validation/node_modules/.bin/playwright.cmd" install chromium
$env:NODE_PATH = "$env:TEMP/rachana-portfolio-validation/node_modules"
node tests/portfolio.cjs
```

The suite checks all palettes and modes, persistence, project filters, navigation, contact validation and email drafting, local assets, PDF downloads and content, and layouts at 1440px, 390px, and 320px. Screenshots are written to the temporary `rachana-portfolio-screenshots` folder.

After editing the resume source, regenerate and verify the PDF with:

```powershell
node tests/portfolio.cjs --generate-resume
```