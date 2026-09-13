🚢 Titanic Survival Analysis & Interactive Predictor:

A full exploratory data analysis of the Titanic passenger manifest, built in Python, extended into an interactive, presentation-ready web app in HTML/CSS/JavaScript.
The project asks one question: did a passenger's chances of survival depend on who they were — gender, class, age, ticket price, family size? The notebook answers it with real statistics; the web app lets anyone explore the answer for themselves.
🔗 Live demo: https://munteanumarian19.github.io/titanic-survivor-predictor/
---
Overview
891 real passenger records analyzed
12 original columns → cleaned, then extended with 5 engineered features
4 research questions answered with grouped survival rates
10-column correlation matrix identifying the strongest predictors of survival
A 4-question interactive predictor that looks up real historical survival rates — not a machine learning model — with a built-in safeguard against showing unreliable numbers from tiny samples
---
🧹 Data Cleaning
Issue	Decision	Why
`Cabin` — 687 of 891 missing (77%)	Dropped entirely	Too sparse to impute reliably
`Age` — 177 missing	Filled with the median age of the same gender	More accurate than a single overall median; avoids skew from outliers
`Embarked` — 2 missing	Filled with the mode (most common port)	Only 2 rows affected; safe default
🛠️ Feature Engineering
New column	Built from	Purpose
`Sex_num`	`Sex` mapped to 0/1	Lets gender enter the numeric correlation matrix
`FamilySize`	`SibSp + Parch + 1`	Total family group size aboard, including the passenger
`IsAlone`	`FamilySize == 1`	Binary flag for solo travelers
`FareClass` / `FareClassNum`	`Fare` binned into Cheap / Medium / Rich	Turns a continuous price into a readable wealth tier
`AgeGroup`	`Age` binned into 5 life-stage ranges	Groups passengers the way the evacuation protocol actually treated them (children, adults, elderly)
---
🔍 Key Findings
Question	Result
Does passenger class affect survival?	1st: 63.0% · 2nd: 47.3% · 3rd: 24.2% — worse class meant a lower deck, farther from the lifeboats
Does gender affect survival?	Female: 74.2% · Male: 18.9% — by far the strongest single factor, reflecting the "women and children first" evacuation protocol
Did fare paid relate to survival?	Survivors paid £48.40 on average · Non-survivors paid £22.12 — fare acted as a proxy for cabin class and lifeboat proximity
Does age group affect survival?	Child (0–12): 58.0% · Teen: 42.9% · Adult: 36.0% · Older adult: 39.1% · Elder (61–80): 22.7% — children were prioritized; the pattern isn't strictly linear
🔥 Correlation Analysis
A 10-column Pearson correlation matrix (`Survived`, `Sex_num`, `Pclass`, `FareClassNum`, `Fare`, `FamilySize`, `IsAlone`, `Age`, `SibSp`, `Parch`), visualized as a heatmap.
Strongest real predictors of `Survived`:
`Sex_num`: +0.54 (by far the strongest)
`Pclass`: −0.34
`FareClassNum`: +0.33
`Fare`: +0.26
`IsAlone`: −0.20
A deliberate caveat worth noting: `FamilySize ↔ SibSp` shows a very high +0.89, but this isn't a discovery — `FamilySize` is calculated directly from `SibSp + Parch + 1`, so the two are mathematically linked by construction, not by any real-world pattern. The same applies to a few other pairs in the matrix (`FamilySize↔Parch`, `FamilySize↔IsAlone`). Distinguishing genuine findings from these engineered-feature artifacts was a deliberate part of the analysis.
`Age`'s correlation with `Survived` is a weak −0.07 despite real, meaningful differences existing between age groups (see the findings table above) — because Pearson correlation only captures straight-line trends, and the actual age/survival relationship rises and falls rather than moving consistently in one direction.
---
🎯 Interactive Survival Predictor
A 4-question tool (Gender → Class → Age → Family situation) that returns the real historical survival rate for passengers matching that profile.
Important methodological note: this is not a machine learning model. No algorithm is trained or generalizing — every percentage shown is a direct measurement: filter the 891 real passengers down to the exact combination selected, count how many survived, divide by the total. If a combination has too few matching passengers to trust (fewer than 3), the tool automatically steps back to a broader, more reliable group instead of reporting a misleading number based on one or two people — and explains why when this happens.
How the analysis became a website
The statistics were computed once, offline, in the Python notebook (`pandas.groupby().mean()` for survival rates, `pandas.corr()` for the correlation matrix). Those results — not the raw dataset — were then embedded directly into the JavaScript as fixed lookup tables. The browser never re-runs any statistics; it only decides, live, which pre-computed number to display based on the visitor's answers, including the small-sample fallback logic described above.
---
🧰 Tech Stack
Analysis: Python · pandas · NumPy · Matplotlib · Seaborn · Jupyter Notebook
Web app: HTML5 · CSS3 · Vanilla JavaScript (no frameworks, no build step)
---
📁 Project Structure
```
titanic-survival-analysis/
├── titanic_project.ipynb   # Full Python/pandas EDA — cleaning, feature engineering,
│                            # visualizations, correlation matrix, research questions
├── titanic_Daniela.csv     # Dataset — 891 passenger records
├── index.html               # Web app markup
├── style.css                # Web app styling
├── script.js                 # Correlation heatmap + interactive predictor logic
└── README.md
```
---
▶️ Running Locally
Notebook:
```bash
pip install pandas matplotlib seaborn numpy ipykernel
jupyter notebook titanic_project.ipynb
```
Web app — no build step required, it's static HTML/CSS/JS:
```bash
# Option 1: just open it directly
open index.html          # macOS
start index.html         # Windows

# Option 2: serve it locally
python -m http.server 8000
# then visit http://localhost:8000
```
---
📌 Dataset
The classic Titanic passenger dataset (891 records), widely used for introductory data analysis and as the basis of Kaggle's "Titanic: Machine Learning from Disaster" competition.
---
📝 Author's Note
This project was built as a Data Analyst course capstone, then extended beyond the original assignment into a full interactive presentation — including a from-scratch JavaScript correlation heatmap and a historically-grounded survival predictor with honest handling of small-sample reliability.
