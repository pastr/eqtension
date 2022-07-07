const openGithubCommentButton = document.getElementById("open-comments");
const loadMoreCommentsButton = document.getElementById("load-more-comments");
const openJiraTicketButton = document.getElementById("open-jira-ticket");
const jiraTicketPrefixInput = document.getElementById("jira-ticket-prefix");
const jiraTicketInput = document.getElementById("jira-ticket-input");

let jiraTicketPrefix = "";
jiraTicketInput.focus();

chrome.storage.sync.get(['jiraTicketPrefix'], function(result) {
  jiraTicketPrefixInput.value = result.jiraTicketPrefix === undefined ? "" : result.jiraTicketPrefix;
  jiraTicketPrefix = result.jiraTicketPrefix;
});

openGithubCommentButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: openGithubComment,
  });
});

loadMoreCommentsButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: loadMoreComments,
  });
});

openJiraTicketButton.addEventListener("click", async () => {
  openJiraTicket();
});

jiraTicketPrefixInput.addEventListener("input", (e) => {
  jiraTicketPrefix = e.target.value;
  chrome.storage.sync.set({ jiraTicketPrefix });
});


// functions

function openGithubComment() {
  console.log("opening comments...");
  document.querySelectorAll('.js-resolvable-timeline-thread-container').forEach(e => { e.setAttribute('open', ''); });
}

function loadMoreComments() {
  console.log("loading more comments...");
  const ajaxButtons = document.querySelectorAll('.ajax-pagination-btn');
  for (const ajaxButton of ajaxButtons) {
    ajaxButton.click();
  }

  setTimeout(() => {
    if (ajaxButtons.length > 0) {
      loadMoreComments();
      // openGithubComment(); doesn't work
      document.querySelectorAll('.js-resolvable-timeline-thread-container').forEach(e => { e.setAttribute('open', ''); });
    }
  }, 1500);
}

function openJiraTicket() {
  const ticketNb = jiraTicketInput.value;
  const fullTicket = `${jiraTicketPrefix}-${ticketNb}`;
  const jiraTicketRegex = /[A-Z]{2,}-\d+/g;
  const jiraUrl = "https://edgelab.atlassian.net/browse/";

  window.open(`${jiraUrl}${fullTicket}`, '_blank');
}