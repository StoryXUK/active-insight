function doPost(e) {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Responses');
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.attendeeType,
    data.name,
    data.company,
    (data.selections || []).join(', ')
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
