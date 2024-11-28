let email = '';
let candidateName = '';
let timer;
let timeLeft = 10; // 10 seconds for the countdown before starting the test

// Login Button Click Handler
document.getElementById("start-test-btn").addEventListener("click", () => {
    email = document.getElementById('email').value;

    // Clear previous error messages
    const errorMessageElement = document.getElementById("login-error");
    errorMessageElement.innerText = "";
    errorMessageElement.style.display = 'none';  // Hide the error message initially

    // If email is not provided, show an error message
    if (!email) {
        errorMessageElement.innerText = "Please enter a valid email.";
        errorMessageElement.style.display = 'block'; // Show error message
        return;
    }

    console.log("Sending login request for email:", email);

    // Send the email to the backend for authentication
    fetch('/check-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })  // Send email as JSON
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            // Candidate is eligible to take the test
            console.log("Login successful. Candidate name:", data.name);
            candidateName = data.name;
            document.getElementById('candidate-name').innerText = candidateName;
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('start-test-page').style.display = 'block'; // Show Start Test Page
            startCountdown();  // Start the countdown timer before starting the test
        } else if (data.status === 'error') {
            // If error is returned from backend (e.g. test already taken), display the message
            errorMessageElement.innerText = data.message;
            errorMessageElement.style.display = 'block'; // Show error message
            return;  // Don't proceed if error occurs
        }
    })
    .catch(err => {
        console.error("Error during login request:", err);
        const errorMessageElement = document.getElementById("error-message");
        errorMessageElement.innerText = "An error occurred while logging in. Please try again.";
        errorMessageElement.style.display = 'block'; // Show error message
    });
});

// Start the countdown timer
function startCountdown() {
    const countdownElement = document.getElementById("countdown-timer");
    const startTestBtn = document.getElementById("start-test-manually");

    countdownElement.innerText = `${timeLeft}s`; // Set initial time

    timer = setInterval(() => {
        timeLeft--;
        countdownElement.innerText = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the countdown
            startTest(); // Auto start the test
        }
    }, 1000);

    // Manual button to start the test
    startTestBtn.addEventListener('click', () => {
        clearInterval(timer); // Stop countdown
        startTest(); // Start test manually
    });
}

//Security Measure Code Part

// let isTestActive = false;

// Function to start the test
function startTest() {
    document.getElementById('start-test-page').style.display = 'none';  // Hide Start Test Page
    document.getElementById('test-container').style.display = 'block';  // Show Test Page
    startTimer();  // Start the test timer
    displayQuestions();  // Display questions
    document.getElementById('submit-test-btn').style.display = 'block'; // Ensure Submit Test button is visible
    isTestActive = true;
}

// Test Timer (10 minutes)
function startTimer() {
    let timeLeft = 10 * 60; // 10 minutes in seconds
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("timer").innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitTest();  // Submit test when time's up
        }
    }, 1000);
}


