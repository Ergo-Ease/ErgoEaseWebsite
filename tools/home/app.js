/***********************
 * Question Set (15)
 ***********************/
const QUESTIONS = [
  {
    id: 1,
    text: "Is the approach to all home entrances free of uneven surfaces or tripping hazards?",
    action: "Reduce tripping hazards at home entrances",
    area: "Entrance",
    weight: 4,
    equipment: [
      { name: "Threshold ramp", costLow: 30, costHigh: 150, url: "https://www.amazon.com/dp/B0C4SY33Z6" }
    ]
  },
  {
    id: 2,
    text: "Are secure handrails present on all steps leading to entry doors?",
    action: "Install secure handrails on entry steps",
    area: "Entrance",
    weight: 5,
    equipment: [
      { name: "Exterior stair handrails", costLow: 60, costHigh: 200, url: "https://www.amazon.com/dp/B07H3L9J9F" }
    ]
  },
  {
    id: 3,
    text: "Are hallways free of clutter and loose cords?",
    action: "Remove clutter and secure cords in hallways",
    area: "Hallway",
    weight: 4,
    equipment: [
      { name: "Cord covers", costLow: 10, costHigh: 30, url: "https://www.amazon.com/dp/B0078NU4C6" }
    ]
  },
  {
    id: 4,
    text: "Is hallway lighting adequate during day and night?",
    action: "Improve lighting in hallways",
    area: "Hallway",
    weight: 3,
    equipment: [
      { name: "Motion sensor night lights", costLow: 15, costHigh: 50, url: "https://www.amazon.com/dp/B082PYDZQ2" }
    ]
  },
  {
    id: 5,
    text: "Are rugs secured with non-slip backing or removed?",
    action: "Secure or remove loose rugs in living areas",
    area: "Living Areas",
    weight: 4,
    equipment: [
      { name: "Non-slip rug pads", costLow: 10, costHigh: 40, url: "https://www.amazon.com/dp/B01C52YCU4" }
    ]
  },
  {
    id: 6,
    text: "Is furniture arranged to allow safe movement?",
    action: "Rearrange furniture to allow clear walking paths",
    area: "Living Areas",
    weight: 3,
    equipment: [
      { name: "Stable chairs with armrests", costLow: 150, costHigh: 800, url: "https://www.amazon.com/dp/B0CYBNZRHN" }
    ]
  },
  {
    id: 7,
    text: "Do chairs make it easy to stand up safely?",
    action: "Use chairs that make standing up easier",
    area: "Living Areas",
    weight: 3,
    equipment: [
      { name: "Chair risers or lift chair", costLow: 30, costHigh: 800, url: "https://www.amazon.com/dp/B0CYBNZRHN" }
    ]
  },
  {
    id: 8,
    text: "Are commonly used kitchen items reachable without climbing?",
    action: "Reorganize kitchen items to avoid climbing",
    area: "Kitchen",
    weight: 4,
    equipment: [
      { name: "Pull-down shelf organizer", costLow: 40, costHigh: 150, url: "https://www.amazon.com/dp/B07KQFZVYB" }
    ]
  },
  {
    id: 9,
    text: "Is kitchen lighting adequate without shadows?",
    action: "Improve lighting in the kitchen work areas",
    area: "Kitchen",
    weight: 3,
    equipment: [
      { name: "Under-cabinet lighting", costLow: 20, costHigh: 60, url: "https://www.amazon.com/dp/B01A2JTCZ2" }
    ]
  },
  {
    id: 10,
    text: "Is the bed height easy to get in and out of?",
    action: "Adjust bed height to make getting in and out easier",
    area: "Bedroom",
    weight: 4,
    equipment: [
      { name: "Bed assist rail", costLow: 40, costHigh: 120, url: "https://www.amazon.com/dp/B0C1SDJFXN" }
    ]
  },
  {
    id: 11,
    text: "Is there a clear, well-lit path from bed to bathroom?",
    action: "Create a clear, well-lit path from bed to bathroom",
    area: "Bedroom",
    weight: 5,
    equipment: [
      { name: "Night lights", costLow: 15, costHigh: 50, url: "https://www.amazon.com/dp/B07SM6G1PD" }
    ]
  },
  {
    id: 12,
    text: "Are grab bars installed near the toilet and in the shower?",
    action: "Install grab bars near the toilet and in the shower",
    area: "Bathroom",
    weight: 5,
    equipment: [
      { name: "ADA grab bars", costLow: 40, costHigh: 120, url: "https://www.amazon.com/dp/B0D1R6JQZ1" }
    ]
  },
  {
    id: 13,
    text: "Are bathroom surfaces non-slip when wet?",
    action: "Add non-slip surfaces in the bathroom",
    area: "Bathroom",
    weight: 4,
    equipment: [
      { name: "Non-slip bath mats", costLow: 15, costHigh: 40, url: "https://www.amazon.com/dp/B08M63DCJW" }
    ]
  },
  {
    id: 14,
    text: "Is a shower chair or bench available if needed?",
    action: "Use a shower chair or bench for safer bathing",
    area: "Bathroom",
    weight: 3,
    equipment: [
      { name: "Shower chair", costLow: 50, costHigh: 150, url: "https://www.amazon.com/dp/B07FZP6KJ6" }
    ]
  },
  {
    id: 15,
    text: "Is a phone or emergency alert device easily accessible in main areas?",
    action: "Ensure access to a phone or emergency alert device",
    area: "Emergency",
    weight: 5,
    equipment: [
      { name: "Emergency alert sysfunction submitToGoogleForm(results, userInfo) {tem", costLow: 30, costHigh: 60, url: "https://www.amazon.com/dp/B0C5Y5534H" }
    ]
  }
];
/***********************
 * Google Form Config
 ***********************/
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScYPOtBgjvruiWutmcz4wRS7ozRKCQPcD2w3j77K1xBeZ-ZNw/formResponse";



