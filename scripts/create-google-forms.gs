/**
 * Builds both AI Foundry forms, wires each to its own response spreadsheet,
 * and files all four in the shared Drive.
 *
 * Run this once, in Apps Script, signed in as an account with edit access to
 * the AI Foundry shared folder. Open script.google.com, make a new project,
 * paste this in, and run `createAiFoundryForms`. Google will ask you to
 * authorize it the first time: it is your own script, and the permissions it
 * asks for are Forms, Sheets, and Drive, which are exactly what it uses.
 *
 * It logs the embed URL at the end. Paste that into FORMS.intake in
 * src/lib/content.ts and the site picks it up. Nothing else changes.
 *
 * Field-by-field rationale for what is here and what is deliberately not:
 * see FORMS.md in the site repo. Short version: BYU Marketing Lab asks six
 * fields for a quote, this asks eight, and the other thirty-odd fields from
 * AI-Foundry-Project-Brief.pdf are the second form, sent after first contact.
 *
 * Safe to re-run. It creates new files every time rather than editing
 * existing ones, so nothing already collecting responses can be clobbered.
 */

// "02 Deals & Clients" in the AI Foundry shared Drive. Client intake belongs
// with the deals, not loose at the root.
const TARGET_FOLDER_ID = '1x6toDmtaR28SdMDiCpnOfaQBzNxkmRsh';

function createAiFoundryForms() {
  const folder = DriveApp.getFolderById(TARGET_FOLDER_ID);
  const quote = buildQuoteForm_(folder);
  const survey = buildSurveyForm_(folder);

  const out = [
    '',
    '===============================================================',
    ' AI Foundry forms created',
    '===============================================================',
    '',
    ' 1. Get a quote  (goes on the website)',
    '    edit:      ' + quote.editUrl,
    '    responses: ' + quote.sheetUrl,
    '',
    '    PASTE THIS into FORMS.intake in src/lib/content.ts:',
    '    ' + quote.embedUrl,
    '',
    ' 2. Project intake survey  (emailed after first contact, not on the site)',
    '    edit:      ' + survey.editUrl,
    '    share:     ' + survey.publishedUrl,
    '    responses: ' + survey.sheetUrl,
    '',
    '===============================================================',
  ].join('\n');

  Logger.log(out);
  return out;
}

/* ─────────────────────────────────────────────────────────────
   Form 1: Get a quote. Eight fields, about two minutes.
   ───────────────────────────────────────────────────────────── */

function buildQuoteForm_(folder) {
  const form = FormApp.create('AI Foundry: Request a quote');

  form.setDescription(
    'Tell us what you want built. We come back with a scope of work, a cost ' +
    'estimate, and a delivery timeline. All information is treated as confidential.'
  );
  form.setConfirmationMessage(
    'Thanks. We will follow up, and send a short intake survey so we can ' +
    'scope the work properly.'
  );
  form.setCollectEmail(false);
  form.setProgressBar(false);

  form.addTextItem().setTitle('First name').setRequired(true);
  form.addTextItem().setTitle('Last name').setRequired(true);

  form.addTextItem()
    .setTitle('Email')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Enter a valid email address.')
      .requireTextIsEmail()
      .build());

  form.addTextItem().setTitle('Phone number').setRequired(true);
  form.addTextItem().setTitle('Company').setRequired(true);

  // Optional on purpose. It costs one tap and it lets whoever picks this up
  // research the company before the first call instead of during it.
  form.addTextItem().setTitle('Website').setRequired(false);

  form.addParagraphTextItem()
    .setTitle('What do you want built')
    .setHelpText(
      'A few sentences is plenty. If you are not sure yet, say so, that is a ' +
      'normal place to start.'
    )
    .setRequired(true);

  // A dropdown, not a date picker, so nobody has to commit to a date to ask
  // a question.
  form.addMultipleChoiceItem()
    .setTitle('When do you need it')
    .setChoiceValues([
      'As soon as possible',
      'Within a semester',
      'Within the year',
      'Exploring, no date yet',
    ])
    .setRequired(false);

  // Budget is deliberately NOT on this form. It is the strongest qualifier in
  // the brief and the fastest way to lose someone who has no reason yet to
  // trust a first-year program. It lives on the survey below.

  return finish_(form, 'AI Foundry: Quote requests', folder);
}

/* ─────────────────────────────────────────────────────────────
   Form 2: the rest of the intake brief. Sent after first contact.

   Sections, so the progress bar shows and nobody meets thirty
   fields at once. Everything is optional except the first
   question: whoever is filling this in is already a live lead,
   and a required field they cannot answer is a reason to stop.
   ───────────────────────────────────────────────────────────── */

