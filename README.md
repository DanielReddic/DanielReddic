# DANIEL REDDIC | BERGOMAT

Static portfolio site (no build step).

## Put it on GitHub Pages
1. Upload everything in this folder to a GitHub repository (keep the `assets` folder and `.nojekyll`).
2. Repo Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. After a minute it is live at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Files
- `index.html` the page. `style.css` styling. `script.js` all behavior and the editable lists at the top.
- `assets/` the 3D head (`head.glb`), artwork, graphic design works, mouth images, and `assets/lens/` photos.
- `shop.js` + `shop.css` the shop. **Switched off**: the Shop page says "coming soon".

## Lens photos
- Book photos live in `assets/lens/NN.jpg` (compressed for fast loading). Clicking one opens `assets/lens/full/NN.jpg` (large).
- The pages are the `SPREADS` list in `script.js`: `P('01',x,y,w)` places photo 01 at x% from the left, y% from the top,
  w% wide. Change the numbers to move things, or point `P(...)` at new files. Videos and text work too (see the comment above `SPREADS`).
- To add photos: save a ~1000px version as `assets/lens/16.jpg` and a ~2000px version as `assets/lens/full/16.jpg`, then add `P('16',x,y,w)` to a page.

## Launching the shop later
1. In `index.html`, remove the comment markers around the two `SHOP (off)` lines (the `shop.css` link and the `shop.js` script, which must stay after `script.js`).
2. In `shop.js`, set your Zelle address and email in `SHOP`, and replace the placeholder items and prices.
3. Checkout shows the buyer your Zelle address plus an order code, and opens an email with the order to you. There is no card processing.

## Testing locally
Opening index.html by double-click will not load the 3D head. Run `python3 -m http.server 8000` in this folder, then open http://localhost:8000
