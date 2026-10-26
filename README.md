# Nusk Labs

Cybersecurity and bug bounty website. React 18 + Vite, fully static (no backend).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # preview the build
```

## Where things are

| What | File |
| --- | --- |
| Add or edit blog posts | `src/data/posts.js` |
| Contact email address | `src/data/site.js` |
| Homepage text, panels, steps, ticker | `src/data/content.js` |
| Cities on the globe | `src/data/nodes.js` |
| Globe drawing and attack animation | `src/components/globe/engine.js` |
| Pages | `src/pages/` |
| All styling | `src/styles/main.css` |

## Notes

- Routing is hash based (`#/blog`, `#/contact`), so it works on any static host (GitHub Pages, Netlify, Vercel, S3) with no server rules.
- The contact form opens the visitor's email app (`mailto:`). To receive messages without that, connect a form service later.
- Pausing or dragging the globe makes the site follow day or night at the place the globe faces.

## Writing a blog

1. Put your pictures in `public/blog/` (png, jpg, webp or svg).
2. Open `src/data/posts.js` and copy one post object to the top of the list.
3. Change `id` (used in the link, no spaces), `title`, `date`, `tag`, `cover` (card + top image) and `intro` (card text).
4. Write the article in `body`:
   - `"text"` for a paragraph
   - `{ h: "Heading" }` for a heading
   - `{ img: "/blog/pic.png", alt: "...", caption: "..." }` for a picture
   - `{ code: "payload" }` for a code or payload block
5. Save. The card appears on Home and Blog, and clicking it opens the full article.

## Deploying to Vercel

1. Push this folder to GitHub, then "Add New Project" on Vercel and import the repo.
2. Framework preset: Vite. Build command `npm run build`, output directory `dist` (Vercel detects both).
3. `vercel.json` already adds security headers (CSP, HSTS, nosniff, no framing).
4. Before going live: set your real email in `src/data/site.js` and `public/.well-known/security.txt`.
5. After you get your domain, add the full URL to the `og:image` tag in `index.html` (social sites need an absolute link).

## Contact form (messages straight to your inbox)

1. Go to https://web3forms.com, enter your email, and copy the access key they mail you.
2. Paste it into `WEB3FORMS_KEY` in `src/data/site.js`.
3. Redeploy. Messages now arrive in your inbox. Without a key the form just opens the visitor's email app.
