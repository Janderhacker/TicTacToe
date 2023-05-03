var feld1 = 0;
var feld2 = 0;
var feld3 = 0;
var feld4 = 0;
var feld5 = 0;
var feld6 = 0;
var feld7 = 0;
var feld8 = 0;
var feld9 = 0;

var player = 1;
var zeichen = "X";

var Text = document.getElementById('value');
    Text.setAttribute("value","Player: "+player+"("+zeichen+") ist an der Reihe")

const button1 = document.querySelector('#eins')
const button2 = document.querySelector('#zwei')
const button3 = document.querySelector('#drei')
const button4 = document.querySelector('#vier')
const button5 = document.querySelector('#funf')
const button6 = document.querySelector('#sechs')
const button7 = document.querySelector('#sieben')
const button8 = document.querySelector('#acht')
const button9 = document.querySelector('#neun')

button1.addEventListener('click', eins);
button2.addEventListener('click', zwei);
button3.addEventListener('click', drei);
button4.addEventListener('click', vier);
button5.addEventListener('click', funf);
button6.addEventListener('click', sechs);
button7.addEventListener('click', sieben);
button8.addEventListener('click', acht);
button9.addEventListener('click', neun);

function eins(){
  button1.textContent = zeichen;
  button1.disabled = true;
  feld1 = player;
  update();
}
function zwei(){
  button2.textContent = zeichen;
  button2.disabled = true;
  feld2 = player;
  update();
}
function drei(){
  button3.textContent = zeichen;
  button3.disabled = true;
  feld3 = player;
  update();
}
function vier(){
  button4.textContent = zeichen;
  button4.disabled = true;
  feld4 = player;
  update();
}
function funf(){
  button5.textContent = zeichen;
  button5.disabled = true;
  feld5 = player;
  update();
}
function sechs(){
  button6.textContent = zeichen;
  button6.disabled = true;
  feld6 = player;
  update();
}
function sieben(){
  button7.textContent = zeichen;
  button7.disabled = true;
  feld7 = player;
  update();
}
function acht(){
  button8.textContent = zeichen;
  button8.disabled = true;
  feld8 = player;
  update();
}
function neun(){
  button9.textContent = zeichen;
  button9.disabled = true;
  feld9 = player;
  update();
}
       
  

function update(){
  if (feld1 == 1 && feld2 == 1 && feld3 == 1 || feld4 == 1 && feld5 == 1 && feld6 == 1 || feld7 == 1 && feld8 == 1 && feld9 == 1 ||
    feld1 == 1 && feld4 == 1 && feld7 == 1 || feld2 == 1 && feld5 == 1 && feld8 == 1 || feld3 == 1 && feld6 == 1 && feld9 == 1 ||
    feld1 == 1 && feld5 == 1 && feld9 == 1 || feld7 == 1 && feld5 == 1 && feld3 == 1){
    alert("Player: "+player+"("+zeichen+") hat gewonnen");
    reset();
  }

  if (feld1 == 2 && feld2 == 2 && feld3 == 2 || feld4 == 2 && feld5 == 2 && feld6 == 2 || feld7 == 2 && feld8 == 2 && feld9 == 2 ||
    feld1 == 2 && feld4 == 2 && feld7 == 2 || feld2 == 2 && feld5 == 2 && feld8 == 2 || feld3 == 2 && feld6 == 2 && feld9 == 2 ||
    feld1 == 2 && feld5 == 2 && feld9 == 2 || feld7 == 2 && feld5 == 2 && feld3 == 2){
    alert("Player: "+player+"("+zeichen+") hat gewonnen");
    reset();
  }

  if (button1.disabled && button2.disabled && button3.disabled && button4.disabled && button5.disabled && button6.disabled && button7.disabled && button8.disabled && button9.disabled){
    alert("tie");
    reset();
  }

  if (player == 1){
    player = 2;
    zeichen = "O";
  }
  else{
    player = 1;
    zeichen = "X";
  }
  var Text = document.getElementById('value');
    Text.setAttribute("value","Player: "+player+"("+zeichen+") ist an der Reihe");
} 

function reset(){
  button1.disabled = false;
  button2.disabled = false;
  button3.disabled = false;
  button4.disabled = false;
  button5.disabled = false;
  button6.disabled = false;
  button7.disabled = false;
  button8.disabled = false;
  button9.disabled = false;
  button1.textContent = "-";
  button2.textContent = "-";
  button3.textContent = "-";
  button4.textContent = "-";
  button5.textContent = "-";
  button6.textContent = "-";
  button7.textContent = "-";
  button8.textContent = "-";
  button9.textContent = "-";
  feld1 = 0;
  feld2 = 0;
  feld3 = 0;
  feld4 = 0;
  feld5 = 0;
  feld6 = 0;
  feld7 = 0;
  feld8 = 0;
  feld9 = 0;
  player = 1;
  zeichen = "X";
  //location.reload();
}