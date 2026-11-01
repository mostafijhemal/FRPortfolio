# Mostafijur Rahman — Portfolio

A single-page portfolio plus a small blog, built with plain HTML, CSS, and
JavaScript. No build step, no dependencies — open `index.html` and it works.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All page content and markup (hero, about, skills, experience, projects, contact) |
| `blog.html` | Blog index — featured post plus a grid of recent posts |
| `blog-agents-boring-parts.html` | Post: *The boring parts of AI agents are the parts that matter* |
| `blog-small-models.html` | Post: *Small models changed where AI features live* |
| `blog-tool-calls.html` | Post: *Tool calls are the new API surface* |
| `styles.css` | Design system, layout, responsive breakpoints, print styles |
| `script.js` | Mobile nav, scroll reveal, active-section nav, copy-email, contact form, 3D card tilt |
| `assets/avatar.png` | Portrait pulled from GitHub |
| `assets/favicon.svg` | Monogram favicon |

## Preview locally

```bash
python -m http.server 5183
# then open http://localhost:5183
```

## Editing content

Everything lives in `index.html` between section comments:

- **Hero** — headline, availability badge, stats strip
- **About** — `#about`
- **Skills** — `#skills`, one `.skill-card` per group
- **Experience** — `#work`, one `.timeline-item` per entry
- **Projects** — `#projects`, one `.project-card` per project
- **Contact** — `#contact`, the two-column panel with direct channels on the left and the form on the right

Colours and spacing are CSS variables at the top of `styles.css` (`--accent` is the
teal used throughout). Change `--accent` / `--accent-strong` to re-theme the site.

## Contact form

The form does client-side validation (name, email format, message length) and shows
inline errors. It never posts anywhere by default: it opens the visitor's own email
app with the message pre-filled and addressed to you, so it works on GitHub Pages
with no accounts or backend.

To collect submissions directly instead, paste a form endpoint in `script.js`:

```js
const CONTACT_ENDPOINT = "https://formspree.io/f/xxxxxxxx"; // or another form service
```

With an endpoint set, the form POSTs the fields as `multipart/form-data` and shows a
success or failure message in place of the mailto fallback. Nothing else needs to
change. There is also an off-screen `_gotcha` honeypot field that silently drops bots.

## Blog

`blog.html` lists the posts; each post is its own HTML page so links are stable and
nothing needs a database. The three posts that ship with the site are demo content —
rewrite them, or delete them and start from one as a template.

To add a post:

1. Copy a post file, e.g. `blog-tool-calls.html` → `blog-my-new-post.html`.
2. Update the `<title>`, the `<meta name="description">`, the `section-kicker`
   category, the `<h1>`, the lede, the `<time>` element and the `.prose` body.
3. Add a `.post-card` (or the `.post-featured` block) to `blog.html` pointing at the
   new file, and add prev/next links at the bottom of the neighbouring posts.

The post body lives inside `<div class="prose">`, so `h2`, `p`, `ul`, `blockquote`,
`code`, and `pre` are already styled.

## Publish with GitHub Pages

1. Create a repository, e.g. `portfolio`.
2. Push these files (`index.html`, `blog*.html`, `styles.css`, `script.js`, `assets/`)
   to `main`.
3. In the repo: **Settings → Pages → Build and deployment → Deploy from a branch →
   `main` / `root` → Save**.
4. The site appears at `https://mostafijhemal.github.io/portfolio/`.

To serve it at `https://mostafijhemal.github.io/` instead, name the repository
`mostafijhemal.github.io` and drop it at the branch root.

## Still to confirm

- Exact job title and start date at **AristoPharma Ltd.**
- Graduation year and university name for the **M.Sc.** entry (and whether to add a
  B.Sc. entry)
- Optional extras: phone number or CV/PDF download
- Replace the three demo blog posts with real writing
