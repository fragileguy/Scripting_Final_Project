var gameWrapper = document.querySelector('#game');
var form = document.querySelector('#form');
if (!gameWrapper.classList.contains('hide')) {
    gameWrapper.classList.remove('center');
    gameWrapper.classList.add('hide');

}
var lose = false;
var takeMoney = 0;

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
} //end hide game

document.getElementById("start_game").onclick = function () {
        showGame();
        game.readTextFile();
        game.getData();
        game.startTimer();
        if (!form.classList.contains('hide')) {
            form.classList.add('hide');
        }
        if (lose) {
            showElement();
        }



        var correct = document.getElementsByClassName("answer");

    } //end onclick function start game

window.onload = function () {

};


/*function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
	if (rawFile.readyState === 4 && rawFile.status == "200") {
	callback(rawFile.responseText);
	}
    }
    rawFile.send(null);
}*/
if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.

    if (localStorage.lastname) {
        alert("Hi Welcome back " + localStorage.lastname);
    } else {
        var lname = prompt("Enter Your Name bro");
        localStorage.lastname = lname;
    }
} else {
    // Sorry! No Web Storage support..
    console.log("Sorry, your browser does not support web storage...");
}
//object class start
var game = {
    time: 10,
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
    level: 8,
    moneyLevel: 9,
    moneyBank: document.getElementsByClassName('bank'),
    popup: document.getElementById('gameinfoHolder'),

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
                this.nextStage(this.id, this.choice);
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
    nextStage: function (qId, ch) {

        var choice;
        this.answerHolder[0].onclick = function () {
            game.choice = game.answerHolder[0].getAttribute('value');
            game.ifCorrect(qId, game.choice);
        }
        this.answerHolder[1].onclick = function () {
            game.choice = game.answerHolder[1].getAttribute('value');
            game.ifCorrect(qId, game.choice);
        }
        this.answerHolder[2].onclick = function () {
            game.choice = game.answerHolder[2].getAttribute('value');
            game.ifCorrect(qId, game.choice);
        }

    }, //end next stage

    /*ifCorrect function accepts two args question from on file (its answer) & userChoice if user choice matches on file, money is added, user levels up, new question shown*/
    ifCorrect: function (question, userChoice) {
        var bank = 0;
        //        alert("question about to be asked if correct: " + question)
        if (question == userChoice) {
            alert("you are correct");

            console.log("Current level is: " + this.level);
            console.log("^^^^^^^^^^^^^_____^^^^^^^^^^^^");
//            alert("level right before div change "+this.level)
            if (game.moneyHolder[this.level].classList.contains('backGround')) {
                game.moneyHolder[this.level].classList.remove('backGround');
                game.moneyHolder[this.level - 1].classList.add('backGround');
                this.moneyLevel = this.moneyLevel - 1;
    
                this.userMoney = game.moneyHolder[this.moneyLevel].getAttribute('value');
                var bankMoney = confirm('Do You Wish To Bank Money?' + this.userMoney);

                if (bankMoney) {
                    takeMoney = parseInt(takeMoney);
                    takeMoney += parseInt(this.userMoney);
//                     if (game.moneyHolder[this.level+1].classList.contains('backGround')) {
                    game.moneyHolder[6].classList.remove('backGround');
                    game.moneyHolder[8].classList.add('backGround');
                   //  }
                    this.level = 9;
                    this.moneyLevel = 9;
                    game.moneyBank[0].innerHTML = '$' + takeMoney;
                }
//                alert("level of money "+this.level)
                this.level = (parseInt(this.level) - 1);
                game.getData();
            }
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
                clearInterval(x);
                //game.youLose();
            }
        }, 1000);



    },

    stopTimer: function () {
        clearInterval(x);

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


}; //end object
var span = document.getElementsByClassName('close')[0];
span.onclick = function () {
    if (!game.popup.classList.contains('hide')) {
        game.popup.classList.add('hide');
        hideGame();
    }
}
window.onclick = function (event) {
    if (event.target == game.popup) {
        game.popup.classList.add('hide');
    }
}

               //////////////////////////// AUDIO SETTINGS/////////////////////////////////////
		var beep = new Audio;
		beep.src="Music/gsound.mp3";
		
			
		beep.autoplay = true;
		
	     function playm(){		
			beep.autoplay = false;
			if(beep.paused){
			
				beep.play();
				 document.getElementById("sound").src="Images/volume_on.png"
			}else {
				beep.load();
				 document.getElementById("sound").src="Images/volume_off.png"
			}
			  
		 }
		 
		 document.getElementById("sound").onmousedown=playm;
		 
