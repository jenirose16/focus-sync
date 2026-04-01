chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const distractions = ["facebook.com", "instagram.com", "youtube.com", "netflix.com"];
    const isDistracted = distractions.some(site => tab.url.includes(site));

    console.log(isDistracted ? "Status: Distracted" : "Status: Focused");

    // This will eventually send data to your Backend
    fetch("http://localhost:5000/update-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: isDistracted ? "Distracted" : "Focused" })
    }).catch(err => console.log("Backend not running yet."));
  }
});