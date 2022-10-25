// /* eslint-disable @typescript-eslint/restrict-template-expressions */

// /**
//  * Fields is an object mapping the names of the form inputs to the values typed in
//  * e.g. for createUser, fields has properites 'username' and 'password'
//  */

function viewAllCircles(fields) {
  fetch('/api/circles')
    .then(showResponse)
    .catch(showResponse);
}

function createNewCircle(fields) {
  console.log(fields);
  fields.members = JSON.parse(fields.members)
  fields.access = JSON.parse(fields.access)
  fetch('/api/circles', 
        {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteCircle(fields) {
    fetch(`/api/circles/${fields.circleId}`, 
        {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function addUserToCircle(fields) {
  console.log(fields)
  fetch(`/api/circles/modifymembers/${fields.circleId}/${fields.userId}`, 
        {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteUserFromCircle(fields) {
  console.log(fields)
  fetch(`/api/circles/modifymembers/${fields.circleId}/${fields.userId}`, 
        {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function addAccessToCircle(fields) {
  console.log(fields)
  fetch(`/api/circles/modifyaccess/${fields.circleId}/${fields.userId}`, 
        {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteAccessFromCircle(fields) {
  console.log(fields)
  fetch(`/api/circles/modifyaccess/${fields.circleId}/${fields.userId}`, 
        {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function leaveCircle(fields) {
  console.log(fields)
  fetch(`/api/circles/modifymyself/${fields.circleId}`, 
        {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}


