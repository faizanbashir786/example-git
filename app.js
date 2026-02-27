const steps = Array.from(document.querySelectorAll('.step'));
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progressFill');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const checkerForm = document.getElementById('checkerForm');
const emailGate = document.getElementById('emailGate');
const result = document.getElementById('result');
const emailForm = document.getElementById('emailForm');
const stepError = document.getElementById('stepError');
const restartBtn = document.getElementById('restartBtn');

let currentStep = 0;
let answers = {};

function showStep(index) {
  steps.forEach((step, i) => step.classList.toggle('active', i === index));
  progress.textContent = `Step ${index + 1} of ${steps.length}`;
  progressFill.style.width = `${((index + 1) / steps.length) * 100}%`;
  backBtn.disabled = index === 0;
  nextBtn.textContent = index === steps.length - 1 ? 'Continue' : 'Next';
  stepError.classList.add('hidden');
}

function validateStep(stepEl) {
  const requiredFields = stepEl.querySelectorAll('input[required]');

  for (const field of requiredFields) {
    if (field.type === 'radio') {
      const group = stepEl.querySelectorAll(`input[name="${field.name}"]`);
      if (![...group].some(item => item.checked)) {
        return false;
      }
    } else if (!field.value) {
      return false;
    }
  }

  return true;
}

function captureAnswers() {
  const formData = new FormData(checkerForm);
  answers = {
    vatStatus: formData.get('vatStatus'),
    income: Number(formData.get('income') || 0),
    recordKeeping: formData.get('recordKeeping'),
    digitalFiling: formData.get('digitalFiling'),
    confidence: formData.get('confidence')
  };
}

function buildAssessment(data) {
  let applicability = 'Not enough information.';
  let deadline = 'Unknown';
  let riskScore = 0;
  const gapNotes = [];

  if (data.vatStatus === 'yes') {
    applicability = 'MTD for VAT likely applies now. MTD for Income Tax may also apply based on your income.';
    riskScore += 1;
  } else {
    applicability = 'MTD for VAT may not apply unless you register for VAT. Income threshold still affects MTD for Income Tax timing.';
  }

  if (data.income >= 50000) {
    deadline = 'April 2026 (income at or above £50,000)';
  } else if (data.income >= 30000) {
    deadline = 'April 2027 (income at or above £30,000)';
  } else {
    deadline = 'Below current announced thresholds (under £30,000). Monitor HMRC updates.';
    riskScore += 1;
  }

  if (data.recordKeeping === 'paper') {
    riskScore += 2;
    gapNotes.push('Move from paper records to digital bookkeeping.');
  } else if (data.recordKeeping === 'spreadsheet') {
    riskScore += 1;
    gapNotes.push('Check if your spreadsheet process needs MTD bridging software.');
  }

  if (data.digitalFiling === 'no') {
    riskScore += 2;
    gapNotes.push('Set up digital submission workflows before your deadline year.');
  } else if (data.digitalFiling === 'sometimes') {
    riskScore += 1;
    gapNotes.push('Standardise quarterly and end-of-period submissions.');
  }

  if (data.confidence === 'low') {
    riskScore += 2;
    gapNotes.push('Arrange support from an accountant or MTD onboarding service.');
  } else if (data.confidence === 'medium') {
    riskScore += 1;
  }

  let risk = 'Low';
  if (riskScore >= 6) risk = 'High';
  else if (riskScore >= 3) risk = 'Medium';

  return {
    applicability,
    deadline,
    risk,
    gap: gapNotes.length ? gapNotes.join(' ') : 'Minimal digital gap identified. Keep records and filing habits consistent.'
  };
}

function renderResult(report) {
  document.getElementById('applicability').textContent = report.applicability;
  document.getElementById('deadline').textContent = report.deadline;
  document.getElementById('risk').textContent = report.risk;
  document.getElementById('gap').textContent = report.gap;
}

function resetFlow() {
  checkerForm.reset();
  emailForm.reset();
  answers = {};
  currentStep = 0;
  result.classList.add('hidden');
  emailGate.classList.add('hidden');
  checkerForm.classList.remove('hidden');
  progress.classList.remove('hidden');
  document.getElementById('progressFill').parentElement.classList.remove('hidden');
  showStep(currentStep);
}

backBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep -= 1;
    showStep(currentStep);
  }
});

nextBtn.addEventListener('click', () => {
  const stepEl = steps[currentStep];
  if (!validateStep(stepEl)) {
    stepError.classList.remove('hidden');
    return;
  }

  if (currentStep < steps.length - 1) {
    currentStep += 1;
    showStep(currentStep);
    return;
  }

  captureAnswers();
  checkerForm.classList.add('hidden');
  progress.classList.add('hidden');
  document.getElementById('progressFill').parentElement.classList.add('hidden');
  emailGate.classList.remove('hidden');
});

emailForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!emailForm.reportValidity()) {
    return;
  }

  const report = buildAssessment(answers);
  renderResult(report);
  emailGate.classList.add('hidden');
  result.classList.remove('hidden');
});

restartBtn.addEventListener('click', resetFlow);

showStep(currentStep);
