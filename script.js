
/* =========================================
   PLACEMENTHUB - JAVASCRIPT
========================================= */

// Sample opportunities for demonstration.
// These are sample listings, not verified live vacancies.

const jobs = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer Intern",
    location: "Bengaluru, India",
    type: "Internship",
    salary: "Paid internship",
    icon: "fa-brands fa-google",
    color: "blue",
    description: "Explore software engineering, collaborate with teams, and learn through real-world projects.",
    skills: ["Java", "Python", "DSA"]
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Frontend Developer Intern",
    location: "Hyderabad, India",
    type: "Internship",
    salary: "Stipend varies",
    icon: "fa-brands fa-microsoft",
    color: "pink",
    description: "Build responsive web experiences and improve your frontend development skills.",
    skills: ["HTML", "CSS", "JavaScript"]
  },
  {
    id: 3,
    company: "Amazon",
    role: "SDE Intern",
    location: "Bengaluru, India",
    type: "Internship",
    salary: "Stipend varies",
    icon: "fa-brands fa-amazon",
    color: "orange",
    description: "Practice problem-solving and learn how software systems work at scale.",
    skills: ["Java", "Python", "DSA"]
  },
  {
    id: 4,
    company: "Infosys",
    role: "Graduate Software Developer",
    location: "Hyderabad, India",
    type: "Full-time",
    salary: "Company dependent",
    icon: "fa-solid fa-code",
    color: "blue",
    description: "Start your software development journey with programming and collaborative projects.",
    skills: ["Java", "SQL", "Problem solving"]
  },
  {
    id: 5,
    company: "Accenture",
    role: "Web Development Intern",
    location: "Chennai, India",
    type: "Internship",
    salary: "Details to verify",
    icon: "fa-solid fa-laptop-code",
    color: "purple",
    description: "Learn to create accessible, responsive websites using modern frontend techniques.",
    skills: ["HTML", "CSS", "React"]
  },
  {
    id: 6,
    company: "TCS",
    role: "Assistant System Engineer",
    location: "India",
    type: "Full-time",
    salary: "Company dependent",
    icon: "fa-solid fa-building",
    color: "cyan",
    description: "Explore software engineering, teamwork, and technical problem-solving.",
    skills: ["Java", "SQL", "Programming"]
  }
];

const STORAGE_KEYS = {
  saved: "placementHubSavedJobs",
  applications: "placementHubApplications"
};

const VALID_STATUSES = [
  "Applied",
  "Interview",
  "Selected",
  "Rejected"
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Could not read saved browser data.", error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Could not save browser data.", error);
    alert("Your browser could not save the change. Check your browser storage settings.");
    return false;
  }
}

let savedJobs = readStorage(STORAGE_KEYS.saved, []);
let applications = readStorage(STORAGE_KEYS.applications, []);

if (!Array.isArray(savedJobs)) savedJobs = [];
if (!Array.isArray(applications)) applications = [];

// Keep only valid, unique job IDs and application statuses.
savedJobs = [...new Set(savedJobs.filter(id =>
  jobs.some(job => job.id === id)
))];

applications = applications
  .filter(app =>
    app &&
    jobs.some(job => job.id === app.jobId) &&
    VALID_STATUSES.includes(app.status)
  )
  .filter((app, index, list) =>
    list.findIndex(item => item.jobId === app.jobId) === index
  );

function saveSavedJobs() {
  return writeStorage(STORAGE_KEYS.saved, savedJobs);
}

function saveApplications() {
  return writeStorage(STORAGE_KEYS.applications, applications);
}

// JOB SEARCH AND FILTERING

const jobGrid = document.getElementById("jobGrid");
const jobSearch = document.getElementById("jobSearch");
const typeFilter = document.getElementById("typeFilter");
const resultsMessage = document.getElementById("resultsMessage");

