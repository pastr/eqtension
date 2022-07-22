chrome.tabs.onUpdated.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: selectAllLinks,
  });
});

chrome.tabs.onActivated.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: selectAllLinks,
  });
});

function selectAllLinks() {
  const jiraTicketRegex = /[A-Z]{2,}-\d+/g;
  const jiraUrl = "https://edgelab.atlassian.net/browse/";

  const links = document.querySelectorAll(".js-issue-title");

  for (const link of links) {
    const ticketNbArray = link.innerText.match(jiraTicketRegex);
    if (ticketNbArray) {
      const ticketNb = ticketNbArray[0];
      const ticketLinkElement = document.createElement("a");
      ticketLinkElement.href = jiraUrl + ticketNb;
      ticketLinkElement.innerText = link.innerText;
      link.replaceWith(ticketLinkElement);
    }
  }
}
