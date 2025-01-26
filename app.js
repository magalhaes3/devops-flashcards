const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");

let questions = [];
let currentQuestionIndex = 0;
let deferredPrompt;

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

// Handle PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button or prompt
    showInstallPrompt();
});

function showInstallPrompt() {
    // You can add a button to your UI here
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    installButton.classList.add('install-button');
    document.body.appendChild(installButton);

    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                await registerPeriodicNotification();
            }
            // Clear the deferredPrompt variable
            deferredPrompt = null;
            // Hide the install button
            installButton.style.display = 'none';
        }
    });
}

async function registerPeriodicNotification() {
    try {
        const registration = await navigator.serviceWorker.ready;
        
        // Request notification permission
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('Notification permission denied');
                return;
            }
        }

        // Register periodic sync if supported
        if ('periodicSync' in registration) {
            try {
                await registration.periodicSync.register('daily-notification', {
                    minInterval: 24 * 60 * 60 * 1000, // 24 hours
                });
                console.log('Periodic sync registered successfully');
            } catch (error) {
                console.log('Periodic sync could not be registered:', error);
            }
        }
    } catch (error) {
        console.log('Error setting up notifications:', error);
    }
}

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('ServiceWorker registration successful');
        } catch (error) {
            console.log('ServiceWorker registration failed:', error);
        }
    });
}

// Notification setup
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

// Test notification every 5 seconds
function sendNotification() {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Time to practice DevOps Flashcards!", {
            icon: '/assets/icons/favicon-32x32.png'
        });
    }
}
