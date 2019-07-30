// Your web app's Firebase configuration
var firebaseConfig = {
   apiKey: "AIzaSyBCzyijPED6pI69mq5zD5je-kLX1KkWPDo",
   authDomain: "typingspeedtest-fc1ce.firebaseapp.com",
   databaseURL: "https://typingspeedtest-fc1ce.firebaseio.com",
   projectId: "typingspeedtest-fc1ce",
   storageBucket: "",
   messagingSenderId: "95363253229",
   appId: "1:95363253229:web:a40fc7e1d73eef2c"
 };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var textDisplay = document.querySelector("#textDisplay");
var input = document.querySelector("#inputField");
var currentWord = 0;
var correct = 0;
var word = [];
var wordList = [];
var randomWords = [];
var wordCount = 25;
var topicSelected = false;
var userTopic = "";
var startTime = 0;

//Firebase Database Variables
var database = firebase.database();
var name = "";
var user = null;
// var lwpm = [];
var lname = [];
var lacc = [];




database.ref(`leaderboard`).on("child_added", function(snapshot){
   var lwpm = database.ref(`leaderboard`).orderByChild('wordsPerMinute');
   // lwpm.push(snapshot.val().wordsPerMinute);
   // lname.push(snapshot.val().name);
   // lacc.push(snapshot.val().Accuracy);
   console.log(lwpm);
   // console.log(lname);
   // console.log(lacc);
});

if (topicSelected === false) {
   $("#textDisplay").append($("<h1>", { "text": "Please enter a topic" }));
   $("#textBox").append($("<input>",{"id" : "input", "value" : "Enter","type" : "submit"}));
   $("#input").on("click", function (event) {
      event.preventDefault();
      userTopic = ($("#inputField").val());
      console.log(userTopic);
      $("#inputField").val("");
      topicSelected = true;
      console.log(topicSelected);
      start()
   });
}
function start() {
   var queryURL = "https://api.datamuse.com/words?ml=" + userTopic + "&max=200";
   console.log(queryURL);
   $.ajax({
      url: queryURL,
      method: 'GET'
   }).then(function (response) {
      var results = response;
      //--------------------Generate Word Array from API-------------------------
      for (var i = 0; i < results.length; i++) {
         if (results[i].word.indexOf(" ") >= 0) {
            // console.log("includes space")
         }
         else if (results[i].word.indexOf("-") >= 0 || results[i].word.indexOf("_") >= 0 || results[i].word.indexOf("'") >= 0 || results[i].word.indexOf("/") >= 0 || results[i].word.indexOf("[") >= 0 || results[i].word.indexOf("]") >= 0 || results[i].word.indexOf("{") >= 0 || results[i].word.indexOf("}") >= 0) {
            // console.log("Includes invalid characters");

         }
         else if (results[i].word.length >= 9) {
            // console.log("Culled long word")
         }
         else {
            // console.log("Does not Include Space");
            word = results[i].word;
            wordList.push(word);
         }
      }
      $(document).on("click", ".wordCount", function () {
         console.log($(this).attr('value'));
         $("span").removeClass("selected");
         $(this).addClass("selected");
         wordCount = $(this).attr('value');
         console.log(wordCount);
         showText();
      });
      //-------------------------------------Reset function for the game starting---------------------------------------
      function reset() {
         currentWord = 0;
         correct = 0;
         input.value = "";
         input.className = '';
         textDisplay.style.display = 'block';
         startTime = 0;
         $("#input").remove();
         $("#submitInfo").remove();
         $("#textDisplay").empty();
         $("#textBox").append($("<input>",{"id" : "input", "value" : "Restart","type" : "submit"}));
         showText();
      }
      //-------------------------Places words from the word list into the DOM ----------------------------
      function showText() {
         $("#textDisplay").empty();
         randomWords = [];
         for (var i = 0; i < wordCount; i++) {
            var ranWord = wordList[Math.floor(Math.random() * wordList.length)];
            console.log(ranWord);
            if (wordList[wordList.length - 1] !== ranWord || wordList[wordList.length - 1] === undefined) {
               randomWords.push(ranWord);
            }
         }
         randomWords.forEach(function(word){
            $("#textDisplay").append($("<span>",{"text": word + " "}));
         });
         textDisplay.firstChild.classList.add("highlightedWord")
      }
      function showResult() {

         var words, minute, accuracy;
         words = correct / 5;
         minute = (Date.now() - startTime) / 1000 / 60;
         var totalKeys = -1;
         randomWords.forEach(e => (totalKeys += e.length + 1));
         accuracy = Math.floor((correct / totalKeys) * 100);
         var wpm = Math.floor(words / minute);
         $("#textDisplay").prepend($("<h1>",{"id" : "stats", "text" : `WPM : ${wpm} | ACC : ${accuracy}`}))
         $("#stats").append($("<p>",{"text" : "Enter your name for the leaderboard."}))
         $("#input").remove();
         $("#textBox").append($("<input>",{"id" : "submitInfo", "value" : "Enter","type" : "submit"}));
         $(document).on("click","#submitInfo", function(event){
            event.preventDefault();
            if(($("#inputField").val().trim() !== ""))
            {
               name = $("#inputField").val().trim();
               user = {
                  name : name,
                  wordsPerMinute : wpm,
                  Accuracy : accuracy,
               };
               database.ref().child(`leaderboard/`).push(user);
            }
            reset();
         });
      }
      //Checking user typing
      input.addEventListener('keydown', event => {
         if (currentWord < randomWords.length) {
            inputFieldClass();
         }
         //check user keydowns between the letters a and z
         function inputFieldClass() {
            if (event.key >= 'a' && event.key <= 'z') {
               var inputSlice = input.value + event.key;
               var currentWordSlice = randomWords[currentWord].slice(0, inputSlice.length);
               // console.log(currentWordSlice);
               input.className = inputSlice === currentWordSlice ? '' : 'wrong';
            }else if (event.key === 'Backspace') {
               var inputSlice = event.ctrlKey ? '' : input.value.slice(0, input.value.length - 1);
               var currentWordSlice = randomWords[currentWord].slice(0, inputSlice.length);
               // console.log(currentWordSlice);
               input.className = inputSlice === currentWordSlice ? '' : 'wrong';
            } else if (event.key === ' ') {
               input.className = "";
            }
         };
         //Generates a time-stamp of when the user starts typing
         if (currentWord === 0 && input.value === "") {
            startTime = Date.now();
         }
         // Check the inputed word the user typed out and assign the styles depening on if its correct or not.
         if (event.key === ' ') {
            event.preventDefault();
            if (input.value !== "") {
               if (currentWord <= randomWords.length - 1) {
                  if (input.value === randomWords[currentWord]) {
                     textDisplay.childNodes[currentWord].classList.add('correct');
                     correct += randomWords[currentWord].length + 1;
                  } else {
                     textDisplay.childNodes[currentWord].classList.add("wrong");
                  }
                  textDisplay.childNodes[currentWord + 1].classList.add('highlightedWord');
               } else if (currentWord === randomWords.length - 1) {
                  textDisplay.childNodes[currentWord].classList.add("wrong");
                  showResult();
               }
               input.value = "";
               currentWord++;
            }
            // Check if it is the last word and input word is correct show the result
         } else if (currentWord === randomWords.length - 1) {
            if (input.value + event.key === randomWords[currentWord]) {
               textDisplay.childNodes[currentWord].classList.add('correct');
               correct += randomWords[currentWord].length;
               currentWord++;
               $("#inputField").val("");
               showResult();
            }
            input.value = "";
            currentWord++;
         }
      });
     
      reset();
   });

}