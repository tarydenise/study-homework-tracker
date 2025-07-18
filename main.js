/* ****************************************************
    temporary array for Subject dropdown to edit later
** ***************************************************/
const subjects = ["Math", "Science", "English", "History", "Art"];

/* ********************
    Variables
** ********************/
let editingIndex = null;

/* ***************************
    Handle nav links to pages
** **************************/
function showDashboard() {
  document.getElementById("app").innerHTML = `
        <h1>Dashboard</h1>
        <p>Welcome to your Study & Homework Tracker!</p>
    `;
}

function showAssignments() {
  document.getElementById("app").innerHTML = `
        <h1>Assignments</h1>
        <form id="assignment-form">
            <input type="text" id="assignment-title" placeholder="Title" required>
            <select id="assignment-subject" required>
            <option value="">Select Subject</option>
            ${subjects
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
  document.getElementById("app").innerHTML = `
        <h1>Study Log</h1>
        <form id="study-form">
            <select id="study-subject" required>
              <option value="">Select Subject</option>
              ${subjects
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
  document.getElementById("app").innerHTML = `
        <h1>Calendar</h1>
        <p>Your calendar will appear here.</p>
    `;
}

function showSettings() {
  document.getElementById("app").innerHTML = `
        <h1>Settings</h1>
        <p>Settings go here.</p>
    `;
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
Store Assignments in localStorage
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
  assignments.push({ title, subject, dueDate });
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
      if (i === editingIndex) {
        return `
                <tr>
                    <td><input type="date" id="edit-due" value="${
                      a.dueDate
                    }"></td>
                    <td>
                      <select id="edit-subject">
                        ${subjects
                          .map(
                            (subj) =>
                              `<option value="${subj}" ${
                                a.subject === subj ? "selected" : ""
                              }>${subj}</option>`
                          )
                          .join("")}
                      </select>
                    </td>
                    <td><input type="text" id="edit-title" value="${
                      a.title
                    }"></td>
                    <td>
                        <button onclick="saveEdit(${i})">Save</button>
                        <button onclick="cancelEdit()">Cancel</button>
                    </td>
                </tr>
            `;
      } else {
        // Normal row
        return `
                <tr>
                    <td>${a.dueDate}</td>
                    <td>${a.subject}</td>
                    <td>${a.title}</td>
                    <td>
                        <button onclick="editAssignment(${i})">Edit</button>
                        <button onclick="deleteAssignment(${i})">Delete</button>
                    </td>
                </tr>
            `;
      }
    })
    .join("");
}

window.deleteAssignment = deleteAssignment;

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

  assignments[index] = {
    dueDate: newDue,
    subject: newSubject,
    title: newTitle,
  };
  saveAssignments(assignments);
  editingIndex = null;
  displayAssignments();
}
window.saveEdit = saveEdit;

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
