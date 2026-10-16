# Loyal Renovations Website

The website is deployed from this repository to https://loyal-renovations.vercel.app.

## Site structure

- `index.html`: home and overview
- `about/index.html`: company approach
- `services/index.html`: services
- `services/kitchen-remodeling/index.html`
- `services/bathroom-remodeling/index.html`
- `services/whole-home-renovations/index.html`
- `services/interior-upgrades/index.html`
- `projects/index.html`: clearly marked design inspiration, **not** past work
- `process/index.html`
- `faq/index.html`
- `contact/index.html`
- `assets/style.css`: responsive, accessible site styling
- `assets/site.js`: mobile menu, quote popup and AJAX forms
- `api/lead.js`: secure serverless submission handler

Each indexable page has unique SEO metadata, canonical URL, a single main heading, internal links, and structured data where applicable. `robots.txt` and `sitemap.xml` support indexing. The homepage points to service pages and navigation is cross-page.

## Important: activate direct email notifications

**The form cannot deliver emails until the provider and recipient addresses are configured.** The API intentionally returns `503` if anything is missing, and the form displays an honest failure message rather than falsely claiming success.

Configure these **server-side only** Vercel environment variables on project `loyal-renovations` for Production, then redeploy:

- `RESEND_API_KEY`: API key from the Resend email delivery account.
- `LEAD_FROM_EMAIL`: authorized, domain-verified sender, e.g. `Loyal Renovations <inquiries@yourdomain.com>`. Use a domain controlled and verified by the business.
- `LEAD_TO_EMAILS`: the inquiry inbox `contact@ignitellc.co`. Additional addresses can be added later if desired.

The endpoint verifies required contact fields, uses a honeypot, escapes HTML, and sends to the addresses above only after the email provider confirms acceptance. Test delivery on production using inboxes for both recipients and check spam folders before promoting the site. For production-grade bot prevention, add rate limiting or a verified CAPTCHA service in a later iteration.

## Launch checklist

1. Collect and verify owner email, company contact information, and base city/state plus towns served. **Do not add guessed local SEO claims.**
2. Verify the domain and configure the email provider.
3. Run a real end-to-end form test that reaches both inboxes.
4. Replace design-inspiration photography with photos of verified completed work when available.
5. Connect custom domain if desired, then update every canonical URL, schema URL, sitemap URL, and robots sitemap URL.
6. Verify the property and submit `/sitemap.xml` in Google Search Console.
7. Confirm business name, physical/legal address (if publicly used), licensing status, and service offering with owner before adding claims.

## Brand

Deep navy `#101d2c`, warm gold `#c39a59`, and light stone `#f3f0ea`. Supplied official logo is used on all pages. The transparent/unboxed header and larger mobile logo are handled in CSS.
