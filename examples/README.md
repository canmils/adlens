# Reproducible, fictional onboarding example

[fictional-page.html](fictional-page.html) is an authored publisher/ad fixture with no external
assets or network requests. It is not an observed advertisement or evidence of campaign performance.

After installing Chromium with the main README commands, run `npm run example`.
This generates ignored `examples/generated.png` (1000 × 600 pixels).
If Chromium installation is unavailable, open the HTML in your normal browser and take a PNG
screenshot; adjust crop coordinates to the actual image dimensions.

## Free walkthrough

1. Start AdLens, open http://127.0.0.1:3000 and upload `examples/generated.png`.
2. In Review, set X **80**, Y **160**, Width **600**, Height **240**. Click **Preview crop**.
3. Verify the crop shows the fictional advertisement, then **Add crop to collection**.
4. Close Review, open **Creative collection** and open the new creative.
5. Enter these manual observations:

| Field | Reference value |
| --- | --- |
| Visible advertiser | Fictional Shoes |
| Visible copy | Save 20% on imaginary trainers |
| Visible call to action | Explore the collection |
| Visible offer | 20% discount — fictional |
| Hook category | Discount |
| Limitations and uncertainty | Synthetic example; no actual campaign, targeting or performance data |

6. Click **Save corrections**. This saves manual notes; no AI key is needed.
7. **Download evidence** saves the crop as PNG. Close the detail dialog and **Export CSV**.
8. Confirm the CSV contains the advertiser, copy and status `manual`. It does not contain the image.
9. Reload at the **same origin** and browser profile. Open the collection and confirm notes remain.

Upload provenance is unverified, even for this fixture: no publisher URL or real observation time
is established. A hook category is an interpretation. Do not present it as verified targeting.

`npm run test:browser` automates upload, crop preview/save, manual notes, image/CSV downloads,
reload persistence and confirmed deletion in real Chromium. It uses temporary server storage and
a fresh browser profile, without OpenAI. It is separate from fast `npm test`.
