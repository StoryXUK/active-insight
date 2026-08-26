/* Paste your deployed Google Apps Script Web App URL between the quotes. */
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxsOMVMrpzH_qzuOrWfqYS5HHGENvHzWbg30fsEAJGtkW802kjqml15N8sQGRaRkAyE/exec";

/* Replace these sample names with the final attendee lists. */
const suppliers = [
  "Alliance Leisure", "Bigwave Marketing", "CIMSPA", "Concept Fitness International",
  "Gladstone", "Gym Equipment Ltd", "Life Fitness", "Myzone", "Perfect Gym",
  "Pulse Fitness", "Technogym", "Xplor Gym"
];

const operators = [
  "Active Luton", "Better", "Circadian Trust", "Everyone Active", "Freedom Leisure",
  "Glasgow Life", "GLL", "Halo Leisure", "LED Community Leisure", "Places Leisure",
  "South Downs Leisure", "Wiltshire Council Leisure"
];

const form = document.querySelector("[data-meeting-form]");

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
    count.textContent = selected.size;
    countBadge.textContent = `${selected.size} selected`;
    submitButton.disabled = selected.size === 0;
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
        checkbox.checked ? selected.add(name) : selected.delete(name);
        updateCount();
      });

      label.appendChild(checkbox);
      grid.appendChild(label);
    });
  }

  search.addEventListener("input", event => render(event.target.value));
  render();

  form.addEventListener("submit", async event => {
    event.preventDefault();
    errorMessage.hidden = true;

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