const FORM_FIELDS = {
  patientName:    "entry.243009298",
  patientEmail:   "entry.1791804861",
  clinicianEmail: "entry.55625740",
  overallScore:   "entry.145084948",
  riskLevel:      "entry.675039945",
  categoryScores: "entry.1040874941",
  priorityItems:  "entry.1661404851",
  fullJSON:       "entry.1640534330"
};





function addThemeToggle() {
  const toggle = document.createElement("button");
  toggle.className = "theme-toggle";

  toggle.textContent = document.body.classList.contains("light")
    ? "🌙"
    : "☀️";

  toggle.onclick = () => {
    document.body.classList.toggle("light");

    localStorage.setItem(
      "theme",
      document.body.classList.contains("light") ? "light" : "dark"
    );

    toggle.textContent = document.body.classList.contains("light")
      ? "🌙"
      : "☀️";
  };

  document.body.append(toggle);
}
function addTextSizeToggle() {
  const toggle = document.createElement("button");
  toggle.className = "text-toggle";

  // Initial label
  toggle.textContent = document.body.classList.contains("large-text")
    ? "A−"
    : "A+";

  toggle.onclick = () => {
    document.body.classList.toggle("large-text");

    const isLarge = document.body.classList.contains("large-text");

    localStorage.setItem("textSize", isLarge ? "large" : "normal");
    toggle.textContent = isLarge ? "A−" : "A+";
  };

  document.body.append(toggle);
}


/***********************
 * App State
 ***********************/
let index = 0;
const answers = {};
let app;

/***********************
 * App Start (DOM Safe)
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  app = document.getElementById("app");

  // Restore theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  // Restore text size
  const savedTextSize = localStorage.getItem("textSize");
  if (savedTextSize === "large") {
    document.body.classList.add("large-text");
  }

  addThemeToggle();
  addTextSizeToggle();
  renderIntro();
});




/***********************
 * Intro Screen
 ***********************/
function renderIntro() {
 document.querySelector(".hero")?.classList.remove("hidden");
  
app.innerHTML = "";

  const hero = document.createElement("div");
  hero.className = "hero";

  const content = document.createElement("div");
  content.className = "hero-content";

  const copy = document.createElement("div");
  copy.className = "hero-copy";

  const h1 = document.createElement("h1");
  h1.textContent = "The Home Independence Playbook";

  const tagline = document.createElement("div");
  tagline.className = "hero-tagline";
  tagline.textContent = "A safer home starts here.";

  const desc = document.createElement("div");
  desc.className = "hero-description";
  desc.textContent =
    "Spot risks, score your safety, and focus on what matters most.";

  const btn = document.createElement("button");
  btn.className = "primary-btn";
  btn.textContent = "Start Assessment";
  btn.onclick = showDisclaimer;

  copy.append(h1, tagline, desc, btn);
  content.append(copy);
  hero.append(content);
  app.append(hero);
}


