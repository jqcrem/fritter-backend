/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function createNewFreetBreakdown(fields) {
  console.log(fields);
  fields.contents = JSON.parse(fields.contents)
  console.log(fields)
  fetch('/api/freetBreakdowns', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

// function updateFriend(fields) {
//   fetch(`/api/freetBreakdowns/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
//     .then(showResponse)
//     .catch(ShowResponse);
// }

