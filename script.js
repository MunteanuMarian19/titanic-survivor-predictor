document.addEventListener('DOMContentLoaded', () => {

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
      // Coolwarm palette: blue=negative, white=zero, red=positive
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
        const tbl = document.createElement('table');
        tbl.style.borderCollapse = 'collapse';
        tbl.style.margin = '0 auto';

        // Header row
        const hdr = document.createElement('tr');
        hdr.appendChild(document.createElement('td'));
        cols.forEach(col => {
            const td = document.createElement('td');
            td.style.cssText = 'height:60px; vertical-align:bottom; text-align:center; padding-bottom:5px; font-size:11px; color:var(--text-muted);';
            td.textContent = col;
            hdr.appendChild(td);
        });
        tbl.appendChild(hdr);

        // Data rows
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
                    document.getElementById('info-panel').textContent = 'Hover over any cell in the grid to see what the correlation means.';
                });
                tr.appendChild(td);
            });
            tbl.appendChild(tr);
        });
        document.getElementById('heatmap-container').appendChild(tbl);
    }
    renderHeatmap();


    // ==========================================
    // 2. INTERACTIVE PREDICTOR
    // Survival probabilities computed directly from the Titanic CSV
    // using the same cleaning steps as the Python notebook:
    //   - Cabin dropped
    //   - Age filled with gender-specific median
    //   - Embarked filled with mode
    //   - FamilySize = SibSp + Parch + 1
    //   - FamGroup: Alone=1, Small=2–4, Large=5+
    //   - AgeGroup bins: [0,12,18,40,60,80]
    //
    // Where a group has fewer than 3 passengers, the next broader
    // level is used as a fallback (L3 → L2 → L1) to avoid
    // unreliable single-passenger rates distorting the predictor.
    // ==========================================

    // L1: Gender only (df.groupby('Sex')['Survived'].mean() * 100)
    // Verified against CSV: female=74.2, male=18.9
    const L1_prob = {
        female: 74.2,
        male:   18.9
    };

    // L2: Gender × Pclass
    // Verified against CSV — all 6 values exact.
    const L2_prob = {
        female: { 1: 96.8, 2: 92.1, 3: 50.0 },
        male:   { 1: 36.9, 2: 15.7, 3: 13.5 }
    };

    // L3: Gender × Pclass × AgeGroup
    // Values verified against CSV.
    // Cells marked [fallback=L2] had < 3 passengers in the data
    // and use the L2 rate for that sex+class combination.
    const L3_prob = {
        female: {
            1: {
                'Child (0-12)':        96.8,  // [fallback=L2] only 1 passenger in data
                'Teen (13-18)':       100.0,  // 10 passengers — exact
                'Adult (19-40)':       98.2,  // 57 passengers — exact
                'Older adult (41-60)': 95.8,  // 24 passengers — exact
                'Elder (61-80)':       96.8   // [fallback=L2] only 2 passengers
            },
            2: {
                'Child (0-12)':       100.0,  // 8 passengers — exact
                'Teen (13-18)':       100.0,  // 6 passengers — exact
                'Adult (19-40)':       91.8,  // 49 passengers — exact
                'Older adult (41-60)': 84.6,  // 13 passengers — exact
                'Elder (61-80)':       92.1   // [fallback=L2] 0 passengers in this group
            },
            3: {
                'Child (0-12)':        47.8,  // 23 passengers — exact
                'Teen (13-18)':        55.0,  // 20 passengers — exact
                'Adult (19-40)':       53.3,  // 92 passengers — exact
                'Older adult (41-60)':  0.0,  // 8 passengers — exact (0 survivors)
                'Elder (61-80)':       50.0   // [fallback=L2] only 1 passenger
            }
        },
        male: {
            1: {
                'Child (0-12)':       100.0,  // 3 passengers — exact
                'Teen (13-18)':        50.0,  // 2 passengers — using actual rate (1 survived of 2)
                'Adult (19-40)':       40.3,  // 67 passengers — exact
                'Older adult (41-60)': 34.2,  // 38 passengers — exact
                'Elder (61-80)':        8.3   // 12 passengers — exact
            },
            2: {
                'Child (0-12)':       100.0,  // 9 passengers — exact
                'Teen (13-18)':         0.0,  // 6 passengers — exact (0 survivors)
                'Adult (19-40)':        8.3,  // 72 passengers — exact
                'Older adult (41-60)':  5.6,  // 18 passengers — exact
                'Elder (61-80)':       33.3   // 3 passengers — exact
            },
            3: {
                'Child (0-12)':        36.0,  // 25 passengers — exact
                'Teen (13-18)':         7.7,  // 26 passengers — exact
                'Adult (19-40)':       12.8,  // 265 passengers — exact
                'Older adult (41-60)':  7.4,  // 27 passengers — exact
                'Elder (61-80)':        0.0   // 4 passengers — exact (0 survivors)
            }
        }
    };

    // L4: Gender × Pclass × AgeGroup × FamilyGroup
    // FamilyGroup: Alone=FamilySize of 1, Small=2–4, Large=5+
    // Cells marked [fallback] use the L3 rate for that sex+class+age group.
    const L4_prob = {
        female: {
            1: {
                'Child (0-12)':        { Alone: 96.8,  Small: 96.8,  Large: 96.8  }, // [fallback=L2] 1 passenger total
                'Teen (13-18)':        { Alone: 100.0, Small: 100.0, Large: 100.0 }, // exact / L3 fallback
                'Adult (19-40)':       { Alone: 100.0, Small: 96.7,  Large: 100.0 }, // exact
                'Older adult (41-60)': { Alone: 87.5,  Small: 100.0, Large: 95.8  }, // exact / L3 fallback
                'Elder (61-80)':       { Alone: 96.8,  Small: 96.8,  Large: 96.8  }  // [fallback=L2] 2 passengers total
            },
            2: {
                'Child (0-12)':        { Alone: 100.0, Small: 100.0, Large: 100.0 }, // exact / L3 fallbacks
                'Teen (13-18)':        { Alone: 100.0, Small: 100.0, Large: 100.0 }, // exact / L3 fallbacks
                'Adult (19-40)':       { Alone: 91.7,  Small: 91.7,  Large: 91.8  }, // exact / L3 fallback
                'Older adult (41-60)': { Alone: 83.3,  Small: 83.3,  Large: 84.6  }, // exact / L3 fallback
                'Elder (61-80)':       { Alone: 92.1,  Small: 92.1,  Large: 92.1  }  // [fallback=L2] 0 passengers
            },
            3: {
                'Child (0-12)':        { Alone: 47.8,  Small: 75.0,  Large: 10.0  }, // exact / L3 fallback (Alone=1 pax)
                'Teen (13-18)':        { Alone: 63.6,  Small: 42.9,  Large: 55.0  }, // exact / L3 fallback
                'Adult (19-40)':       { Alone: 60.9,  Small: 57.1,  Large: 9.1   }, // exact
                'Older adult (41-60)': { Alone: 0.0,   Small: 0.0,   Large: 0.0   }, // exact (0 survivors in all subgroups)
                'Elder (61-80)':       { Alone: 50.0,  Small: 50.0,  Large: 50.0  }  // [fallback=L2] 1 passenger total
            }
        },
        male: {
            1: {
                'Child (0-12)':        { Alone: 100.0, Small: 100.0, Large: 100.0 }, // exact / L3 fallback
                'Teen (13-18)':        { Alone: 50.0,  Small: 50.0,  Large: 50.0  }, // L3 fallback (2 pax, no subgroup data)
                'Adult (19-40)':       { Alone: 39.1,  Small: 45.0,  Large: 40.3  }, // exact / L3 fallback (Large=1 pax)
                'Older adult (41-60)': { Alone: 30.0,  Small: 38.9,  Large: 34.2  }, // exact / L3 fallback
                'Elder (61-80)':       { Alone: 11.1,  Small: 8.3,   Large: 8.3   }  // exact / L3 fallback
            },
            2: {
                'Child (0-12)':        { Alone: 100.0, Small: 100.0, Large: 100.0 }, // exact / L3 fallbacks
                'Teen (13-18)':        { Alone: 0.0,   Small: 0.0,   Large: 0.0   }, // exact / L3 fallbacks
                'Adult (19-40)':       { Alone: 10.0,  Small: 4.5,   Large: 8.3   }, // exact / L3 fallback
                'Older adult (41-60)': { Alone: 7.7,   Small: 0.0,   Large: 5.6   }, // exact / L3 fallback
                'Elder (61-80)':       { Alone: 33.3,  Small: 33.3,  Large: 33.3  }  // exact / L3 fallbacks
            },
            3: {
                'Child (0-12)':        { Alone: 36.0,  Small: 100.0, Large: 6.2   }, // exact / L3 fallback (Alone=1 pax)
                'Teen (13-18)':        { Alone: 14.3,  Small: 0.0,   Large: 0.0   }, // exact
                'Adult (19-40)':       { Alone: 12.6,  Small: 16.7,  Large: 0.0   }, // exact
                'Older adult (41-60)': { Alone: 8.7,   Small: 0.0,   Large: 7.4   }, // exact / L3 fallback
                'Elder (61-80)':       { Alone: 0.0,   Small: 0.0,   Large: 0.0   }  // exact (0 survivors in all subgroups)
            }
        }
    };

    // Maps the human-readable family choice to the L4 key
    const familyKey = {
        'Alone':              'Alone',
        'Small family (2-4)': 'Small',
        'Large family (5+)':  'Large'
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

    // ─── THIS WAS THE CRITICAL BUG ───────────────────────────────────────────
    // The old code was:
    //   if (!sel.cls) return L2_prob[s] ? {1: L2_prob[s][1], 2: ...}[1] || 38.4 : 38.4;
    // This created an object and immediately indexed it with [1], which always
    // returned the 1st Class rate (96.8% for female, 36.9% for male) instead of
    // the sex-only rate. So selecting Female jumped the bar to 96.8% instead of 74.2%.
    //
    // Fix: added L1_prob constant above, and changed this line to: return L1_prob[s]
    // ─────────────────────────────────────────────────────────────────────────
    function getInterimProb() {
        if (!sel.sex) return 38.4;                              // No selection yet → overall baseline
        const s = sel.sex === 'Female' ? 'female' : 'male';
        if (!sel.cls) return L1_prob[s];                       // Sex selected only → L1 rate (74.2% / 18.9%)
        const c = sel.cls === '1st Class' ? 1 : sel.cls === '2nd Class' ? 2 : 3;
        if (!sel.age) return L2_prob[s][c];                    // Sex + Class → L2 rate
        const a = sel.age;
        if (!sel.fam) return L3_prob[s][c][a];                 // Sex + Class + Age → L3 rate
        const f = familyKey[sel.fam];
        return L4_prob[s][c][a][f];                            // All 4 selected → L4 final rate
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
            updateBar(getInterimProb(), 'Current estimate');
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

        const p = getInterimProb();
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
            `<strong>Class:</strong> ${classNotes[c]}<br>` +
            `<strong>Age:</strong> ${ageNotes[sel.age] || ''}<br>` +
            `<strong>Family:</strong> ${familyNotes[sel.fam] || ''}`;
    }

    window.restart = function() {
        step = 0; sel = {}; crumbs = [];
        document.getElementById('question-area').style.display = 'block';
        document.getElementById('result-area').style.display = 'none';
        document.getElementById('restart-btn').style.display = 'none';
        document.getElementById('breadcrumbs').textContent = '';
        document.getElementById('gauge').style.strokeDashoffset = 440;
        updateBar(38.4, 'Baseline — all 891 passengers');
        renderStep();
    };

    window.restart();
});