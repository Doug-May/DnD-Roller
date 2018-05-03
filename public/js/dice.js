//initialize an array to store our history of rolls
var rollHistory = [];

//set up the dice object and its values
var diceObject = {};
diceObject.number = function(){
   return parseInt(document.getElementById('number').value) || 1;
};
diceObject.type = 20;
diceObject.modifier = function(){
   return parseInt(document.getElementById('modifier').value) || 0;
};
diceObject.roll = function() {
   var counter = 0;
   for(i=0;i<diceObject.number();i++){
      counter += Math.ceil(Math.random()*diceObject.type);
   }
   return counter;
};


//onchange function when user selects a different dice type
function typeUpdate(option){
   diceObject.type = parseInt(option);
   document.getElementById('dice').src = "/img/d" + option + ".png";
};

//onclick function when user clicks the dice img to make a roll
document.getElementById('dice').onclick = makeRoll;

//onpress enter make the roll
document.addEventListener("keydown", function(e){
   if (e.keyCode === 13 && !$("body").hasClass("swal2-shown")){
      makeRoll();
   }
});


//this triggers the roll method on the diceObject when the user hits enter or when they click
function makeRoll(){
   if(parseInt(diceObject.number()) > 99) {
      document.getElementById('message').style.visibility = "visible";
      return;
   } else {
      document.getElementById('message').style.visibility = "hidden";
   }
   $("#dice").addClass("roll");
   setTimeout(function(){
      $("#dice").removeClass("roll");
      sweetAlert({title:"You rolled " + (diceObject.roll() + diceObject.modifier()), confirmButtonColor:"#4e5b6d", confirmButtonText:"OK"});
   },400);


   //capture the state of the current dice roll (if unique) and push it to an array where we can re-roll (max history of 5)
   var unique = true;
   var historyDiv = document.getElementById('history');
   var historyElements = historyDiv.getElementsByTagName('h2');
   for(i=0;i<rollHistory.length;i++) {
      if(rollHistory[i].number === diceObject.number() && rollHistory[i].modifier === diceObject.modifier() && rollHistory[i].type === diceObject.type ) {
         unique = false;
         break;
      }
   }
   if(unique && rollHistory.length == 5){
      rollHistory.shift();
   }
   if(unique){
      rollHistory.push(new diceState(diceObject.number(), diceObject.type, diceObject.modifier()));
      //update the h2 elements with the new results array.
      for(i=0;i<rollHistory.length;i++){
         historyElements[i].innerHTML = "(" + rollHistory[rollHistory.length - 1 - i].number + ")d" + rollHistory[rollHistory.length - 1 - i].type + " + " + rollHistory[rollHistory.length - 1 - i].modifier;
      }
   }
   unique = true;

};

//clearing function
document.getElementById('clear').onclick = function(){
   document.getElementById('modifier').value = "";
   document.getElementById('number').value = "";
   document.getElementById('message').style.visibility = "hidden";
}





//function constructor for creating a history of diceObjects that are rolled
function diceState(number, type, modifier){
   this.number = number;
   this.type = type;
   this.modifier = modifier;
   this.roll = function() {
      var counter = 0;
      for(i=0;i<this.number;i++){
         counter += Math.ceil(Math.random()*this.type);
      }
      counter += modifier;
      return counter;
   }
}

//click functions for each history entry
document.getElementById('0').onclick = function() {
   sweetAlert({title:"You rolled " + (rollHistory[rollHistory.length-1].roll()), confirmButtonColor:"#4e5b6d", confirmButtonText:"OK"});
};

document.getElementById('1').onclick = function() {
   sweetAlert({title:"You rolled " + (rollHistory[rollHistory.length-2].roll()), confirmButtonColor:"#4e5b6d", confirmButtonText:"OK"});
};

document.getElementById('2').onclick = function() {
   sweetAlert({title:"You rolled " + (rollHistory[rollHistory.length-3].roll()), confirmButtonColor:"#4e5b6d", confirmButtonText:"OK"});
};

document.getElementById('3').onclick = function() {
   sweetAlert({title:"You rolled " + (rollHistory[rollHistory.length-4].roll()), confirmButtonColor:"#4e5b6d", confirmButtonText:"OK"});
};

document.getElementById('4').onclick = function() {
   sweetAlert({title:"You rolled " + (rollHistory[rollHistory.length-5].roll()), confirmButtonColor:"#4e5b6d", confirmButtonText:"OK"});
};
