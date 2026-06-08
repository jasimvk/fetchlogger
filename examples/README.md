# Examples

## `vanilla.html` — zero-install demo
Open it directly in a browser (or serve the folder). It loads the package from
the [esm.sh](https://esm.sh) CDN, so there's nothing to build:

```bash
# from the repo root
npx serve examples
# then open http://localhost:3000/vanilla.html
```

Click the buttons to fire requests and watch them appear in the panel.

## `react.tsx` — React snippet
Drop-in usage for any React app (Next, Vite, CRA). Install the package and
render `<FetchLogger />` once near your root:

```bash
npm i -D @jasimvk/fetchlogger
```
