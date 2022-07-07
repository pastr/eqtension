const openGithubCommentButton = document.getElementById("open-comments");
const loadMoreCommentsButton = document.getElementById("load-more-comments");
const openJiraTicketButton = document.getElementById("open-jira-ticket");
const JiraTicketInput = document.getElementById("jira-ticket-input");

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

JiraTicketInput.addEventListener("input", (e) => {
  const jiraTicketPrefix = e.target.value;
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
  console.log("opening jira ticket...");
  const ticketNb = JiraTicketInput.value;
  console.log('🚀 ~ openJiraTicket ~ ticketNb', ticketNb);
  const jiraTicketRegex = /[A-Z]{2,}-\d+/g;
  const jiraUrl = "https://edgelab.atlassian.net/browse/";
  window.open(`${jiraUrl}${ticketNb}`, '_blank');
}