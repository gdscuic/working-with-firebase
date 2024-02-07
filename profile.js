import { app, db, firestore, auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  uuidv4,
  getRandomHexColor,
  generateRandomUsername,
  addUserToList,
  clearUserList,
} from "./utils.js";
import {
  ref,
  set,
  onValue,
  onDisconnect,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

let userProfileData = {
  id: uuidv4(),
  username: generateRandomUsername(),
  color: getRandomHexColor(),
};

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  hd: "uic.edu",
});

function handleProfileFormSubmission(username, color) {
  userProfileData.username = username;
  userProfileData.color = color;
  console.log("UPDATING USER PROFILE", userProfileData);

  set(userProfileRef, userProfileData);
}

// implemented code from 
// https://firebase.google.com/docs/database/web/offline-capabilities#section-sample
const userProfileRef = ref(db, "connectedUsers/" + userProfileData.id);
const connectionStatusRef = ref(db, ".info/connected");
onValue(connectionStatusRef, (snap) => {
  if (snap.val() === true) {
    set(userProfileRef, userProfileData);
    onDisconnect(userProfileRef).remove();
  }
});

const connectedUserListRef = ref(db, "connectedUsers");
onValue(connectedUserListRef, (snapshot) => {
  clearUserList();

  // check if snapshot is null
  if (!snapshot.exists()) {
    return;
  }

  const connectedUsers = snapshot.val();

  console.log("CONNECTED USERS", connectedUsers);

  Object.values(connectedUsers).forEach((user) => {
    addUserToList(user.username, user.color);
  });
});

//
// references: 
// https://firebase.google.com/docs/auth/web/start#set_an_authentication_state_observer_and_get_user_data
// https://firebase.google.com/docs/reference/js/auth.user
//
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    console.log(user);

    hideAnonymousProfileUI();
    hideGoogleSignInButton();
    showGoogleSignOutButton();

    showGoogleProfileUI();
    showGoogleProfileInfo(user.displayName, user.email);

    userProfileData.username = user.displayName;
    userProfileData.id = user.uid;
    set(userProfileRef, userProfileData);
  } else {
    // user is NOT signed in
    showGoogleProfileUI();
    showGoogleSignInButton();
    hideGoogleSignOutButton();
    hideGoogleProfileInfo();

    showAnonymousProfileUI();
    createNewAnonymousData();
    set(userProfileRef, userProfileData);
  }
});

function handleSignIn() {
  //
  // references:
  // https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk
  //
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      console.log(credential, token, user);

      const usersRef = ref(db, "users/" + user.uid);
      set(usersRef, {
        name: user.displayName,
        email: user.email,
      });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log(errorCode, errorMessage, email, credential);
    });
}

function handleSignOut() {
  signOut(auth).catch(alert);
}

// ===== already implemented stuff
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// ----- no need to edit stuff below this line but feel free to reference it

const usernameInputElement = document.getElementById("username-input");
const userColorInputElement = document.getElementById("user-color-input");

function createNewAnonymousData() {
  userProfileData = {
    id: uuidv4(),
    username: generateRandomUsername(),
    color: getRandomHexColor(),
  };

  usernameInputElement.value = userProfileData.username;
  userColorInputElement.value = userProfileData.color;
}

// intercept form submission for user profile and update database info
const userProfileFormElement = document.getElementById("user-profile-editor");
userProfileFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = usernameInputElement.value.trim();
  usernameInputElement.value = username;

  if (!username.replace(/\s/g, "").length) {
    alert("Please enter a username");
    usernameInputElement.value = "";
    return;
  }

  const userColor = userColorInputElement.value;

  handleProfileFormSubmission(username, userColor);
});

const signInButtonElement = document.getElementById("google-signin-button");
const googleProfileName = document.getElementById("google-name");
const googleProfileEmail = document.getElementById("google-email");
const signOutButtonElement = document.getElementById("google-signout-button");

function showGoogleProfileInfo(name, email) {
  googleProfileName.innerText = name;

  googleProfileEmail.innerText = email;
}

// handle sign in with Google button
signInButtonElement.addEventListener("click", handleSignIn);

// handle sign out with Google button
signOutButtonElement.addEventListener("click", handleSignOut);

// ===== various UI helper functions
function showGoogleProfileUI() {
  document.getElementById("google-profile-wrapper").style.display = "block";
}

function showAnonymousProfileUI() {
  document.getElementById("user-profile-editor").style.display = "block";
}

function hideGoogleProfileUI() {
  document.getElementById("google-profile-wrapper").style.display = "none";
  googleProfileName.innerText = "";
  googleProfileEmail.innerText = "";
}

function hideAnonymousProfileUI() {
  document.getElementById("user-profile-editor").style.display = "none";
}

function showGoogleSignInButton() {
  signInButtonElement.style.display = "block";
}

function hideGoogleSignInButton() {
  signInButtonElement.style.display = "none";
}

function showGoogleSignOutButton() {
  signOutButtonElement.style.display = "block";
}

function hideGoogleSignOutButton() {
  signOutButtonElement.style.display = "none";
}

function hideGoogleProfileInfo() {
  googleProfileName.innerText = "";
  googleProfileEmail.innerText = "";
}