function showDisclaimer() {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const modal = document.createElement("div");
  modal.className = "modal";

  const h2 = document.createElement("h2");
  h2.textContent = "Health Disclaimer";

  const p = document.createElement("p");
  p.textContent =
    "This app provides educational home-safety guidance only and does not diagnose, treat, or replace advice from a licensed medical professional.";

const consent = document.createElement("label");
consent.className = "consent-row";

const checkbox = document.createElement("input");
checkbox.type = "checkbox";

const consentText = document.createElement("span");
consentText.textContent =
  "I understand this is educational guidance and not medical advice.";

consent.append(checkbox, consentText);

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  const cancel = document.createElement("button");
  cancel.className = "secondary-btn";
  cancel.textContent = "Cancel";
  cancel.onclick = () => backdrop.remove();

  const agree = document.createElement("button");
  agree.className = "primary-btn";
  agree.textContent = "Agree & Continue";
  agree.disabled = true;
  agree.style.opacity = 0.5;

  checkbox.onchange = () => {
    agree.disabled = !checkbox.checked;
    agree.style.opacity = checkbox.checked ? 1 : 0.5;
  };

  agree.onclick = () => {
    backdrop.remove();
    index = 0;
    renderQuestion();
  };

  footer.append(cancel, agree);
 modal.append(h2, p, consent, footer);
  backdrop.append(modal);
  document.body.append(backdrop);
}

/***********************
 * Question Screen
 ***********************/
function renderQuestion() {
  document.querySelector(".hero")?.classList.add("hidden");

  const q = QUESTIONS[index];
  app.innerHTML = "";

const card = document.createElement("div");
  card.className = "card";

  /* Progress bar */
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  const progressFill = document.createElement("div");
  progressFill.className = "progress-fill";
  progressFill.style.width = `${((index + 1) / QUESTIONS.length) * 100}%`;

  progressBar.append(progressFill);

  /* Question header */
  const h2 = document.createElement("h2");
  h2.textContent = `Question ${index + 1} of ${QUESTIONS.length}`;

  /* Area label (Kitchen, Bathroom, etc.) */
  const area = document.createElement("div");
  area.className = "question-area";
  area.textContent = q.area;

  /* Question text */
  const p = document.createElement("p");
  p.textContent = q.text;

  /* Button row */
  const btnRow = document.createElement("div");
  btnRow.className = "button-row";

  ["Yes", "No", "NA"].forEach(val => {
    const b = document.createElement("button");
    b.className = val === "Yes" ? "primary-btn" : "secondary-btn";
    b.textContent = val === "NA" ? "N/A" : val;
    b.onclick = () => answer(val);
    btnRow.append(b);
  });

  card.append(progressBar, h2, area, p, btnRow);
  app.append(card);
}

/***********************
 * Answer Handler
 ***********************/
function answer(val) {
  answers[QUESTIONS[index].id] = val;

  if (index < QUESTIONS.length - 1) {
    index++;
    renderQuestion();
   } else {
    const results = computeResults();
    renderNextSteps(results);   // NEW PAGE
  }
}


/***********************
 * Scoring + Results
 ***********************/
function computeResults() {
  let earned = 0;
  let possible = 0;

  const categories = {};
  const priorities = [];
  let low = 0;
  let high = 0;

  QUESTIONS.forEach(q => {
    const a = answers[q.id];
    if (a === "NA") return;

    possible += q.weight;

    if (!categories[q.area]) {
      categories[q.area] = { earned: 0, possible: 0 };
    }
    categories[q.area].possible += q.weight;

    if (a === "Yes") {
      earned += q.weight;
      categories[q.area].earned += q.weight;
    } else {
      priorities.push(q);
      q.equipment.forEach(e => {
        low += e.costLow;
        high += e.costHigh;
      });
    }
  });

  const overallScore = Math.round((earned / possible) * 100);

  // ✅ Category percentages
  const categoryScores = {};
  Object.entries(categories).forEach(([area, data]) => {
    categoryScores[area] = Math.round(
      (data.earned / data.possible) * 100
    );
  });

  // ✅ EXACT Google Form radio labels
  let riskLevel;
  if (overallScore >= 80) {
    riskLevel = "Low Risk";
  } else if (overallScore >= 55) {
    riskLevel = "Moderate Risk";
  } else {
    riskLevel = "High Risk";
  }

  return {
    overallScore,
    riskLevel,          // ✅ guaranteed match
    categoryScores,
    priorities,
    costEstimate: { low, high }
  };
}
function buildFormPayload(results, userInfo) {
  return {
    patientName: userInfo.name,
    patientEmail: userInfo.email,
    clinicianEmail: userInfo.clinicianEmail || "",

    overallScore: String(results.overallScore),

    riskLevel: results.riskLevel,

    categoryScores: Object.entries(results.categoryScores || {})
      .map(([area, score]) => `${area}: ${score}%`)
      .join("\n"),

    priorityItems: (results.priorities || [])
      .map(q =>
        `${q.area} – ${q.equipment
          .map(e => `${e.name} ($${e.costLow}–$${e.costHigh})`)
          .join(", ")}`
      )
      .join("\n"),

    fullJSON: JSON.stringify(
      {
        answers: results.answers || {},
        results,
        submittedAt: new Date().toISOString()
      },
      null,
      2
    )
  };
}

