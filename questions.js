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

const questionsListRef = ref(db, "questions");

// this function gets passed the question text from the form
// this is where we'll add it to the database
function handleQuestionSubmission(questionText) {
  const dataToSet = {
    text: questionText,
    timestamp: serverTimestamp(),
  };

  push(questionsListRef, dataToSet).catch((err) => {
    console.error("ERROR SUBMITTING QUESTION", err);
    alert("Error submitting question");
  });
}

// grab questions from database and update the ui
onValue(questionsListRef, (snapshot) => {
  if (!snapshot.exists()) {
    return;
  }

  clearQuestionList();

  const questions = snapshot.val();
  console.log("QUESTIONS", questions);
  const questionIds = Object.keys(questions);

  questionIds.forEach((questionId) => {
    const question = questions[questionId];

    addQuestionToList(questionId, question.text, question.timestamp);
  });
});

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
