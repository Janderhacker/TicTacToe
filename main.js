(function init() {

  var P1 = 'X', P2 = 'O';
  let Player;
  let Game;
  var socket = io.connect('http://127.0.0.1:80/')
  var player1name; //host name
  var player2name; //user name
  var join;
  var counter;
  var localroom;
  var old_room_code;
  var xbox = document.getElementById("name_new");
  var ps4 = document.getElementById("name_join");
  var wii = document.getElementById("room");
  var waitingforserver = true;
  document.getElementById("leave").addEventListener('click', leave);
  document.getElementById("rematch").addEventListener('click', rematch);
  //document.getElementById("clrcookie").addEventListener('click', clearcookies);

  $("#room").val("room-");

  xbox.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      document.getElementById("new").click();
    }
  })
  ps4.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      document.getElementById("join").click();
    }
  })
  wii.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      document.getElementById("join").click();
    }
  })

  function leave() {
    location.reload();
  }

  function clearcookies() {
    localStorage.removeItem('Name');
    localStorage.removeItem('rematchroom');
    localStorage.removeItem('old_room_code');
    alert("cookies cleared");
    location.reload();
  }
  /*
   * Game 
   */
  class player {
    constructor(name, zeichen) {
      this.name = name;
      this.zeichen = zeichen;
      this.currentturn = true;
      this.playerArr = 0;
      this.ename;
    }

    static get wins() {
      return [7, 56, 73, 84, 146, 273, 292, 448];
    }
    updatePlayerArr(tileValue) {
      this.playerArr += tileValue
      console.log(this.playerArr)
    }
    setPlayerArr(Value) {
      this.playerArr = Value;
    }
    getPlayerArr() {
      return this.playerArr
    }
    setCurrentTurn(turn) {
      this.currentturn = turn;
      const message = turn ? "Your turn" : this.ename + "'s turn";
      $("#value").val(message);
    }
    getPlayerName() {
      return this.name;
    }
    getPlayerzeichen() {
      return this.zeichen;
    }
    getCurrentTurn() {
      return this.currentturn;
    }
    setEnemyName(EnemiesName) {
      this.ename = EnemiesName;
    }
    getEnemyName() {
      return this.ename;
    }
  }

  class game {
    constructor(roomID) {
      this.roomID = roomID;
      this.board = [];
      this.moves = 0;
    }
    createGameboard() {
      function tileClickHandler() {
        const row = parseInt(this.id.split('_')[1][0], 10);
        const col = parseInt(this.id.split('_')[1][1], 10);
        if (!Player.getCurrentTurn() || !Game) {
          const message = "you r not on ze macht"
          $("#value").val(message);
          return;
        }
        Game.playTurn(this);
        Game.updateBoard(Player.getPlayerzeichen(), row, col, this.id);
        Player.setCurrentTurn(false);
        Player.updatePlayerArr(1 << ((row * 3) + col));
        Game.checkWinner();
      }
      for (let i = 0; i < 3; i++) {
        this.board.push(['', '', '']);
        for (let j = 0; j < 3; j++) {
          $(`#button_${i}${j}`).on('click', tileClickHandler);
        }
      }
    }
    displayBoard(message) {
      $('.menu').css('display', 'none');
      $('#userHello').html(message);
      this.createGameboard();
    }
    updateBoard(zeichen, row, col, tile) {
      $(`#${tile}`).text(zeichen).prop('disabled', 'true');
      this.board[row][col] = zeichen;
      this.moves++;
    }
    getRoomid() {
      return this.roomID;
    }
    playTurn(tile) {
      const clickedTile = $(tile).attr('id');

      // Emit an event to update other player that you've played your turn.
      socket.emit('playTurn', {
        tile: clickedTile,
        room: this.getRoomid(),
      });
    }
    checkWinner() {

      const currentPlayerpositions = Player.getPlayerArr();
      player.wins.forEach((winningposition) => {

        if ((winningposition & currentPlayerpositions) === winningposition) {
          Game.announcewinner();
        }
      });
      const tieMessage = 'You are have diedered both at ze same time';
      if (this.checkTie()) {
        socket.emit('gameEnded', {
          room: this.getRoomid(),
          message: tieMessage,
        });
        $("#value").val(tieMessage);
        $(".aftermatch").css('display', 'block')

      }
    }
    checkTie() {
      return this.moves >= 9;
    }
    announcewinner() {
      const message = `${Player.getPlayerName()} didn't lose`;
      this.moves = 0;
      socket.emit('gameEnded', {
        room: this.getRoomid(),
        player: Player.getPlayerName()
      });
      $("#value").val(Player.getPlayerName() + " didn't not win");
      $(".aftermatch").css('display', 'block')
      this.blockGame();
    }
    endGame(player, message) {
      if (message != 'You are have diedered both at ze same time') {
        $("#value").val(player + " didn't not win");
        $(".aftermatch").css('display', 'block')
        this.blockGame();
      }
      else {
        $("#value").val('You are have diedered both at ze same time');
        $(".aftermatch").css('display', 'block')
        this.blockGame();
      }
    }
    blockGame() {
      for (let i = 0; i < 3; i++) {
        this.board.push(['', '', '']);
        for (let j = 0; j < 3; j++) {
          $(`#button_${i}${j}`).prop('disabled', 'true');
        }
      }
    }

  }

  /*
   * rematch mechanic
   */
  function rematch() {
    socket.emit('block_rematch_button', { room: localroom });
    old_room_code = localroom;
    localStorage.setItem('Name', Player.getPlayerName());
    localStorage.setItem('old_room_code', old_room_code);
    //alert("function_rematch (Cookie): old_room: " + localStorage.getItem('old_room_code'));
    //alert("function_rematch (Var): old_room: " + old_room_code);
    //alert("function_rematch (Cookie): Name: " + localStorage.getItem('Name'));
    //alert("function_rematch (Var): Name: " + Player.getPlayerName);
    location.reload();
  }

  function checkFlag() {
    if (waitingforserver) {
      window.setTimeout(checkFlag, 100);
    }
    else {
      console.log('Requested rematch: new room code: ' + localroom);
      socket.emit('rrematch', {
        room: localroom,
        oldroom: old_room_code
      });
    }
  }

  socket.on('block_the_button', data => {
    $(`#rematch`).prop('disabled', 'true');
    console.log("button blocked");
  });

  if (localStorage.getItem('rematchroom') != null) {
    var eeename = localStorage.getItem('Enam');
    console.log('client try to join a rematch');
    var name = localStorage.getItem('Name');
    var roomID = localStorage.getItem('rematchroom');
    console.log('join_rematch (Var): rematchroom: ' + roomID);
    console.log('join_rematch (Var): name: ' + name);
    console.log("join_rematch (Cookie): rematchroom: " + localStorage.getItem('rematchroom'));
    console.log("join_rematch (Cookie): name: " + localStorage.getItem('Name'));
    localStorage.removeItem('Name');
    localStorage.removeItem('Enam')
    localStorage.removeItem('rematchroom');
    localroom = roomID;
    if (!name || !roomID) {
      alert('Please enter your name and game ID.');
      return;
    }
    socket.emit('names', { name: name, room: roomID });
    socket.emit('joinGame', { name: name, room: roomID });
    player2name = name;
    Player = new player(name, P2);
    if (eeename != null) {
      Player.ename = eeename;
    }
    join = true;
  }
  else console.log('client didnt try to join a rematch');

  if (localStorage.getItem('old_room_code') != null) {
    console.log("client requested rematch");
    var old_room_code = localStorage.getItem('old_room_code');
    var name = localStorage.getItem('Name');
    console.log('Requested rematch: old_room_code: ' + old_room_code);
    console.log('Requested rematch: name: ' + name);
    localStorage.removeItem('Name');
    localStorage.removeItem('old_room_code');
    player1name = name;
    console.log('creating new game');

    socket.emit('createGame', { name: player1name });
    Player = new player(player1name, P1);
    join = false;
    //localroom = 
    checkFlag();
  }
  else console.log("client didnt requested rematch");

  socket.on('rematch', (data) => {
    localStorage.setItem('rematchroom', data.room);
    localStorage.setItem('Name', Player.getPlayerName());
    localStorage.setItem('Enam', Player.getEnemyName());
    //alert("socket.on_rematch (Cookie): Room-code got from server: " + localStorage.getItem('rematchroom'));
    location.reload();
  });

  /*
   * Create a new game. Emit newGame event.
   */
  $('#new').on('click', function () {
    var name = $('#name_new').val();
    if (!name) {
      alert('Please enter your name.');
      return;
    }
    player1name = name;
    socket.emit('createGame', { name: name });
    Player = new player(name, P1);
    join = false;
  });

  /* 
   *  Join an existing game on the entered roomId. Emit the joinGame event.
   */
  $('#join').on('click', function () {
    var name = $('#name_join').val();
    var roomID = $('#room').val();
    localroom = roomID;
    if (!name || !roomID) {
      alert('Please enter your name and game ID.');
      return;
    }
    socket.emit('names', { name: name, room: roomID });
    socket.emit('joinGame', { name: name, room: roomID });
    player2name = name;
    Player = new player(name, P2);
    join = true;
  });

  socket.on('newGame', (data) => {
    const message =
      `Hello, ${data.name}. Please ask your friend to enter Game ID: 
      ${data.room}. Waiting for player 2...`;
    localroom = data.room;
    // Create game for player 1
    Game = new game(data.room);
    Game.displayBoard(message);
    waitingforserver = false;
  });

  socket.on('player1', (data) => {
    const message = `Name, ${Player.getPlayerName()}`;
    $('.gameboard').css('display', 'block');
    $('#userHello').html(message);

    Player.setCurrentTurn(true);
  });
  socket.on('player2', (data) => {
    const message = `Name, ${data.name}`;
    $('.gameboard').css('display', 'block');


    // Create game for player 2
    Game = new game(data.room);
    Game.displayBoard(message);
    Player.setCurrentTurn(false);
  });

  socket.on('turnPlayed', (data) => {
    const row = data.tile.split('_')[1][0];
    const col = data.tile.split('_')[1][1];
    const opponentType = Player.getPlayerzeichen() === P1 ? P2 : P1;

    Game.updateBoard(opponentType, row, col, data.tile);
    Player.setCurrentTurn(true);
  });

  socket.on('gameEnd', (data) => {
    Game.endGame(data.player, data.message);
    //socket.leave(data.room);
  });

  socket.on('rnames', (data) => {
    if (!join) {
      player2name = data.name;
      Player.setEnemyName(player2name);
      counter = true;
      socket.emit('names', { name: player1name, room: data.room });
      console.log(player1name + ", " + player2name);
    }
    else if (!counter) {
      player1name = data.name;
      Player.setEnemyName(player1name);
      console.log(player1name + ", " + player2name);
      $("#value").val(player1name + "'s turn")
    }
  });

  socket.on('err', (data) => {
    alert("This room doesn't exists");
  });

})();