const questions = [
    { question: "1. What is the primary purpose of a Business Requirements Document (BRD)?", options: ["a) To define the technical architecture
", "b) To describe the scope of the business process", "c) To outline the functional and non-functional requirements of a project", "d) To create a project timeline"], correctAnswer: "c) To outline the functional and non-functional requirements of a project" },
    { "question": "1. What is the primary role of a Business Analyst?", "options": ["a) To write code for software", "b) To analyze and improve business processes", "c) To manage financial accounts", "d) To design marketing campaigns"], "correctAnswer": "b) To analyze and improve business processes" },
  { "question": "2. Which of the following is a common responsibility of a Business Analyst?", "options": ["a) Designing websites", "b) Writing software code", "c) Gathering and documenting business requirements", "d) Managing payrolls"], "correctAnswer": "c) Gathering and documenting business requirements" },
  { "question": "3. What is the purpose of process mapping?", "options": ["a) To create project timelines", "b) To improve and optimize business processes", "c) To develop software", "d) To design websites"], "correctAnswer": "b) To improve and optimize business processes" },
  { "question": "4. Which tool is commonly used by Business Analysts to create process maps?", "options": ["a) PowerPoint", "b) JIRA", "c) Microsoft Visio", "d) Excel"], "correctAnswer": "c) Microsoft Visio" },
  { "question": "5. What is the main goal of data analysis in business?", "options": ["a) To improve business decisions and identify opportunities", "b) To design marketing ads", "c) To write software code", "d) To create presentations"], "correctAnswer": "a) To improve business decisions and identify opportunities" },
  { "question": "6. Which of the following is NOT typically used in data analysis?", "options": ["a) Excel", "b) Power BI", "c) JIRA", "d) Tableau"], "correctAnswer": "c) JIRA" },
  { "question": "7. What is the first step in gathering business requirements?", "options": ["a) Writing code", "b) Identifying stakeholders", "c) Creating the final product", "d) Designing solutions"], "correctAnswer": "b) Identifying stakeholders" },
  { "question": "8. What is the best way to collect business requirements from stakeholders?", "options": ["a) Surveys and interviews", "b) Writing code", "c) Creating project plans", "d) Designing prototypes"], "correctAnswer": "a) Surveys and interviews" },
  { "question": "9. What document outlines the technical details of a solution?", "options": ["a) Business Requirements Document", "b) Functional Specifications Document", "c) Project Charter", "d) Meeting Minutes"], "correctAnswer": "b) Functional Specifications Document" },
  { "question": "10. What is the role of a Business Analyst in process improvement?", "options": ["a) To write software code", "b) To suggest ways to improve processes", "c) To manage finances", "d) To design graphics"], "correctAnswer": "b) To suggest ways to improve processes" },
  { "question": "11. What is the primary focus of a Business Analyst when designing solutions?", "options": ["a) Creating the technical architecture", "b) Aligning business needs with technical solutions", "c) Writing code", "d) Managing project budgets"], "correctAnswer": "b) Aligning business needs with technical solutions" },
  { "question": "12. What does the 'current state' represent in process mapping?", "options": ["a) The ideal process", "b) The existing process", "c) Future process improvements", "d) A draft version of the process"], "correctAnswer": "b) The existing process" },
  { "question": "13. Which project management tool is commonly used by Business Analysts?", "options": ["a) PowerPoint", "b) JIRA", "c) Excel", "d) Microsoft Word"], "correctAnswer": "b) JIRA" },
  { "question": "14. What is a Business Analyst’s role in ensuring project delivery?", "options": ["a) Writing code", "b) Tracking project milestones and working with teams", "c) Managing marketing strategies", "d) Developing the product design"], "correctAnswer": "b) Tracking project milestones and working with teams" },
  { "question": "15. How does a Business Analyst work with technical teams?", "options": ["a) Writing code for the product", "b) Acting as a liaison between business and technical teams", "c) Managing the project timeline", "d) Designing the user interface"], "correctAnswer": "b) Acting as a liaison between business and technical teams" },
  { "question": "16. Which skill is important for a Business Analyst to have when working with clients?", "options": ["a) Writing code", "b) Strong communication and interpersonal skills", "c) Designing user interfaces", "d) Creating marketing content"], "correctAnswer": "b) Strong communication and interpersonal skills" },
  { "question": "17. Why is it important for a Business Analyst to translate business needs into technical solutions?", "options": ["a) To create a marketing plan", "b) To develop solutions that meet both business and technical objectives", "c) To manage project budgets", "d) To write technical specifications"], "correctAnswer": "b) To develop solutions that meet both business and technical objectives" },
  { "question": "18. When gathering business requirements for a data analysis project, which of the following is most important to ensure the analysis is aligned with the client’s objectives?", "options": ["a) Defining data cleaning procedures", "b) Understanding the key business goals and metrics to be tracked", "c) Selecting the right visualization tool", "d) Ensuring the data is normalized"], "correctAnswer": "b) Understanding the key business goals and metrics to be tracked" }
];

// Display Test Questions
function displayQuestions() {

    shuffleArray(questions);

    const questionContainer = document.getElementById('question-container');
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        
        const questionText = document.createElement('p');
        questionText.innerText = `${index + 1}. ${question.question}`;
        questionDiv.appendChild(questionText);

        question.options.forEach(option => {
            const optionLabel = document.createElement('label');
            optionLabel.innerHTML = `<input type="radio" name="question${index}" value="${option}" /> ${option}`;
            questionDiv.appendChild(optionLabel);
        });

        questionContainer.appendChild(questionDiv);
    });
}

// Shuffle Array for random question options
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Swap
    }
}

// Add Event Listener to Submit Button
document.getElementById('submit-test-btn').addEventListener('click', () => {
    submitTest();
});

// Submit Test
function submitTest() {
    let score = 0;

    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedAnswer) {
        if (selectedAnswer.value === question.correctAnswer) {
            score++;
        }
    }
    });

    // Send score to backend
    fetch('/submit-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, score })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Test submitted successfully", data);
        document.getElementById('test-container').style.display = 'none';
        document.getElementById('submission-container').style.display = 'block';
        setTimeout(() => window.location.reload(), 4000);  // Refresh after 4 seconds
    })
    .catch(err => {
        console.error("Error submitting test:", err);
        alert("Error submitting test. Please try again later.");
    });
}








// Security Measures

