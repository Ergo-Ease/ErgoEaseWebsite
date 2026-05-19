// ==============================
// CONFIG — WEB APP ENDPOINT
// ==============================
const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzhLn1Ir4Xz_pwaHZIW3UqksyyGSVIIMEVspEqMS4fFJQsSyFwbZtpS41I3Pg6eRRrF6Q/exec";
// ==============================
// GLOBAL PHOTO STATE (MUST BE FIRST)
// ==============================
let employeePhotoBase64 = null;
/* ============================================================
   DOM HELPER
============================================================ */
function $(id) { return document.getElementById(id); }

// ==============================
// PHOTO PREVIEW (NO UPLOAD YET)
// ==============================
const photoInput = document.getElementById("photoUpload");
const photoPreview = document.getElementById("photoPreview");

if (photoInput && photoPreview) {
  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      employeePhotoBase64 = e.target.result;   // 🔥 STORE PHOTO
      photoPreview.src = e.target.result;
      photoPreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });
}

/* ============================================================
   GLOBAL STATE
============================================================ */
let currentIndex = 0;
let answers = [];

let categoryTotals = {};
let categoryScores = {};

let finalPercent = 0;
let finalStatus = "";

let strengthsList = [];
let needsList = [];

let top3Gear = [];
let totalCostEstimate = "$0";

window.employeeOwnedEquipment = [];   // <-- PRE-SCREEN equipment

async function uploadPhotoToServer() {
  if (!employeePhotoBase64) return null;

  const res = await fetch(WEBAPP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "uploadPhoto",
      filename: `workstation_${Date.now()}.png`,
      base64: employeePhotoBase64
    })
  });

  const json = await res.json();
  return json.photoUrl || null;
}

/* ============================================================
   TOOLTIP TEXT
============================================================ */
const TOOLTIP_TEXT = {
    "Patient Handling & Transfers": "Keeping patients close, using assistive equipment, and asking for help when needed can reduce strain during transfers and repositioning.",
    "Mid & Low Back": "A more neutral trunk posture reduces strain. Repeated bending, reaching over beds, and twisting during care tasks can increase fatigue.",
    "Shoulders & Upper Arms": "Tasks are easier on the shoulders when supplies, monitors, and patient-care items stay below shoulder height and close to the body.",
    "Feet & Other": "Supportive footwear, stable footing, and opportunities to change position can reduce discomfort during long periods of standing and walking.",
    "Wrists & Hands": "Neutral wrists and lower grip force can help reduce strain during documentation, medication prep, equipment handling, and repetitive care tasks.",
    "Work Habits": "Brief recovery moments, task variation, hydration, and safe pacing can help manage fatigue during demanding healthcare shifts.",
    "Environment": "Clear paths, good lighting, organized supplies, and accessible equipment help reduce awkward reaches and unnecessary strain."
};

