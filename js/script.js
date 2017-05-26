var gameWrapper = document.querySelector('#game');
var form = document.querySelector('#form');
var rules = document.querySelector('#rules');
var error = document.getElementsByClassName('error');
var info = document.getElementsByClassName('info');
var info2 = document.getElementsByName('info');
var userName = document.getElementById('userName');
var click = 1;
var firstName;
var LastName = "";
var registered = false;

if (!gameWrapper.classList.contains('hide')) {
    gameWrapper.classList.remove('center');
    gameWrapper.classList.add('hide');

}

document.getElementById("butt_rules").onclick = function () {

    if (rules.classList.contains('hide')) {
        rules.classList.remove('hide');
        form.classList.add('hide');
        //        rules.setAttribute('value','close rule');
        rules.value = 'close rule';
        click++;
    } else if (!rules.classList.contains('hide') && form.classList.contains('hide') && click == 2) {
        rules.classList.add('hide');
        form.classList.remove('hide');
        rules.setAttribute('value', 'rules');
        click = 1;
    } //end else if
}
document.getElementById("start_game").onclick = function () {

        if (validate() || registered) {
            showGame();
            game.readTextFile();
            game.getData();
            game.startTimer();
            if (!form.classList.contains('hide')) {
                form.classList.add('hide');
            }
            if (!rules.classList.contains('hide')) {
                rules.classList.add('hide');
            }

        }


        var correct = document.getElementsByClassName("answer");

    } //end onclick function start game
function validate() {
    firstName = info[0].value;
    LastName = info[1].value;
    var val = true;
    var reg = /^[a-zA-Z ]{1,15}$/
    if (firstName == "" || firstName == null) {
        info[0].setAttribute('placeholder', 'You Must Enter Your First Name');
        val = false;

    } else if (firstName != "" || firstName != null) {
        if (!reg.test(firstName)) {
            info[0].setAttribute('placeholder', firstName + 'doesnt match requirments, re-enter');
            error[0].innerHTML = 'Doesnt match requirments, re-enter';
            val = false;
        } else {
            info[0].setAttribute('placeholder', 'Enter Your First Name');
        }
    } else {
        info[0].setAttribute('placeholder', 'Enter Your First Name');
    }
    if (val) {
        userName.innerHTML = firstName;
        return val;
    }
}


function showGame() {

    var gameRule = document.querySelector('#gameControl');
    gameRule.classList.remove('control', 'center');
    gameRule.classList.add('hide');
    if (gameWrapper.classList.contains('hide')) {
        gameWrapper.classList.remove('hide');
        gameWrapper.classList.add('center');

    }
}

function hideGame() {
    var gameRule = document.querySelector('#gameControl');
    if (gameRule.classList.contains('hide')) {
        gameRule.classList.remove('hide');
        gameRule.classList.add('control', 'center');
    }
    if (!gameWrapper.classList.contains('hide')) {
        gameWrapper.classList.add('hide');
        gameWrapper.classList.remove('center');
    }
    if (!rules.classList.contains('hide')) {
        rules.classList.add('hide');
    }

} //end hide game


window.onload = function () {

};

