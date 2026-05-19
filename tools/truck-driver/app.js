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
    "Seat & Head Position": "Keep your head aligned over your shoulders and your seat adjusted so you can see clearly without craning forward.",
    "Low Back Support": "A supported lumbar curve and slight seat recline can reduce fatigue during long driving periods.",
    "Hips & Legs": "Your hips should stay fully supported while your knees and legs move comfortably between pedals and rest positions.",
    "Feet & Cab Access": "Pedals, step-in height, and stable footing all affect strain on your feet, knees, and overall balance.",
    "Shoulders, Arms & Hands": "Relaxed shoulders and elbows help reduce tension while steering, shifting, and handling controls.",
    "Driving Habits": "Regular movement breaks, hydration, and route habits help reduce whole-body fatigue.",
    "Cab Environment": "Visibility, vibration, reach distance, and storage placement all shape ergonomic comfort in the cab."
};


/* ============================================================
   QUESTION SET (NO EQUIPMENT QUESTION)
============================================================ */
const QUESTIONS = [
    { id:"seat_eye_line", cat:"Seat & Head Position", q:"Can you see the road clearly over the dash without leaning your head forward?", weight:2 },
    { id:"mirror_neutral", cat:"Seat & Head Position", q:"Are your mirrors adjusted so you can check them without twisting or jutting your neck?", weight:2 },
    { id:"headrest_support", cat:"Seat & Head Position", q:"Is your headrest positioned to support a neutral head and neck posture?", weight:1 },

    { id:"lumbar_support", cat:"Low Back Support", q:"Does your seat provide comfortable lower-back support while driving?", weight:2 },
    { id:"seat_recline", cat:"Low Back Support", q:"Is your seatback reclined slightly so you are not sitting bolt upright for long periods?", weight:2 },
    { id:"vibration_control", cat:"Low Back Support", q:"Does your seat help reduce road vibration and jarring through your back?", weight:2 },

    { id:"hips_supported", cat:"Hips & Legs", q:"Are your hips fully supported by the seat without sliding forward?", weight:2 },
    { id:"knee_space", cat:"Hips & Legs", q:"Do you have enough space to move your knees and legs comfortably while driving?", weight:2 },
    { id:"seat_edge_pressure", cat:"Hips & Legs", q:"Does the front edge of the seat avoid pressing into the back of your thighs?", weight:1 },

    { id:"pedal_reach", cat:"Feet & Cab Access", q:"Can you reach the pedals without over-stretching your legs or pointing your toes hard downward?", weight:2 },
    { id:"stable_entry", cat:"Feet & Cab Access", q:"Do you use stable handholds and steps when getting in and out of the truck?", weight:1 },
    { id:"foot_support", cat:"Feet & Cab Access", q:"Do your feet feel supported and stable during long stretches of driving?", weight:1 },

    { id:"shoulders_relaxed", cat:"Shoulders, Arms & Hands", q:"Can you keep your shoulders relaxed while holding the steering wheel?", weight:2 },
    { id:"elbow_bend", cat:"Shoulders, Arms & Hands", q:"Are your elbows slightly bent instead of locked out while driving?", weight:2 },
    { id:"wrist_neutral", cat:"Shoulders, Arms & Hands", q:"Do your wrists stay mostly straight while steering and using cab controls?", weight:2 },

    { id:"breaks", cat:"Driving Habits", q:"Do you take regular movement breaks during long trips when safe and practical?", weight:1 },
    { id:"hydration", cat:"Driving Habits", q:"Do you stay hydrated throughout your shift?", weight:1 },
    { id:"load_planning", cat:"Driving Habits", q:"Do you plan stops and tasks to avoid rushing, awkward lifting, or repeated strain?", weight:1 },

    { id:"glare", cat:"Cab Environment", q:"Is glare from the windshield, dash, or side windows kept under control?", weight:1 },
    { id:"controls_reach", cat:"Cab Environment", q:"Are the controls you use most often within easy reach from your normal driving position?", weight:1 },
    { id:"storage_access", cat:"Cab Environment", q:"Are storage items placed so you can reach them without awkward twisting or overreaching?", weight:1 }
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
        "Lumbar Support Cushion",
        "Suspension Seat Cushion",
        "Steering Wheel Cover Grip",
        "Clip-On Sun Visor Extender",
        "Mirror Adjustment Aid",
        "Portable Seat Wedge",
        "Cab Step Grip Tape",
        "Hands-Free Headset"
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
    { item: "Clip-On Sun Visor Extender", cat: "Cab Environment", cost: "$15–$30",
      budgetLink: "https://www.amazon.com/s?k=truck+sun+visor+extender",
      premiumLink: "https://www.amazon.com/s?k=premium+truck+sun+visor+extender" },

    { item: "Mirror Blind Spot Add-On", cat: "Cab Environment", cost: "$12–$25",
      budgetLink: "https://www.amazon.com/s?k=truck+blind+spot+mirror",
      premiumLink: "https://www.amazon.com/s?k=premium+truck+blind+spot+mirror" },

    { item: "Cab Organizer Caddy", cat: "Cab Environment", cost: "$20–$45",
      budgetLink: "https://www.amazon.com/s?k=truck+cab+organizer",
      premiumLink: "https://www.amazon.com/s?k=premium+truck+cab+organizer" },

    { item: "Lumbar Support Cushion", cat: "Low Back Support", cost: "$25–$50",
      budgetLink: "https://www.amazon.com/s?k=truck+lumbar+support+cushion",
      premiumLink: "https://www.amazon.com/s?k=premium+truck+lumbar+support+cushion" },

    { item: "Suspension Seat Cushion", cat: "Low Back Support", cost: "$45–$120",
      budgetLink: "https://www.amazon.com/s?k=truck+seat+cushion+vibration",
      premiumLink: "https://www.amazon.com/s?k=premium+truck+suspension+seat+cushion" },

    { item: "Portable Seat Wedge", cat: "Hips & Legs", cost: "$20–$40",
      budgetLink: "https://www.amazon.com/s?k=truck+seat+wedge+cushion",
      premiumLink: "https://www.amazon.com/s?k=premium+seat+wedge+cushion" },

    { item: "Leg Support Cushion", cat: "Hips & Legs", cost: "$25–$55",
      budgetLink: "https://www.amazon.com/s?k=leg+support+cushion+car+seat",
      premiumLink: "https://www.amazon.com/s?k=premium+leg+support+cushion+car+seat" },

    { item: "Pedal Comfort Cover Set", cat: "Feet & Cab Access", cost: "$18–$35",
      budgetLink: "https://www.amazon.com/s?k=truck+pedal+pad+cover",
      premiumLink: "https://www.amazon.com/s?k=premium+truck+pedal+cover" },

    { item: "Cab Step Grip Tape", cat: "Feet & Cab Access", cost: "$12–$25",
      budgetLink: "https://www.amazon.com/s?k=truck+step+grip+tape",
      premiumLink: "https://www.amazon.com/s?k=premium+anti+slip+grip+tape" },

    { item: "Steering Wheel Cover Grip", cat: "Shoulders, Arms & Hands", cost: "$15–$30",
      budgetLink: "https://www.amazon.com/s?k=truck+steering+wheel+cover+grip",
      premiumLink: "https://www.amazon.com/s?k=premium+truck+steering+wheel+cover" },

    { item: "Arm Support Pad", cat: "Shoulders, Arms & Hands", cost: "$20–$45",
      budgetLink: "https://www.amazon.com/s?k=car+armrest+support+pad",
      premiumLink: "https://www.amazon.com/s?k=premium+vehicle+armrest+support" },

    { item: "Hands-Free Headset", cat: "Driving Habits", cost: "$25–$80",
      budgetLink: "https://www.amazon.com/s?k=trucker+hands+free+headset",
      premiumLink: "https://www.amazon.com/s?k=premium+trucker+bluetooth+headset" }
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
      "Discipline": "Truck Drivers",
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

