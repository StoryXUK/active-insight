/* Paste your deployed Google Apps Script Web App URL between the quotes. */
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsOMVMrpzH_qzuOrWfqYS5HHGENvHzWbg30fsEAJGtkW802kjqml15N8sQGRaRkAyE/exec";

const suppliers = [
  "4Global",
  "Active-Insight",
  "Alliance Leisure",
  "Bigwave",
  "CIMSPA",
  "Cornerstone",
  "Egym Hussle",
  "Egym",
  "Evolve",
  "Fibodo",
  "Future Fit for Business",
  "HireBob.ai",
  "Hutchison",
  "InBody",
  "IndigoFitness",
  "Innerva",
  "Integratis Consulting",
  "Johnson Tech",
  "MOWL",
  "MyFitApp",
  "Pulse Fitness",
  "Qualified Trainers",
  "Rent Gym Equipment",
  "Right Directions",
  "Risk HQ",
  "RLSS UK",
  "Scottish Swimming",
  "SECA",
  "Space Place",
  "Sportmax",
  "STA",
  "Taylor Made Designs & Blu Leisure",
  "UKActive",
  "Xplor Technologies",
  "Xn Leisure",
  "LED Snaps"
];

const operators = [
  "AngusAlive",
  "Clackmannanshire Council",
  "Edinburgh Leisure",
  "Fife Sports and Leisure Trust",
  "OneRen",
  "Wave Active",
  "Enjoy East Ren",
  "SRUC",
  "High Life Highland",
  "North Lanarkshire",
  "Glasgow Life",
  "Live Life Aberdeenshire",
  "Leisure and Culture Dundee",
  "Strathclyde",
  "Inverclyde Leisure",
  "South Ayrshire",
  "Derry Strabane",
  "South Lanarkshire Leisure",
  "East Dunbarton",
  "Alliance Leisure",
  "KA Leisure",
  "Sport Aberdeen"
];

const form = document.querySelector("[data-meeting-form]");
const MAX_SELECTIONS = 10;

if (form) {
  const audience = document.body.dataset.audience;
  const companies = audience === "operator" ? suppliers : operators;
  const grid = document.querySelector("[data-company-grid]");
  const search = document.querySelector("[data-company-search]");
  const count = document.querySelector("[data-count]");
  const countBadge = document.querySelector(".selection-count");
  const submitButton = form.querySelector("button[type='submit']");
  const errorMessage = document.querySelector(".form-error");
  const emptyState = document.querySelector(".empty-state");
  const selected = new Set();

  function safeId(name) {
    return `${audience}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  }

  function updateCount() {
    count.textContent = `${selected.size} / ${MAX_SELECTIONS}`;
    countBadge.textContent = `${selected.size} / ${MAX_SELECTIONS} selected`;

    grid.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
      checkbox.disabled = selected.size >= MAX_SELECTIONS && !checkbox.checked;
    });
  }

  function render(filter = "") {
    const visible = companies.filter(name => name.toLowerCase().includes(filter.toLowerCase()));
    grid.innerHTML = "";
    emptyState.hidden = visible.length > 0;

    visible.forEach(name => {
      const label = document.createElement("label");
      label.className = "company-option";
      label.htmlFor = safeId(name);
      label.innerHTML = `<span class="company-mark" aria-hidden="true">${name.charAt(0)}</span><span>${name}</span>`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = safeId(name);
      checkbox.value = name;
      checkbox.checked = selected.has(name);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked && selected.size >= MAX_SELECTIONS && !selected.has(name)) {
          checkbox.checked = false;
          return;
        }

        checkbox.checked ? selected.add(name) : selected.delete(name);
        updateCount();
      });

      label.appendChild(checkbox);
      grid.appendChild(label);
    });

    updateCount();
  }

  search.addEventListener("input", event => render(event.target.value));
  render();

  form.addEventListener("submit", async event => {
    event.preventDefault();
    errorMessage.hidden = true;

    if (selected.size > MAX_SELECTIONS) {
      errorMessage.textContent = `Please select no more than ${MAX_SELECTIONS} organisations before submitting.`;
      errorMessage.hidden = false;
      return;
    }

    if (GOOGLE_APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
      errorMessage.textContent = "Add your Google Apps Script URL to script.js before submitting.";
      errorMessage.hidden = false;
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting…";
    const data = new FormData(form);
    const payload = {
      submittedAt: new Date().toISOString(),
      attendeeType: audience,
      name: data.get("name"),
      company: data.get("company"),
      selections: Array.from(selected)
    };

    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      form.hidden = true;
      document.querySelector(".form-hero").hidden = true;
      document.querySelector("[data-success]").hidden = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      errorMessage.textContent = "We couldn’t submit your choices. Please try again.";
      errorMessage.hidden = false;
      submitButton.disabled = false;
      submitButton.textContent = "Submit preferences";
    }
  });
}
