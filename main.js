// On page load, set theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// subjects in localStorage
function getSubjects() {
  return (
    JSON.parse(localStorage.getItem("subjects")) || [
      "Math",
      "Science",
      "English",
      "History",
      "Art",
    ]
  );
}
function saveSubjects(subjects) {
  localStorage.setItem("subjects", JSON.stringify(subjects));
}

/* ********************
    Variables
** ********************/
let editingIndex = null;

/* ***************************
    Handle nav links to pages
** **************************/
function showDashboard() {
  editingIndex = null;

  const upcoming = getUpcomingAssignments();
  const past = getPastAssignments();
  const progress = getAcademicProgress();

  document.getElementById("app").innerHTML = `
        <h1>Dashboard</h1>
        <section>
            <h2>Upcoming Assignments</h2>
            ${renderAssignmentsTable(upcoming)}
        </section>
        <section>
            <h2>Past Due Assignments</h2>
            ${renderAssignmentsTable(past, true)}
        </section>
        <section>
            <h2>Academic Progress</h2>
            <p>${progress.completed} out of ${
    progress.total
  } assignments completed (${progress.percent}%)</p>
            <div style="background:#eee;width:100%;border-radius:10px;overflow:hidden;">
                <div style="background:#4caf50;height:20px;width:${
                  progress.percent
                }%;"></div>
            </div>
        </section>
    `;
}

function showAssignments() {
  document.getElementById("app").innerHTML = `
        <h1>Assignments</h1>
        <form id="assignment-form">
            <input type="text" id="assignment-title" placeholder="Title" required>
            <select id="assignment-subject" required>
            <option value="">Select Subject</option>
            ${getSubjects()
              .map((subj) => `<option value="${subj}">${subj}</option>`)
              .join("")}
            </select>
            <input type="date" id="assignment-due" required>
            <button type="submit">Add Assignment</button>
        </form>
        <table id="assignments-table">
            <thead>
                <tr>
                    <th>Due Date</th>
                    <th>Subject</th>
                    <th>Title</th>
                    <th>Complete</th>
                </tr>
            </thead>
            <tbody>
                <!-- Assignment rows go here -->
            </tbody>
        </table>
    `;

  displayAssignments();

  // Form submit handler
  document
    .getElementById("assignment-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      addAssignment();
    });
}

function showStudyLog() {
  editingIndex = null;

  document.getElementById("app").innerHTML = `
        <h1>Study Log</h1>
        <form id="study-form">
            <select id="study-subject" required>
              <option value="">Select Subject</option>
              ${getSubjects()
                .map((subj) => `<option value="${subj}">${subj}</option>`)
                .join("")}
            </select>
            <input type="date" id="study-date" required>
            <input type="number" id="study-duration" placeholder="Duration (minutes)" required min="1">
            <button type="submit">Add Session</button>
        </form>
        <table id="study-table">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Duration (min)</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <!-- Study rows go here -->
            </tbody>
        </table>
    `;

  displayStudyLog();

  document
    .getElementById("study-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      addStudySession();
    });
}

function showCalendar() {
  editingIndex = null;
  document.getElementById("app").innerHTML = `
    <h1>Calendar</h1>
    <div id="calendar"></div>
  `;

  // Gather assignment and study events
  const assignmentEvents = getAssignments().map((a) => ({
    title: `Assignment: ${a.subject} - ${a.title}${a.completed ? " ✔️" : ""}`,
    start: a.dueDate,
    allDay: true,
    color: a.completed ? "#85e085" : "#2d5be3",
  }));
  const studyEvents = getStudyLog().map((s) => ({
    title: `Study: ${s.subject} - ${s.duration} min`,
    start: s.date,
    allDay: true,
    color: "#f7ca18",
  }));
  const events = assignmentEvents.concat(studyEvents);

  setTimeout(() => {
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: events,
    });
    calendar.render();
  }, 0);
}

