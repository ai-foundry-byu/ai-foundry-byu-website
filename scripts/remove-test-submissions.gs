/**
 * TEMPORARY, single purpose. Remove the two ZZTEST submissions made while
 * verifying the forms end to end on 2026-07-29.
 *
 * One function only, because the Apps Script function dropdown cannot be
 * trusted to run what it displays.
 *
 * A test response lives in TWO places: the row in the linked spreadsheet, and
 * the form's own response store. Deleting one does not remove the other, so
 * this does both.
 *
 * It refuses to delete anything that is not the test row. Every sheet row is
 * checked for the test email first, and responses are only cleared when the
 * form holds exactly the one we submitted.
 */
function removeTestSubmissions() {
  var TEST_EMAIL = 'zztest.deleteme@example.com';

  var targets = [
    { name: 'Quote requests',  sheet: '1mG0PeVp1ZsuheWYM3tGDJ3FwgZ7qSw0Vk1iN9d_cyyE',
      form: '1tfwnK9BDuG8fKrhLtL8uy8RK9enbHGSUMrYkYufOiB0' },
    { name: 'Network signups', sheet: '17I2IK5W_88iuncKTE5YuZtS1HWU_KsnXhacGF81MXb4',
      form: '1pSeIx4wwMLBCgnrk0jciO-WTJ5SHCLvvnWUSEGOjLWU' }
  ];

  var log = [''];

  for (var t = 0; t < targets.length; t++) {
    var target = targets[t];
    log.push('--- ' + target.name + ' ---');

    // 1. the spreadsheet row
    var sheet = SpreadsheetApp.openById(target.sheet).getSheets()[0];
    var values = sheet.getDataRange().getValues();
    var removed = 0;
    // bottom up, so deleting does not shift rows we have not checked yet
    for (var r = values.length - 1; r >= 1; r--) {
      if (values[r].join(' | ').indexOf(TEST_EMAIL) !== -1) {
        sheet.deleteRow(r + 1);
        removed++;
      }
    }
    log.push('  sheet rows removed: ' + removed +
             '   rows remaining (incl. header): ' + sheet.getLastRow());

    // 2. the form's own response store
    var form = FormApp.openById(target.form);
    var responses = form.getResponses();
    if (responses.length === 0) {
      log.push('  form responses: already empty');
    } else if (responses.length === 1) {
      form.deleteAllResponses();
      log.push('  form responses: cleared the 1 test response');
    } else {
      log.push('  form responses: LEFT ALONE, found ' + responses.length +
               ' responses and expected 1. Someone real may have submitted. ' +
               'Delete the test one by hand in the Responses tab.');
    }
  }

  log.push('');
  Logger.log(log.join('\n'));
  return log.join('\n');
}