function submitToGoogleForm(results, userInfo) {
  const payload = buildFormPayload(results, userInfo);

  const formData = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    const entryId = FORM_FIELDS[key];
    if (!entryId) return;
    formData.append(entryId, value);
  });

  // IMPORTANT: do NOT .toString() and do NOT set Content-Type manually
  return fetch(FORM_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}

function normalizeRiskLevel(score) {
  if (score >= 80) return "Low Risk";
  if (score >= 55) return "Moderate Risk";
  return "High Risk";
console.log("Patient Name being sent:", payload.patientName);
}


/***********************
 * Submission Modal
 ***********************/
function showSubmissionModal(results) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <h2>Submit Home Safety Assessment</h2>

    <label>
      Name *
      <input id="name" type="text" required />
    </label>

    <label>
      Email *
      <input id="email" type="email" required />
    </label>

    <label>
      Clinician Email (optional)
      <input id="clinicianEmail" type="email" />
    </label>

    <p class="disclaimer">
      This screening is educational only and does not replace professional medical advice.
    </p>

    <div class="modal-footer">
      <button class="secondary-btn" id="cancel">Cancel</button>
      <button class="primary-btn" id="submit">Submit</button>
    </div>
  `;

  backdrop.append(modal);
  document.body.append(backdrop);

  const cancelBtn = modal.querySelector("#cancel");
  const submitBtn = modal.querySelector("#submit");

  cancelBtn.onclick = () => backdrop.remove();

  submitBtn.onclick = () => {
    const userInfo = {
      name: modal.querySelector("#name").value.trim(),
      email: modal.querySelector("#email").value.trim(),
      clinicianEmail: modal.querySelector("#clinicianEmail").value.trim()
    };

    if (!userInfo.name || !userInfo.email) {
      alert("Name and Email are required.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    submitToGoogleForm(results, userInfo);

    setTimeout(() => {
      backdrop.remove();
      renderConfirmationPage();
    }, 400);
  };
}
function renderConfirmationPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="card">
      <h2>Assessment Submitted Successfully</h2>
      <p>
        Your home safety assessment has been submitted.
      </p>
      <p>
        If a valid email address was provided, a report will be delivered shortly.
      </p>
      <button class="primary-btn" onclick="location.reload()">
        Start New Assessment
      </button>
    </div>
  `;
}


/***********************
 * Results Screen
 ***********************/
