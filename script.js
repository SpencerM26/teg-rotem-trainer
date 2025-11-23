(function () {
  // --- Data & Constants ---

  const CONDITIONS = [
    "Normal",
    "Anticoagulants / Factor deficiency",
    "Abnormal platelet function / antiplatelet agent",
    "Fibrinolysis",
    "Hypercoagulable state",
    "DIC (late)"
  ];

  const THERAPIES = {
    factor: "Factor Replacement (Plasma and/or Cryo)",
    platelets: "Platelets",
    txa: "TXA / antifibrinolytic",
    none: "No product"
  };

  const NORMALS = {
    TEG: { R: [5, 10], K: [1, 3], alpha: [53, 72], MA: [50, 70], LY30: [0, 3] },
    ROTEM: { CT: [38, 79], CFT: [34, 159], alpha: [65, 83], MCF: [50, 72], LI30: [94, 100] }
  };

  const CASES = [
    {
      id: "normal-1", svg: "graphs/Normal.svg", condition: "Normal",
      description: "A middle-aged post-operative patient is recovering uneventfully. The surgical field remains dry, vital signs are stable, and temperature and perfusion are normal. A viscoelastic test is performed.",
      teg: { R: 7, K: 1.5, alpha: 65, MA: 62, LY30: 1 },
      rotem: { CT: 70, CFT: 120, alpha: 70, MCF: 62, LI30: 98 },
      therapies: ["none"]
    },
    {
      id: "normal-2", svg: "graphs/Normal.svg", condition: "Normal",
      description: "Following trauma surgery, hemostasis appears secure and blood loss has stopped. The patient is normothermic and stable on room air. The team performs a viscoelastic study.",
      teg: { R: 8, K: 1.8, alpha: 63, MA: 60, LY30: 2 },
      rotem: { CT: 75, CFT: 140, alpha: 68, MCF: 60, LI30: 97 },
      therapies: ["none"]
    },
    {
      id: "anticoag-1", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "After cardiothoracic surgery, mild oozing persists from multiple small sites. The patient has been rewarmed and electrolytes corrected. Anesthetic recovery is uneventful, but clinicians obtain a viscoelastic trace to assess early clot initiation and kinetics before giving additional products.",
      teg: { R: 16, K: 2.5, alpha: 58, MA: 62, LY30: 1 },
      rotem: { CT: 140, CFT: 150, alpha: 60, MCF: 62, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "anticoag-3", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "A patient with liver disease develops diffuse bleeding following abdominal surgery. Bleeding is not brisk but persists despite surgical hemostasis. A viscoelastic analysis is ordered.",
      teg: { R: 18, K: 2.2, alpha: 56, MA: 60, LY30: 1 },
      rotem: { CT: 160, CFT: 145, alpha: 58, MCF: 60, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "fibrino-1", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "In a major abdominal procedure with moderate transfusion requirement, the operative field shows slow ooze from broad tissue planes. Core temperature and acid–base status are acceptable. A viscoelastic study is performed to examine clot propagation and firmness.",
      teg: { R: 8, K: 3.5, alpha: 48, MA: 56, LY30: 2 },
      rotem: { CT: 80, CFT: 260, alpha: 54, MCF: 54, LI30: 97 },
      therapies: ["factor"]
    },
    {
      id: "fibrino-2", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "A postpartum hemorrhage has been controlled surgically, but small diffuse bleeding continues. Blood pressure and temperature are stable. Clinicians request a viscoelastic test to evaluate the quality of hemostasis.",
      teg: { R: 7, K: 3.2, alpha: 50, MA: 52, LY30: 1 },
      rotem: { CT: 78, CFT: 240, alpha: 56, MCF: 52, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "plate-1", svg: "graphs/Platelet_blockers.svg", condition: "Abnormal platelet function / antiplatelet agent",
      description: "An urgent non-cardiac operation proceeds in a patient with MI and stent placement 5 months ago. There is generalized oozing. After correction of temperature and electrolytes, a viscoelastic study is obtained to evaluate overall clot strength.",
      teg: { R: 8, K: 2, alpha: 55, MA: 40, LY30: 1 },
      rotem: { CT: 75, CFT: 160, alpha: 60, MCF: 38, LI30: 98 },
      therapies: ["platelets"]
    },
    {
      id: "plate-2", svg: "graphs/Platelet_blockers.svg", condition: "Abnormal platelet function / antiplatelet agent",
      description: "A complex hepatic resection becomes notable for diffuse surface bleeding that is unresponsive to surgical measures. The anesthesia team performs a viscoelastic assay.",
      teg: { R: 7, K: 1.8, alpha: 60, MA: 36, LY30: 2 },
      rotem: { CT: 70, CFT: 150, alpha: 62, MCF: 34, LI30: 97 },
      therapies: ["platelets"]
    },
    {
      id: "lysis-1", svg: "graphs/fibrinolysis.svg", condition: "Fibrinolysis",
      description: "Following initial control of major trauma bleeding, re-accumulation of blood occurs at line sites and drains. Laboratory studies are pending. A viscoelastic test is requested.",
      teg: { R: 8, K: 2, alpha: 60, MA: 62, LY30: 14 },
      rotem: { CT: 70, CFT: 140, alpha: 65, MCF: 62, LI30: 60 },
      therapies: ["txa"]
    },
    {
      id: "lysis-2", svg: "graphs/fibrinolysis.svg", condition: "Fibrinolysis",
      description: "In elective orthopedic surgery, steady drain output persists despite good hemostasis and stable vitals. The surgeon suspects fragile clot formation. A viscoelastic profile is performed.",
      teg: { R: 8, K: 2, alpha: 60, MA: 58, LY30: 10 },
      rotem: { CT: 70, CFT: 150, alpha: 63, MCF: 58, LI30: 70 },
      therapies: ["txa"]
    },
    {
      id: "hyper-1", svg: "graphs/hypercoaguable.svg", condition: "Hypercoagulable state",
      description: "During minimally invasive colectomy, suction canister tubing begins to occlude with rapidly forming clot even though bleeding is minimal. Clinicians request a viscoelastic test.",
      teg: { R: 4, K: 0.8, alpha: 78, MA: 74, LY30: 1 },
      rotem: { CT: 45, CFT: 60, alpha: 80, MCF: 72, LI30: 98 },
      therapies: ["none"]
    },
    {
      id: "hyper-2", svg: "graphs/hypercoaguable.svg", condition: "Hypercoagulable state",
      description: "After blunt trauma, hemostasis is brisk and all line sites clot immediately. The field is dry and transfusion needs are minimal. A viscoelastic trace is obtained to study overall coagulation.",
      teg: { R: 5, K: 1, alpha: 75, MA: 70, LY30: 1 },
      rotem: { CT: 50, CFT: 80, alpha: 78, MCF: 68, LI30: 99 },
      therapies: ["none"]
    },
    {
      id: "dicL-1", svg: "graphs/DIC_late.svg", condition: "DIC (late)",
      description: "In a patient with septic shock, ongoing mucosal and line-site bleeding develops despite supportive care. Vital signs stabilize with resuscitation, but the team notes ongoing bleeding. A viscoelastic test is performed.",
      teg: { R: 18, K: 5, alpha: 35, MA: 34, LY30: 8 },
      rotem: { CT: 180, CFT: 380, alpha: 38, MCF: 32, LI30: 85 },
      therapies: ["factor", "platelets"]
    },
    {
      id: "plasma-new", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "During major transfusion for abdominal trauma, persistent oozing occurs despite adequate temperature and calcium correction. The clinical team performs viscoelastic testing.",
      teg: { R: 17, K: 2.3, alpha: 58, MA: 63, LY30: 1 },
      rotem: { CT: 150, CFT: 155, alpha: 60, MCF: 61, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "plate-3", svg: "graphs/Platelet_blockers.svg", condition: "Abnormal platelet function / antiplatelet agent",
      description: "After prolonged bypass support, diffuse oozing is noted from line sites and incisions. Laboratory tests are inconclusive. The perfusionist requests viscoelastic analysis.",
      teg: { R: 7, K: 1.6, alpha: 60, MA: 35, LY30: 2 },
      rotem: { CT: 68, CFT: 145, alpha: 61, MCF: 33, LI30: 97 },
      therapies: ["platelets"]
    },
    {
      id: "new-1-warfarin", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "A patient receiving warfarin therapy presents for emergency surgery. They received Vitamin K preoperatively. The patient continues bleeding despite surgical interventions.",
      teg: { R: 19, K: 2.6, alpha: 56, MA: 60, LY30: 1 },
      rotem: { CT: 170, CFT: 160, alpha: 60, MCF: 60, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "new-2-pelvic-trauma", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "Following major pelvic trauma, diffuse bleeding continues. The team orders a viscoelastic profile.",
      teg: { R: 16, K: 2.8, alpha: 55, MA: 58, LY30: 1 },
      rotem: { CT: 145, CFT: 180, alpha: 58, MCF: 58, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "new-3-ortho-aspirin", svg: "graphs/Platelet_blockers.svg", condition: "Abnormal platelet function / antiplatelet agent",
      description: "After orthopedic surgery, generalized oozing is noted from suture lines. The patient has a history of coronary artery disease. Temperature and acid-base status are normal. A viscoelastic test is performed.",
      teg: { R: 8, K: 1.9, alpha: 58, MA: 38, LY30: 1 },
      rotem: { CT: 72, CFT: 150, alpha: 62, MCF: 36, LI30: 98 },
      therapies: ["platelets"]
    },
    {
      id: "new-4-esld", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "A patient with end-stage liver disease develops slow mucosal bleeding post-procedure. Despite correction of temperature and electrolytes, the surgical field remains wet. A viscoelastic test is obtained.",
      teg: { R: 18, K: 2.4, alpha: 55, MA: 59, LY30: 1 },
      rotem: { CT: 165, CFT: 170, alpha: 58, MCF: 59, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "new-5-cabg-postprotamine", svg: "graphs/Platelet_blockers.svg", condition: "Abnormal platelet function / antiplatelet agent",
      description: "After coronary artery bypass grafting, bleeding is noted from the chest drains. Protamine was recently administered at the appropriate dose. The surgical team orders viscoelastic analysis.",
      teg: { R: 7, K: 1.8, alpha: 58, MA: 39, LY30: 1 },
      rotem: { CT: 70, CFT: 150, alpha: 61, MCF: 37, LI30: 98 },
      therapies: ["platelets"]
    },
    {
      id: "new-6-mtp-dilution", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "After massive transfusion for trauma, the patient remains hemodynamically stable but persistent oozing occurs at line sites. A viscoelastic test is performed to guide next products.",
      teg: { R: 17, K: 2.9, alpha: 54, MA: 60, LY30: 1 },
      rotem: { CT: 155, CFT: 190, alpha: 57, MCF: 60, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "new-7-lysis-drains", svg: "graphs/fibrinolysis.svg", condition: "Fibrinolysis",
      description: "A stable post-operative patient suddenly develops new bleeding at drain sites. The surgical field was previously dry. Laboratory values are pending. A viscoelastic test is obtained.",
      teg: { R: 8, K: 2, alpha: 60, MA: 60, LY30: 16 },
      rotem: { CT: 70, CFT: 145, alpha: 64, MCF: 60, LI30: 65 },
      therapies: ["txa"]
    },
    {
      id: "new-8-dvt-suspect", svg: "graphs/hypercoaguable.svg", condition: "Hypercoagulable state",
      description: "A patient presents with new-onset left leg pain 72 hours after a routine elective surgery.",
      teg: { R: 4.5, K: 0.9, alpha: 77, MA: 72, LY30: 1 },
      rotem: { CT: 48, CFT: 70, alpha: 79, MCF: 70, LI30: 99 },
      therapies: ["none"]
    },
    {
      id: "new-9-dic-late", svg: "graphs/DIC_late.svg", condition: "DIC (late)",
      description: "A trauma patient develops new mucosal bleeding despite aggressive resuscitation.",
      teg: { R: 20, K: 4.8, alpha: 36, MA: 33, LY30: 10 },
      rotem: { CT: 190, CFT: 360, alpha: 40, MCF: 30, LI30: 82 },
      therapies: ["factor", "platelets"]
    },
    {
      id: "new-10-pph-controlled", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "After control of obstetric hemorrhage, small diffuse bleeding continues at suture sites. Temperature and calcium are normal. A viscoelastic test is performed.",
      teg: { R: 15, K: 3.1, alpha: 50, MA: 56, LY30: 1 },
      rotem: { CT: 140, CFT: 230, alpha: 55, MCF: 54, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "new-11-trauma-lysis", svg: "graphs/fibrinolysis.svg", condition: "Fibrinolysis",
      description: "A trauma patient begins having increased chest tube output a few hours after stabilization.",
      teg: { R: 8, K: 2.1, alpha: 60, MA: 59, LY30: 18 },
      rotem: { CT: 68, CFT: 150, alpha: 63, MCF: 58, LI30: 62 },
      therapies: ["txa"]
    },
    {
      id: "new-12-splenectomy-hyper", svg: "graphs/hypercoaguable.svg", condition: "Hypercoagulable state",
      description: "A patient undergoing splenectomy develops brisk clotting in the surgical field with minimal transfusion requirements.",
      teg: { R: 4.2, K: 0.8, alpha: 79, MA: 73, LY30: 1 },
      rotem: { CT: 46, CFT: 65, alpha: 80, MCF: 71, LI30: 99 },
      therapies: ["none"]
    },
    {
      id: "new-13-dilution-crystalloids", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "During major abdominal surgery, the patient receives large volumes of crystalloids and exhibits slow oozing without major bleeding.",
      teg: { R: 16, K: 3.2, alpha: 49, MA: 57, LY30: 1 },
      rotem: { CT: 150, CFT: 240, alpha: 55, MCF: 55, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "new-14-ecmo-platelet", svg: "graphs/Platelet_blockers.svg", condition: "Abnormal platelet function / antiplatelet agent",
      description: "After prolonged mechanical support with an ECMO circuit, diffuse surface bleeding is observed. Hemodynamics and temperature are stable. A viscoelastic study is performed.",
      teg: { R: 7.5, K: 1.7, alpha: 59, MA: 34, LY30: 2 },
      rotem: { CT: 70, CFT: 140, alpha: 61, MCF: 32, LI30: 97 },
      therapies: ["platelets"]
    },
    {
      id: "new-15-post-arrest-rewarm", svg: "graphs/anticoagulant_factor_deficiency.svg", condition: "Anticoagulants / Factor deficiency",
      description: "A post-cardiac arrest care patient develops mild generalized oozing after rewarming.",
      teg: { R: 17, K: 2.5, alpha: 57, MA: 61, LY30: 1 },
      rotem: { CT: 155, CFT: 170, alpha: 59, MCF: 60, LI30: 98 },
      therapies: ["factor"]
    },
    {
      id: "new-16-normal-chole", svg: "graphs/Normal.svg", condition: "Normal",
      description: "A healthy adult undergoes elective laparoscopic cholecystectomy. Hemostasis appears secure, temperature and electrolytes are normal, and there is no significant drain output.",
      teg: { R: 7, K: 1.6, alpha: 66, MA: 63, LY30: 1 },
      rotem: { CT: 72, CFT: 130, alpha: 71, MCF: 63, LI30: 98 },
      therapies: ["none"]
    },
    {
      id: "new-17-normal-knee", svg: "graphs/Normal.svg", condition: "Normal",
      description: "Following uncomplicated knee arthroscopy, the operative field remains dry and line sites clot promptly. Vitals are stable and no active bleeding is observed.",
      teg: { R: 8, K: 1.7, alpha: 64, MA: 61, LY30: 2 },
      rotem: { CT: 76, CFT: 140, alpha: 68, MCF: 61, LI30: 97 },
      therapies: ["none"]
    }
  ];

  // --- State & Utilities ---

  let order = [];
  let ptr = 0;
  let score = { right: 0, total: 0 };

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildOrderWithNormalFirst() {
    const normalIdx = [];
    CASES.forEach((c, i) => {
      if (c.condition === "Normal") normalIdx.push(i);
    });

    const first = normalIdx[Math.floor(Math.random() * normalIdx.length)];
    let rest = [];
    for (let j = 0; j < CASES.length; j++) {
      if (j !== first) rest.push(j);
    }
    rest = shuffle(rest);
    return [first, ...rest];
  }

  function updateScoreDisplay() {
    const scoreEl = document.getElementById("score");
    if (scoreEl) {
      scoreEl.textContent = `Score: ${score.right}/${score.total}`;
    }
  }

  // --- Rendering ---

  function render() {
    const main = document.getElementById("main");
    if (!main) return;

    // Check if finished
    if (ptr >= order.length) {
      renderDone(main);
      return;
    }

    const currentCase = CASES[order[ptr]];

    // Generate Buttons HTML
    const condButtons = CONDITIONS.map(cond =>
      `<button class="btn" data-cond="${cond}">${cond}</button>`
    ).join('');

    const txButtons = Object.keys(THERAPIES).map(key =>
      `<button class="btn" data-tx="${key}">${THERAPIES[key]}</button>`
    ).join('');

    main.innerHTML = `
      <div class="grid">
        <!-- Left Column: Case Info & Trace -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <div class="text-muted text-uppercase text-small">Case Scenario</div>
            <span class="pill">Case ${ptr + 1} of ${CASES.length}</span>
          </div>
          
          <div style="margin-bottom:24px;">
            <div class="section-title">Interpret this viscoelastic profile</div>
            <div class="text-muted mt-2" style="font-size:1.05rem; line-height:1.6;">${currentCase.description}</div>
          </div>

          <div>
            <div class="trace-container">
              <img id="trace" class="trace" alt="Viscoelastic trace" src="">
            </div>
            <div id="imgErr" class="result-box error" style="display:none"></div>
          </div>

          <div style="margin-top:24px;">
            <button id="toggleParams" class="btn">Show Parameters</button>
            <div id="params" class="params-container mt-4" style="display:none">
              <div class="text-muted text-small font-bold mb-2">TEG (min/deg/mm, %)</div>
              <table>
                <thead><tr><th>R</th><th>K</th><th>α</th><th>MA</th><th>LY30</th></tr></thead>
                <tbody>
                  <tr>
                    <td>${currentCase.teg.R}</td>
                    <td>${currentCase.teg.K}</td>
                    <td>${currentCase.teg.alpha}</td>
                    <td>${currentCase.teg.MA}</td>
                    <td>${currentCase.teg.LY30}</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="text-muted text-small font-bold mb-2 mt-4">ROTEM (s/deg/mm, %)</div>
              <table>
                <thead><tr><th>CT</th><th>CFT</th><th>α</th><th>MCF</th><th>LI30</th></tr></thead>
                <tbody>
                  <tr>
                    <td>${currentCase.rotem.CT}</td>
                    <td>${currentCase.rotem.CFT}</td>
                    <td>${currentCase.rotem.alpha}</td>
                    <td>${currentCase.rotem.MCF}</td>
                    <td>${currentCase.rotem.LI30}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column: Questions & Controls -->
        <div class="card">
          <div>
            <div class="text-muted text-uppercase text-small mb-2">1) Which condition?</div>
            <div class="choices-grid" id="condChoices">${condButtons}</div>
          </div>

          <div class="mt-4">
            <div class="text-muted text-uppercase text-small mb-2">2) Select treatment(s)</div>
            <div class="choices-grid" id="txChoices">${txButtons}</div>
          </div>

          <div id="result" class="result-box" style="display:none"></div>

          <div class="nav-row">
            <button id="backBtn" class="btn">Back</button>
            <button id="checkBtn" class="btn">Check</button>
            <button id="nextBtn" class="btn primary">Next</button>
          </div>
          
          <div class="pt-4" style="margin-top:32px; border-top:1px solid var(--border)">
             <div style="display:flex; justify-content:space-between; align-items:center;">
                <div class="font-bold text-small">Reference & Notes</div>
                <button id="toggleNotes" class="btn" style="padding:4px 12px; font-size:0.85rem;">Show</button>
             </div>
             <div id="notesBox" class="reference-section mt-2" style="display:none">
                ${renderReferenceTable()}
             </div>
          </div>
        </div>
      </div>
    `;

    attachEventHandlers(currentCase);
    loadImage(currentCase);
  }

  function renderDone(container) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding: 48px 24px;">
        <h2 style="color:var(--primary-dark); margin-bottom:16px;">All Scenarios Completed 🎉</h2>
        <p style="font-size:1.2rem; margin-bottom:24px;">
          Final Score: <b>${score.right}</b> / <b>${score.total}</b>
        </p>
        <button class="btn primary" id="restartBtn">Restart (Reshuffle)</button>
      </div>
    `;
    document.getElementById("restartBtn").onclick = () => {
      initGame();
    };
  }

  function renderReferenceTable() {
    return `
      <div style="margin-top:8px">
        <div class="text-small font-bold mb-2">Normal Values (Simplified)</div>
        <table>
          <tr><th colspan="5" style="background:#f5f5f5">TEG</th></tr>
          <tr><th>R</th><th>K</th><th>α</th><th>MA</th><th>LY30</th></tr>
          <tr>
            <td>${NORMALS.TEG.R.join('–')}</td>
            <td>${NORMALS.TEG.K.join('–')}</td>
            <td>${NORMALS.TEG.alpha.join('–')}</td>
            <td>${NORMALS.TEG.MA.join('–')}</td>
            <td>${NORMALS.TEG.LY30.join('–')}</td>
          </tr>
        </table>
        <table style="margin-top:8px">
          <tr><th colspan="5" style="background:#f5f5f5">ROTEM</th></tr>
          <tr><th>CT</th><th>CFT</th><th>α</th><th>MCF</th><th>LI30</th></tr>
          <tr>
            <td>${NORMALS.ROTEM.CT.join('–')}</td>
            <td>${NORMALS.ROTEM.CFT.join('–')}</td>
            <td>${NORMALS.ROTEM.alpha.join('–')}</td>
            <td>${NORMALS.ROTEM.MCF.join('–')}</td>
            <td>${NORMALS.ROTEM.LI30.join('–')}</td>
          </tr>
        </table>
        <ul>
          <li><b>R/CT ↑</b> or <b>K/CFT ↑</b> or <b>α ↓</b> → Factor Replacement</li>
          <li><b>MA/MCF ↓</b> → Platelets</li>
          <li><b>LY30 ↑ / LI30 ↓</b> → Antifibrinolytic (TXA)</li>
        </ul>
        <div class="text-muted text-small" style="margin-top:8px; font-style:italic;">
          Educational tool only; not for clinical decision-making.
        </div>
      </div>
    `;
  }

  function loadImage(c) {
    const img = document.getElementById("trace");
    if (!img) return;

    // Cache bust to force animation replay
    const cacheBust = `case=${encodeURIComponent(c.id)}&t=${Date.now()}`;
    img.classList.remove('show');
    img.removeAttribute('src');
    img.src = `${c.svg}${c.svg.includes("?") ? "&" : "?"}${cacheBust}`;

    img.onload = () => {
      img.classList.remove('show');
      void img.offsetWidth; // Trigger reflow
      img.classList.add('show');
    };

    img.onerror = () => {
      const errBox = document.getElementById("imgErr");
      if (errBox) {
        errBox.style.display = "block";
        errBox.textContent = `Could not load ${img.src}. Check filename and graphs/ folder.`;
      }
    };
  }

  function attachEventHandlers(currentCase) {
    // Toggle Parameters
    const paramBtn = document.getElementById("toggleParams");
    const paramBox = document.getElementById("params");
    paramBtn.onclick = () => {
      const isHidden = paramBox.style.display === "none";
      paramBox.style.display = isHidden ? "block" : "none";
      paramBtn.textContent = isHidden ? "Hide Parameters" : "Show Parameters";
    };

    // Toggle Notes
    const notesBtn = document.getElementById("toggleNotes");
    const notesBox = document.getElementById("notesBox");
    notesBtn.onclick = () => {
      const isHidden = notesBox.style.display === "none";
      notesBox.style.display = isHidden ? "block" : "none";
      notesBtn.textContent = isHidden ? "Hide" : "Show";
    };

    // Navigation
    const backBtn = document.getElementById("backBtn");
    backBtn.disabled = (ptr === 0);
    backBtn.onclick = () => {
      if (ptr > 0) {
        ptr--;
        render();
      }
    };

    document.getElementById("nextBtn").onclick = () => {
      ptr++;
      render();
    };

    document.getElementById("checkBtn").onclick = () => checkAnswer(currentCase);

    // Selection Logic
    const condChoices = document.getElementById("condChoices");
    Array.from(condChoices.children).forEach(btn => {
      btn.onclick = () => {
        Array.from(condChoices.children).forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      };
    });

    const txChoices = document.getElementById("txChoices");
    Array.from(txChoices.children).forEach(btn => {
      btn.onclick = () => {
        btn.classList.toggle("selected");
      };
    });
  }

  function checkAnswer(c) {
    const chosenCondBtn = document.querySelector('#condChoices .btn.selected');
    const chosenCond = chosenCondBtn ? chosenCondBtn.getAttribute('data-cond') : null;

    const chosenTxBtns = document.querySelectorAll('#txChoices .btn.selected');
    const chosenTx = Array.from(chosenTxBtns).map(b => b.getAttribute('data-tx')).sort();

    const requiredTx = c.therapies.slice().sort();

    const condOK = (chosenCond === c.condition);
    const txOK = JSON.stringify(chosenTx) === JSON.stringify(requiredTx);

    // Update Score
    score.total += 1;
    if (condOK && txOK) score.right += 1;
    updateScoreDisplay();

    // Show Result
    const resultBox = document.getElementById("result");
    resultBox.style.display = "block";
    resultBox.className = "result-box " + (condOK && txOK ? "" : "error");

    const expectedTxNames = c.therapies.map(k => THERAPIES[k]).join(", ");

    resultBox.innerHTML = `
      <div class="mb-2">
        <b>Condition:</b> ${condOK ? "✅ Correct" : `❌ Expected “${c.condition}”`}
      </div>
      <div>
        <b>Treatment:</b> ${txOK ? "✅ Correct" : `❌ Expected: ${expectedTxNames}`}
      </div>
    `;
  }

  function initGame() {
    order = buildOrderWithNormalFirst();
    ptr = 0;
    score = { right: 0, total: 0 };
    updateScoreDisplay();
    render();
  }

  // Start
  document.addEventListener("DOMContentLoaded", initGame);

})();
