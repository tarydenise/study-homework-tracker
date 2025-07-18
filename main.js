function showDashboard() {
  document.getElementById("app").innerHTML = `
        <h1>Dashboard</h1>
        <p>Welcome to your Study & Homework Tracker!</p>
    `;
}

function showAssignments() {
  document.getElementById("app").innerHTML = `
        <h1>Assignments</h1>
        <p>Your list of assignments will appear here.</p>
    `;
}

function showStudyLog() {
  document.getElementById("app").innerHTML = `
        <h1>Study Log</h1>
        <p>Your study sessions will appear here.</p>
    `;
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
