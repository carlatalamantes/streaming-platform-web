"use strict";
getUsers();

async function getUsers() {
  let response = await usersHandler(urlAPI, localStorage.getItem("token"));
  if (response.status == 200) {
    localStorage.setItem("userlistAdmin", JSON.stringify(response.message));
    return userListToHtml(response.message);
  } else {
    return userListToHtml([]);
  }
}

function userToHtml(user) {
  return `
    <tr>
        <td>${user.name}</td>
        <td>${user.lastname}</td>
        <td>@${user.email}</td>
        <td> 
        <button onClick="deleteUser('${user._id}')">
        Eliminar
        </button>
      </td>
    </tr>
    `;
}

async function userListToHtml(users) {
  let container = document.getElementById("tableBody");
  container.innerHTML = users.map(userToHtml);
}

async function deleteUser(userId) {
  let response = await deletuserbyidHandler(
    urlAPI,
    localStorage.getItem("token"),
    userId
  );

  if (response.status == 200) {
    window.alert(response.message.message);
    window.location.reload();
  } else {
    window.alert(response.message.error);
  }
}

async function searchUser() {
  let value = document.getElementById("inpt_search").value;
  if (value == "") {
    getUsers();
    return;
  }

  let data = localStorage.getItem("userlistAdmin");
  let parsedData = JSON.parse(data);

  let filteredResults = [];
  parsedData.find((user) => {
    if (
      `${user.name.toLowerCase()} ${user.lastname.toLowerCase()}` ===
      value.toLowerCase()
    ) {
      filteredResults.push(user);
    }
  });

  if (filteredResults.length > 0) {
    userListToHtml(filteredResults);
  }
}
