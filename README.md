# DANIEL REDDIC | BERGOMAT

Static portfolio site (no build step).

## Put it on GitHub Pages
1. Create a new GitHub repository and upload everything in this folder (keep the `assets` folder and `.nojekyll`).
2. Repo Settings > Pages > Build and deployment: Source = "Deploy from a branch", Branch = `main`, folder = `/ (root)`. Save.
3. After a minute the site is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Editing
- `script.js` top section ("EDIT HERE"): artwork titles/descriptions (`ART`), Lens binder photos and videos (`SPREADS`), Digital projects (`DIGITAL`, `GFX`), shop items, prices and your Zelle/email (`SHOP`).
- Swap photos by replacing files in `assets/` (keep the same file names) or point the lists at new files.
- `style.css`: all styling. `assets/head.glb`: the 3D head.

## Testing locally
Opening index.html by double-click will not load the 3D head (browsers block it). Run a tiny server in this folder instead:
`python3 -m http.server 8000` then open http://localhost:8000
