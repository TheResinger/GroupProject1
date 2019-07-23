var queryURL = "https://tastedive.com/api/similar?q=spider+man?type=movie?k=340975-MoviePar-SZBYPH0E";

$.ajax({
    url : queryURL,
    method : 'GET'
}).then(function(res){
    console.log(res);
});