function showSettings() {
  editingIndex = null;
  const isDark = localStorage.getItem("theme") === "dark";
  const subjects = getSubjects();

  document.getElementById("app").innerHTML = `
    <h1>Settings</h1>
    <section>
      <h2>Customize</h2>
      <label style="display:flex;align-items:center;gap:0.5em;">
        <input type="checkbox" id="theme-toggle" ${isDark ? "checked" : ""}>
        Dark Mode
      </label>
    </section>
    <section style="margin-top:2em;">
      <h2>Manage Subjects</h2>
      <form id="add-subject-form" style="margin-bottom:1em;">
        <input type="text" id="new-subject" placeholder="New subject" required>
        <button type="submit">Add</button>
      </form>
      <ul id="subjects-list">
        ${subjects
          .map(
            (subj, i) =>
              `<li>${subj} <button data-index="${i}" class="remove-subject-btn" style="color:#d33;">Remove</button></li>`
          )
          .join("")}
      </ul>
    </section>
    <section style="margin-top:2em;">
      <button id="reset-data-btn" style="background:#fa6666;color:white;padding:0.5em 1.5em;border:none;border-radius:12px;font-weight:bold;">Reset All Data</button>
      <p style="color:#c00;">Warning: This will delete ALL your assignments and study log data. This action cannot be undone.</p>
    </section>
  `;

  // Dark mode toggle
  document
    .getElementById("theme-toggle")
    .addEventListener("change", function (e) {
      if (e.target.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    });

  // Add subject
  document
    .getElementById("add-subject-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const val = document.getElementById("new-subject").value.trim();
      if (val && !subjects.includes(val)) {
        subjects.push(val);
        saveSubjects(subjects);
        showSettings();
      }
    });

  // Remove subject
  document.querySelectorAll(".remove-subject-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = Number(btn.getAttribute("data-index"));
      const subjects = getSubjects();
      const subjectToRemove = subjects[index];

      // Check if subject is used
      const usedInAssignments = getAssignments().some(
        (a) => a.subject === subjectToRemove
      );
      const usedInStudyLog = getStudyLog().some(
        (s) => s.subject === subjectToRemove
      );

      if (usedInAssignments || usedInStudyLog) {
        if (
          !window.confirm(
            `"${subjectToRemove}" is used in your assignments or study log.\n\nIf you remove it, ALL assignments and study log entries with this subject will be permanently deleted.\n\nAre you sure you want to continue?`
          )
        ) {
          return;
        }

        // Remove from all assignments
        let assignments = getAssignments();
        assignments = assignments.filter((a) => a.subject !== subjectToRemove);
        saveAssignments(assignments);

        // Remove from all study logs
        let studyLog = getStudyLog();
        studyLog = studyLog.filter((s) => s.subject !== subjectToRemove);
        saveStudyLog(studyLog);
      }

      // Remove from subjects list
      subjects.splice(index, 1);
      saveSubjects(subjects);
      showSettings();
    });
  });

  // Reset all data
  document
    .getElementById("reset-data-btn")
    .addEventListener("click", function () {
      if (
        window.confirm(
          "Are you sure you want to delete all assignments, study log, and subject list? This cannot be undone."
        )
      ) {
        localStorage.removeItem("assignments");
        localStorage.removeItem("studyLog");
        localStorage.removeItem("subjects");
        showSettings();
      }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  showDashboard();

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const page = btn.getAttribute("data-page");
      if (page === "dashboard") showDashboard();
      if (page === "assignments") showAssignments();
      if (page === "study") showStudyLog();
      if (page === "calendar") showCalendar();
      if (page === "settings") showSettings();
    });
  });
});

/* *********************************
    Assignments
** ********************************/
function getAssignments() {
  return JSON.parse(localStorage.getItem("assignments") || "[]");
}

function saveAssignments(assignments) {
  localStorage.setItem("assignments", JSON.stringify(assignments));
}

function addAssignment() {
  const title = document.getElementById("assignment-title").value;
  const subject = document.getElementById("assignment-subject").value;
  const dueDate = document.getElementById("assignment-due").value;

  if (!title || !subject || !dueDate) return;

  const assignments = getAssignments();
  assignments.push({
    title,
    subject,
    dueDate,
    completed: false,
    completedOn: null,
  });
  saveAssignments(assignments);
  displayAssignments();

  // Clear form
  document.getElementById("assignment-form").reset();
}

function deleteAssignment(index) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this assignment?"
  );
  if (!confirmDelete) return;

  const assignments = getAssignments();
  assignments.splice(index, 1);
  saveAssignments(assignments);
  displayAssignments();
}

function displayAssignments() {
  const assignments = getAssignments();
  const tbody = document.querySelector("#assignments-table tbody");
  if (!tbody) return;
  tbody.innerHTML = assignments
    .map((a, i) => {
      // Edit mode for a specific row
      if (i === editingIndex) {
        return `
                <tr>
                    <td>
                        <input type="date" id="edit-due" value="${a.dueDate}">
                    </td>
                    <td>
                        <select id="edit-subject">
                            ${getSubjects()
                              .map(
                                (subj) =>
                                  `<option value="${subj}">${subj}</option>`
                              )
                              .join("")}
                        </select>
                    </td>
                    <td>
                        <input type="text" id="edit-title" value="${a.title}">
                    </td>
                    <td>
                        <input type="checkbox" id="edit-completed" ${
                          a.completed ? "checked" : ""
                        }>
                    </td>
                    <td>
                        <button onclick="saveEdit(${i})">Save</button>
                        <button onclick="cancelEdit()">Cancel</button>
                    </td>
                </tr>
            `;
      } else {
        // Normal display row
        return `
                <tr>
                    <td>${a.dueDate}</td>
                    <td>${a.subject}</td>
                    <td>${a.title}</td>
                    <td>
                        <input type="checkbox" onchange="toggleComplete(${i})" ${
          a.completed ? "checked" : ""
        } ${editingIndex === i ? "disabled" : ""}>

                    </td>
                    <td>
                        <button onclick="editAssignment(${i})" ${
          a.completed ? "disabled" : ""
        }>Edit</button>
                        <button onclick="deleteAssignment(${i})">Delete</button>
                    </td>
                </tr>
            `;
      }
    })
    .join("");
}
window.deleteAssignment = deleteAssignment;