// Disable right-click to prevent copying
document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});
// Disable copy, cut, and paste functionality through keyboard shortcuts
document.addEventListener("keydown", function(event) {
    // Disable Ctrl+C, Ctrl+V, Ctrl+X for copy, paste, and cut
    if(isTestActive){
    if ((event.ctrlKey || event.metaKey) && 
        (event.key === 'c' || event.key === 'v' || event.key === 'x')) {
        event.preventDefault();
        alert("Copy-paste and cut operations are disabled during the test.");
    }
    }
});


// Detect tab switching or minimizing the browser
let isTestActive = false;
let count = 0;
document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        if (isTestActive) {
            count++;
            alert("You are not allowed to switch tabs or minimize the window during the test. Warning : "+count + " if The You Continue The Test Auto-Submit");
            // Optionally, you can lock the test here by preventing further inputs or stopping the timer
            // Disable the test (you can implement a better method for this)
            if(count>3){
            disableTest();
            }
        }
    }
});

// Disable test (you can stop the timer and prevent further actions)
function disableTest() {
    alert("You have switched tabs too many times. The test will be automatically submitted.");

    // Manually trigger test submission logic after 3 tab switches
    submitTest();
}


// Disable F12 and inspect element
document.addEventListener("keydown", function(event) {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault(); // Disable the key action
        alert("Developer tools are disabled during the test.");
    }
});

// Disable window resizing
window.onresize = function() {
    alert("Resizing the window is not allowed during the test.");
    window.resizeTo(window.innerWidth, window.innerHeight); // Restore original window size
};

// Track if mouse moves within the test container
let isMouseActive = false;

document.getElementById('test-container').addEventListener('mousemove', function() {
    isMouseActive = true;
});

// Optionally, alert if the user is idle for too long (e.g., 1 minute)
setInterval(() => {
    if (!isMouseActive && isTestActive==true) {
        alert("Please stay active on the test page.");
        // You can also log out the user or lock the test
    }
    isMouseActive = false;
}, 60000); // Check every minute




let adminEmail = "123";  // Replace with actual admin email
let adminPassword = "123";  // Replace with actual admin password

document.getElementById("admin-login-link").addEventListener("click", () => {
    document.getElementById('login-form').style.display = 'none';  // Hide user login form
    document.getElementById('admin-login-form').style.display = 'block';  // Show admin login form
});

// Admin Login Button Click Handler
document.getElementById("admin-login-btn").addEventListener("click", () => {
    const enteredEmail = document.getElementById('admin-email').value;
    const enteredPassword = document.getElementById('admin-password').value;

    // Simple admin credential check
    if (enteredEmail === adminEmail && enteredPassword === adminPassword) {
        document.getElementById('admin-login-form').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        loadTestData();  // Load current test data to edit
    } else {
        document.getElementById('admin-login-error').innerText = "Invalid admin credentials!";
    }
});

// Load current test data (questions, options, and duration) from the backend (or local storage)
function loadTestData() {
    // Assuming you have an endpoint to fetch the current test details (questions, options, duration)
    fetch('/get-test-data')
        .then(response => response.json())
        .then(data => {
            // Populate the test data in the admin dashboard
            document.getElementById('test-duration').value = data.duration;

            const questionsContainer = document.getElementById('questions-container');
            questionsContainer.innerHTML = '';  // Clear existing questions

            data.questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question');
                questionDiv.innerHTML = `
                    <label>Question ${index + 1}:</label>
                    <input type="text" class="question-text" value="${question.question}" data-index="${index}" placeholder="Enter question text">
                    <label>Options:</label>
                    ${question.options.map((option, i) => `
                        <input type="text" class="option" value="${option}" data-question-index="${index}" data-option-index="${i}" placeholder="Enter option ${i + 1}">
                    `).join('')}
                `;
                questionsContainer.appendChild(questionDiv);
            });
        })
        .catch(err => {
            console.error("Error loading test data:", err);
        });
}

// Handle form submission to save changes (duration and questions)
document.getElementById('update-test-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const updatedDuration = document.getElementById('test-duration').value;
    const questions = [];

    document.querySelectorAll('.question').forEach(questionDiv => {
        const questionText = questionDiv.querySelector('.question-text').value;
        const options = [];
        questionDiv.querySelectorAll('.option').forEach(optionInput => {
            options.push(optionInput.value);
        });
        questions.push({ question: questionText, options: options });
    });

    // Send the updated test data to the backend
    fetch('/update-test-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration: updatedDuration, questions: questions }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert("Test data updated successfully!");
        } else {
            alert("Error updating test data.");
        }
    })
    .catch(err => {
        console.error("Error updating test data:", err);
    });
});
