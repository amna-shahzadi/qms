document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const quizTitleDisplay = document.getElementById('quiz-title-display');
    const questionsContainer = document.getElementById('questions-container');
    const quizArea = document.getElementById('quiz-area');
    const resultArea = document.getElementById('result-area');
    const scoreDisplay = document.getElementById('score-display');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-quiz-btn');
    const backToHomeBtn = document.getElementById('back-to-home-btn');

    // State Variables
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let quizQuestions = [];

    // Timer Variables
    let timeLeft = 600; // 10 minutes in seconds
    let timerInterval;

    // Quiz Data
    const simulatedQuizData = {
        title: "Web Development Fundamentals Quiz",
        questions: [
            {
                id: 1,
                text: "What does CSS primarily control?",
                options: {
                    a: "Content and Structure",
                    b: "Behavior and Interactivity",
                    c: "Presentation and Style",
                    d: "Server-side Logic"
                },
                correctAnswer: "c"
            },
            {
                id: 2,
                text: "Which programming language is commonly used for front-end interactivity?",
                options: {
                    a: "Python",
                    b: "Java",
                    c: "C#",
                    d: "JavaScript"
                },
                correctAnswer: "d"
            },
            {
                id: 3,
                text: "The `<head>` element contains:",
                options: {
                    a: "The main visible content of the document",
                    b: "Metadata about the HTML document",
                    c: "Footers and copyright information",
                    d: "Navigational links"
                },
                correctAnswer: "b"
            },
            {
                id: 4,
                text: "Which CSS property changes the text color?",
                options: {
                    a: "text-color",
                    b: "font-color",
                    c: "color",
                    d: "foreground"
                },
                correctAnswer: "c"
            }
        ]
    };

    // --- Timer Functions ---

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${paddedMinutes}:${paddedSeconds}`;
    }

    function startTimer() {
        const timeLeftDisplay = document.getElementById('time-left');
        timeLeftDisplay.textContent = formatTime(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("Time is up! The quiz will be submitted automatically.");
                submitQuiz(true); // Auto-submit on timeout
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    }


    // --- Core Quiz Functions ---

    function loadQuiz() {
        quizQuestions = simulatedQuizData.questions;
        quizTitleDisplay.textContent = simulatedQuizData.title;

        quizQuestions.forEach(question => {
            questionsContainer.appendChild(createQuestionCard(question));
        });

        showQuestion(currentQuestionIndex);
        attachOptionListeners();
        startTimer(); // 🟢 TIMER START
    }

    function createQuestionCard(question) {
        const card = document.createElement('div');
        card.classList.add('quiz-question-card');
        card.setAttribute('data-id', question.id);

        let optionsHtml = '';
        for (const [value, text] of Object.entries(question.options)) {
            optionsHtml += `
                <label class="option-label" data-q-id="${question.id}">
                    <input type="radio" name="q${question.id}-answer" value="${value}"> 
                    <span class="option-text">${text}</span>
                </label>
            `;
        }

        card.innerHTML = `
            <p class="question-number">Question ${question.id} of ${quizQuestions.length}</p>
            <h3 class="question-text">${question.text}</h3>
            <div class="options-container">
                ${optionsHtml}
            </div>
        `;
        return card;
    }

    function showQuestion(index) {
        const cards = questionsContainer.querySelectorAll('.quiz-question-card');

        if (index < 0 || index >= cards.length) return;

        cards.forEach(card => card.classList.remove('active-question'));

        if (cards[index]) {
            cards[index].classList.add('active-question');
            currentQuestionIndex = index;
            updateNavigationButtons();

            // Re-apply previous selection
            const qId = quizQuestions[index].id;
            const selectedOption = userAnswers[qId];
            if (selectedOption) {
                const input = document.querySelector(`input[name="q${qId}-answer"][value="${selectedOption}"]`);
                if (input) input.checked = true;
            }
        }
    }

    function updateNavigationButtons() {
        prevBtn.disabled = currentQuestionIndex === 0;

        if (currentQuestionIndex === quizQuestions.length - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    function attachOptionListeners() {
        questionsContainer.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const qId = parseInt(e.target.name.split('-')[0].substring(1));
                userAnswers[qId] = e.target.value;
            });
        });
    }

    /** Final submission logic with REVIEW FIX. */
    function submitQuiz(isAutoSubmit = false) {
        stopTimer();

        if (!isAutoSubmit && !confirm("Are you sure you want to submit the quiz?")) {
            startTimer();
            return;
        }

        let score = 0;
        let totalQuestions = quizQuestions.length;

        quizQuestions.forEach(question => {
            const qId = question.id;
            const userAnswer = userAnswers[qId];
            const correctAnswer = question.correctAnswer;

            if (userAnswer === correctAnswer) {
                score++;
            }

            // Apply Visual Feedback (Red/Green highlighting)
            const optionLabels = document.querySelectorAll(`.option-label[data-q-id="${qId}"]`);
            optionLabels.forEach(label => {
                const radio = label.querySelector('input[type="radio"]');

                label.style.pointerEvents = 'none';

                // Highlight the correct answer (Green)
                if (radio.value === correctAnswer) {
                    label.classList.add('correct');
                }

                // Highlight user's wrong answer (Red)
                else if (radio.checked && radio.value !== correctAnswer) {
                    label.classList.add('incorrect');
                }
            });
        });

        // Display results
        scoreDisplay.innerHTML = `Your Score: ${score} / ${totalQuestions}`;

        // Switch views: 
        quizArea.classList.add('hidden');
        resultArea.classList.remove('hidden');

        // 🟢 REVIEW ANSWERS FIX: Move/Show all questions in the Result Area
        const allQuestionCards = questionsContainer.querySelectorAll('.quiz-question-card');

        allQuestionCards.forEach(card => {
            // Remove single question view class
            card.classList.remove('active-question');

            // Force display: block to show all of them in a list
            card.style.display = 'block';
        });

        // The question cards are already children of questionsContainer, 
        // which is now visible because resultArea is visible. 
        // We just need to move the entire questions container below the "Review your answers below" message 
        // which is handled by the HTML structure in this version.
        resultArea.insertBefore(questionsContainer, backToHomeBtn);
    }

    // --- Event Handlers ---

    prevBtn.addEventListener('click', () => {
        showQuestion(currentQuestionIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        showQuestion(currentQuestionIndex + 1);
    });

    submitBtn.addEventListener('click', () => {
        submitQuiz(false); // Manual submit
    });

    // 🟢 BACK TO SELECTION FIX
    backToHomeBtn.addEventListener('click', () => {
        stopTimer(); // Timer stop
        // Redirect to the role selection page
        window.location.href = 'guest.html';
    });

    // Start the Quiz
    loadQuiz();
});