function toggleComplete(index) {
  const assignments = getAssignments();
  const assignment = assignments[index];
  assignment.completed = !assignment.completed;

  if (assignment.completed) {
    assignment.completedOn = new Date().toISOString().slice(0, 10);
  } else {
    assignment.completedOn = null;
  }

  saveAssignments(assignments);
  displayAssignments();
}
window.toggleComplete = toggleComplete;

function editAssignment(index) {
  editingIndex = index;
  displayAssignments();
}
window.editAssignment = editAssignment;

function cancelEdit() {
  editingIndex = null;
  displayAssignments();
}
window.cancelEdit = cancelEdit;

function saveEdit(index) {
  const assignments = getAssignments();
  const newDue = document.getElementById("edit-due").value;
  const newSubject = document.getElementById("edit-subject").value;
  const newTitle = document.getElementById("edit-title").value;

  const oldAssignment = assignments[index];
  assignments[index] = {
    dueDate: newDue,
    subject: newSubject,
    title: newTitle,
    completed: oldAssignment.completed || false,
    completedOn: oldAssignment.completedOn || null,
  };
  saveAssignments(assignments);
  editingIndex = null;
  displayAssignments();
}
window.saveEdit = saveEdit;

function renderAssignmentsTable(assignments, showCompleted = false) {
  if (assignments.length === 0) {
    return "<p>No assignments found.</p>";
  }
  return `
        <table class="assignments-table">
            <thead>
                <tr>
                    <th>Due Date</th>
                    <th>Subject</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                ${assignments
                  .map(
                    (a) => `
                    <tr>
                        <td>${a.dueDate}</td>
                        <td>${a.subject}</td>
                        <td>${a.title}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

/* *********************************
    Data Storage for Study Log
** ********************************/
function getStudyLog() {
  return JSON.parse(localStorage.getItem("studyLog") || "[]");
}

function saveStudyLog(log) {
  localStorage.setItem("studyLog", JSON.stringify(log));
}

function addStudySession() {
  const subject = document.getElementById("study-subject").value;
  const date = document.getElementById("study-date").value;
  const duration = document.getElementById("study-duration").value;

  if (!subject || !date || !duration) return;

  const log = getStudyLog();
  log.push({ subject, date, duration });
  saveStudyLog(log);
  displayStudyLog();
  document.getElementById("study-form").reset();
}

function deleteStudySession(index) {
  const confirmDelete = window.confirm("Delete this study session?");
  if (!confirmDelete) return;

  const log = getStudyLog();
  log.splice(index, 1);
  saveStudyLog(log);
  displayStudyLog();
}
window.deleteStudySession = deleteStudySession;

/* *********************************
    Display Study Log
** ********************************/
function displayStudyLog() {
  const log = getStudyLog();
  const tbody = document.querySelector("#study-table tbody");
  if (!tbody) return;
  tbody.innerHTML = log
    .map(
      (s, i) => `
        <tr>
            <td>${s.subject}</td>
            <td>${s.date}</td>
            <td>${s.duration}</td>
            <td>
                <button onclick="deleteStudySession(${i})">Delete</button>
            </td>
        </tr>
    `
    )
    .join("");
}

/* *********************************
    Dashboard
** ********************************/

function getUpcomingAssignments(days = 7) {
  const assignments = getAssignments();
  const now = new Date();
  const soon = new Date();
  soon.setDate(now.getDate() + days);
  return assignments.filter((a) => {
    const due = new Date(a.dueDate);
    return !a.completed && due >= now && due <= soon;
  });
}

function getPastAssignments() {
  const assignments = getAssignments();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return assignments.filter((a) => {
    const due = new Date(a.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < now;
  });
}

function getAcademicProgress() {
  const assignments = getAssignments();
  const total = assignments.length;
  const completed = assignments.filter((a) => a.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent };
}
