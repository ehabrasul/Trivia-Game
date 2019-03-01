$(document).ready(function() {

restartQuiz();

$("button").on("click", function() {

    // If Restart Quiz button pressed, then restart the quiz
    if ($(this).attr("id") === "restartQuiz") {
        restartQuiz();
    }
    // Quiz answer button pressed, check answer
    else {
        var answer = checkAnswer($(this).attr("data-btnVal"),questions[questionIndex]);
        displayAnswer (answer, 0, questions[questionIndex])
    }

  });
});

// Global Variables & Constants

// Question timer and second time variables/constants
const answerQuestionTime = 10000; // 10 seconds
const displayAnswerTime = 15000; // 15 seconds
const second = 1000;

var questionTimer;
var answerTimer;
var secondTimer;
var timeRemaining;

var questionIndex = 0;
var numCorrect = 0;
var numWrong = 0;

// Trivia Questions
var q1 = new TriviaQuestion("What is the capital of Missouri.","St. Louis","Kansas City","Springfield","Jefferson City","Jefferson City","assets/images/JeffersonCity.png");
var q2 = new TriviaQuestion("What is the capital of Canada."," ottowa","vancouver","montreal", "Toronto","ottowa" ,"assets/images/ottawa.png");
var q3 = new TriviaQuestion("What is the capital of Mexico.","Tijuana","cancun","mexico city","acapulco","mexico city","assets/images/mexicocity.png");
var q4 = new TriviaQuestion("What is the capital of Japan.","osaka","tokyo","kyoto","yokohama","tokyo","assets/images/tokyo.png");
var q5 = new TriviaQuestion("What is the capital of France.","lyon","marseille","nice","paris","paris","assets/images/paris.png");


var questions = [q1,q2,q3,q4,q5];
// var questions = [q1,q2,q3] // Used for testing

// Functions & Objects

function TriviaQuestion (question,ans1,ans2,ans3,ans4,correctAns,ansInfo,ansImg) {
    this.question = question;
    this.ans1 = ans1;
    this.ans2 = ans2;
    this.ans3 = ans3;
    this.ans4 = ans4;
    this.correctAns = correctAns;
    this.ansInfo = ansInfo;
    this.ansImg = ansImg;
}

// Gets & Displays the next trivia question
function nextQuestion(){
    clearAnswer();
    questionIndex++;

    if (questionIndex < questions.length) {
        displayQuestion(questions[questionIndex]);
    } else {
        gameOver();
    }
}

// Display a triva question
function displayQuestion(q) {
    var questionNum = questionIndex+1; // Used to display the question number
    var answerArray = [q.ans1,q.ans2,q.ans3,q.ans4] // Temporary array used to randomize the answer order

    shuffleArray(answerArray); // Shuffle the order of the answers

    clearTimeout(answerTimer); // Stop the question timer
    clearInterval(secondTimer); // Stop the second timer

    questionTimer = setTimeout(function(){displayAnswer(false, 1, questions[questionIndex])}, answerQuestionTime); // Set time allowed to answer question
    secondTimer = setInterval(secondCountdown, second); // Set interval time to count down seconds
    timeRemaining = answerQuestionTime/1000; // time allowed to answer the question

    $("#nextQuestionTime").hide(); // Hide the next question timer
    $("#timeRemaining").html("Time Remaining: "+timeRemaining+" seconds").show().css("color","black"); // Display the time remaining to answer question

    $("#questionNumber").html(questionNum+". ").show();; // Display question number
    $("#triviaQuestion").html(q.question).show(); // Display the trivia question 
    $("#btn1").html(answerArray[0]).attr("data-btnVal",answerArray[0]).show();
    $("#btn2").html(answerArray[1]).attr("data-btnVal",answerArray[1]).show();
    $("#btn3").html(answerArray[2]).attr("data-btnVal",answerArray[2]).show();
    $("#btn4").html(answerArray[3]).attr("data-btnVal",answerArray[3]).show();
    enableButtons();
}

// Clears the question
function clearQuestion() {
    $("#questionNumber").hide();
    $("#triviaQuestion").hide();
    $("#btn1").hide();
    $("#btn2").hide();
    $("#btn3").hide();
    $("#btn4").hide();
}

// Displays the triva answer, info and image
// Parameters: a: answer (true/false), r: reason (0 = wrong answer/1 = time's up), q: current question
function displayAnswer(a,r,q) {
    if (a) {         
        $("#result").html("Correct!").css("color","green");
    }
    else if(r === 0) {    
        $("#result").html("Wrong!").css("color","red");
    }
    else {   
        $("#result").html("Times's Up!").css("color","red");
        numWrong++;
    }
    
    clearTimeout(questionTimer); // Stop the question timer
    clearInterval(secondTimer); // Stop the second timer

    answerTimer = setTimeout(nextQuestion, displayAnswerTime); // Set the display answer timer   
    secondTimer = setInterval(secondCountdown, second); // Reset the second timer 

    timeRemaining = displayAnswerTime/1000; 

    $("#timeRemaining").hide(); 
    $("#info").html(q.ansInfo);
    $("#nextQuestionTime").html("Next Question in: "+timeRemaining+" seconds").css("color","green").show();
    $("#answerImg").html("<img src='"+q.ansImg+"'>");
}




// Display the game , display button to restart
function displayStats() {
    $("#correctAns").html("Correct Answers: "+numCorrect).css("color","green");
    $("#wrongAns").html("Wrong Answers: "+numWrong).css("color","red");
    $("#restartQuiz").show();
}

// Clear the game 
function clearStats() {
    $("#correctAns").empty();
    $("#wrongAns").empty();
    $("#restartQuiz").hide();
    numCorrect = 0;
    numWrong = 0;
}

// Returns True if the correct answer selected, else returns False
// btnVal: value of the button clicked, question: current question object
function checkAnswer(btnVal,question){
    disableButtons();
    if (btnVal === question.correctAns) {
        numCorrect++;
        return true;
    }
    else {
        numWrong++;
        return false;
    }
}

function restartQuiz() {
    clearStats();   // Clear the correct/wrong answer 
    questionIndex = 0; // reset the question 
    shuffleArray(questions); // Shuffle the questions so its not the same quiz
    displayQuestion(questions[questionIndex]); // display the first question

}

    


function secondCountdown() {
    timeRemaining--;

    if (timeRemaining <= 5) {       // Warn user time is running out
        $("#timeRemaining").html("Time Remaining: "+timeRemaining+" seconds").css("color","red");
    }
    else {
        $("#timeRemaining").html("Time Remaining: "+timeRemaining+" seconds").css("color","black");   
    }
    $("#nextQuestionTime").html("Next Question in: "+timeRemaining+" seconds");
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}