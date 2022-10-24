/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function followFriend(fields) {
  fetch('/api/friends/', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function updateFriend(fields) {
  fetch(`/api/friends/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(ShowResponse);
}

function getAllFollowers(fields) {
  fetch(`/api/friends/FOLLOWER`)
    .then(showResponse)
    .catch(ShowResponse);
}

function getAllFollowing(fields) {
  fetch(`/api/friends/FOLLOWING`)
    .then(showResponse)
    .catch(ShowResponse);
}

function getAllBlocked(fields) {
  fetch(`/api/friends/BLOCKED`)
    .then(showResponse)
    .catch(ShowResponse);
}

function blockUser(fields) {
  fetch(`/api/friends/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unblockUser(fields) {
  fetch(`/api/friends/un/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
  fetch(`/api/friends/un/${fields.id}`, {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
