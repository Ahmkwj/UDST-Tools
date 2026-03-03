# Contributing to UDST Tools

UDST Tools is an open-source academic toolkit for UDST students. Contributions are welcome. This guide explains how to get set up and submit changes.

---

## Getting started

**Prerequisites:** Node.js (v18+), npm.

1. Fork and clone the repo:
   ```bash
   git clone https://github.com/Ahmkwj/UDST-Tools.git
   cd UDST-Tools
   ```

2. Install dependencies and run the app:
   ```bash
   npm install
   npm run dev
   ```
   The site will be at `http://localhost:5173`.

3. Run the linter and build to confirm everything passes:
   ```bash
   npm run lint
   npm run build
   ```

---

## Project overview

- **Stack:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion. Client-side only, no backend.
- **Structure:**  
  - `src/pages/` — route pages (GPA, Grade, Attendance, Calendar, etc.).  
  - `src/components/` — shared UI and layout (Sidebar, Footer, LocalizedLink, etc.).  
  - `src/context/` — `LanguageContext` for locale and RTL.  
  - `src/utils/`, `src/hooks/`, `src/data/` — helpers, hooks, and static data.

---

## Bilingual support (English and Arabic)

The app is fully bilingual with RTL support for Arabic.

- Use the `useLocale()` hook from `LanguageContext` to read the current locale (`"en"` or `"ar"`).
- For user-facing text, always provide both languages, e.g.:
  - Inline: `locale === "ar" ? "النص العربي" : "English text"`
  - Or objects: `{ en: "English text", ar: "النص العربي" }`
- Use `LocalizedLink` for in-app navigation so links work correctly with the current locale.
- Test in both languages and confirm RTL layout looks correct when switching to Arabic.

---

## Code style

- **TypeScript:** Use types for props and shared data; avoid `any` where possible.
- **Linting:** Run `npm run lint` before committing. Fix any reported issues.
- **Formatting:** Keep existing style (indentation, quotes). The project uses ESLint with TypeScript and React hooks.
- **UI:** Use Tailwind utility classes; follow patterns used in existing components (e.g. `Card`, `PageHeader`, `Button`).
- **New pages:** Add the route in `App.tsx` and include the page in the Sidebar and Footer link lists so it appears in both locales.

---

## Submitting changes

1. Create a branch from `main`:
   ```bash
   git checkout -b fix/short-description
   ```
   or `feature/short-description` for new functionality.

2. Make your changes. Keep commits focused and messages clear.

3. Ensure the project still runs and passes checks:
   ```bash
   npm run lint
   npm run build
   ```

4. Push your branch and open a **Pull Request** against the upstream `main` branch.

5. In the PR description, briefly state:
   - What changed (e.g. bug fix, new feature, copy/UX tweak).
   - How to test it (steps or screens).
   - For UI or copy: confirm it’s updated in both English and Arabic if applicable.

Maintainers will review and may ask for small edits. Once approved, your PR can be merged.

---

## What to contribute

- **Bug fixes** — Incorrect behavior, layout issues, or broken links.
- **Features** — New tools or improvements that fit the academic toolkit (e.g. calculators, planners, links).
- **Copy and UX** — Clearer labels, better error messages, accessibility improvements.
- **Translations** — Corrections or improvements for Arabic (or English) strings.
- **Docs** — Fixes or clarifications in README or this file.

If you have a large or breaking change in mind, open an issue first to discuss it.

---

## License

By contributing, you agree that your contributions will be made under the same terms as the project license. The repository is made publicly available for viewing and contribution; see the [LICENSE](LICENSE) file for full terms.

---

Thank you for contributing.
