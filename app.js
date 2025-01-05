const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");

let questions = [];
let currentQuestionIndex = 0;

// Load questions
fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
        questions = data.sort(() => Math.random() - 0.5).slice(0, 10);
        showQuestion();
    });

function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionContainer.innerHTML = `
        <p class="question"><strong>Question ${currentQuestionIndex + 1}:</strong> ${question.question}</p>
        <p class="answer" style="display: none;"><strong>Answer:</strong> ${question.answer}</p>
    `;
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        alert("You've completed the quiz!");
        currentQuestionIndex = 0;
        showQuestion();
    }
});

// Register service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker Registered"));
}

// Notification setup
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

function sendNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Time to practice DevOps Flashcards!");
    }
}

// Send a daily notification
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 8 && now.getMinutes() === 0) { // Example: notify at 8 AM
        sendNotification();
    }
}, 60000);
