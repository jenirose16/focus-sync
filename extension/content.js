// This script runs inside every tab the user opens
console.log("FocusSync Guardian: Content Script Active");

/**
 * Checks if the current website is on the blocklist
 */
function checkCurrentSite() {
  const blockedSites = [
    "facebook.com", 
    "instagram.com", 
    "youtube.com", 
    "netflix.com", 
    "twitter.com"
  ];
  
  const hostname = window.location.hostname;
  const isDistraction = blockedSites.some(site => hostname.includes(site));

  if (isDistracted) {
    console.warn("Distraction detected! Reporting to FocusSync...");
    
    // Send a message to background.js
    chrome.runtime.sendMessage({
      type: "STATUS_UPDATE",
      status: "Distracted",
      site: hostname
    });

    // Optional: Visual feedback (Adds a red border to the page)
    document.body.style.border = "10px solid #e74c3c";
  } else {
    // Report focused status
    chrome.runtime.sendMessage({
      type: "STATUS_UPDATE",
      status: "Focused",
      site: hostname
    });
    
    // Optional: Visual feedback (Adds a green border to the page)
    document.body.style.border = "10px solid #2ecc71";
  }
}

// Run the check as soon as the page loads
checkCurrentSite();