# Blocktap

A responsive, buildless landing page about reclaiming time from scrolling.

Run `npm run dev`, then open http://localhost:3000. Run `npm run check` for JavaScript syntax validation. The deployable site is in `dist/`.

The calculator is an illustration: minutes per day × 365, displayed as annual hours and whole 24-hour days. No outcomes, checkout, email capture, compatibility, or prices are fabricated. Purchase integration can be added once launch details exist.

Design references: https://getbrick.com/ and https://www.foqos.app/ . Original product image supplied by the user.

`dist/assets/blocktap-studio.png` was generated with the built-in imagegen tool using the supplied prototype as reference. Prompt: "Use case: product-mockup. Create an editorial product photograph for Blocktap website using the supplied image as product reference. Preserve the violet blue palm-sized rounded square 3D-printed block, four engraved corner arc motifs, engraved BLOCKTAP lettering and thin thickness. Single block lying flat at slight diagonal on warm pale peach cream matte studio surface, close-up shot from elevated angle, sunlight from upper left casting a distinct soft long shadow toward bottom right. Product occupies middle 65% of square image, tactile fine plastic layer lines, tasteful premium independent design studio photography. No hands, phones, props, additional text, or graphics. Match reference product closely."

## Deployment

Public site: https://dist-six-xi-47.vercel.app

Import this repository into Vercel to deploy from GitHub. The root `vercel.json` validates the JavaScript and serves `dist/`. Local `.vercel/` project settings and environment files are ignored by Git. The existing deployment was published with the CLI; Git-based automatic deployments require linking this repository in Vercel.
