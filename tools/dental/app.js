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
    "Operator Positioning": "Keep your head centered over your shoulders and bring the patient, mirror, and tray closer instead of leaning in.",
    "Shoulders & Upper Back": "Relaxed shoulders and supported upper back positioning help reduce fatigue during prolonged procedures.",
    "Seated Support": "Your stool should let you sit balanced with hips supported and easy access to pedals and instruments.",
    "Legs & Foot Controls": "Feet should be stable, with pedals easy to reach without twisting or overreaching.",
    "Wrists & Hands": "Neutral wrists and a light grip help reduce strain during scaling, polishing, suctioning, and charting.",
    "Clinical Workflow": "Short posture resets, room setup consistency, and alternating tasks can reduce cumulative strain.",
    "Operatory Setup": "Lighting, instrument placement, and patient positioning strongly affect comfort and efficiency."
};


/* ============================================================
   QUESTION SET (NO EQUIPMENT QUESTION)
============================================================ */
const QUESTIONS = [
    { id:"patient_height", cat:"Operator Positioning", q:"Do you adjust the patient chair so the treatment area can be reached without bending your neck forward?", weight:2 },
    { id:"eye_line", cat:"Operator Positioning", q:"Do you keep your eyes level with the treatment area by using patient positioning, loupes, or indirect vision when appropriate?", weight:2 },
    { id:"twist_avoid", cat:"Operator Positioning", q:"Do you avoid sustained twisting of your neck or trunk while working?", weight:2 },

    { id:"shoulders_relaxed", cat:"Shoulders & Upper Back", q:"Do you keep your shoulders relaxed rather than lifted while treating patients?", weight:2 },
    { id:"upper_arms_close", cat:"Shoulders & Upper Back", q:"Do you keep your upper arms close to your body during most procedures?", weight:2 },
    { id:"back_support", cat:"Shoulders & Upper Back", q:"Does your stool or seating setup help support an upright upper-back posture?", weight:2 },

    { id:"hips_balanced", cat:"Seated Support", q:"Are you able to sit balanced on your stool with your hips supported and weight evenly distributed?", weight:2 },
    { id:"seat_height", cat:"Seated Support", q:"Is your stool height adjusted so your thighs angle slightly downward or stay comfortably open at the hips?", weight:2 },
    { id:"seat_mobility", cat:"Seated Support", q:"Can you move around the patient easily without reaching or leaning from the stool?", weight:2 },

    { id:"feet_stable", cat:"Legs & Foot Controls", q:"Are your feet stable on the floor or pedals without awkward stretching?", weight:2 },
    { id:"pedal_reach", cat:"Legs & Foot Controls", q:"Can you reach foot controls without twisting your knee or hip?", weight:2 },
    { id:"leg_clearance", cat:"Legs & Foot Controls", q:"Is there enough space around the chair base and cabinetry for comfortable leg positioning?", weight:1 },

    { id:"wrist_neutral", cat:"Wrists & Hands", q:"Do you keep your wrists relatively straight while scaling, polishing, charting, or assisting?", weight:2 },
    { id:"light_grip", cat:"Wrists & Hands", q:"Do you use a light grip on instruments rather than squeezing tightly?", weight:2 },
    { id:"instrument_size", cat:"Wrists & Hands", q:"Are your most-used instruments comfortable in diameter and handle texture for your hand?", weight:2 },

    { id:"microbreaks", cat:"Clinical Workflow", q:"Do you take short posture resets or micro-breaks between patients or during longer procedures?", weight:1 },
    { id:"task_variety", cat:"Clinical Workflow", q:"Does your day include enough task variety to avoid repeating the same posture for hours at a time?", weight:1 },
    { id:"room_setup_consistent", cat:"Clinical Workflow", q:"Is your room setup consistent enough that you do not have to search, reach, or reposition repeatedly?", weight:1 },

    { id:"light_position", cat:"Operatory Setup", q:"Can you position the operatory light without forcing your neck or shoulders into awkward angles?", weight:1 },
    { id:"instruments_within_reach", cat:"Operatory Setup", q:"Are frequently used instruments and supplies within easy reach?", weight:1 },
    { id:"assistant_transfer_zone", cat:"Operatory Setup", q:"Is the transfer zone organized to reduce crossing, overreaching, or awkward handoffs?", weight:1 },
    { id:"computer_charting", cat:"Operatory Setup", q:"Is your charting/computer screen positioned so you can view it without repeated neck strain?", weight:1 }
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
        "Operator Stool with Adjustable Seat Tilt",
        "Saddle Stool",
        "Loupes with Headlight",
        "Patient Chair Headrest Support",
        "Mobile Rear-Delivery Cart",
        "Cordless Lightweight Handpiece",
        "Ergonomic Mirror Handle",
        "Foot Pedal Stabilizer Mat"
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
    { item: "Loupes with Headlight", cat: "Operator Positioning", cost: "$180–$950",
      budgetLink: "https://www.amazon.com/s?k=dental+loupes+headlight",
      premiumLink: "https://www.amazon.com/s?k=wireless+dental+loupes+headlight" },

    { item: "Patient Chair Headrest Support", cat: "Operator Positioning", cost: "$25–$120",
      budgetLink: "https://www.amazon.com/s?k=dental+chair+headrest+support",
      premiumLink: "https://www.amazon.com/s?k=adjustable+dental+chair+headrest+support" },

    { item: "Mobile Rear-Delivery Cart", cat: "Operatory Setup", cost: "$90–$260",
      budgetLink: "https://www.amazon.com/s?k=mobile+dental+cart",
      premiumLink: "https://www.amazon.com/s?k=rear+delivery+dental+cart" },

    { item: "Arm Support Cushion", cat: "Shoulders & Upper Back", cost: "$20–$55",
      budgetLink: "https://www.amazon.com/s?k=forearm+support+cushion",
      premiumLink: "https://www.amazon.com/s?k=adjustable+forearm+support+ergonomic" },

    { item: "Operator Stool with Adjustable Seat Tilt", cat: "Seated Support", cost: "$140–$420",
      budgetLink: "https://www.amazon.com/s?k=ergonomic+dental+operator+stool",
      premiumLink: "https://www.amazon.com/s?k=premium+dental+operator+stool+tilt" },

    { item: "Saddle Stool", cat: "Seated Support", cost: "$130–$380",
      budgetLink: "https://www.amazon.com/s?k=ergonomic+saddle+stool",
      premiumLink: "https://www.amazon.com/s?k=premium+ergonomic+saddle+stool" },

    { item: "Foot Pedal Stabilizer Mat", cat: "Legs & Foot Controls", cost: "$18–$45",
      budgetLink: "https://www.amazon.com/s?k=foot+pedal+mat+ergonomic",
      premiumLink: "https://www.amazon.com/s?k=non+slip+ergonomic+foot+pedal+mat" },

    { item: "Anti-Fatigue Support Platform", cat: "Legs & Foot Controls", cost: "$35–$95",
      budgetLink: "https://www.amazon.com/s?k=anti+fatigue+support+platform",
      premiumLink: "https://www.amazon.com/s?k=adjustable+anti+fatigue+platform" },

    { item: "Ergonomic Mirror Handle", cat: "Wrists & Hands", cost: "$15–$40",
      budgetLink: "https://www.amazon.com/s?k=ergonomic+dental+mirror+handle",
      premiumLink: "https://www.amazon.com/s?k=wide+diameter+dental+mirror+handle" },

    { item: "Large-Diameter Instrument Grips", cat: "Wrists & Hands", cost: "$12–$35",
      budgetLink: "https://www.amazon.com/s?k=dental+instrument+grips",
      premiumLink: "https://www.amazon.com/s?k=silicone+dental+instrument+grips" },

    { item: "Procedure Timer", cat: "Clinical Workflow", cost: "$10–$25",
      budgetLink: "https://www.amazon.com/s?k=visual+timer+desktop",
      premiumLink: "https://www.amazon.com/s?k=programmable+interval+timer+workstation" },

    { item: "Preset Instrument Cassette System", cat: "Clinical Workflow", cost: "$35–$110",
      budgetLink: "https://www.amazon.com/s?k=dental+instrument+cassette+system",
      premiumLink: "https://www.amazon.com/s?k=organized+dental+cassette+system" },

    { item: "Adjustable LED Operatory Light", cat: "Operatory Setup", cost: "$80–$220",
      budgetLink: "https://www.amazon.com/s?k=adjustable+led+task+light+dental",
      premiumLink: "https://www.amazon.com/s?k=high+output+adjustable+operatory+light" },

    { item: "Monitor Arm for Charting Screen", cat: "Operatory Setup", cost: "$35–$120",
      budgetLink: "https://www.amazon.com/s?k=monitor+arm+vivo",
      premiumLink: "https://www.amazon.com/s?k=medical+grade+monitor+arm" }
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
      "Discipline": "Dental Office",
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
    link.download = "ErgoEase_Office_Log.csv";
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

