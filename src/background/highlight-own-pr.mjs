chrome.tabs.onUpdated.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: highlightOwnPr,
  });
});

chrome.tabs.onActivated.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: highlightOwnPr,
  });
});

function highlightOwnPr() {
  const prsOpenedBy = document.querySelectorAll(".js-navigation-item .opened-by");
  const userLogin = document.querySelector("[name=user-login]").content;

  prsOpenedBy.forEach(pr => {
    if (pr.innerHTML.includes(userLogin)) {
      pr.parentElement?.parentElement?.firstElementChild?.style.setProperty("color", "var(--color-accent-emphasis)", "important");
    }
  });
}