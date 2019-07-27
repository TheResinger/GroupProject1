var textDisplay = document.querySelector("#textDisplay");
var input = document.querySelector("#inputField");
var currentWord = 0;
var correct = 0;
var word = [];
var wordList = [];
var wordListRandom = [];
var wordCount = 25;
var topicSelected = false;
var userTopic = "";
var words = 100;

$(document).on("click", ".wordCount", function(){
   console.log($(this).attr('value'));
   $("span").removeClass("selected");
   $(this).addClass("selected");
   wordCount = $(this).attr('value');
   console.log(wordCount);
   
});
if(topicSelected === false)
{
   $("#textDisplay").append($("<h1>",{"text": "Please enter a topic"}));
   $("#input").on("click",function(event){
      event.preventDefault();
      userTopic = ($("#inputField").val());
      console.log(userTopic);
      $("#inputField").val("");
      topicSelected = true;
      console.log(topicSelected);
      start();
   });
}
function start()
{
   console.log("text");
   var queryURL = "https://api.datamuse.com/words?ml=" + userTopic + "&max=200";
   console.log(queryURL);
   $.ajax({
      url : queryURL,
      method : 'GET'
   }).then(function(response){
      var results = response;
      //--------------------Generate Word Array from API-------------------------
      for(var i = 0; i < results.length; i++)
      {
         if(results[i].word.indexOf(" ") >= 0)
         {
            console.log("includes space")
         }
         else
         {
            console.log("Does not Include Space");
            word = results[i].word;
            wordList.push(word);
         }
      }
      //-------------------------------------Reset function for the game starting---------------------------------------
      function reset(){
         currentWord = 0;
         correct = 0;
         $("#textDisplay").empty();
         showText();
         input.value = "";
         input.className = '';
         textDisplay.style.display = 'block';
      }
      //-------------------------Places words from the word list into the DOM ----------------------------
      function showText()
      {
         for(var i = 0; i < wordCount; i++)
         {
            var ranWord = wordList[Math.floor(Math.random() * wordCount)];
            wordListRandom.push(ranWord);
            $("#textDisplay").append($("<span>",{"text": ranWord + " "}));
         }
         textDisplay.firstChild.classList.add("highlightedWord")
      } 
      //Checking user typing
      input.addEventListener('keydown', event => {
         //check user keydowns between the letters a and z
         if(currentWord < wordListRandom.length)
         {
            inputFieldClass();
         }
         function inputFieldClass()
         {
            if(event.key >= 'a' && event.key <= 'z')
            {
               var inputSlice = input.value + event.key;
               var currentWordSlice = wordListRandom[currentWord].slice(0,inputSlice.length);
               console.log(currentWordSlice);
               input.className = inputSlice === currentWordSlice ? '' : 'wrong';
            }
            else if(event.key === 'Backspace')
            {
               var inputSlice = event.ctrlKey ? '' : input.value.slice(0, input.value.length -1);
               var currentWordSlice = wordListRandom[currentWord].slice(0, inputSlice.length);
               console.log(currentWordSlice);
               input.className = inputSlice === currentWordSlice ? '' : 'wrong';
            }
            else if(event.key === ' ')
            {
               input.className = "";
            }
         };
         if(event.key === " ")
         {
            event.preventDefault();
            if(input.value !== " ")
            {
               if (currentWord < wordListRandom.length - 1)
               {
                  if(input.value === wordListRandom[currentWord])
                  {
                     textDisplay.childNodes[currentWord].classList.add('correct');
                     correct += wordListRandom[currentWord].length + 1;
                  }
                  else
                  {
                     textDisplay.childNodes[currentWord].classList.add("wrong");
                  }
                  textDisplay.childNodes[currentWord + 1].classList.add('highlightedWord');
               }
               else if(currentWord === wordListRandom.length - 1)
               {
                  textDisplay.childNodes[currentWord].classList.add("wrong");
               }
            }
            input.value = "";
            currentWord++;
         }
      });
      reset();
   }); 
}