if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.

    if (localStorage.firstname) {
        userName.innerHTML = "Welcome back, " + localStorage.firstname;
        registered = true;
    } else {
        alert(firstName);
        localStorage.firstname = firstName;
    }
} else {
    // Sorry! No Web Storage support..
    console.log("Sorry, your browser does not support web storage...");
}
//object class start
var game = {
    time: 240,
    x: "",
    question: "",
    choice: "",
    id: "",
    round: "",
    fact: "",
    data: "",
    userMoney: "",
    answerHolder: document.getElementsByClassName("answer"),
    questionHolder: document.getElementsByClassName("question"),
    questionArray: [],
    moneyHolder: document.getElementsByClassName('moneyTree'),
    bank2: document.getElementsByClassName('bank2'),
    level: 8,
    moneyLevel: 9,
    moneyBank: document.getElementsByClassName('bank'),
    popup: document.getElementById('gameinfoHolder'),
    completed: false,
    opt: false,
    takeMoney: 0,
    bankMoney: document.getElementsByClassName('response'),
    option: document.getElementsByClassName('option'),

    /*function using http protocol to get and reads json file raw stored locally, this function is
	used by the getData function to convert json to readable data by javascript*/
    readTextFile: function (file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }, //end read file

    /*getData function converts json to executable data which is read in by the readTextFile function*/
    getData: function () {

        this.readTextFile("js/quest.json", function (text) {
            var data = JSON.parse(text);
            //console.log(data.Question);
            var gameQ = data.Question;
            game.data = data.Question;
            game.displayQuest(gameQ);
        });
        this.nextStage();
        if (this.completed) {
            this.level = 5;
        }

    }, //end showData

    /*function uses data converted in getData fucntion and incorporates two other functions randomizeQuestion & nextStage */
    displayQuest: function (jData) {
        var i = 0;
        var ran = this.randomizeQuestion(jData);

        //console.log("Question to go to " + ran);
        for (var key in jData) {
            key = ran;

            this.question = jData[key].quest;
            this.id = jData[key].id;
            this.fact = jData[key].fact;
            this.questionHolder[i].innerHTML = this.question;

            for (var tra in jData[key].choice) {

                this.choice = jData[key].choice[tra];
                this.answerHolder[tra].innerHTML = this.choice;
                this.nextStage(this.id, this.choice, this.fact);
            } //close inner forloop
        } //close outer forloop
    }, //end displayQuestion

    /*randomizeQuestion function accepts 1 arg which is the json date uses its length to generate calculated random question*/
    randomizeQuestion: function (qData) {

        this.question = Math.floor((Math.random() * qData.length));

        var newQ = this.ifQuestionAsked(this.question, qData);
        console.log("Booleen statement: " + newQ);
        console.log("----------------------");
        if (newQ) {
            this.question = Math.floor((Math.random() * qData.length));
            this.getData();
            //alert("A question was already asked make new: " + this.question);
        }

        return this.question;
    },

    /*nextStage function accepts two arguments qId which is the correct answer on file and ch which isnt being used*/
    nextStage: function (qId, ch, fa) {

        var choice;
        this.answerHolder[0].onclick = function () {
            game.choice = game.answerHolder[0].getAttribute('value');
            game.ifCorrect(qId, game.choice, fa);
        }
        this.answerHolder[1].onclick = function () {
            game.choice = game.answerHolder[1].getAttribute('value');
            game.ifCorrect(qId, game.choice, fa);
        }
        this.answerHolder[2].onclick = function () {
            game.choice = game.answerHolder[2].getAttribute('value');
            game.ifCorrect(qId, game.choice, fa);
        }

    }, //end next stage

    /*ifCorrect function accepts two args question from on file (its answer) & userChoice if user choice matches on file, money is added, user levels up, new question shown*/
    ifCorrect: function (question, userChoice) {
        var bank = 0;
        //        alert("question about to be asked if correct: " + question)
        if (question == userChoice) {

            console.log("Current level is: " + this.level);
            console.log("^^^^^^^^^^^^^_____^^^^^^^^^^^^");
            if (game.moneyHolder[this.level].classList.contains('backGround')) {
                game.moneyHolder[this.level].classList.remove('backGround');
                game.moneyHolder[this.level - 1].classList.add('backGround');
                this.moneyLevel = this.moneyLevel - 1;
                this.userMoney = game.moneyHolder[this.moneyLevel].getAttribute('value');
                this.youAreCorrect();


                /*game.level=9
                game.moneyLevel*/
                
                this.level = (parseInt(this.level) - 1);
                game.getData();
            } //end if statment
        } else {
            //alert("wrong bro go home");
            //this.youLose();
            game.readTextFile();
            game.getData();

        }
    }, //end function 

    /*ifQuestionAsked accepts two args 'asked' which is the question about to be displayed includes method is used to compare existence */
    ifQuestionAsked: function (asked, data) {
        console.log("/--Question " + asked + " has been asked--/");
        console.log("If question asked return true: " + this.questionArray.includes(asked));

        var qasked = this.questionArray.includes(asked);
        if (!qasked) {
            this.questionArray.push(asked);
        }
        var info = "";

        for (var i = 0; i <= this.questionArray.length - 1; i++) {
            info += this.questionArray[i] + ", ";
        }

        console.log("data in Array " + info);

        return qasked;
    },



    /*Function times needs to be worked on*/
    startTimer: function () {


        var x = setInterval(function () {

            var minutes = game.time / 60;
            var seconds = game.time % 60;

            if (seconds == 0) {
                // Output the result in an element with id="demo"
                document.getElementById("time").innerHTML = parseInt(minutes) + ":" + seconds + "0";
                game.time--;

            } else {
                // Output the result in an element with id="demo"
                document.getElementById("time").innerHTML = parseInt(minutes) + ":" + seconds;
                game.time--;

            }

            // If the count down is over, write some text 
            if (game.time == -1) {
                var completed = false;
                clearInterval(x);

                if (this.completed) {
                    game.showRoundThree();
                    game.time = 120;
                }
                if (!this.completed) {
                    game.showRoundTwo();
                    game.time = 120;
                    this.completed = true;
                }

                game.readTextFile();
                game.getData();
                game.startTimer();
                //game.youLose();
            }
        }, 1000);



    },
    stopTimer: function () {
        clearInterval(x);
    },
    showRoundTwo: function () {
        var bank = document.getElementsByClassName('bankWrapper');
        if (bank[1].classList.contains('hide')) {
            bank[1].classList.remove('hide');
            bank[0].classList.add('hide');

            game.round = 2;
            document.querySelector('.round').innerHTML = game.round;

            game.moneyHolder = document.getElementsByClassName('bank2');
            game.level = game.moneyHolder.length
                // alert("Bank 2 " + game.level);
                //game.moneyHolder[game.level].classList.add('backGround');
        }

    },
    showRoundThree: function () {
        var bank = document.getElementsByClassName('bankWrapper');
        if (!bank[1].classList.contains('hide')) {
            bank[1].classList.add('hide');

            game.round = 3;
            game.level = 6;
            document.querySelector('.round').innerHTML = game.round;

        }
    },
    restartGame: function () {

        this.choice = "";
        this.id = ""
        this.questionArray = [];
        this.level = 8;
    },
    youLose: function () {

        this.popup.classList.remove('hide');
    },
    youAreCorrect() {
        var messageheader = document.querySelector('#messageHeader');
        var message = document.querySelector('#messageDis');
        var fact = document.querySelector('#factDis');

        messageheader.innerHTML = "You Are Correct";
        if (this.userMoney != 0) {
            message.innerHTML = "Do You Wish To Bank $" + this.userMoney + " ?";
            this.option[0].onclick = function () {
                game.choice = game.option[0].getAttribute('value');
                if (game.choice == 'YES' || game.choice == 'yes') {
                    game.opt = true;
                    console.log(game.choice, game.opt);

                    game.takeMoney = parseInt(game.takeMoney);
                    game.takeMoney += parseInt(game.userMoney);

                    game.moneyBank[0].innerHTML = '$' + game.takeMoney;
                    game.moneyHolder[game.level].classList.add('backGround');
                    game.moneyHolder[8].classList.add('backGround');
                    /*game.level = 9;
                    game.moneyLevel = 9;*/
                }

            }
            this.option[1].onclick = function () {
                game.choice = game.option[1].getAttribute('value');
                if (game.choice == 'NO' || game.choice == 'NO') {
                    console.log(game.choice);
                    game.opt = false;
                }
            }
        }
        if (this.fact) {
            fact.innerHTML = this.fact;
        }
        this.popup.classList.remove('hide');
    } //end function you are correct

}; //end object
var span = document.getElementsByClassName('close')[0];
span.onclick = function () {
    if (!game.popup.classList.contains('hide')) {
        game.popup.classList.add('hide');
        // hideGame();
    }
}
window.onclick = function (event) {
    if (event.target == game.popup) {
        game.popup.classList.add('hide');
    }
}

//////////////////////////// AUDIO SETTINGS/////////////////////////////////////
var beep = new Audio;
beep.src = "Music/gsound.mp3";

// beep.autoplay = true;

//beep.autoplay = true;

function playm() {
    beep.autoplay = false;
    if (beep.paused) {

        beep.play();
        document.getElementById("sound").src = "Images/volume_on.png"
    } else {
        beep.load();
        document.getElementById("sound").src = "Images/volume_off.png"
    }

}
document.getElementById("sound").onmousedown = playm;
