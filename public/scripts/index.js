// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'view-all-circles': viewAllCircles,
  'create-new-circle': createNewCircle,
  'delete-circle': deleteCircle,
  'add-user-to-circle': addUserToCircle,
  'delete-user-from-circle': deleteUserFromCircle,
  'add-access-to-circle': addAccessToCircle,
  'delete-access-from-circle': deleteAccessFromCircle,
  'leave-circle': leaveCircle,
  'get-all-users': getAllUsers,
  'get-all-followers': getAllFollowers,
  'get-all-following': getAllFollowing,
  'get-all-blocked': getAllBlocked,
  'block-user': blockUser,
  'unblock-user': unblockUser,
  'unfollow-user': unfollowUser,
  'create-alias': createAlias,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'follow-friend': followFriend,
  'update-friend': updateFriend,
  'get-aliases': getMyAliases,
  'update-access-key': updateAccessKey,
  'create-new-freet-breakdown': createNewFreetBreakdown,
  'view-all-freet-breakdowns': viewAllFreetBreakdowns,
  'delete-freet-breakdown': deleteFreetBreakdown,
  'add-content-to-freet-breakdown': addContentToFreetBreakdown,
  'delete-freet-from-freet-breakdown': deleteFreetFromFreetBreakdown,
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      console.log(Object.fromEntries(formData.entries()));
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
