var textDisplay = document.querySelector("#textDisplay");
var input = document.querySelector("#input-field");
var currentWord = 0;
var correct = 0;
var word = [];
var wordList = [];
var wordListFiltered = [];


//--------------------------------------Set the API---------------------------
var queryURL = "https://api.datamuse.com/words?ml=breakfast&max=100";
$.ajax({5
   url : queryURL,
   method : 'GET'
}).then(function(response){
   var results = response;
   //--------------------Generate Word Array from API-------------------------
   for(var i = 0; i < results.length; i++)
   {
      if(results[i].word.includes(" "))
      { }
      else
      {
         word = results[i].word
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
      wordList.forEach(word => {
         var span = document.createElement('span');
         span.innerHTML = word + ' ';
         textDisplay.appendChild(span);
      })
      textDisplay.firstChild.classList.add("highlightedWord")
   } 
   //Checking user typing
   input.addEventListener('keydown', event => {
      //check user keydowns between the letters a and z
      if(currentWord < wordList.length)
      {
         inputFieldClass();
      }
      function inputFieldClass()
      {
         if(event.key >= 'a' && event.key <= 'z')
         {
            var inputSlice = input.value + event.key;
            var currentWordSlice = wordList[currentWord].slice(0,inputSlice.length);
            console.log(currentWordSlice);
            input.className = inputSlice === currentWordSlice ? '' : 'wrong';
         }
         else if(event.key === 'Backspace')
         {
            var inputSlice = event.ctrlKey ? '' : input.value.slice(0, input.value.length -1);
            var currentWordSlice = wordList[currentWord].slice(0, inputSlice.length);
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
            if (currentWord < wordList.length -1)
            {
               if(input.value === wordList[currentWord])
               {
                  textDisplay.childNodes[currentWord].classList.add('correct');
                  correct += wordList[currentWord].length + 1;
               }
               else
               {
                  textDisplay.childNodes[currentWord].classList.add("wrong");
               }
               textDisplay.childNodes[currentWord + 1].classList.add('highlightedWord');
            }
            else if(currentWord === wordList.length - 1)
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