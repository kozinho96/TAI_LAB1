fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(index);
        activateAnswers();
    });

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');
let results = document.querySelector('.results');
let list = document.querySelector('.list');
let userScorePoint = document.querySelector('.userScorePoint');
let averageScore = document.querySelector('.average');
let numberQuestion = document.querySelector('#number-question');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;

function activateAnswers() {
    answers.forEach((item) => {
        item.addEventListener('click', doAction);
    });
}

function doAction(event) {
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    } else {
        markInCorrect(event.target);
    }
    disableAnswers(event.target);
}

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markInCorrect(elem) {
    elem.classList.add('incorrect');
}

function disableAnswers() {
    answers.forEach((item) => {
        item.removeEventListener('click', doAction);
    });
}

let clearClass = () => {
    answers.forEach((item) => {
        item.classList.remove('correct');
        item.classList.remove('incorrect');
    });
};

restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});

function setQuestion(index) {
    clearClass();

    numberQuestion.innerHTML = index + 1;
    question.innerHTML = preQuestions[index].question;

    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }
}

next.addEventListener('click', function () {
    index++;
    if (index >= preQuestions.length) {
        list.style.display = 'none';
        results.style.display = 'block';
        userScorePoint.innerHTML = points;
        // localStorage.removeItem("quizScore");
        saveScore();
    } else {
        setQuestion(index);
        activateAnswers();
    }
});

previous.addEventListener('click', function () {
    if (index > 0) {
        index--;
        setQuestion(index);
        activateAnswers();
    }
});

function saveScore() {

    if (localStorage.getItem("quizScore") != null) {
        let previousScore = JSON.parse(localStorage.getItem("quizScore"));
        let newScore = {
            "totalPoints": previousScore.totalPoints + points,
            "avgScore": (JSON.parse(localStorage.getItem("quizScore")).totalPoints + points) / (previousScore.numberOfGames + 1),
            "numberOfGames": JSON.parse(localStorage.getItem("quizScore")).numberOfGames + 1
        };
        localStorage.setItem("quizScore", JSON.stringify(newScore));
    } else {
        let newScore = {
            "totalPoints": points,
            "avgScore": points,
            "numberOfGames": 1
        };
        localStorage.setItem("quizScore", JSON.stringify(newScore));
    }
    averageScore.innerText = JSON.parse(localStorage.getItem("quizScore")).avgScore;

}