/* ============================================================
   QUESTION SET (NO EQUIPMENT QUESTION)
============================================================ */
const QUESTIONS = [
    { id:"transfer_assist", cat:"Patient Handling & Transfers", q:"Do you use patient-lift equipment, slide sheets, or team assistance for heavier or dependent transfers?", weight:2 },
    { id:"patient_close", cat:"Patient Handling & Transfers", q:"Do you keep the patient or load close to your body when assisting with transfers or repositioning?", weight:2 },
    { id:"bed_height", cat:"Patient Handling & Transfers", q:"Do you adjust bed, stretcher, or treatment-table height before providing care when possible?", weight:2 },

    { id:"bend_limit", cat:"Mid & Low Back", q:"Do you avoid repeated bending over beds, chairs, or low surfaces for long periods?", weight:2 },
    { id:"twist_limit", cat:"Mid & Low Back", q:"Do you avoid twisting your back while assisting patients, reaching for supplies, or moving equipment?", weight:2 },
    { id:"charting_posture", cat:"Mid & Low Back", q:"When charting or using a workstation, can you sit or stand with your back in a comfortable, neutral position?", weight:1 },

    { id:"shoulder_height", cat:"Shoulders & Upper Arms", q:"Do you avoid frequent tasks at or above shoulder height, such as reaching for high supplies or equipment?", weight:2 },
    { id:"elbows_close", cat:"Shoulders & Upper Arms", q:"Can you keep your elbows near your sides during medication prep, charting, or equipment use?", weight:2 },

    { id:"stable_feet", cat:"Feet & Other", q:"Do you have stable footing and enough room to position your feet during patient care tasks?", weight:2 },
    { id:"supportive_shoes", cat:"Feet & Other", q:"Do you wear supportive footwear appropriate for long shifts on hard floors?", weight:2 },
    { id:"standing_variation", cat:"Feet & Other", q:"Do you get opportunities to alternate standing, walking, and brief seated work when possible?", weight:1 },

    { id:"neutral_wrists", cat:"Wrists & Hands", q:"Are your wrists generally straight while charting, scanning, preparing medication, or handling equipment?", weight:2 },
    { id:"grip_force", cat:"Wrists & Hands", q:"Can most tasks be completed without sustained high grip force or awkward hand positions?", weight:2 },

    { id:"micro_breaks", cat:"Work Habits", q:"Do you have short recovery moments or task changes during the shift?", weight:1 },
    { id:"hydration", cat:"Work Habits", q:"Do you stay hydrated throughout the workday?", weight:1 },
    { id:"safe_pacing", cat:"Work Habits", q:"Do you pace physically demanding care tasks to avoid rushing when safety could be affected?", weight:1 },

    { id:"lighting", cat:"Environment", q:"Is lighting adequate so you can see patient-care tasks, labels, and documentation without leaning in unnecessarily?", weight:1 },
    { id:"clear_paths", cat:"Environment", q:"Are walking paths, bedside areas, and equipment routes generally clear of clutter and trip hazards?", weight:1 },
    { id:"supplies_close", cat:"Environment", q:"Are frequently used supplies positioned within easy reach for routine care tasks?", weight:1 }
];