function renderJobs() {
  const searchText = jobSearch.value.trim().toLowerCase();
  const selectedType = typeFilter.value;

  const filteredJobs = jobs.filter(job => {
    const searchableText = [
      job.company,
      job.role,
      job.location,
      job.type,
      job.description,
      ...job.skills
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchText);
    const matchesType =
      selectedType === "all" || job.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (filteredJobs.length === 0) {
    jobGrid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-magnifying-glass"></i>
        <h3>No opportunities found</h3>
        <p>Try another keyword or change your opportunity filter.</p>
      </div>
    `;
    resultsMessage.textContent = "";
    return;
  }

  jobGrid.innerHTML = filteredJobs.map(job => {
    const isSaved = savedJobs.includes(job.id);
    const alreadyApplied = applications.some(
      app => app.jobId === job.id
    );

    return `
      <article class="job-card">
        <div class="job-top">
          <div class="job-company-logo ${job.color}">
            <i class="${job.icon}"></i>
          </div>

          <div class="job-company-info">
            <strong>${job.company}</strong>
            <p>${job.type}</p>
          </div>

          <button
            class="save-btn ${isSaved ? "saved" : ""}"
            data-save="${job.id}"
            aria-label="${isSaved ? "Unsave" : "Save"} ${job.role}"
            aria-pressed="${isSaved}"
            title="${isSaved ? "Remove saved job" : "Save job"}"
          >
            <i class="${isSaved ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
          </button>
        </div>

        <h3>${job.role}</h3>

        <div class="job-meta">
          <span><i class="fa-solid fa-location-dot"></i>${job.location}</span>
          <span><i class="fa-solid fa-wallet"></i>${job.salary}</span>
        </div>

        <p class="job-description">${job.description}</p>

        <div class="job-tags">
          ${job.skills.map(skill =>
            `<span class="job-tag">${skill}</span>`
          ).join("")}
        </div>

        <div class="job-footer">
          <span class="job-type">${job.type}</span>
          <button
            class="apply-btn"
            data-apply="${job.id}"
            ${alreadyApplied ? "disabled" : ""}
          >
            ${alreadyApplied ? "Added ✓" : "Track application"}
          </button>
        </div>
      </article>
    `;
  }).join("");

  resultsMessage.textContent =
    `Showing ${filteredJobs.length} sample opportunit${filteredJobs.length === 1 ? "y" : "ies"}.`;
}

jobSearch.addEventListener("input", renderJobs);
typeFilter.addEventListener("change", renderJobs);

// SAVE OR UNSAVE JOBS

jobGrid.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  const applyButton = event.target.closest("[data-apply]");

  if (saveButton) {
    const jobId = Number(saveButton.dataset.save);

    if (savedJobs.includes(jobId)) {
      savedJobs = savedJobs.filter(id => id !== jobId);
    } else {
      savedJobs.push(jobId);
    }

    if (saveSavedJobs()) renderJobs();
  }

  if (applyButton && !applyButton.disabled) {
    const jobId = Number(applyButton.dataset.apply);
    const job = jobs.find(item => item.id === jobId);

    if (!job) return;

    const alreadyApplied = applications.some(
      app => app.jobId === jobId
    );

    if (alreadyApplied) return;

    applications.push({
      jobId: jobId,
      status: "Applied",
      date: new Date().toLocaleDateString("en-IN")
    });

    if (saveApplications()) {
      renderJobs();
      renderApplications();

      document.getElementById("tracker").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      applications = applications.filter(
        app => app.jobId !== jobId
      );
    }
  }
});

// APPLICATION TRACKER

const applicationList = document.getElementById("applicationList");

function renderApplications() {
  const total = applications.length;
  const inProgress = applications.filter(app =>
    app.status === "Applied" || app.status === "Interview"
  ).length;
  const selected = applications.filter(app =>
    app.status === "Selected"
  ).length;

  document.getElementById("totalApplications").textContent = total;
  document.getElementById("progressApplications").textContent = inProgress;
  document.getElementById("selectedApplications").textContent = selected;

  if (applications.length === 0) {
    applicationList.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-folder-open"></i>
        <h3>No applications yet</h3>
        <p>Explore opportunities above and add a job to start tracking.</p>
      </div>
    `;
    return;
  }

  applicationList.innerHTML = applications.map(app => {
    const job = jobs.find(item => item.id === app.jobId);

    if (!job) return "";

    return `
      <div class="application-row">
        <div class="job-company-logo ${job.color}">
          <i class="${job.icon}"></i>
        </div>

        <div class="application-info">
          <strong>${job.role}</strong>
          <p>${job.company} · Added ${app.date}</p>
        </div>

        <select
          class="status-select"
          data-status="${job.id}"
          aria-label="Application status for ${job.role}"
        >
          ${VALID_STATUSES.map(status => `
            <option value="${status}" ${app.status === status ? "selected" : ""}>
              ${status}
            </option>
          `).join("")}
        </select>

        <button
          class="remove-btn"
          data-remove="${job.id}"
          aria-label="Remove ${job.role} from applications"
          title="Remove application"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  }).join("");
}

applicationList.addEventListener("change", event => {
  const statusSelect = event.target.closest("[data-status]");

  if (!statusSelect) return;

  const jobId = Number(statusSelect.dataset.status);
  const application = applications.find(
    app => app.jobId === jobId
  );

  if (!application || !VALID_STATUSES.includes(statusSelect.value)) {
    renderApplications();
    return;
  }

  const oldStatus = application.status;
  application.status = statusSelect.value;

  if (!saveApplications()) {
    application.status = oldStatus;
  }

  renderApplications();
});

applicationList.addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove]");

  if (!removeButton) return;

  const jobId = Number(removeButton.dataset.remove);
  const previousApplications = [...applications];

  applications = applications.filter(
    app => app.jobId !== jobId
  );

  if (saveApplications()) {
    renderApplications();
    renderJobs();
  } else {
    applications = previousApplications;
    renderApplications();
  }
});

// MOBILE NAVIGATION

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuBtn.setAttribute("aria-expanded", String(isOpen));
  menuBtn.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

navLinks.addEventListener("click", event => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
});

// NAVBAR SCROLL EFFECT

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

// CURRENT YEAR

document.getElementById("currentYear").textContent =
  new Date().getFullYear();

// INITIAL RENDER

renderJobs();
renderApplications();