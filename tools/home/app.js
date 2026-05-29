/***********************
 * Home Safety App
 * Complete app.js replacement
 ***********************/

/***********************
 * Google Form Config
 * Matches Apps Script source sheet: Form Responses 4
 ***********************/
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdRQyCCFSjcDbgHJ04f_MM-nE9E3iSkVa7SNAEj9lI3S1Xz8A/formResponse";

const FORM_FIELDS = {
  when: "entry.2047149240",
  employeeName: "entry.1943500786",
  employer: "entry.1677099687",
  discipline: "entry.2047427559",
  score: "entry.1382140920",
  status: "entry.1904022429",
  safeItems: "entry.218414928",
  flaggedItems: "entry.1838043351",
  topRecs: "entry.1048214936",
  gearItems: "entry.1585007199",
  estCostUSD: "entry.1432334069",
  emailAddress: "entry.67631206"
};

/***********************
 * Question Set
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
      { name: "Emergency alert system", costLow: 30, costHigh: 60, url: "https://www.amazon.com/dp/B0C5Y5534H" }
    ]
  }
];
const AREA_GUIDANCE = {
  Entrance: {
    title: "Safe entrances reduce fall risk.",
    text: "Stable walking surfaces, ramps, and secure handrails improve safety when entering or leaving the home."
  },

  Hallway: {
    title: "Clear pathways improve mobility.",
    text: "Reducing clutter and improving lighting can help prevent trips and improve navigation throughout the home."
  },

  "Living Areas": {
    title: "Comfortable living spaces support independence.",
    text: "Furniture layout, stable seating, and reduced tripping hazards help make daily movement safer and easier."
  },

  Kitchen: {
    title: "Accessible kitchens improve safety.",
    text: "Keeping commonly used items within reach can reduce overreaching, climbing, and balance-related injuries."
  },

  Bedroom: {
    title: "Safe bedrooms support nighttime mobility.",
    text: "Good lighting and safe bed access can reduce fall risk during nighttime movement."
  },

  Bathroom: {
    title: "Bathrooms are a common fall area.",
    text: "Grab bars, non-slip surfaces, and bathing supports can significantly improve bathroom safety."
  },

  Emergency: {
    title: "Emergency access improves peace of mind.",
    text: "Quick access to phones and emergency alert systems can improve response time during urgent situations."
  }
};
/***********************
 * App State
 ***********************/
let index = 0;
const answers = {};
const ownedEquipment = new Set();
let app;

/***********************
 * DOM Start
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  app = document.getElementById("app");

  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
  }

  if (localStorage.getItem("textSize") === "large") {
    document.body.classList.add("large-text");
  }

  addThemeToggle();
  addTextSizeToggle();
  renderIntro();
});

/***********************
 * Utility Buttons
 ***********************/
function addThemeToggle() {
  const toggle = document.createElement("button");
  toggle.className = "theme-toggle";
  toggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";

  toggle.onclick = () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    toggle.textContent = isLight ? "🌙" : "☀️";
  };

  document.body.append(toggle);
}

function addTextSizeToggle() {
  const toggle = document.createElement("button");
  toggle.className = "text-toggle";
  toggle.textContent = document.body.classList.contains("large-text") ? "A−" : "A+";

  toggle.onclick = () => {
    document.body.classList.toggle("large-text");
    const isLarge = document.body.classList.contains("large-text");
    localStorage.setItem("textSize", isLarge ? "large" : "normal");
    toggle.textContent = isLarge ? "A−" : "A+";
  };

  document.body.append(toggle);
}

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
  desc.textContent = "Spot risks, score your safety, and focus on what matters most.";

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
    renderEquipmentScreen();
  };

  footer.append(cancel, agree);
  modal.append(h2, p, consent, footer);
  backdrop.append(modal);
  document.body.append(backdrop);
}

/***********************
 * Equipment Pre-Screen
 ***********************/
function renderEquipmentScreen() {
  document.querySelector(".hero")?.classList.add("hidden");
  app.innerHTML = "";

  ownedEquipment.clear();

  const card = document.createElement("div");
  card.className = "card equipment-screen";

  const title = document.createElement("h2");
  title.textContent = "Before We Begin";

  const intro = document.createElement("p");
  intro.textContent =
    "Please select any home safety equipment you already have. This helps tailor recommendations so you do not receive suggestions for items you already own.";

  const list = document.createElement("div");
  list.className = "equipment-checklist";

  const equipmentItems = Array.from(
    new Set(
      QUESTIONS.flatMap(q => (q.equipment || []).map(e => e.name))
    )
  );

  equipmentItems.forEach(item => {
    const label = document.createElement("label");
    label.className = "equipment-check-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = item;

    const span = document.createElement("span");
    span.textContent = item;

    label.append(checkbox, span);
    list.append(label);
  });

  const footer = document.createElement("div");
  footer.className = "button-row";

  const continueBtn = document.createElement("button");
  continueBtn.className = "primary-btn";
  continueBtn.textContent = "Continue to Screening";

  continueBtn.onclick = () => {
    list.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
      ownedEquipment.add(input.value);
    });

    index = 0;
    renderQuestion();
  };

  footer.append(continueBtn);
  card.append(title, intro, list, footer);
  app.append(card);
}

