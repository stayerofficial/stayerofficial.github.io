# stayerofficial.com

Static site for **STAYER** (Maksym Duchenko, Vienna), hosted on GitHub Pages.
No build step, no dependencies, no tracking — plain HTML/CSS/JS served as-is.

## Structure

Every page exists in **English and German**, paired by a `-de` suffix and wired together
with a top-right `EN / DE` switcher plus `rel="alternate" hreflang` tags.

| English | German | Purpose |
| --- | --- | --- |
| `index.html` | `index-de.html` | Home — scroll-driven word nav + the APPS overlay |
| — | `impressum.html` | Impressum / Offenlegung (§ 5 ECG, § 63 GewO, § 25 MedienG). **German only**, no switcher — linked from both language branches |
| `privacy.html` | `privacy-de.html` | Privacy policy for **this website** |
| `privacy-anyicon.html` | `privacy-anyicon-de.html` | Any Icon app privacy policy — **linked from the Play Store listing, do not rename** |
| `terms-anyicon.html` | `terms-anyicon-de.html` | Any Icon terms of use — **linked from the Play Store listing, do not rename** |
| `privacy-health.html` | `privacy-health-de.html` | Placeholder for the unreleased Health Widgets app (`noindex`). Currently **not linked from anywhere** — the app card was removed from the home page; kept for when the app ships |
| `404.html` | — | GitHub Pages error page |

| Asset | Purpose |
| --- | --- |
| `assets/site.css` | The single stylesheet for every page |
| `assets/home.js` | Home page interactions |
| `assets/hero-*.jpg` | Responsive hero, generated from `../WebSite-sources/photo.png` |
| `CNAME` | Custom domain — keep this file, Pages needs it |

## Rules of thumb

- **Never add third-party scripts, fonts, or embeds.** The site currently sets no
  cookies and loads nothing from outside its own origin, which is why it needs no
  cookie banner. Adding a Google Font or an analytics snippet changes that and
  makes `privacy.html` inaccurate.
- Legal page URLs are referenced from Google Play. Renaming one breaks the store
  listing. Play Console takes a privacy-policy URL per store-listing language — point the
  German listing at `privacy-anyicon-de.html`.
- **Edit both languages together.** The German and English legal texts declare that they
  have the same content, and that German prevails for consumers in AT/DE/CH. Changing only
  one side makes that statement false.
- Bump the `?v=` query on `site.css` / `home.js` whenever you edit them, otherwise returning
  visitors keep the cached copy.
- **Image sources live outside this folder**, in `../WebSite-sources/` (`photo.png`,
  `logo.png`), so they are never uploaded. Regenerating from them:

  ```
  sips -s format jpeg -s formatOptions 72 -Z 2560 ../WebSite-sources/photo.png --out assets/hero-2560.jpg
  sips -s format jpeg -s formatOptions 68 -Z 1280 ../WebSite-sources/photo.png --out assets/hero-1280.jpg
  sips -s format jpeg -s formatOptions 78 -c 630 1200 ../WebSite-sources/photo.png --out assets/og-image.jpg
  sips -Z 180 ../WebSite-sources/logo.png --out assets/apple-touch-icon.png
  sips -Z 32  ../WebSite-sources/logo.png --out assets/favicon-32.png
  ```

## Local preview

```
python3 -m http.server 8000
```
