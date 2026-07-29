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
 * NOT blindly safe to re-run, and an earlier version of this comment claiming
 * otherwise is how four duplicate files ended up in the shared Drive on
 * 2026-07-29. It never overwrites, which was true, but it happily builds a
 * second copy of a form that already exists. assertNotAlreadyThere_ now blocks
 * that, and each build function takes force = true if you really mean it.
 *
 * Three entry points. Pick the right one in the dropdown next to Run, and do
 * NOT press Escape to close that dropdown: it reverts the selection without
 * changing what the label appears to say.
 *
 *   createAiFoundryForms   quote form + intake survey   (already built)
 *   createNetworkForm      join the network             (already built)
 *   trashFilesByIdOnly     cleanup, by explicit id
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

/**
 * Join the network. SEPARATE ENTRY POINT on purpose.
 *
 * Run THIS one, not createAiFoundryForms, when you only want the network form.
 * The function above builds the quote form and the survey from scratch every
 * time, so running it again would leave you with duplicates of two forms that
 * are already live and already collecting.
 *
 * Select `createNetworkForm` in the function dropdown next to Run.
 */
function createNetworkForm() {
  const folder = DriveApp.getFolderById(TARGET_FOLDER_ID);
  const net = buildNetworkForm_(folder);

  const out = [
    '',
    '===============================================================',
    ' Join the network form created',
    '===============================================================',
    '',
    '    edit:      ' + net.editUrl,
    '    responses: ' + net.sheetUrl,
    '',
    '    PASTE THIS into FORMS.network in src/lib/content.ts:',
    '    ' + net.embedUrl,
    '',
    '===============================================================',
  ].join('\n');

  Logger.log(out);
  return out;
}

/**
 * The network form.
 *
 * Shorter than the quote form, and it should stay that way. Nobody is buying
 * anything here, they are raising a hand, so every extra field is pure cost.
 * Email is the only thing actually required: everything else is nice to have
 * and none of it should stop someone joining.
 *
 * The interest checkboxes match NETWORK_INTERESTS in src/lib/content.ts, which
 * is what the website renders beside this form. If you edit one, edit both.
 *
 * On merging JD's existing list: the response sheet is the merge target. Match
 * his columns to these, append his rows underneath, then dedupe on email. Keep
 * the timestamp column, an empty timestamp is how you will tell an imported
 * row from one that came through the form.
 */
function buildNetworkForm_(folder, force) {
  assertNotAlreadyThere_('AI Foundry: Join the network', folder, force);
  const form = FormApp.create('AI Foundry: Join the network');

  form.setDescription(
    'Alumni, friends, and builders. Tell us what you want in on: events, the ' +
    'weekly digest, the talent network, or a project of your own.'
  );
  form.setConfirmationMessage(
    'You are in. We will be in touch based on what you picked.'
  );
  form.setCollectEmail(false);
  form.setProgressBar(false);

  form.addTextItem().setTitle('Full name').setRequired(false);

  form.addTextItem()
    .setTitle('Email')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .setHelpText('Enter a valid email address.')
      .requireTextIsEmail()
      .build());

  form.addTextItem().setTitle('Company or organization').setRequired(false);
  form.addTextItem().setTitle('Role').setRequired(false);
  form.addTextItem().setTitle('LinkedIn').setRequired(false);

  form.addCheckboxItem()
    .setTitle("I'm interested in")
    .setHelpText('Pick as many as apply.')
    .setChoiceValues([
      'Live BYU-sponsored AI events',
      'Weekly AI digest',
      'Access to the cohort for talent',
      'Submitting a project proposal',
    ])
    .setRequired(false);

  return finish_(form, 'AI Foundry: Network signups', folder);
}

/* ─────────────────────────────────────────────────────────────
   Form 1: Get a quote. Eight fields, about two minutes.
   ───────────────────────────────────────────────────────────── */

function buildQuoteForm_(folder, force) {
  assertNotAlreadyThere_('AI Foundry: Request a quote', folder, force);
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

function buildSurveyForm_(folder, force) {
  assertNotAlreadyThere_('AI Foundry: Project intake survey', folder, force);
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

/**
 * Move specific files to the Drive trash, by id.
 *
 * Written to clean up the duplicates from the 2026-07-29 incident. Trash, not
 * permanent deletion: Drive keeps trashed files for 30 days, so a wrong id here
 * is recoverable. It logs the title of every file before trashing it, so the
 * log is the record of exactly what went.
 *
 * Edit the list, select this function in the dropdown, Run.
 */
function trashFilesByIdOnly() {
  const ids = [
    // Duplicates created 2026-07-29 21:34 by an accidental run of
    // createAiFoundryForms. Verified by creation timestamp, and the live site
    // points at the 19:42 originals, not these.
    '17_DnHilzGPRE9sIuLLVhQdO0sFM5o9PPgfQFQmNl3TQ', // form  Request a quote (dup)
    '14NUKjaiS2wpYaS5JSX7d96HXHeqQEVVjLSyPDaNFbTA', // sheet Quote requests (dup)
    '18MOCyoEFg8pwYL5Hd2e3Jg6s8velJO6_9cDC7I_soEo', // form  Project intake survey (dup)
    '1-AWfjgr2B1fbmndP7F3NBN5p9-dFTyN-kIseyv-Te_U', // sheet Intake survey responses (dup)
  ];

  const log = [''];
  ids.forEach(function (id) {
    try {
      const file = DriveApp.getFileById(id);
      const title = file.getName();
      file.setTrashed(true);
      log.push('  trashed  ' + title + '  (' + id + ')');
    } catch (e) {
      log.push('  SKIPPED  ' + id + '  ' + e.message);
    }
  });
  log.push('');
  log.push('  Recoverable from Drive trash for 30 days.');
  Logger.log(log.join('\n'));
  return log.join('\n');
}

/**
 * Refuse to build a form that already exists in the folder.
 *
 * Added after a real incident on 2026-07-29: pressing Escape to close the
 * function dropdown silently reverted the selection to createAiFoundryForms,
 * Run executed that instead of createNetworkForm, and it cheerfully built a
 * second copy of two forms that were already live. Four junk files in a shared
 * Drive, and the only reason it was not worse is that neither form had
 * responses yet.
 *
 * "Safe to re-run because it never edits anything" was true and also useless:
 * the danger was never overwriting, it was duplicating. This is the guard that
 * should have been here from the start.
 *
 * Pass force = true only if you genuinely want a second copy.
 */
function assertNotAlreadyThere_(title, folder, force) {
  if (force) return;
  const existing = folder.getFilesByName(title);
  if (existing.hasNext()) {
    const file = existing.next();
    throw new Error(
      'A form called "' + title + '" already exists in this folder:\n' +
      file.getUrl() + '\n\n' +
      'Building another one would give you duplicates. If that is really what ' +
      'you want, call the build function with force = true. Otherwise pick a ' +
      'different function in the dropdown next to Run, and note that pressing ' +
      'Escape on that dropdown reverts your selection.'
    );
  }
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
