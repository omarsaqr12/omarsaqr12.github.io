# Omar Saqr — Personal Portfolio

A buildless, responsive portfolio for **https://omarsaqr12.github.io/**.

The page contains selected engineering projects, publications, education, Microsoft experience, contact links, and a small synthetic I/Q constellation experiment. All core content is static HTML and remains readable without JavaScript.

## Publish on GitHub Pages

1. Create a **public** repository named exactly `omarsaqr12.github.io` under `omarsaqr12`.
2. Commit the contents of this directory to its `main` branch. Keep `index.html`, `styles.css`, `script.js`, and `.nojekyll` at the repository root.
3. In **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/(root)**, then save.
4. Wait for the Pages deployment to finish. GitHub reports the live URL as `https://omarsaqr12.github.io/`.

No npm install, build pipeline, secret, paid service, custom domain, or backend is needed.

## Edit

- `index.html`: biography, publication records, project descriptions, source links.
- `styles.css`: typography, colors, layout, mobile behavior, print styles.
- `script.js`: project filters and synthetic normalized constellation/AWGN sketch.
- `404.html`, `robots.txt`, `sitemap.xml`: basic navigation and discoverability.

For local viewing, open `index.html` in a browser. With Node.js 22 or later, `npm run dev` starts an optional static preview at `http://127.0.0.1:4173/`; it needs no dependencies or installation. Check JavaScript syntax with `node --check script.js`.

## Content and attribution

See `CONTENT_SOURCES.md`. Project summaries describe implemented scope and preserve team attribution. Private repository contents, credentials, unpublished experiment results, and patient/customer data are excluded from this website.

The synthetic signal sketch is a separate, deterministic educational demonstration. QPSK/8-PSK symbols have unit magnitude; 16-QAM is normalized by √10; complex Gaussian noise power is 10^(−SNR/10). It is not an ML accuracy measurement or an SDR capture.
