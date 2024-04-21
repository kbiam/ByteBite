// let items = document.querySelectorAll('.slider .item');
// let next = document.getElementById('next');
// let prev = document.getElementById('prev');

// let active = 0;

// function loadShow() {
//     let stt = 0;
//     items[active].style.transform = 'none'; // Add quotation marks around 'none'
//     items[active].style.zIndex = 1;
//     items[active].style.filter = 'none';
//     items[active].style.opacity = 1;
//     for (let i = active + 1; i < items.length; i++) {
//         stt++;
//         items[i].style.transform = `translateX(${120 * stt}px) scale(${1 - 0.2 * stt}) perspective(70px) rotateY(-1deg)`;
//         items[i].style.zIndex = -stt;
//         items[i].style.filter = 'blur(1px)';
//         items[i].style.opacity = stt > 1 ? 0 : 0.6;
//     }
//     stt = 0;
//     for (let i = active - 1; i >= 0; i--) {
//         stt++;
//         items[i].style.transform = `translateX(${-120 * stt}px) scale(${1 - 0.2 * stt}) perspective(70px) rotateY(1deg)`;
//         items[i].style.zIndex = -stt;
//         items[i].style.filter = 'blur(1px)';
//         items[i].style.opacity = stt > 1 ? 0 : 0.6;
//     }
// }

// loadShow();

// next.onclick = function() {
//     active = active + 1 < items.length ? active + 1 : active;
//     loadShow();
// }

// prev.onclick = function() {
//     active = active - 1 >= 0 ? active - 1 : active;
//     loadShow();
// }
const currentUrl = window.location.href;
const lessonName = decodeURIComponent(currentUrl.split('?lesson=')[1]);

// Construct the URL for the fetch request
const fetchUrl = '/quiz/transcripts';

// Make the fetch request
fetch(fetchUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ lessonName: lessonName })
})
.then(response => (response.json()))
.then(data => {
    // console.log(data)
    const transcriptsArray = data.map(item => item.transcript);
    // console.log(transcriptsArray)
    const concatenatedTranscripts = transcriptsArray.join('+');
    fetchingQuizQuestions(concatenatedTranscripts)
    


    // Extract lesson name and transcripts from the response
    const lessonName = data.lessonName;
    const transcripts = data.transcripts;

    // Now you can use both lessonName and transcripts as needed
    // console.log('Lesson Name:', lessonName);
    // console.log('Transcripts:', transcripts);
})
.catch(error => console.error('Error fetching data:', error));


async function fetchingQuizQuestions(transcripts) {
    const apiUrl = 'http://localhost:5000/generate_content';

    const requestBody = {
        transcripts: transcripts
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',  // Ensure CORS is enforced
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        console.log("received", data);
                // Split the response into individual questions
                const questions = data.split('**Question');

                // Remove the empty first element
                questions.shift();
        
                // Display the questions on the frontend
                displayQuiz(questions);

        // After receiving the response, you can close the CORS policy if needed
        // Example: CORS policy is closed by default
        // CORS policy can be opened again if necessary for subsequent requests
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// function displayQuiz(questions) {
//     // Assuming quizContainer is the container where the quiz will be displayed
//     const quizContainer = document.querySelector('.item');

//     // Clear previous content if any
//     quizContainer.innerHTML = '';

//     // Loop through each question
//     questions.forEach((question, index) => {
//         // Split the question into question text and answer
//         const [questionText, answer] = question.split('**Answer:');

//         // Extract the question text
//         const questionTitle = questionText.trim().split('\n')[0];

//         // Extract the options
//         const options = questionText.trim().split('\n').slice(1);

//         // Create a div element for the question
//         const questionDiv = document.createElement('div');
//         questionDiv.classList.add('question');
//         questionDiv.innerHTML = `<p>${questionTitle}</p>`;

//         // Create radio buttons for options
//         options.forEach((option, optionIndex) => {
//             const optionInput = document.createElement('input');
//             optionInput.type = 'radio';
//             optionInput.name = `question_${index}`;
//             optionInput.value = optionIndex;

//             const optionLabel = document.createElement('label');
//             optionLabel.textContent = option.trim();

//             // Append the option input and label to the question div
//             questionDiv.appendChild(optionInput);
//             questionDiv.appendChild(optionLabel);
//             questionDiv.appendChild(document.createElement('br'));
//         });

//         // Append the question div to the quiz container
//         quizContainer.appendChild(questionDiv);
//     });
// }
function displayQuiz(questions) {
    // Assuming quizContainer is the container where the quiz will be displayed
    const quizContainer = document.querySelector('.item');

    // Clear previous content if any
    quizContainer.innerHTML = '';

    // Loop through each question
    questions.forEach((question, index) => {
        // Split the question into question text and answer
        const [questionText, answer] = question.split('**Answer:');

        // Extract the question text
        const questionTitle = questionText.trim().split('\n')[0];

        // Extract the options
        const options = questionText.trim().split('\n').slice(1);

        // Create a div element for the question
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('questiondiv');
        const elem = document.createElement('p');
        questionDiv.appendChild(elem).innerText=questionTitle;

        // Create radio buttons for options
        options.forEach((option, optionIndex) => {
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question_${index}`;
            optionInput.value = optionIndex;

            const optionLabel = document.createElement('label');
            optionLabel.textContent = option.trim();

            // Append the option input and label to the question div
            questionDiv.appendChild(optionInput);
            questionDiv.appendChild(optionLabel);
            questionDiv.appendChild(document.createElement('br'));
        });

        // Append the question div to the quiz container
        quizContainer.appendChild(questionDiv);
    });
}

// Submit button click event handler
document.getElementById('submit').addEventListener('click', function() {
    const answers = getSelectedAnswers();
    const correctAnswers = ['A', 'B', 'C', 'D', 'A']; // Replace with correct answers
    
    // Check answers
    let score = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
        if (answers[i] === correctAnswers[i]) {
            score++;
        }
    }

    // Display score
    alert(`Your score: ${score}/${correctAnswers.length}`);
});

// Helper function to get selected answers
function getSelectedAnswers() {
    const answers = [];
    const questionDivs = document.querySelectorAll('.question');
    questionDivs.forEach((questionDiv, index) => {
        const selectedOption = questionDiv.querySelector(`input[name="question_${index}"]:checked`);
        if (selectedOption) {
            answers.push(selectedOption.value);
        } else {
            answers.push(null); // If no option selected
        }
    });
    return answers;
}
