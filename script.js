// Admin Login Function
function loginAdmin() {
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  const message = document.getElementById("loginMessage");

  // Dummy Credentials
  const validUsername = "admin";
  const validPassword = "admin123";

  if (username === validUsername && password === validPassword) {
    message.style.color = "green";
    message.textContent = "Login successful! Redirecting...";
    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = "dashboard.html"; // Replace with your dashboard page
    }, 1500);
  } else {
    message.style.color = "red";
    message.textContent = "Invalid credentials!";
  }
}
