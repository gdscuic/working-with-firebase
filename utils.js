// generate random uuid
// https://stackoverflow.com/a/2117523
export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

// generate random hex color
// https://stackoverflow.com/a/5092872
export function getRandomHexColor() {
  return "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
}

// generate random name
export function generateRandomUsername() {
  const adjectives = [
    "happy",
    "clever",
    "colorful",
    "brave",
    "gentle",
    "playful",
    "silly",
    "sleepy",
    "funny",
    "curious",
    "friendly",
  ];
  const nouns = [
    "beaver",
    "dragon",
    "star",
    "wizard",
    "robot",
    "snail",
    "bard",
    "dog",
    "cat",
    "fox",
    "penguin",
    "dinosaur",
    "machine",
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective} ${randomNoun}`;
}

// return given timestamp in a friendly relative time text format
export function friendlyRelativeTime(timestamp) {
  const now = new Date();
  const seconds = (now.getTime() - timestamp) / 1000;
  if (seconds < 60) {
    return `${Math.round(seconds)} seconds ago`;
  } else if (seconds < 60 * 60) {
    return `${Math.round(seconds / 60)} minutes ago`;
  } else if (seconds < 60 * 60 * 24) {
    return `${Math.round(seconds / 60 / 60)} hours ago`;
  } else {
    return `${Math.round(seconds / 60 / 60 / 24)} days ago`;
  }
}

const templateUserCard = document.getElementById("template-user-card");
const templateQuestionCard = document.getElementById("template-question-card");

const userListElement = document.getElementById("user-list");
const questionListElement = document.getElementById("question-grid");

export function addUserToList(name, color) {
  const newUserCard = templateUserCard.cloneNode(true);

  newUserCard.removeAttribute("id");

  newUserCard.querySelector(".username-field").innerText = name;
  newUserCard.style.setProperty("--user-color", color);

  userListElement.appendChild(newUserCard);
}

export function addQuestionToList(id, text, timestamp, userName) {
  const newQuestionCard = templateQuestionCard.cloneNode(true);

  newQuestionCard.setAttribute("id", id);

  newQuestionCard.querySelector(".question-text").innerText = text;
  const newTimestampElement = newQuestionCard.querySelector(".question-timestamp");
  newTimestampElement.setAttribute("data-timestamp", timestamp);
  newTimestampElement.innerText = friendlyRelativeTime(timestamp);

  if (userName) {
    newQuestionCard.querySelector(".question-name").innerText = userName + " asks:";
  } else {
    newQuestionCard.querySelector(".question-name").innerText = "\t";
  }

  questionListElement.appendChild(newQuestionCard);
}

export function setUserNameOnQuestion(id, userName) {
  const questionCard = document.getElementById(id);

  if (!questionCard) {
    return;
  }

  questionCard.querySelector(".question-name").innerText = userName + " asks:";
}

export function clearUserList() {
  userListElement.innerHTML = "";
}

export function clearQuestionList() {
  questionListElement.innerHTML = "";
}

// debug layout stuff
// for (let i = 0; i < 20; i++) {
//   addUserToList(getRandomUsername(), getRandomHexColor());
// }

// for (let i = 0; i < 20; i++) {
//   addQuestionToList("This is a sample question", Date.now() - Math.random() * 10000000000);
// }

// update all timestamps every second
setInterval(() => {
  const timestamps = document.querySelectorAll(".question-timestamp");

  timestamps.forEach((timestamp) => {
    const timestampValue = timestamp.getAttribute("data-timestamp");
    const friendlyTimestamp = friendlyRelativeTime(timestampValue);
    timestamp.innerText = friendlyTimestamp;
  });
}, 1000);