/***********************
 * Question Flow
 ***********************/
function renderQuestion() {
  document.querySelector(".hero")?.classList.add("hidden");

  const q = QUESTIONS[index];
  app.innerHTML = "";

  const card = document.createElement("div");
  card.className = "card question-card";

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  const progressFill = document.createElement("div");
  progressFill.className = "progress-fill";
  progressFill.style.width = `${((index + 1) / QUESTIONS.length) * 100}%`;
  progressBar.append(progressFill);

  const visualSection = document.createElement("div");
  visualSection.className = "question-visual";

  const image = document.createElement("img");
image.src = "home-safety-visual.png";
  image.alt = "Home safety illustration";
  image.className = "question-visual-image";

  const visualText = document.createElement("div");
  visualText.className = "question-visual-text";
const guidance = AREA_GUIDANCE[q.area] || {
  title: "Safe homes support independence.",
  text: "Small environmental changes can reduce fall risk and improve accessibility."
};

visualText.innerHTML = `
  <h3>${guidance.title}</h3>
  <p>${guidance.text}</p>
`;

  visualSection.append(image, visualText);

  const h2 = document.createElement("h2");
  h2.textContent = `Question ${index + 1} of ${QUESTIONS.length}`;

  const area = document.createElement("div");
  area.className = "question-area";
  area.textContent = q.area;

  const p = document.createElement("p");
  p.textContent = q.text;

  const btnRow = document.createElement("div");
  btnRow.className = "button-row";

  ["Yes", "No", "NA"].forEach(value => {
    const btn = document.createElement("button");
    btn.className = value === "Yes" ? "primary-btn" : "secondary-btn";
    btn.textContent = value === "NA" ? "N/A" : value;
    btn.onclick = () => answer(value);
    btnRow.append(btn);
  });

card.append(progressBar, h2, area, p, btnRow, visualSection);
  app.append(card);
}
function answer(value) {
  answers[QUESTIONS[index].id] = value;

  if (index < QUESTIONS.length - 1) {
    index++;
    renderQuestion();
  } else {
    const results = computeResults();
    renderNextSteps(results);
  }
}

/***********************
 * Scoring
 ***********************/
function computeResults() {
  let earned = 0;
  let possible = 0;
  let low = 0;
  let high = 0;

  const categories = {};
  const priorities = [];

  QUESTIONS.forEach(q => {
    const answerValue = answers[q.id];
    if (answerValue === "NA") return;

    possible += q.weight;

    if (!categories[q.area]) {
      categories[q.area] = { earned: 0, possible: 0 };
    }

    categories[q.area].possible += q.weight;

    if (answerValue === "Yes") {
      earned += q.weight;
      categories[q.area].earned += q.weight;
    } else {
      const recommendedEquipment = (q.equipment || []).filter(e => {
        return !ownedEquipment.has(e.name);
      });

      priorities.push({
        ...q,
        equipment: recommendedEquipment
      });

      recommendedEquipment.forEach(e => {
        low += e.costLow;
        high += e.costHigh;
      });
    }
  });

  const overallScore = possible > 0 ? Math.round((earned / possible) * 100) : 0;

  const categoryScores = {};
  Object.entries(categories).forEach(([area, data]) => {
    categoryScores[area] = data.possible > 0
      ? Math.round((data.earned / data.possible) * 100)
      : 0;
  });

  return {
    overallScore,
    riskLevel: normalizeRiskLevel(overallScore),
    categoryScores,
    priorities,
    costEstimate: { low, high },
    answers: { ...answers },
    ownedEquipment: Array.from(ownedEquipment)
  };
}

function normalizeRiskLevel(score) {
  if (score >= 80) return "Low Risk";
  if (score >= 55) return "Moderate Risk";
  return "High Risk";
}

/***********************
 * Google Form Payload
 * Option A: structured payload → Google Form entry fields
 ***********************/
