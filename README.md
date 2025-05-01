# Who’s Building the Future?  
**Mapping the Global Landscape of AI Model Development**

## 📊 Overview

This interactive dashboard visualizes the global distribution of AI model development, focusing exclusively on **Notable AI models**—those achieving state-of-the-art results, historical importance, high citations, or broad adoption.

We highlight the key contributors shaping the future of AI across domains such as research, accessibility, infrastructure, and national investment.

---

## 🌍 Features

- **Bar Charts**: Top AI domains, leading organizations, and countries by model count
- **Stacked Charts**: Model accessibility breakdowns by domain, organization, and country
- **Radar Chart**: Compare two countries across 10 AI development indicators
- **Responsive Design**: Works across desktops, tablets, and mobile
- **Dynamic Tooltips** and **interactive legends**

---

## 📁 Project Structure

```
.
├── index.html              # Main dashboard layout
├── css/
│   └── style.css           # Custom styles
├── js/
│   ├── main.js             # Bar chart logic
│   ├── accessibility.js    # Stacked bar charts
│   └── radar.js            # Radar chart and dropdown logic
├── data/
│   ├── notable_ai_models_cleaned.csv
│   ├── model_accessibility_by_domain.csv
│   ├── model_accessibility_by_top10_orgs.csv
│   ├── model_accessibility_by_top10_countries.csv
│   └── Merged_AI_data.csv  # Country radar chart data
```

---

## 🧠 AI Indicators (Radar Chart)

Each axis represents an essential pillar of national AI development:

- **Talent** – Skilled AI workforce availability
- **Infrastructure** – Electricity, internet, computing resources
- **Operating Environment** – Regulation and public trust
- **Research** – Academic publications & citations
- **Development** – Fundamental platform & algorithm innovation
- **Government Strategy** – Public investment and policy
- **Commercial** – Industry/startup innovation
- **Notable Models** – Models with state-of-the-art/citation impact
- **Publications** – AI-related research output
- **Investment** – Capital directed at AI initiatives

---

## 🚀 How to Run

1. Clone or download the repo
2. Ensure all `.csv` files are placed in the `/data` folder
3. Open `index.html` in your browser

---

## 📌 Tools & Libraries

- [D3.js v7](https://d3js.org/)
- [Bootstrap 5](https://getbootstrap.com/)
- [d3-interpolate-path (optional)](https://github.com/pbeshai/d3-interpolate-path) for radar animation

---

## 🎓 Academic Context

This project is my submission for the **Introduction to Information Visualization** class  
at **Temple University** under **Prof. Stephen MacNeil (Steve)**.

---

## 💡 Lessons Learned

- Gained proficiency in **D3.js** and modern JavaScript development
- Designed **user interactivity** through tooltips, dropdowns, legends, and animations
- Improved **data gathering and cleaning methods** for visualization datasets
- Learned **responsive design principles** for visualizations on desktop and mobile
- Practiced integrating **multiple charts** into a cohesive dashboard experience

---

## ✨ Author

Created with 💻 and 📊 by Arish Sayyed  
Year: 2025
