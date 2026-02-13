(() => {
  "use strict";

  /* ================================
     CONFIG
  ================================= */
  const CONFIG = {
    currentVersion: "1.0",
    versionUrl:
      "https://raw.githubusercontent.com/ivysone/Will-you-be-my-Valentine-/main/version.json",
    animationDelay: 250,
    yesScaleFactor: 1.5,
  };

  /* ================================
     STATE
  ================================= */
  let messageIndex = 0;
  let firstAttempt = true;

  const messages = [
    "Are you sure?",
    "Really sure??",
    "Are you positive?",
    "Pleaseee.....",
    "Just think about it!",
    "If you say no, I will be really sad...",
    "I will be very sad...",
    "I will be very very very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, say yes please! ❤️",
  ];

  /* ================================
     DOM CACHE (safe)
  ================================= */
  const dom = {
    customAlert: document.getElementById("customAlert"),
    alertMessage: document.getElementById("alertMessage"),
    alertOk: document.getElementById("alertOk"),
    noButton: document.querySelector(".no-button"),
    yesButton: document.querySelector(".yes-button"),
  };

  /* ================================
     UTIL
  ================================= */
  function safeNumber(value, fallback = 16) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function isElement(el) {
    return el instanceof HTMLElement;
  }

  /* ================================
     CUTE ALERT SYSTEM
  ================================= */
  function showCuteAlert(message) {
    if (!isElement(dom.customAlert) || !isElement(dom.alertMessage)) {
      console.warn("Custom alert elements missing.");
      return;
    }

    dom.alertMessage.textContent = message;
    dom.customAlert.classList.remove("hidden");

    // trigger animation safely
    requestAnimationFrame(() => {
      dom.customAlert.classList.add("show");
    });
  }

  function hideCuteAlert() {
    if (!isElement(dom.customAlert)) return;

    dom.customAlert.classList.remove("show");

    setTimeout(() => {
      dom.customAlert.classList.add("hidden");
    }, CONFIG.animationDelay);
  }

  /* ================================
     VERSION CHECK (robust)
  ================================= */
  async function checkForUpdates() {
    try {
      const response = await fetch(CONFIG.versionUrl, {
        cache: "no-store",
      });

      if (!response.ok) {
        console.warn("Could not fetch version information.");
        return;
      }

      const data = await response.json();
      const latestVersion = data?.version;
      const updateMessage = data?.updateMessage;

      if (!latestVersion) return;

      if (CONFIG.currentVersion !== latestVersion) {
        showCuteAlert(updateMessage || "New update available!");
      } else {
        console.log("You are using the latest version.");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  }

  /* ================================
     BUTTON LOGIC
  ================================= */
  function handleNoClick() {
    showCuteAlert("oops, wrong answer");

    if (isElement(dom.noButton)) {
      dom.noButton.textContent = messages[messageIndex];
      messageIndex = (messageIndex + 1) % messages.length;
    }

    if (isElement(dom.yesButton)) {
      const currentSize = safeNumber(
        window.getComputedStyle(dom.yesButton).fontSize,
        16
      );

      dom.yesButton.style.fontSize =
        currentSize * CONFIG.yesScaleFactor + "px";

      dom.yesButton.focus();
    }
  }

  function handleYesClick() {
    if (firstAttempt) {
      firstAttempt = false;
      window.location.href = "yes_page2.html";
    } else {
      window.location.href = "yes_page.html";
    }
  }

  /* ================================
     INIT
  ================================= */
  function init() {
    // bind alert button
    if (isElement(dom.alertOk)) {
      dom.alertOk.addEventListener("click", hideCuteAlert);
    }

    // bind main buttons
    if (isElement(dom.noButton)) {
      dom.noButton.addEventListener("click", handleNoClick);
    }

    if (isElement(dom.yesButton)) {
      dom.yesButton.addEventListener("click", handleYesClick);
    }

    // check update (non-blocking)
    checkForUpdates();
  }

  /* ================================
     BOOT
  ================================= */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