document.addEventListener("DOMContentLoaded", () => {
    $("qTotal").textContent = QUESTIONS.length;

/* ============================================================
   SECTION CONTROL
============================================================ */
function showSection(id) {
    [
      "heroSection",
      "equipmentSection",
      "screeningSection",
      "photoStep",
      "resultsSection",
      "logView"
    ].forEach(sec => $(sec).classList.add("hidden"));

    $(id).classList.remove("hidden");

    if (id === "resultsSection") $("actionBar").classList.remove("hidden");
    else $("actionBar").classList.add("hidden");
}

/* ============================================================
   START SCREENING FLOW
============================================================ */
$("startBtn").onclick = () => {
    resetState();
    showEquipmentList();
    showSection("equipmentSection");
};

/* ============================================================
   PHOTO STEP → GENERATE RESULTS
============================================================ */
$("generateReportBtn").onclick = () => {
    computeResults();
};

function resetState() {
    currentIndex = 0;
    answers = [];
    categoryTotals = {};
    categoryScores = {};
    totalPossibleWeight = 0;

    QUESTIONS.forEach(q => {
        totalPossibleWeight += q.weight;
        if (!categoryTotals[q.cat]) categoryTotals[q.cat] = 0;
        categoryTotals[q.cat] += q.weight;
    });

    $("progressBarFill").style.width = "0%";
}

/* ============================================================
   EQUIPMENT PRE-SCREEN → Continue Button
============================================================ */
$("continueBtn").onclick = () => {
    window.employeeOwnedEquipment = Array.from(
        document.querySelectorAll(".equip-check:checked")
    ).map(cb => cb.value);

    renderQuestion();
    showSection("screeningSection");
};

/* ============================================================
   BUILD EQUIPMENT CHECKLIST DYNAMICALLY
============================================================ */
function showEquipmentList() {
    const list = $("equipmentList");
    list.innerHTML = "";

    const equipmentItems = [
        "Patient Lift / Sit-to-Stand Assist",
        "Slide Sheets / Transfer Aids",
        "Height-Adjustable Bed or Treatment Table",
        "Rolling Supply Cart",
        "Supportive Clinical Footwear",
        "Anti-Fatigue Mat",
        "Adjustable Charting Workstation",
        "Task Lighting (LED)"
    ];

    list.innerHTML = equipmentItems.map(item => `
        <label style="display:block; margin:6px 0;">
            <input type="checkbox" class="equip-check" value="${item}">
            ${item}
        </label>
    `).join("");
}

/* ============================================================
   RENDER QUESTIONS
============================================================ */
function renderQuestion() {
    const q = QUESTIONS[currentIndex];

    $("questionText").textContent = q.q;
    $("questionCategoryText").textContent = q.cat;
    $("qNum").textContent = currentIndex + 1;

    injectTooltip(q.cat);

    // Fade animation
    const box = document.querySelector(".question-box");
    box.classList.remove("fade-in");
    setTimeout(() => box.classList.add("fade-in"), 20);

    // Progress bar
    const pct = (currentIndex / QUESTIONS.length) * 100;
    $("progressBarFill").style.width = pct + "%";
}

/* ============================================================
   TOOLTIP
============================================================ */
function injectTooltip(categoryName) {
    $("tooltipSideText").textContent = TOOLTIP_TEXT[categoryName] || "";
}

/* ============================================================
   YES / NO ANSWERS
============================================================ */
$("yesBtn").onclick = () => handleAnswer(true);
$("noBtn").onclick = () => handleAnswer(false);

function handleAnswer(isYes) {
    const q = QUESTIONS[currentIndex];

    const risk = isYes ? 0 : q.weight;

    answers[currentIndex] = risk;

    if (!categoryScores[q.cat]) categoryScores[q.cat] = 0;
    categoryScores[q.cat] += risk;

    currentIndex++;

    if (currentIndex >= QUESTIONS.length) {
        showSection("photoStep");   // ⬅ go to photo + instructions first
    } else {
        renderQuestion();
    }
}

/* ============================================================
   SUBMIT TO GOOGLE SHEET (APPS SCRIPT)
============================================================ */
function submitToGoogleForm(data) {
  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdRQyCCFSjcDbgHJ04f_MM-nE9E3iSkVa7SNAEj9lI3S1Xz8A/formResponse";

  const formData = new URLSearchParams();

formData.append("entry.2047149240", data.When);
formData.append("entry.1943500786", data.EmployeeName);
formData.append("entry.1677099687", data.Employer);
formData.append("entry.2047427559", data.Discipline);
formData.append("entry.1382140920", String(data.Score));
formData.append("entry.1904022429", data.Status);
formData.append("entry.218414928", data["Safe Items"]);
formData.append("entry.1838043351", data["Flagged Items"]);

// Top Recs = actual equipment recommendation names
formData.append("entry.1048214936", data["Top Recs"]);

// Gear Items = numeric count
formData.append("entry.1585007199", String(data["Gear Items"]));

formData.append("entry.1432334069", String(data.EstCostUSD));
formData.append("entry.67631206", data["Email Address"]);

  return fetch(FORM_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}

/* ============================================================
   RESULTS
============================================================ */
function computeResults() {
    const totalRisk = answers.reduce((a,b)=>a+b, 0);
    finalPercent = Math.round((totalRisk / totalPossibleWeight) * 100);

    if (finalPercent <= 20) finalStatus = "Low Risk";
    else if (finalPercent <= 40) finalStatus = "Mild Risk";
    else if (finalPercent <= 60) finalStatus = "Moderate Risk";
    else if (finalPercent <= 80) finalStatus = "High Risk";
    else finalStatus = "Severe Risk";

    $("scoreText").textContent = finalPercent + "%";
    $("scoreLabel").textContent = finalStatus;

    // Strengths & Needs
    strengthsList = [];
    needsList = [];

    for (let cat in categoryTotals) {
        const pct = (categoryScores[cat] || 0) / categoryTotals[cat];
        if (pct < 0.5) strengthsList.push(cat);
        else needsList.push(cat);
    }

    $("strengthList").innerHTML = strengthsList.map(s => `<li>${s}</li>`).join("");
    $("needsList").innerHTML = needsList.map(n => `<li>${n}</li>`).join("");

    renderBreakdown();
    computeRecommendations();
    updateGauge(finalPercent);

    showSection("resultsSection");
}

/* ============================================================
   BREAKDOWN BARS
============================================================ */
function renderBreakdown() {
    $("breakdownContainer").innerHTML = "";

    for (let cat in categoryTotals) {
        const risk = categoryScores[cat] || 0;
        const pct = Math.round((risk / categoryTotals[cat]) * 100);

        const color =
            pct > 60 ? "#e74c3c" :
            pct > 30 ? "#f1c40f" :
                        "#5cb85c";

        $("breakdownContainer").innerHTML += `
            <div class="breakRow">
                <div>${cat}</div>
                <div>${pct}%</div>
            </div>
            <div class="barOuter">
                <div class="barFill" style="width:${pct}%; background:${color};"></div>
            </div>
        `;
    }
}

/* ============================================================
   GAUGE
============================================================ */
function updateGauge(percent) {
    const maxArc = 314;
    const fill = (percent / 100) * maxArc;

    $("gaugeFill").style.strokeDasharray = `${fill} ${maxArc}`;

    const angle = -90 + percent * 1.8;
    const rad = angle * Math.PI / 180;

    const cx = 20 + 140 * Math.cos(rad);
    const cy = 160 + 140 * Math.sin(rad);

    $("gaugePtr").setAttribute("cx", cx);
    $("gaugePtr").setAttribute("cy", cy);
}

/* ============================================================
   DEVICE CATALOG
============================================================ */
const GEAR = [
    { item: "Task Lighting (LED)", cat: "Environment", cost: "$25–$60",
      budgetLink: "https://www.amazon.com/s?k=led+task+light+medical+workstation",
      premiumLink: "https://www.amazon.com/s?k=premium+led+task+light+clinical+workstation" },

    { item: "Rolling Supply Cart", cat: "Environment", cost: "$80–$180",
      budgetLink: "https://www.amazon.com/s?k=medical+rolling+supply+cart",
      premiumLink: "https://www.amazon.com/s?k=premium+medical+rolling+supply+cart" },

    { item: "Patient Lift / Sit-to-Stand Assist", cat: "Patient Handling & Transfers", cost: "$250–$600",
      budgetLink: "https://www.amazon.com/s?k=patient+lift+transfer+assist",
      premiumLink: "https://www.amazon.com/s?k=premium+sit+to+stand+patient+lift" },

    { item: "Slide Sheets / Transfer Aids", cat: "Patient Handling & Transfers", cost: "$25–$70",
      budgetLink: "https://www.amazon.com/s?k=patient+transfer+slide+sheet",
      premiumLink: "https://www.amazon.com/s?k=premium+patient+transfer+slide+sheet" },

    { item: "Height-Adjustable Bed or Treatment Table", cat: "Mid & Low Back", cost: "$180–$350",
      budgetLink: "https://www.amazon.com/s?k=height+adjustable+treatment+table",
      premiumLink: "https://www.amazon.com/s?k=premium+height+adjustable+medical+table" },

    { item: "Adjustable Charting Workstation", cat: "Mid & Low Back", cost: "$120–$260",
      budgetLink: "https://www.amazon.com/s?k=adjustable+medical+computer+workstation",
      premiumLink: "https://www.amazon.com/s?k=premium+adjustable+charting+workstation" },

    { item: "Anti-Fatigue Mat", cat: "Feet & Other", cost: "$50–$90",
      budgetLink: "https://www.amazon.com/s?k=anti+fatigue+mat+medical",
      premiumLink: "https://www.amazon.com/s?k=premium+anti+fatigue+mat+healthcare" },

    { item: "Supportive Clinical Footwear", cat: "Feet & Other", cost: "$40–$120",
      budgetLink: "https://www.amazon.com/s?k=supportive+nursing+shoes",
      premiumLink: "https://www.amazon.com/s?k=premium+supportive+nursing+shoes" },

    { item: "Ergonomic Keyboard and Mouse", cat: "Wrists & Hands", cost: "$35–$90",
      budgetLink: "https://www.amazon.com/s?k=ergonomic+keyboard+mouse+medical+office",
      premiumLink: "https://www.amazon.com/s?k=premium+ergonomic+keyboard+mouse" },

    { item: "Low-Force Scissors / Clinical Tool Grip", cat: "Wrists & Hands", cost: "$10–$30",
      budgetLink: "https://www.amazon.com/s?k=ergonomic+medical+scissors",
      premiumLink: "https://www.amazon.com/s?k=premium+ergonomic+medical+scissors" },

    { item: "Shift Hydration Bottle", cat: "Work Habits", cost: "$15–$30",
      budgetLink: "https://www.amazon.com/s?k=hydration+reminder+bottle",
      premiumLink: "https://www.amazon.com/s?k=insulated+hydration+reminder+bottle" },

    { item: "Task Rotation / Break Timer", cat: "Work Habits", cost: "$25–$60",
      budgetLink: "https://www.amazon.com/s?k=work+break+timer",
      premiumLink: "https://www.amazon.com/s?k=premium+digital+interval+timer" },

    { item: "Adjustable Monitor Arm", cat: "Shoulders & Upper Arms", cost: "$35–$90",
      budgetLink: "https://www.amazon.com/s?k=adjustable+monitor+arm+medical+workstation",
      premiumLink: "https://www.amazon.com/s?k=premium+adjustable+monitor+arm" },

    { item: "Lightweight Reach Tool", cat: "Shoulders & Upper Arms", cost: "$15–$35",
      budgetLink: "https://www.amazon.com/s?k=lightweight+reacher+grabber+tool",
      premiumLink: "https://www.amazon.com/s?k=premium+lightweight+reacher+grabber" }
];

/* ============================================================
   RECOMMENDATION ENGINE
============================================================ */
function computeRecommendations() {
    // 1. Identify high-risk categories
    let highRiskCategories = Object.keys(categoryTotals).filter(cat => {
        const pct = Math.round((categoryScores[cat] || 0) / categoryTotals[cat] * 100);
        return pct >= 50;
    });

    // fallback: top category
    if (highRiskCategories.length === 0) {
        highRiskCategories = [
            Object.keys(categoryTotals).sort((a,b) =>
                (categoryScores[b]||0) - (categoryScores[a]||0)
            )[0]
        ];
    }

    // 2. Collect matching gear
    let allMatches = GEAR.filter(g => highRiskCategories.includes(g.cat));

    // 3. Remove equipment the employee already owns
    if (Array.isArray(window.employeeOwnedEquipment)) {
        allMatches = allMatches.filter(item =>
            !window.employeeOwnedEquipment.includes(item.item)
        );
    }

    // 4. Top 3
    top3Gear = allMatches.slice(0, 3);
    const noDevicesMsg = $("noDevicesMsg");

    if (top3Gear.length === 0) {
        noDevicesMsg.classList.remove("hidden");
    } else {
        noDevicesMsg.classList.add("hidden");
    }

    // 5. Render top 3
    $("topRecsContainer").innerHTML = top3Gear.map(g => `
        <div class="topRecItem">
            <strong>${g.item}</strong><br>
            <span>${g.cat}</span><br>
            <span>${g.cost}</span><br>
            <a href="${g.budgetLink}" target="_blank">Budget Option</a><br>
            <a href="${g.premiumLink}" target="_blank">Premium Option</a>
        </div>
    `).join("");

    // 6. Render all devices
    $("allDevicesContainer").innerHTML = allMatches.map(g => `
        <div class="allDeviceCard">
            <strong>${g.item}</strong><br>
            <span>${g.cat}</span><br>
            <span>${g.cost}</span><br>
            <a href="${g.budgetLink}" target="_blank">Budget Option</a><br>
            <a href="${g.premiumLink}" target="_blank">Premium Option</a>
        </div>
    `).join("");

    // 7. Cost estimate
    let low = 0, high = 0;
    top3Gear.forEach(i => {
        const parts = i.cost.replace(/\$/g,"").split("–");
        low += parseInt(parts[0]);
        high += parseInt(parts[1]);
    });

    totalCostEstimate = `$${low}–$${high}`;
    $("estCostText").textContent = "Estimated Cost: " + totalCostEstimate;
}

/* ============================================================
   Toggle device list
============================================================ */
$("toggleAllBtn").onclick = () => {
    const box = $("allDevicesWrapper");
    const hidden = box.classList.contains("hidden");

    if (hidden) {
        box.classList.remove("hidden");
        $("toggleAllBtn").textContent = "Hide All Device Options ▲";
    } else {
        box.classList.add("hidden");
        $("toggleAllBtn").textContent = "Show All Device Options ▼";
    }
};

/* ============================================================
   SAVE / LOG / CSV
============================================================ */
$("saveReportBtn").onclick = () =>
  $("saveModal").classList.remove("hidden");

$("cancelSaveBtn").onclick = () =>
  $("saveModal").classList.add("hidden");

// 🔒 Submission guard scoped ONLY to this button
$("confirmSaveBtn").onclick = async () => {
  const btn = $("confirmSaveBtn");
  btn.textContent = "Saving...";
  btn.disabled = true;

  try {
    // ----------------------------
    // Required fields
    // ----------------------------
    const employee = $("employeeName").value.trim();
    if (!employee) throw new Error("Employee name required");

    const email = $("employeeEmail").value.trim();
    if (!email) throw new Error("Email required");

    const employer = $("employerName").value.trim();

    const notes = $("reportNotes").value.trim();

    // ----------------------------
    // Google Form payload (FINAL)
    // ----------------------------
    const sheetPayload = {
      "When": new Date().toISOString(),
      "EmployeeName": employee,
      "Employer": employer,
      "Discipline": "Nursing/Healthcare Workers",
      "Score": finalPercent,
      "Status": finalStatus,
      "Safe Items": strengthsList.join(" | "),
      "Flagged Items": needsList.join(" | "),
      "Gear Items": top3Gear.length,
      "Top Recs": top3Gear.map(g => g.item).join(" | "),
      "EstCostUSD": totalCostEstimate,
      "Notes": notes,
      "Email Address": email
    };

    console.log("Submitting payload:", sheetPayload);

    // 🔑 AWAIT submission
    await submitToGoogleForm(sheetPayload);

    // Close modal
    $("saveModal").classList.add("hidden");

    // Redirect
    window.location.href =
      "confirmation.html?email=" +
      encodeURIComponent(email) +
      "&employee=" +
      encodeURIComponent(employee);

  } catch (err) {
    alert("Save failed: " + err.message);
    console.error(err);
  } finally {
    // 🔓 ALWAYS reset button
    btn.textContent = "Save Report";
    btn.disabled = false;
  }
};

// ----------------------------
// View log
// ----------------------------
$("viewLogBtn").onclick = () => {
  renderLogTable();
  showSection("logView");
};

function renderLogTable() {
    const log = JSON.parse(localStorage.getItem("ergoLog") || "[]");

    $("logTableBody").innerHTML = log.map(r => `
        <tr>
            <td>${r.when}</td>
            <td>${r.employeeName}</td>
            <td>${r.discipline}</td>
            <td>${r.score}</td>
            <td>${r.status}</td>
            <td>${r.safeItems}</td>
            <td>${r.flaggedItems}</td>
            <td>${r.gearItems}</td>
            <td>${r.topRecs}</td>
            <td>${r.estCostUSD}</td>
            <td>${r.recTitles}</td>
            <td>${r.evaluatorNotes}</td>
            <td>${r.photoIncluded ? "📸 Yes" : "—"}</td>
            <td style="text-align:center;">
              ${r.hasPhoto ? "📷 Yes" : "—"}
            </td>
        </tr>
    `).join("");
}

$("backBtn").onclick = () => showSection("resultsSection");

$("clearLogBtn").onclick = () => {
    if (confirm("Clear ALL entries?")) {
        localStorage.removeItem("ergoLog");
        renderLogTable();
    }
};

$("csvBtn").onclick = () => {
    const log = JSON.parse(localStorage.getItem("ergoLog") || "[]");
    if (!log.length) return alert("No saved reports.");

    let csv =
"WHEN,EmployeeName,Discipline,Score,Status,SafeItems,FlaggedItems,#Devices,EstCostUSD,TopDevices,RecTitles,EvaluatorNotes\n";

    log.forEach(r => {
        csv += [
            `"${r.when}"`,
            `"${r.employeeName}"`,
            `"${r.discipline}"`,
            `"${r.score}"`,
            `"${r.status}"`,
            `"${r.safeItems}"`,
            `"${r.flaggedItems}"`,
            `"${r.gearItems}"`,
            `"${r.estCostUSD}"`,
            `"${r.topRecs}"`,
            `"${r.recTitles}"`,
            `"${r.evaluatorNotes}"`
        ].join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ErgoEase_Nursing_Healthcare_Log.csv";
    link.click();
};

/* ============================================================
   RETAKE
============================================================ */
$("retakeBtn").onclick = () => {
    resetState();
    updateGauge(0);
    renderQuestion();
    showSection("screeningSection");
};
}); // ✅ CLOSE DOMContentLoaded