function renderResults(r) {
  document.querySelector(".hero")?.classList.add("hidden");

  app.innerHTML = "";

  const container = document.createElement("div");
  container.className = "results-container";

  /* Header */
  const header = document.createElement("div");
  header.className = "results-header";

  const title = document.createElement("h1");
  title.textContent = "Your Home Safety Score";

  const score = document.createElement("div");
  score.className = "results-score";
  score.textContent = r.overallScore;

  const risk = document.createElement("span");
  risk.className = `risk-pill ${r.riskLevel.toLowerCase().replace(" ", "-")}`;
  risk.textContent = r.riskLevel;

  header.append(title, score, risk);

  /* Category Breakdown */
  const breakdown = document.createElement("div");
  breakdown.className = "results-section";

  const breakdownTitle = document.createElement("h2");
  breakdownTitle.textContent = "Category Breakdown";

  breakdown.append(breakdownTitle);

  Object.entries(r.categoryScores).forEach(([area, value]) => {
    const row = document.createElement("div");
    row.className = "category-row";

    const label = document.createElement("span");
    label.textContent = area;

    const bar = document.createElement("div");
    bar.className = "category-bar";

    const fill = document.createElement("div");
    fill.className = "category-fill";
    fill.style.width = `${value}%`;

    const pct = document.createElement("span");
    pct.textContent = `${value}%`;

    bar.append(fill);
    row.append(label, bar, pct);
    breakdown.append(row);
  });

  /* Priority Actions */
  const actions = document.createElement("div");
  actions.className = "results-section";

  const actionsTitle = document.createElement("h2");
  actionsTitle.textContent = "Top Priority Actions";

const disclaimer = document.createElement("div");
disclaimer.className = "equipment-disclaimer";
disclaimer.textContent =
  "Equipment links are provided as examples for convenience only. They are not endorsements and do not constitute medical advice.";

actions.append(actionsTitle, disclaimer);

r.priorities.forEach(q => {
  const item = document.createElement("div");
  item.className = "priority-item";

  const text = document.createElement("div");

  // Action title
  const title = document.createElement("strong");
  title.textContent = q.action;

  // Meta line
  const meta = document.createElement("div");
  meta.className = "priority-meta";
  meta.textContent = `${q.area} • High impact`;

  // Equipment links (REAL URLs)
  const equip = document.createElement("div");
  equip.className = "priority-equipment";

  q.equipment.forEach((e, i) => {
    const link = document.createElement("a");
    link.href = e.url;                 // ✅ REAL Amazon link
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `${e.name} ($${e.costLow}–$${e.costHigh})`;

    equip.append(link);

    if (i < q.equipment.length - 1) {
      equip.append(document.createTextNode(", "));
    }
  });

  text.append(title, meta, equip);
  item.append(text);
  actions.append(item);
});


  /* Budget Snapshot */
  const budget = document.createElement("div");
  budget.className = "results-section";

  const budgetTitle = document.createElement("h2");
  budgetTitle.textContent = "Budget Snapshot";

  const budgetText = document.createElement("p");
  budgetText.textContent =
    `Estimated equipment cost: $${r.costEstimate.low} – $${r.costEstimate.high}`;

  budget.append(budgetTitle, budgetText);

/* Footer Actions */
const footer = document.createElement("div");
footer.className = "results-footer";

/* Submit Results */
const submitBtn = document.createElement("button");
submitBtn.className = "primary-btn";
submitBtn.textContent = "Submit Results";
submitBtn.onclick = () => showSubmissionModal(r);

/* Retake Assessment */
const retakeBtn = document.createElement("button");
retakeBtn.className = "secondary-btn";
retakeBtn.textContent = "Retake Assessment";
retakeBtn.onclick = () => {
  index = 0;
  Object.keys(answers).forEach(k => delete answers[k]);
  renderIntro();
};

footer.append(submitBtn, retakeBtn);

container.append(header, breakdown, actions, budget, footer);
app.append(container);
}
function renderNextSteps(results) {
  app.innerHTML = "";

  const container = document.createElement("div");
  container.className = "next-steps-container";

  const title = document.createElement("h1");
  title.textContent = "Assessment Complete";

  const message = document.createElement("p");
  message.textContent =
    "The evaluation has been successfully completed. You may now generate a comprehensive safety report summarizing environmental risks, recommended interventions, and estimated cost considerations. Reports are securely delivered via email for documentation and care planning purposes.";

  const instructions = document.createElement("div");
  instructions.className = "next-steps-box";
  instructions.innerHTML = `
    <ol>
      <li>Click <strong>Submit Results</strong> below.</li>
      <li>Enter your  name and email address.</li>
      <li>Click submit to receive a full safety report by email.</li>
    </ol>
  `;

  const buttonRow = document.createElement("div");
  buttonRow.className = "button-row";

  const submitBtn = document.createElement("button");
  submitBtn.className = "primary-btn";
  submitBtn.textContent = "Submit Results";
  submitBtn.onclick = () => showSubmissionModal(results);

  const viewBtn = document.createElement("button");
  viewBtn.className = "secondary-btn";
  viewBtn.textContent = "View Results Now";
  viewBtn.onclick = () => renderResults(results);

  buttonRow.append(submitBtn, viewBtn);
  container.append(title, message, instructions, buttonRow);
  app.append(container);
}

