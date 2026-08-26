# fibodo Meeting Selector — standalone files

This version uses plain HTML, CSS and JavaScript. It can be uploaded to standard static hosting without a build process.

## Files

- `index.html` — attendee-type choice
- `operators.html` — operators choose suppliers
- `suppliers.html` — suppliers choose operators
- `styles.css` — shared responsive styling
- `script.js` — company lists, selection behaviour and form submission
- `google-apps-script.js` — code to paste into Google Apps Script

## Add the company lists

Open `script.js` and replace the sample entries in the `suppliers` and `operators` arrays.

## Connect Google Sheets

1. Create a Google Sheet and rename its first tab `Responses`.
2. Add these headings to row 1: `Submitted at`, `Attendee type`, `Name`, `Company`, `Selections`.
3. Choose **Extensions → Apps Script**.
4. Paste in the contents of `google-apps-script.js` and save.
5. Choose **Deploy → New deployment → Web app**.
6. Set **Execute as** to `Me` and **Who has access** to `Anyone`.
7. Deploy and copy the Web App URL.
8. Open `script.js` and replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with that URL.

Upload all five website files together, keeping them in the same directory.
