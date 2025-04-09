const CORRECT_PASSWORD = "bank123";
let currentOTP = "";

function resendOTP(type) {
  currentOTP = generateOTP();
  alert(`OTP sent to your phone: ${currentOTP}`);
  document.getElementById(`${type}Otp`).value = "";
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("depositForm")) {
    document.getElementById("depositForm").addEventListener("submit", function (e) {
      e.preventDefault();
      handleTransaction("deposit");
    });
  }

  if (document.getElementById("withdrawForm")) {
    document.getElementById("withdrawForm").addEventListener("submit", function (e) {
      e.preventDefault();
      handleTransaction("withdraw");
    });
  }
});

function handleTransaction(type) {
  const password = document.getElementById(`${type}Password`).value;
  const otpSection = document.getElementById(`${type}OtpSection`);
  const enteredOTP = document.getElementById(`${type}Otp`).value;

  if (otpSection.style.display !== "block") {
    if (password === CORRECT_PASSWORD) {
      completeTransaction(type);
    } else {
      otpSection.style.display = "block";
      currentOTP = generateOTP();
      alert(`OTP sent: ${currentOTP}`);
    }
  } else {
    if (enteredOTP === currentOTP) {
      completeTransaction(type);
    } else {
      alert("Incorrect OTP.");
    }
  }
}

function completeTransaction(type) {
  const amount = document.getElementById(`${type}Amount`).value;
  const method = document.getElementById(`${type}Type`).value;
  alert(`${type === "deposit" ? "Deposit" : "Withdrawal"} Successful!\nAmount: ₹${amount}\nMethod: ${method}`);
  window.location.href = "index.html";
}
