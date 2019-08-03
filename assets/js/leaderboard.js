database.ref('leaderboard').orderByChild("wordsPerMinute").on('value', function (snapshot) {
    var WPMgroups = {};
    var maxgroup = 0;
    lname = [];
    lwpm = [];
    lacc = [];
 
    var totalusers = 0;
    var totalaccuracy = 0 ;
    var totalwpm = 0;
 
    snapshot.forEach(function (child) {
       lwpm.push(child.val().wordsPerMinute);
       // console.log("TCL: lwpm", lwpm)
       lname.push(child.val().name);
       // console.log("TCL: lname", lname)
       lacc.push(child.val().Accuracy);
       // console.log("TCL: lacc", lacc)
 
       totalaccuracy += parseFloat(child.val().Accuracy);
       totalusers++;
 
       totalwpm += parseFloat(child.val().wordsPerMinute);
       
       //-------CHART BEGINS-------
       var wpm = child.val().wordsPerMinute;
       var wpmgroup = Math.floor(wpm / 10)
       if (!WPMgroups[wpmgroup * 10]) {
          WPMgroups[wpmgroup * 10] = 1
       }
       else {
          WPMgroups[wpmgroup * 10]++;
       }
       if (maxgroup < wpmgroup) {
          maxgroup = wpmgroup;
       }
 
    });
 
    var averageaccuracy = Math.round(totalaccuracy/totalusers);
    var averagewpm = Math.round(totalwpm/totalusers);
    $("#stats").text(`WPM : ${averagewpm} | ACC : ${averageaccuracy} %`)
 
 
 
    // -----------------------chart ends --------------
 
    rlname = [];
    rlwpm = [];
    rlacc = [];
    rlname = lname.reverse();
    rlwpm = lwpm.reverse();
    rlacc = lacc.reverse();
    var xaxis = [];
    var values = [];
    for (var i = 0; i <= maxgroup; i++) {
       var lowerbound = i * 10;
       var upperbound = ((i + 1) * 10) - 1;
       xaxis.push(lowerbound);
       if (WPMgroups[i * 10]) {
          values.push(WPMgroups[i * 10])
       }
       else {
          values.push(0)
       }
    }
 
    var chart = new Chart(document.getElementById("myChart"), {
       type: 'bar',
       data: {
          labels: xaxis,
          datasets: [
             {
                label: "Number of Users",
                backgroundColor: "rgb(10, 172, 147)",
                data: values
             }
          ]
       },
       options: {
          legend: { display: false },
          title: {
             display: true,
             text: 'Global Stats',
             fontSize: 32,
             fontFamily: 'Calibri',
          }
       }
    });
    
 });
 