function buildSurveyForm_(folder) {
  const form = FormApp.create('AI Foundry: Project intake survey');

  form.setDescription(
    'Please complete this to the extent possible. Your responses are used to ' +
    'prepare a scope of work, cost estimate, and delivery timeline. All ' +
    'information is treated as confidential.'
  );
  form.setConfirmationMessage(
    'Upon receipt, we will review your responses, follow up with any ' +
    'clarifying questions, and provide a written scope of work covering ' +
    'deliverables, cost, and schedule.'
  );
  form.setProgressBar(true);

  section_(form, 'Current process');
  form.addParagraphTextItem()
    .setTitle('The process you want to replace or improve, step by step')
    .setRequired(true);
  form.addTextItem().setTitle('How often does it run, and who runs it');
  form.addTextItem().setTitle('Roughly how many hours a week does it take');
  form.addParagraphTextItem()
    .setTitle('Where does it currently fail')
    .setHelpText('Errors, delays, things that get missed.');

  section_(form, 'Objectives');
  form.addParagraphTextItem().setTitle('What outcome are you after');
  form.addParagraphTextItem()
    .setTitle('How would you measure whether it worked')
    .setHelpText('One or more concrete success criteria.');

  section_(form, 'Users');
  form.addParagraphTextItem()
    .setTitle('Who will use this, in what roles, and how many of them');
  form.addMultipleChoiceItem()
    .setTitle('How technical are those users')
    .setChoiceValues(['High', 'Moderate', 'Low']);

  section_(form, 'Scope');
  form.addParagraphTextItem()
    .setTitle('Three to five capabilities the first release must have');
  form.addParagraphTextItem().setTitle('Capabilities you want later, but not first');
  form.addParagraphTextItem()
    .setTitle('Exclusions')
    .setHelpText('What it must not do, and what it must not have access to.');

  section_(form, 'Data and integrations');
  form.addParagraphTextItem().setTitle('Where does the relevant data live today');
  form.addCheckboxItem()
    .setTitle('What does it need to integrate with')
    .setChoiceValues([
      'Email (Gmail or Outlook)',
      'Excel or spreadsheets',
      'Google Drive or OneDrive',
      'CRM',
      'QuickBooks or other accounting',
      'Calendar',
      'SMS or text',
      'Telephone system',
      'Website forms',
      'Slack or Teams',
      'Social media',
      'Industry-specific software',
    ])
    .showOtherOption(true);
  form.addMultipleChoiceItem()
    .setTitle('Can you provide access to those systems')
    .setChoiceValues(['Yes', 'Yes, with some approvals', 'Not sure yet', 'No']);
  form.addMultipleChoiceItem()
    .setTitle('Are sample files available')
    .setChoiceValues(['Available', 'Available with preparation', 'Not available']);

  section_(form, 'Platform');
  form.addCheckboxItem()
    .setTitle('Where does this need to run')
    .setChoiceValues([
      'Windows desktop',
      'macOS desktop',
      'Web browser',
      'iOS',
      'Android',
      'Scheduled or unattended',
    ])
    .showOtherOption(true);
  form.addMultipleChoiceItem()
    .setTitle('Does it run continuously, or on demand')
    .setChoiceValues(['Continuously in the background', 'On demand', 'Not sure yet']);

  section_(form, 'Compliance and privacy');
  form.addParagraphTextItem()
    .setTitle('Any regulations that apply')
    .setHelpText('HIPAA, FERPA, GDPR, contractual obligations, anything else.');
  form.addParagraphTextItem().setTitle('Any sensitive data involved');
  form.addParagraphTextItem()
    .setTitle('Any action that must require a human to approve it before it happens');

  section_(form, 'Design references');
  form.addParagraphTextItem()
    .setTitle('Applications you think are well designed, and why');
  form.addParagraphTextItem()
    .setTitle('Applications you find difficult, and why');

  section_(form, 'Budget and ownership');
  form.addParagraphTextItem().setTitle('Budget range');
  form.addParagraphTextItem()
    .setTitle('Have you tried to solve this before, and what happened');
  form.addParagraphTextItem()
    .setTitle('Who owns this after delivery, and who needs training on it');

  section_(form, 'Anything else');
  form.addParagraphTextItem()
    .setTitle('Anything else relevant to scoping the work');

  return finish_(form, 'AI Foundry: Intake survey responses', folder);
}

/* ─────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────── */

function section_(form, title) {
  form.addPageBreakItem().setTitle(title);
}

/** Link a response sheet, move both files into the shared folder, return URLs. */
function finish_(form, sheetName, folder) {
  const sheet = SpreadsheetApp.create(sheetName);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  DriveApp.getFileById(form.getId()).moveTo(folder);
  DriveApp.getFileById(sheet.getId()).moveTo(folder);

  const published = form.getPublishedUrl();
  return {
    editUrl: form.getEditUrl(),
    publishedUrl: published,
    // What an <iframe> needs. The site drops this straight into FORMS.intake.
    embedUrl: published.replace('/viewform', '/viewform?embedded=true'),
    sheetUrl: sheet.getUrl(),
  };
}
