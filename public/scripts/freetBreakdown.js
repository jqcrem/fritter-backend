/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllFreetBreakdowns(fields) {
  fetch('/api/freetBreakdowns')
    .then(showResponse)
    .catch(showResponse);
}

function createNewFreetBreakdown(fields) {
  console.log(fields);
  fields.contents = JSON.parse(fields.contents)
  console.log(fields)
  fetch('/api/freetBreakdowns', 
        {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreetBreakdown(fields) {
    fetch(`/api/freetBreakdowns/${fields.freetBreakdownId}`, 
        {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function addContentToFreetBreakdown(fields) {
  console.log(fields)
  fetch(`/api/freetBreakdowns/modifycontent/${fields.freetBreakdownId}`, 
        {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreetFromFreetBreakdown(fields) {
  console.log(fields)
  fetch(`/api/freetBreakdowns/modify/${fields.freetBreakdownId}/${fields.freetId}`, 
        {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}


// function updateFriend(fields) {
//   fetch(`/api/freetBreakdowns/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
//     .then(showResponse)
//     .catch(ShowResponse);
// }

