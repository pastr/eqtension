chrome.tabs.onUpdated.addListener(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: requestToAddReviewers,
  });
});

// It should work but probably needs improvements
function requestToAddReviewers() {
  const authenticity_token = document.querySelector("#partial-discussion-sidebar > div.discussion-sidebar-item.sidebar-assignee.js-discussion-sidebar-item.position-relative > form > input[type=hidden]").value;
  const menu = document.querySelector(".select-menu-divider.js-divider-suggestions");
  const githubOrganization = window.location.pathname.split("/")[1];
  const githubRepo = window.location.pathname.split("/")[2];
  const githubPrNumber = window.location.pathname.split("/")[4];
  const prUrl = `https://github.com/${githubOrganization}/${githubRepo}/pull/${githubPrNumber}`;

  console.log("window.location.pathname", window.location.pathname);

  if (menu.childElementCount === 0) {
    const addBenzeneReviewersButton = document.createElement("button");
    const benzeneReviewersButtonContainer = document.createElement("div");

    benzeneReviewersButtonContainer.style.display = "flex";
    benzeneReviewersButtonContainer.style.justifyContent = "center";
    benzeneReviewersButtonContainer.style.marginTop = '12px';
    benzeneReviewersButtonContainer.style.marginBottom = '12px';

    addBenzeneReviewersButton.innerText = "Add Benzene Reviewers";
    addBenzeneReviewersButton.classList.add("btn", "btn-primary");

    benzeneReviewersButtonContainer.appendChild(addBenzeneReviewersButton);
    menu.appendChild(benzeneReviewersButtonContainer);

    const benzeneGrp = 5146712;
    const Neevalt = 37702867;
    const rmencattini = 48673773;
    const lbevo = 104770958;
    const Luvooda = 102238515;
    const AdrianAbramczyk = 72611719;
    const Svreber = 2393978;
    const haxos = 28428558;
    const burgyl = 29167147;
    const pastr = 6838136;

    const benzeneUsers = [Neevalt, rmencattini, lbevo, Luvooda, AdrianAbramczyk, Svreber, haxos, burgyl, pastr];

    const formData = new FormData();
    formData.set('authenticity_token', authenticity_token);
    formData.set('dummy-field-just-to-avoid-empty-submit', "foo");
    benzeneUsers.forEach(user => {
      formData.append('reviewer_user_ids[]', user);
    });

    const headers = new Headers();
    headers.append("accept", "text/html");
    headers.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7");
    headers.append("cache-control", "no-cache");
    // headers.append("Content-Type", "multipart/form-data"); // If we set the content type ourselves then the boundary between the header and the body won't match. Not specifying the type is the correct solution
    // headers.append("boundary", "----WebKitFormBoundaryCcdd7oA4m3hnVkg5");
    headers.append("pragma", "no-cache");
    headers.append("sec-ch-ua", "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"");
    headers.append("sec-ch-ua-mobile", "?0");
    headers.append("sec-ch-ua-platform", "\"macOS\"");
    headers.append("sec-fetch-dest", "empty");
    headers.append("sec-fetch-mode", "cors");
    headers.append("sec-fetch-site", "same-origin");
    headers.append("x-requested-with", "XMLHttpRequest");

    addBenzeneReviewersButton.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      console.log("formData", formData);
      formData.forEach((key, value) => {
        console.log(key, value);
      });

      fetch(`${prUrl}/review-requests`, {
        "headers": headers,
        "referrer": prUrl,
        "referrerPolicy": "strict-origin-when-cross-origin",
        body: formData,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      }).then(res => {
        console.log(res);
      });

    });
  }
}