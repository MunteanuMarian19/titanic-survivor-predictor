document.addEventListener('DOMContentLoaded', () => {

    // 0. MOBILE MENU TOGGLE LOGIC
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.classList.toggle('active');
        });

        navLinks.addEventListener('click', (e) => {
            if(e.target.tagName === 'A') {
                navLinks.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 1. CORRELATION HEATMAP
    // ==========================================
    const cols = ['Survived','Sex_num','Pclass','FareClassNum','Fare','FamilySize','IsAlone','Age','SibSp','Parch'];
    const corrData = {
      "Survived":    {"Survived":1.0,"Sex_num":0.54,"Pclass":-0.34,"FareClassNum":0.33,"Fare":0.26,"FamilySize":0.02,"IsAlone":-0.20,"Age":-0.07,"SibSp":-0.04,"Parch":0.08},
      "Sex_num":     {"Survived":0.54,"Sex_num":1.0,"Pclass":-0.13,"FareClassNum":0.24,"Fare":0.18,"FamilySize":0.2,"IsAlone":-0.3,"Age":-0.1,"SibSp":0.11,"Parch":0.25},
      "Pclass":      {"Survived":-0.34,"Sex_num":-0.13,"Pclass":1.0,"FareClassNum":-0.68,"Fare":-0.55,"FamilySize":0.07,"IsAlone":0.14,"Age":-0.34,"SibSp":0.08,"Parch":0.02},
      "FareClassNum":{"Survived":0.33,"Sex_num":0.24,"Pclass":-0.68,"FareClassNum":1.0,"Fare":0.68,"FamilySize":0.39,"IsAlone":-0.53,"Age":0.12,"SibSp":0.35,"Parch":0.31},
      "Fare":        {"Survived":0.26,"Sex_num":0.18,"Pclass":-0.55,"FareClassNum":0.68,"Fare":1.0,"FamilySize":0.22,"IsAlone":-0.27,"Age":0.09,"SibSp":0.16,"Parch":0.22},
      "FamilySize":  {"Survived":0.02,"Sex_num":0.2,"Pclass":0.07,"FareClassNum":0.39,"Fare":0.22,"FamilySize":1.0,"IsAlone":-0.69,"Age":-0.25,"SibSp":0.89,"Parch":0.78},
      "IsAlone":     {"Survived":-0.20,"Sex_num":-0.3,"Pclass":0.14,"FareClassNum":-0.53,"Fare":-0.27,"FamilySize":-0.69,"IsAlone":1.0,"Age":0.18,"SibSp":-0.58,"Parch":-0.58},
      "Age":         {"Survived":-0.07,"Sex_num":-0.1,"Pclass":-0.34,"FareClassNum":0.12,"Fare":0.09,"FamilySize":-0.25,"IsAlone":0.18,"Age":1.0,"SibSp":-0.24,"Parch":-0.18},
      "SibSp":       {"Survived":-0.04,"Sex_num":0.11,"Pclass":0.08,"FareClassNum":0.35,"Fare":0.16,"FamilySize":0.89,"IsAlone":-0.58,"Age":-0.24,"SibSp":1.0,"Parch":0.41},
      "Parch":       {"Survived":0.08,"Sex_num":0.25,"Pclass":0.02,"FareClassNum":0.31,"Fare":0.22,"FamilySize":0.78,"IsAlone":-0.58,"Age":-0.18,"SibSp":0.41,"Parch":1.0}
    };

    const notes = {
      "Survived-Sex_num":"Strongest predictor. Being female (Sex_num=1) dramatically increased survival (74% vs 19%).",
      "Sex_num-Survived":"Strongest predictor. Being female (Sex_num=1) dramatically increased survival (74% vs 19%).",
      "Survived-Pclass":"Higher Pclass = worse cabin = lower survival. 1st class: 63% survived, 3rd class: only 24%.",
      "Pclass-Survived":"Higher Pclass = worse cabin = lower survival. 1st class: 63% survived, 3rd class: only 24%.",
      "Survived-FareClassNum":"Expensive tickets = 1st class cabins = closer to lifeboats. Survivors paid £48 avg vs £22.",
      "FareClassNum-Survived":"Expensive tickets = 1st class cabins = closer to lifeboats. Survivors paid £48 avg vs £22.",
      "Survived-IsAlone":"Traveling alone slightly reduced survival. No family group to coordinate with.",
      "IsAlone-Survived":"Traveling alone slightly reduced survival. No family group to coordinate with.",
      "Survived-Fare":"Higher fare = better class = closer to lifeboats. Positive but weaker than FareClassNum.",
      "Fare-Survived":"Higher fare = better class = closer to lifeboats. Positive but weaker than FareClassNum.",
      "Survived-Age":"Very weak negative: older passengers were marginally less likely to survive.",
      "Age-Survived":"Very weak negative: older passengers were marginally less likely to survive.",
      "Survived-FamilySize":"Near zero: family size alone barely predicts survival once gender and class are accounted for.",
      "FamilySize-Survived":"Near zero: family size alone barely predicts survival once gender and class are accounted for.",
      "Survived-SibSp":"Very weak negative: having many siblings/spouses aboard slightly reduced survival odds.",
      "SibSp-Survived":"Very weak negative: having many siblings/spouses aboard slightly reduced survival odds.",
      "Survived-Parch":"Very weak positive (+0.08): having parents/children had almost no effect on survival.",
      "Parch-Survived":"Very weak positive (+0.08): having parents/children had almost no effect on survival.",
      "Pclass-FareClassNum":"Strong inverse: higher Pclass number (worse cabin) = cheaper ticket. Two columns measuring the same concept from opposite directions.",
      "FareClassNum-Pclass":"Strong inverse: higher Pclass number (worse cabin) = cheaper ticket. Two columns measuring the same concept from opposite directions.",
      "Pclass-Fare":"Strong inverse: worse class = lower fare paid. Expected and logical.",
      "Fare-Pclass":"Strong inverse: worse class = lower fare paid. Expected and logical.",
      "FamilySize-SibSp":"Very strong (+0.89): FamilySize = SibSp + Parch + 1. SibSp is mathematically inside FamilySize. Not a discovery.",
      "SibSp-FamilySize":"Very strong (+0.89): FamilySize = SibSp + Parch + 1. SibSp is mathematically inside FamilySize. Not a discovery.",
      "FamilySize-Parch":"Strong (+0.78): Parch is part of the FamilySize formula. Mathematical dependence, not a real-world finding.",
      "Parch-FamilySize":"Strong (+0.78): Parch is part of the FamilySize formula. Mathematical dependence, not a real-world finding.",
      "FamilySize-IsAlone":"Strong negative: IsAlone = 1 only when FamilySize = 1. These two measure the exact same thing from opposite directions.",
      "IsAlone-FamilySize":"Strong negative: IsAlone = 1 only when FamilySize = 1. These two measure the exact same thing from opposite directions.",
      "IsAlone-SibSp":"If SibSp > 0, you are not alone. Strong negative — logical and expected.",
      "SibSp-IsAlone":"If SibSp > 0, you are not alone. Strong negative — logical and expected.",
      "IsAlone-Parch":"If Parch > 0, you are not alone. Strong negative — logical and expected.",
      "Parch-IsAlone":"If Parch > 0, you are not alone. Strong negative — logical and expected.",
      "Pclass-Age":"Moderate negative: older passengers tended to travel in higher (worse) classes.",
      "Age-Pclass":"Moderate negative: older passengers tended to travel in higher (worse) classes.",
      "Age-FamilySize":"Moderate negative: older passengers tended to travel with fewer family members.",
      "FamilySize-Age":"Moderate negative: older passengers tended to travel with fewer family members.",
      "FareClassNum-FamilySize":"Moderate positive: larger families tended to pay more (group bookings in better class).",
      "FamilySize-FareClassNum":"Moderate positive: larger families tended to pay more (group bookings in better class).",
      "IsAlone-FareClassNum":"Moderate negative: solo travelers paid less on average — budget tickets.",
      "FareClassNum-IsAlone":"Moderate negative: solo travelers paid less on average — budget tickets."
    };

    function corrColor(v) {
      const stops = [[-1,[59,76,192]],[-0.5,[140,172,221]],[0,[245,245,245]],[0.5,[214,96,77]],[1,[180,4,38]]];
      for (let i = 0; i < stops.length - 1; i++) {
        const [v0, c0] = stops[i], [v1, c1] = stops[i+1];
        if (v >= v0 && v <= v1) {
          const t = (v - v0) / (v1 - v0);
          return `rgb(${Math.round(c0[0]+t*(c1[0]-c0[0]))},${Math.round(c0[1]+t*(c1[1]-c0[1]))},${Math.round(c0[2]+t*(c1[2]-c0[2]))})`;
        }
      }
      return '#f5f5f5';
    }

    function renderHeatmap() {
        const container = document.getElementById('heatmap-container');
        if (!container) return;
        const tbl = document.createElement('table');
        tbl.style.borderCollapse = 'collapse';
        tbl.style.margin = '0 auto';

        const hdr = document.createElement('tr');
        hdr.appendChild(document.createElement('td'));
        cols.forEach(col => {
            const td = document.createElement('td');
            td.style.cssText = 'height:60px; vertical-align:bottom; text-align:center; padding-bottom:5px; font-size:11px; color:var(--text-muted);';
            td.textContent = col;
            hdr.appendChild(td);
        });
        tbl.appendChild(hdr);

        cols.forEach(row => {
            const tr = document.createElement('tr');
            const lbl = document.createElement('td');
            lbl.style.cssText = 'padding-right:10px; font-size:12px; color:var(--text-muted); text-align:right; font-weight:500; white-space:nowrap;';
            lbl.textContent = row;
            tr.appendChild(lbl);

            cols.forEach(col => {
                const v = corrData[row][col];
                const bg = corrColor(v);
                const fg = Math.abs(v) > 0.45 ? '#fff' : '#1f2937';
                const td = document.createElement('td');
                td.style.cssText = `width:45px; height:45px; background:${bg}; text-align:center; font-size:12px; font-weight:600; color:${fg}; cursor:pointer; border:1px solid #fff;`;
                td.textContent = v.toFixed(2);

                td.addEventListener('mouseenter', () => {
                    td.style.boxShadow = 'inset 0 0 0 2px rgba(0,0,0,0.5)';
                    const key = row + '-' + col;
                    const note = notes[key];
                    const panel = document.getElementById('info-panel');
                    if (!panel) return;
                    if (row === col) {
                        panel.innerHTML = `<strong>${row} ↔ ${row} (1.00):</strong> A column always correlates perfectly with itself. This diagonal is a mathematical rule — it tells you nothing about the data.`;
                    } else {
                        const dir = v > 0.05 ? 'positive' : v < -0.05 ? 'negative' : 'near-zero';
                        const strength = Math.abs(v) >= 0.7 ? 'very strong' : Math.abs(v) >= 0.5 ? 'strong' : Math.abs(v) >= 0.3 ? 'moderate' : Math.abs(v) >= 0.1 ? 'weak' : 'almost zero';
                        panel.innerHTML = `<strong>${row} ↔ ${col} (${v.toFixed(2)}):</strong> ${strength} ${dir} correlation. ${note || 'No specific historical note for this pair.'}`;
                    }
                });
                td.addEventListener('mouseleave', () => {
                    td.style.boxShadow = 'none';
                    const panel = document.getElementById('info-panel');
                    if (panel) panel.textContent = 'Hover over any cell in the grid to see what the correlation means.';
                });
                tr.appendChild(td);
            });
            tbl.appendChild(tr);
        });
        container.appendChild(tbl);
    }
    renderHeatmap();


    // ==========================================
    // 2. INTERACTIVE PREDICTOR
    // All numbers below are computed directly from the Titanic CSV using
    // the same cleaning steps as the Python notebook (Cabin dropped, Age
    // filled with gender-specific median, Embarked filled with mode,
    // FamilySize = SibSp + Parch + 1, FamGroup: Alone=1, Small=2-4, Large=5+).
    //
    // Each entry is {r: survival rate %, n: number of matching passengers}.
    // A `null` means zero passengers in the dataset match that exact group.
    // ==========================================

    const MIN_SAMPLE = 3; // below this, a group's rate is considered unreliable

    const L1_data = {
        female: {r:74.2,n:314},
        male: {r:18.9,n:577},
    };

    const L2_data = {
        female: {
            1: {r:96.8,n:94},
            2: {r:92.1,n:76},
            3: {r:50.0,n:144},
        },
        male: {
            1: {r:36.9,n:122},
            2: {r:15.7,n:108},
            3: {r:13.5,n:347},
        },
    };

    const L3_data = {
        female: {
            1: {
                'Child (0-12)': {r:0.0,n:1},
                'Teen (13-18)': {r:100.0,n:10},
                'Adult (19-40)': {r:98.2,n:57},
                'Older adult (41-60)': {r:95.8,n:24},
                'Elder (61-80)': {r:100.0,n:2},
            },
            2: {
                'Child (0-12)': {r:100.0,n:8},
                'Teen (13-18)': {r:100.0,n:6},
                'Adult (19-40)': {r:91.8,n:49},
                'Older adult (41-60)': {r:84.6,n:13},
                'Elder (61-80)': null,
            },
            3: {
                'Child (0-12)': {r:47.8,n:23},
                'Teen (13-18)': {r:55.0,n:20},
                'Adult (19-40)': {r:53.3,n:92},
                'Older adult (41-60)': {r:0.0,n:8},
                'Elder (61-80)': {r:100.0,n:1},
            },
        },
        male: {
            1: {
                'Child (0-12)': {r:100.0,n:3},
                'Teen (13-18)': {r:50.0,n:2},
                'Adult (19-40)': {r:40.3,n:67},
                'Older adult (41-60)': {r:34.2,n:38},
                'Elder (61-80)': {r:8.3,n:12},
            },
            2: {
                'Child (0-12)': {r:100.0,n:9},
                'Teen (13-18)': {r:0.0,n:6},
                'Adult (19-40)': {r:8.3,n:72},
                'Older adult (41-60)': {r:5.6,n:18},
                'Elder (61-80)': {r:33.3,n:3},
            },
            3: {
                'Child (0-12)': {r:36.0,n:25},
                'Teen (13-18)': {r:7.7,n:26},
                'Adult (19-40)': {r:12.8,n:265},
                'Older adult (41-60)': {r:7.4,n:27},
                'Elder (61-80)': {r:0.0,n:4},
            },
        },
    };

    const L4_data = {
        female: {
            1: {
                'Child (0-12)': { Alone: null, Small: {r:0.0,n:1}, Large: null },
                'Teen (13-18)': { Alone: {r:100.0,n:1}, Small: {r:100.0,n:8}, Large: {r:100.0,n:1} },
                'Adult (19-40)': { Alone: {r:100.0,n:24}, Small: {r:96.7,n:30}, Large: {r:100.0,n:3} },
                'Older adult (41-60)': { Alone: {r:87.5,n:8}, Small: {r:100.0,n:16}, Large: null },
                'Elder (61-80)': { Alone: {r:100.0,n:1}, Small: {r:100.0,n:1}, Large: null },
            },
            2: {
                'Child (0-12)': { Alone: null, Small: {r:100.0,n:8}, Large: null },
                'Teen (13-18)': { Alone: {r:100.0,n:2}, Small: {r:100.0,n:4}, Large: null },
                'Adult (19-40)': { Alone: {r:91.7,n:24}, Small: {r:91.7,n:24}, Large: {r:100.0,n:1} },
                'Older adult (41-60)': { Alone: {r:83.3,n:6}, Small: {r:83.3,n:6}, Large: {r:100.0,n:1} },
                'Elder (61-80)': { Alone: null, Small: null, Large: null },
            },
            3: {
                'Child (0-12)': { Alone: {r:100.0,n:1}, Small: {r:75.0,n:12}, Large: {r:10.0,n:10} },
                'Teen (13-18)': { Alone: {r:63.6,n:11}, Small: {r:42.9,n:7}, Large: {r:50.0,n:2} },
                'Adult (19-40)': { Alone: {r:60.9,n:46}, Small: {r:57.1,n:35}, Large: {r:9.1,n:11} },
                'Older adult (41-60)': { Alone: {r:0.0,n:1}, Small: {r:0.0,n:3}, Large: {r:0.0,n:4} },
                'Elder (61-80)': { Alone: {r:100.0,n:1}, Small: null, Large: null },
            },
        },
        male: {
            1: {
                'Child (0-12)': { Alone: null, Small: {r:100.0,n:3}, Large: null },
                'Teen (13-18)': { Alone: null, Small: {r:50.0,n:2}, Large: null },
                'Adult (19-40)': { Alone: {r:39.1,n:46}, Small: {r:45.0,n:20}, Large: {r:0.0,n:1} },
                'Older adult (41-60)': { Alone: {r:30.0,n:20}, Small: {r:38.9,n:18}, Large: null },
                'Elder (61-80)': { Alone: {r:11.1,n:9}, Small: {r:0.0,n:2}, Large: {r:0.0,n:1} },
            },
            2: {
                'Child (0-12)': { Alone: null, Small: {r:100.0,n:9}, Large: null },
                'Teen (13-18)': { Alone: {r:0.0,n:6}, Small: null, Large: null },
                'Adult (19-40)': { Alone: {r:10.0,n:50}, Small: {r:4.5,n:22}, Large: null },
                'Older adult (41-60)': { Alone: {r:7.7,n:13}, Small: {r:0.0,n:5}, Large: null },
                'Elder (61-80)': { Alone: {r:33.3,n:3}, Small: null, Large: null },
            },
            3: {
                'Child (0-12)': { Alone: {r:0.0,n:1}, Small: {r:100.0,n:8}, Large: {r:6.2,n:16} },
                'Teen (13-18)': { Alone: {r:14.3,n:14}, Small: {r:0.0,n:8}, Large: {r:0.0,n:4} },
                'Adult (19-40)': { Alone: {r:12.6,n:222}, Small: {r:16.7,n:36}, Large: {r:0.0,n:7} },
                'Older adult (41-60)': { Alone: {r:8.7,n:23}, Small: {r:0.0,n:4}, Large: null },
                'Elder (61-80)': { Alone: {r:0.0,n:4}, Small: null, Large: null },
            },
        },
    };

    const familyKey = {
        'Alone':              'Alone',
        'Small family (2-4)': 'Small',
        'Large family (5+)':  'Large'
    };

    const genderNotes = {
        'Female': 'Called to lifeboats first under the "women and children first" evacuation protocol.',
        'Male':   'Generally expected to step aside for women and children, sharply reducing lifeboat access.'
    };
    const classNotes = {
        1: 'Best cabins — upper deck, steps from lifeboats, crew priority.',
        2: 'Mid-ship — reasonable access to exits.',
        3: 'Lowest decks — farthest from lifeboats, most delayed evacuation.'
    };
    const ageNotes = {
        'Child (0-12)':        'Children received explicit evacuation priority ("women and children first").',
        'Teen (13-18)':        'Teenagers were generally treated as adults during the evacuation.',
        'Adult (19-40)':       'The largest demographic on board.',
        'Older adult (41-60)': 'Reduced physical mobility in chaotic, crowded conditions.',
        'Elder (61-80)':       'Smallest group — hardest conditions to endure physically.'
    };
    const familyNotes = {
        'Alone':              'No family group to coordinate with or be prioritized alongside.',
        'Small family (2-4)': 'Optimal group size — coordination without chaos.',
        'Large family (5+)':  'Very difficult to move and keep together; some had to be left behind.'
    };

    const steps = [
        { q: "Passenger's Gender",  note: 'Women were heavily prioritized in the evacuation.',       key: 'sex', choices: ['Female', 'Male'] },
        { q: "Ticket Class",        note: 'Determined cabin placement and deck access.',              key: 'cls', choices: ['1st Class', '2nd Class', '3rd Class'] },
        { q: "Age Group",           note: 'Age affected both priority and physical ability to escape.', key: 'age', choices: ['Child (0-12)', 'Teen (13-18)', 'Adult (19-40)', 'Older adult (41-60)', 'Elder (61-80)'] },
        { q: "Travel Situation",    note: 'Family size on board affected coordination and priority.',  key: 'fam', choices: ['Alone', 'Small family (2-4)', 'Large family (5+)'] }
    ];

    let step = 0, sel = {}, crumbs = [];

    function probColor(p) {
        if (p >= 70) return '#10b981';
        if (p >= 50) return '#f59e0b';
        if (p >= 30) return '#f97316';
        return '#ef4444';
    }

    // ─────────────────────────────────────────────────────────────────────
    // CASCADING RESOLVER
    // Tries the most specific group the user has selected so far. If that
    // group has fewer than MIN_SAMPLE passengers in the real data (or zero),
    // it steps back to a broader group automatically, and reports exactly
    // what was dropped so the UI can explain it honestly.
    //
    // targetLevel: how many questions have been answered (0 to 4)
    //   0 = nothing selected yet      -> overall baseline
    //   1 = sex only                  -> L1
    //   2 = sex + class                -> L2
    //   3 = sex + class + age          -> L3
    //   4 = sex + class + age + family -> L4 (full profile)
    // ─────────────────────────────────────────────────────────────────────
    function resolve(targetLevel) {
        if (targetLevel === 0) {
            return { rate: 38.4, count: 891, usedLevel: 0, requestedLevel: 0, fallback: false, dropped: [] };
        }

        const s = sel.sex === 'Female' ? 'female' : 'male';
        const c = sel.cls ? (sel.cls === '1st Class' ? 1 : sel.cls === '2nd Class' ? 2 : 3) : null;
        const a = sel.age || null;
        const f = sel.fam ? familyKey[sel.fam] : null;

        const chain = [];
        if (targetLevel >= 4 && c && a && f) {
            chain.push({ level: 4, node: L4_data[s]?.[c]?.[a]?.[f], dropped: [] });
        }
        if (targetLevel >= 3 && c && a) {
            chain.push({ level: 3, node: L3_data[s]?.[c]?.[a], dropped: ['family size'] });
        }
        if (targetLevel >= 2 && c) {
            chain.push({ level: 2, node: L2_data[s]?.[c], dropped: ['age group', 'family size'] });
        }
        chain.push({ level: 1, node: L1_data[s], dropped: ['class', 'age group', 'family size'] });

        for (const cand of chain) {
            if (cand.node && cand.node.n >= MIN_SAMPLE) {
                return {
                    rate: cand.node.r,
                    count: cand.node.n,
                    usedLevel: cand.level,
                    requestedLevel: targetLevel,
                    fallback: cand.level < targetLevel,
                    dropped: cand.dropped
                };
            }
        }
        // Should never reach here since L1 always has 300+ passengers per group
        return { rate: 38.4, count: 891, usedLevel: 0, requestedLevel: targetLevel, fallback: true, dropped: ['everything'] };
    }

    function droppedToText(dropped) {
        if (dropped.length === 0) return '';
        if (dropped.length === 1) return dropped[0];
        return dropped.slice(0, -1).join(', ') + ' and ' + dropped[dropped.length - 1];
    }

    function levelDescription(level, s, c, a) {
        // Builds a short label like "Female, 2nd Class" describing what WAS used
        const parts = [];
        if (level >= 1) parts.push(sel.sex);
        if (level >= 2) parts.push(sel.cls);
        if (level >= 3) parts.push(sel.age);
        return parts.join(', ');
    }

    // Ensures the fallback note element exists, creating it once via JS
    // (no HTML/CSS file edits needed).
    function ensureFallbackNoteEl() {
        let el = document.getElementById('fallback-note');
        if (!el) {
            el = document.createElement('div');
            el.id = 'fallback-note';
            el.style.cssText = 'display:none; font-size:0.85rem; line-height:1.5; background:#fffbeb; border-left:4px solid #f59e0b; color:#92400e; padding:0.9rem 1rem; border-radius:8px; margin-bottom:1rem; text-align:left;';
            const ctxNote = document.getElementById('ctx-note');
            if (ctxNote && ctxNote.parentNode) {
                ctxNote.parentNode.insertBefore(el, ctxNote.nextSibling); // insert AFTER (below) Data context
            } else {
                document.getElementById('result-area').appendChild(el);
            }
        }
        return el;
    }

    function updateBar(p, label) {
        const bar = document.getElementById('prob-bar');
        const txt = document.getElementById('prob-text');
        bar.style.width = p + '%';
        bar.style.background = probColor(p);
        txt.textContent = p.toFixed(1) + '%' + (label ? ' (' + label + ')' : '');
    }

    function updateBreadcrumb() {
        document.getElementById('breadcrumbs').textContent = crumbs.length ? crumbs.join('  ›  ') : '';
    }

    function verdict(p) {
        if (p >= 90) return 'Almost certain survival';
        if (p >= 70) return 'Very likely to survive';
        if (p >= 55) return 'Favorable odds';
        if (p >= 45) return 'About even odds';
        if (p >= 25) return 'More likely to perish';
        return 'Very unlikely to survive';
    }

    function renderStep() {
        const st = steps[step];
        document.getElementById('step-ind').textContent = 'Step ' + (step + 1) + ' of 4';
        document.getElementById('q-text').textContent = st.q;
        document.getElementById('q-note').textContent = st.note;
        const ch = document.getElementById('choices');
        ch.innerHTML = '';
        st.choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = c;
            btn.onclick = () => choose(c);
            ch.appendChild(btn);
        });
    }

    window.choose = function(c) {
        const keyMap = { 0: 'sex', 1: 'cls', 2: 'age', 3: 'fam' };
        sel[keyMap[step]] = c;
        const labelMap = {
            'Female':'Female', 'Male':'Male',
            '1st Class':'1st', '2nd Class':'2nd', '3rd Class':'3rd',
            'Child (0-12)':'Child', 'Teen (13-18)':'Teen', 'Adult (19-40)':'Adult',
            'Older adult (41-60)':'Older adult', 'Elder (61-80)':'Elder',
            'Alone':'Alone', 'Small family (2-4)':'Small fam', 'Large family (5+)':'Large fam'
        };
        crumbs.push(labelMap[c] || c);
        updateBreadcrumb();
        step++;
        if (step < 4) {
            const r = resolve(step);
            updateBar(r.rate, 'Current estimate');
            renderStep();
        } else {
            showResult();
        }
    };

    function showResult() {
        document.getElementById('question-area').style.display = 'none';
        document.getElementById('result-area').style.display = 'block';
        document.getElementById('restart-btn').style.display = 'block';
        document.getElementById('step-ind').textContent = 'Final Result';

        const result = resolve(4);
        const p = result.rate;
        updateBar(p, 'Final probability');

        setTimeout(() => {
            const offset = 440 - (p / 100) * 440;
            const g = document.getElementById('gauge');
            g.style.strokeDashoffset = offset;
            g.style.stroke = probColor(p);
            document.getElementById('res-pct').textContent = p.toFixed(1) + '%';
            document.getElementById('res-pct').style.color = probColor(p);
        }, 100);

        document.getElementById('verdict').textContent = verdict(p);
        document.getElementById('verdict').style.color = probColor(p);

        const c = sel.cls === '1st Class' ? 1 : sel.cls === '2nd Class' ? 2 : 3;
        document.getElementById('profile-txt').textContent =
            `${sel.sex}  •  ${sel.cls}  •  ${sel.age}  •  ${sel.fam}`;
        document.getElementById('ctx-note').innerHTML =
            `<strong>Data context</strong><br><br>` +
            `<strong>Gender:</strong> ${genderNotes[sel.sex] || ''}<br>` +
            `<strong>Class:</strong> ${classNotes[c]}<br>` +
            `<strong>Age:</strong> ${ageNotes[sel.age] || ''}<br>` +
            `<strong>Family:</strong> ${familyNotes[sel.fam] || ''}`;

        // ── Fallback note: only shown when the exact 4-answer profile
        // didn't have enough matching passengers, and a broader group
        // was used instead. This is why the % sometimes doesn't move
        // after the last answer — it's being honest about small samples.
        const noteEl = ensureFallbackNoteEl();
        if (result.fallback) {
            const usedDesc = levelDescription(result.usedLevel);
            const droppedText = droppedToText(result.dropped);
            noteEl.innerHTML =
                `<strong>⚠ Limited data note:</strong> Only a handful of passengers (or none) match ` +
                `your exact combination. This estimate is instead based on <strong>${result.count} similar passengers` +
                `</strong> (${usedDesc}) — the Titanic records don't have enough people matching the ${droppedText} ` +
                `you selected to calculate a reliable rate at that level.`;
            noteEl.style.display = 'block';
        } else {
            noteEl.style.display = 'none';
        }
    }

    window.restart = function() {
        step = 0; sel = {}; crumbs = [];
        document.getElementById('question-area').style.display = 'block';
        document.getElementById('result-area').style.display = 'none';
        document.getElementById('restart-btn').style.display = 'none';
        document.getElementById('breadcrumbs').textContent = '';
        document.getElementById('gauge').style.strokeDashoffset = 440;
        const noteEl = document.getElementById('fallback-note');
        if (noteEl) noteEl.style.display = 'none';
        updateBar(38.4, 'Baseline — all 891 passengers');
        renderStep();
    };

    window.restart();
});