function buildFormPayload(results, userInfo) {
  const safeItems = QUESTIONS
    .filter(q => answers[q.id] === "Yes")
    .map(q => q.area)
    .filter((area, i, arr) => arr.indexOf(area) === i)
    .join(" | ");

  const flaggedItems = (results.priorities || [])
    .map(q => q.area)
    .filter((area, i, arr) => arr.indexOf(area) === i)
    .join(" | ");

  const topRecs = (results.priorities || [])
    .flatMap(q => q.equipment || [])
    .map(e => e.name)
    .filter((name, i, arr) => arr.indexOf(name) === i)
    .join(" | ");

  const gearItems = (results.priorities || []).reduce(
    (count, q) => count + ((q.equipment || []).length),
    0
  );

  return {
    when: new Date().toISOString(),
    employeeName: userInfo.name,
    employer: userInfo.employer || "Home Safety",
    discipline: "Home",
    score: String(results.overallScore),
    status: results.riskLevel,
    safeItems,
    flaggedItems,
    topRecs,
    gearItems: String(gearItems),
    estCostUSD: `$${results.costEstimate.low}–$${results.costEstimate.high}`,
    emailAddress: userInfo.email
  };
}

function submitToGoogleForm(results, userInfo) {
  const payload = buildFormPayload(results, userInfo);

  console.log("Submitting Home Safety Google Form payload:", payload);

  return new Promise(resolve => {
    const iframeName = "hidden_google_form_iframe_" + Date.now();

    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.action = FORM_URL;
    form.method = "POST";
    form.target = iframeName;
    form.style.display = "none";

    Object.entries(payload).forEach(([key, value]) => {
      const entryId = FORM_FIELDS[key];
      if (!entryId) return;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = entryId;
      input.value = value == null ? "" : String(value);
      form.appendChild(input);
    });
document.body.appendChild(form);

iframe.onload = () => {
  console.log("Google Form iframe load completed.");

  setTimeout(() => {
    form.remove();
    iframe.remove();
  }, 1000);

  resolve({
    ok: true,
    method: "hidden-form-post"
  });
};

console.log("FORM URL:", FORM_URL);
console.log("PAYLOAD:", payload);

form.submit();

setTimeout(() => {
  if (document.body.contains(form)) {
    form.remove();
  }

  if (document.body.contains(iframe)) {
    iframe.remove();
  }

  resolve({
    ok: true,
    method: "hidden-form-post-timeout"
  });
}, 2500);

    // Google Forms sometimes does not reliably fire iframe.onload.
    // Resolve anyway so the user is not stuck on the submit screen.
    setTimeout(() => {
      if (document.body.contains(form)) form.remove();
      if (document.body.contains(iframe)) iframe.remove();
      resolve({ ok: true, method: "hidden-form-post-timeout" });
    }, 2500);
  });
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
      Employer / Organization (optional)
      <input id="employer" type="text" />
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

  submitBtn.onclick = async () => {
    const userInfo = {
      name: modal.querySelector("#name").value.trim(),
      email: modal.querySelector("#email").value.trim(),
      employer: modal.querySelector("#employer").value.trim()
    };

    if (!userInfo.name || !userInfo.email) {
      alert("Name and Email are required.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    try {
      const response = await submitToGoogleForm(results, userInfo);
      console.log("Home Safety Google Form submission response:", response);
    backdrop.remove();
window.location.href = "confirmation.html";
    } catch (err) {
  console.error("HOME SUBMISSION ERROR:", err);
  alert(err.message || String(err));
  submitBtn.disabled = false;
  submitBtn.textContent = "Submit";
}
  };
}

function renderConfirmationPage() {
  app.innerHTML = `
    <div class="confirmation-wrapper">

      <div class="confirmation-header">
        <img
          src="logo-slogan.png"
          alt="ErgoEase — Ergonomic Insight, Healthier Workplaces, Safer Homes"
          class="confirmation-logo"
        />
      </div>

      <h1>Report Sent Successfully</h1>

      <p>
        Your assessment has been completed, and your personalized report has been
        sent to the email address you provided.
      </p>

      <p>
        Take a few minutes to review your report carefully. Focus on the key risk
        areas identified and the recommended adjustments that can improve comfort,
        reduce strain, and support long-term safety in your home environment.
      </p>

      <hr class="confirmation-divider" />

      <h2>About ErgoEase</h2>

      <p>
        ErgoEase is a digital ergonomic and home safety screening platform designed
        to identify risk factors and provide clear, practical recommendations tailored
        to real-world environments.
      </p>

      <p>
        Our goal is to help individuals and organizations make smarter decisions around
        workspace setup, movement patterns, accessibility, and home safety.
      </p>

      <p>
        If you have questions or are interested in team screening options, feel free
        to reach out — we’re here to help.
      </p>

      <hr class="confirmation-divider" />

      <div class="next-step">
        <p class="next-step-text">
          Want to screen another role or environment?
        </p>

        <p class="next-step-subtext">
          Explore office, dental, warehouse, driving, healthcare, or home safety screenings — all designed to deliver fast, practical recommendations.
        </p>

        <a href="occupations.html" class="btn btn-primary next-step-btn">
          View Available Screens
        </a>
      </div>

      <div class="confirmation-footer">
        <p><strong>ErgoEase</strong></p>

        <p>
          <a href="mailto:ergoease.app@gmail.com">
            ergoease.app@gmail.com
          </a>
        </p>

        <p class="disclaimer">
          ErgoEase is a home safety and ergonomic screening tool designed to identify
          potential risk factors and provide general recommendations. It is not a substitute
          for medical advice, diagnosis, or treatment. If you are experiencing pain,
          injury, or a medical emergency, please seek care from a qualified healthcare
          professional.
        </p>
      </div>
    </div>
  `;
}

/***********************
 * Next Steps Screen
 ***********************/
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
      <li>Enter your name and email address.</li>
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

/***********************
 * Results Screen
 ***********************/
function renderResults(results) {
  document.querySelector(".hero")?.classList.add("hidden");

  app.innerHTML = "";

  const container = document.createElement("div");
  container.className = "results-container";

  const header = document.createElement("div");
  header.className = "results-header";

  const title = document.createElement("h1");
  title.textContent = "Your Home Safety Score";

  const score = document.createElement("div");
  score.className = "results-score";
  score.textContent = results.overallScore;

  const risk = document.createElement("span");
  risk.className = `risk-pill ${results.riskLevel.toLowerCase().replace(" ", "-")}`;
  risk.textContent = results.riskLevel;

  header.append(title, score, risk);

  const breakdown = document.createElement("div");
  breakdown.className = "results-section";

  const breakdownTitle = document.createElement("h2");
  breakdownTitle.textContent = "Category Breakdown";
  breakdown.append(breakdownTitle);

  Object.entries(results.categoryScores).forEach(([area, value]) => {
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

  const actions = document.createElement("div");
  actions.className = "results-section";

  const actionsTitle = document.createElement("h2");
  actionsTitle.textContent = "Top Priority Actions";

  const disclaimer = document.createElement("div");
  disclaimer.className = "equipment-disclaimer";
  disclaimer.textContent =
    "Equipment links are provided as examples for convenience only. They are not endorsements and do not constitute medical advice.";

  actions.append(actionsTitle, disclaimer);

  if (!results.priorities.length) {
    const none = document.createElement("p");
    none.textContent = "No priority action items were identified from your responses.";
    actions.append(none);
  }

  results.priorities.forEach(q => {
    const item = document.createElement("div");
    item.className = "priority-item";

    const text = document.createElement("div");

    const actionTitle = document.createElement("strong");
    actionTitle.textContent = q.action;

    const meta = document.createElement("div");
    meta.className = "priority-meta";
    meta.textContent = `${q.area} • High impact`;

    const equip = document.createElement("div");
    equip.className = "priority-equipment";

    q.equipment.forEach((e, i) => {
      const link = document.createElement("a");
      link.href = e.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${e.name} ($${e.costLow}–$${e.costHigh})`;

      equip.append(link);

      if (i < q.equipment.length - 1) {
        equip.append(document.createTextNode(", "));
      }
    });

    text.append(actionTitle, meta, equip);
    item.append(text);
    actions.append(item);
  });

  const budget = document.createElement("div");
  budget.className = "results-section";

  const budgetTitle = document.createElement("h2");
  budgetTitle.textContent = "Budget Snapshot";

  const budgetText = document.createElement("p");
  budgetText.textContent =
    `Estimated equipment cost: $${results.costEstimate.low} – $${results.costEstimate.high}`;

  budget.append(budgetTitle, budgetText);

  const footer = document.createElement("div");
  footer.className = "results-footer";

  const submitBtn = document.createElement("button");
  submitBtn.className = "primary-btn";
  submitBtn.textContent = "Submit Results";
  submitBtn.onclick = () => showSubmissionModal(results);

  const retakeBtn = document.createElement("button");
  retakeBtn.className = "secondary-btn";
  retakeBtn.textContent = "Retake Assessment";
  retakeBtn.onclick = () => {
    index = 0;
    Object.keys(answers).forEach(key => delete answers[key]);
    ownedEquipment.clear();
    renderIntro();
  };

  footer.append(submitBtn, retakeBtn);
  container.append(header, breakdown, actions, budget, footer);
  app.append(container);
}
