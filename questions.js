// Importing the functions we need from Firebase SDKS
import {
  ref,
  onValue,
  push,
  get,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { db, firestore, auth } from "./firebase.js";
import { clearQuestionList, addQuestionToList, setUserNameOnQuestion } from "./utils.js";

//
// TODO create a reference to the questions list in the database
//

// this function gets passed the question text from the form
// this is where we'll add it to the database
//
function handleQuestionSubmission(questionText) {
  // TODO use the push function to add the question to the database
  // the questions should have the following fields:
  // - text: the question text
  // - timestamp: the current server time
  // 
}

// grab questions from database and update the ui
// 
// TODO use onValue to grab the questions from the database
// https://firebase.google.com/docs/database/web/read-and-write#read_data
// clear the question list to reset the UI and then add each question to the list
//

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

// intercept form submission and add question to database
const questionFormElement = document.getElementById("question-form");
questionFormElement.addEventListener("submit", async (e) => {
  e.preventDefault();
  const questionInputElement = document.getElementById("question-input");
  const questionText = questionInputElement.value;
  questionInputElement.value = "";

  handleQuestionSubmission(questionText);
});
