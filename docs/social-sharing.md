# Social sharing metadata

## Purpose and scope

The site provides Open Graph metadata so sharing platforms can identify a title, description, and image for a link. This is intended to improve previews when a visitor shares the site from WeChat's in-app browser. It does not require a WeChat account, JS-SDK, or backend, but metadata alone does **not** guarantee that WeChat will display a card: the client, sharing method, accessibility of the assets, and cached results can affect the outcome.

The implementation was informed by the article [如何让网站链接在微信里显示卡片](https://mp.weixin.qq.com/s/RrHDjhIlvSAXJZSALjwS1A). Its suggestions include using an absolute image URL, a square 478×478 JPG or PNG under 2 MB, and testing through WeChat rather than relying on a pasted link.

## Where the metadata comes from

- `index.html` contains the site-wide page title, description, `og:title`, `og:description`, `og:type`, and `og:site_name`. These are present in the initial HTML, without needing React to run.
- `vite.config.ts` injects `og:image` and, when a site URL is configured, `og:url` into the generated HTML. The image URL points to `images/share-card.png` beneath the configured site root.
- `public/images/share-card.png` is the square sharing image. Vite copies it to `dist/images/share-card.png`. All files in `public/` must be tracked with Git LFS; install Git LFS and run `git lfs install` before adding or updating the image.
- `.github/workflows/ci.yml` passes the GitHub Pages `base_url` output as `SITE_URL` and its `base_path` as `GITHUB_PAGES_BASE` for Pages deployments. The reusable CI workflow checks out LFS assets before building.

## Deployment configuration

For GitHub Pages, the deployment workflow supplies the URL and path prefix automatically, including when a custom domain is configured. For other deployments, set both values to match the public site root when running the reusable CI build. For example, for a site at `https://example.com/zerolab/`, the equivalent local build is:

```bash
SITE_URL=https://example.com/zerolab/ GITHUB_PAGES_BASE=/zerolab/ pnpm build
```

`SITE_URL` must be an absolute HTTP(S) URL; use the publicly accessible HTTPS URL in production. `GITHUB_PAGES_BASE` must begin and end with `/`, and must match the path component of `SITE_URL` (use `/` for a root deployment). Serve the resulting `dist/` directory as the site root.

If `SITE_URL` is not set, the build emits a relative `og:image` and omits `og:url`. This is useful for local builds but may not produce a reliable sharing preview. Do not assume a URL assigned after building will be reflected in the metadata: rebuild with the final URL.

## Routing limitation

The site uses React Router's `HashRouter`. URLs such as `/#/product` and `/#/about` request the same HTML document; the fragment is not sent in the HTTP request. Consequently, the initial metadata is site-wide, not page-specific. A crawler that does not execute JavaScript or inspect fragments cannot receive different metadata for those routes. Updating tags only in React is not a reliable fix for such crawlers. Per-page previews would require a routing and rendering strategy that serves distinct metadata in the initial HTML for distinct request URLs, followed by platform testing.

## Maintenance and verification

1. Update the title and descriptions in `index.html` together when the site's positioning changes. Keep them concise and consistent with the content.
2. If replacing the image, retain a broadly compatible square JPG or PNG, keep it under 2 MB, and update the path in `vite.config.ts` if its name changes. Keep important content away from the edges in case a client crops it.
3. Build with the intended public URL and inspect `dist/index.html`. Confirm that `og:image` and `og:url` are absolute and include the correct path prefix, and that `dist/images/share-card.png` is the actual image rather than a Git LFS pointer.
4. After deployment, inspect the HTML returned by the public URL and confirm that the image URL is publicly reachable over HTTPS without authentication or hotlink blocking. For example:

   ```bash
   curl -L https://example.com/zerolab/
   curl -I -L https://example.com/zerolab/images/share-card.png
   ```

5. Open the deployed site in WeChat's in-app browser and use the top-right menu to share it with a friend. Check the title, description, image, and destination. Pasting a URL directly into a chat may remain plain text. WeChat can cache previous results, and behavior may vary between clients; a successful build or HTML inspection alone is not proof that a card will appear.
