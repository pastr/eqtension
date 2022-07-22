import { getUserId } from '../shared/utils.mjs';

const addGithubUserButton = document.getElementById("add-github-reviewers");
const githubUserInput = document.getElementById("github-username");
const githubUsersList = document.querySelector(".selected-github-user");

let users = {};

function updateGithubUsernameList() {
  const githubUsersListChild = githubUsersList.firstElementChild;
  const newList = document.createElement("ul");

  chrome.storage.sync.get('users', (val) => {
    users = val.users;
    console.log('🚀 ~ chrome.storage.sync.get ~ users', users);
    const githubUsernames = Object.keys(users);

    if (githubUsernames.length > 0) {
      githubUsernames.forEach(githubUser => {
        const listItem = document.createElement("li");
        const usernameSpan = document.createElement("span");
        const removeButton = document.createElement("button");
        usernameSpan.innerText = githubUser;
        removeButton.innerText = "x";
        removeButton.dataset.removeUser = githubUser;
        listItem.appendChild(usernameSpan);
        listItem.appendChild(removeButton);
        newList.appendChild(listItem);
      });

      if (githubUsersListChild) {
        githubUsersListChild.replaceWith(newList);
      } else {
        githubUsersList.appendChild(newList);
      }
    } else {
      const emptyList = document.createElement("p");
      emptyList.innerText = "No users added yet";

      if (githubUsersListChild) {
        githubUsersListChild.replaceWith(emptyList);
      } else {
        githubUsersList.appendChild(emptyList);
      }
    }
  });
}

githubUserInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addGithubUser();
  }
});


// Remove user from the list
githubUsersList.addEventListener("click", (e) => {
  if (e.target.dataset.removeUser) {
    console.log('hell yeah', e.target);
    delete users[e.target.dataset.removeUser];
    chrome.storage.sync.set({ users }, () => {
      updateGithubUsernameList();
    });
  }

});

async function addGithubUser() {
  const username = githubUserInput.value;
  addGithubUserButton.disabled = true;
  addGithubUserButton.innerText = "Loading...";

  const userId = await getUserId(username);
  chrome.storage.sync.set({ users: { ...users, [username]: userId } }, () => {
    updateGithubUsernameList();
    addGithubUserButton.disabled = false;
    addGithubUserButton.innerText = "Add";
    githubUserInput.value = '';
    githubUserInput.focus();
  });
}

// Add user to the list
addGithubUserButton.addEventListener("click", addGithubUser);


// Init
updateGithubUsernameList();
