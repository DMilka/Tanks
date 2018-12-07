/* ***************************

        Tanks Controller

******************************/
const tanksController = (function() {
  let Tank = function(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  };

  let boardData = {
    playerBoard: [],
    computerBoard: []
  };

  return {
    test: function() {
      return boardData;
    },

    
    getBoardData: function() {
      return boardData;
    },


    setPlayerTank: function(id, x, y) {
      let tank;

      tank = new Tank(id, x, y);

      boardData.playerBoard.push(tank);
    },

    fillEnemyBoard: function() {
      let x, y, placedX, placedY, tank, validated, id;
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);  

      tank = new Tank(1, x, y);

      boardData.computerBoard.push(tank);
     
      do {
        validated = true;
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);  
        for(let i = 0; i < boardData.computerBoard.length; i++) {
          placedX = boardData.computerBoard[i].x;
          placedY = boardData.computerBoard[i].y;
  
          if(placedX === x && placedY === y) {
            validated = false;
          } 

          if(x >= 0  && x < 10 && y >= 0 && y < 10) {
            if(  ( placedX + 1 === x && placedY === y )
              || ( placedX - 1 === x && placedY === y )
              || ( placedY + 1 === y && placedX === x ) 
              || ( placedY - 1 === y && placedX === x )
              || ( placedX + 1 === x && placedY + 1 === y )
              || ( placedX - 1 === x && placedY + 1 === y )
              || ( placedX - 1 === x && placedY - 1 === y )
              || ( placedX + 1 === x && placedY - 1 === y )
            ) validated = false;
          }
          id = i + 2;
        }

        if(validated) {
          tank = new Tank(id, x, y);
          boardData.computerBoard.push(tank);
        }
        
      } while (boardData.computerBoard.length <= 6);
    },
    // setComputerTanks: function(x, y) {

    // }
  }
})();


/* ***************************

  User Interface Controller

******************************/
const UIController = (function() {
  let DOMstrings = {
    gameMenu: '.game-menu',
    game: '.game',
    playerBoard: '#player-board',
    computerBoard: '#computer-board',
    gameStartBtn: '#game-start-btn',
    container: '.container',
    gameSettings: '.game__settings-board',
    boardElement: '.board-element'
  }

  return {
    getDOMelemenets: function() {
      return DOMstrings;
    },

    showPlayerSettingBoard: function() {
      document.querySelector(DOMstrings.gameMenu).classList.add('hidden');
      document.querySelector(DOMstrings.game).classList.remove('hidden');
    },

    createBoards: function() {
      let html, element;

      html = '<div class="board-element" id="player_board-%x%-%y%"></div>'
      element = document.querySelector(DOMstrings.playerBoard);


      for(let y = 0; y < 10; y++) {
        for(let x = 0; x < 10; x++) {
          newHtml = html.replace('%x%', x);
          newHtml = newHtml.replace('%y%', y);
          element.insertAdjacentHTML('beforeend', newHtml);
        }
      }

      html = '<div class="board-element" id="computer_board-%x%-%y%"></div>'
      element = document.querySelector(DOMstrings.computerBoard);

      for(let y = 0; y < 10; y++) {
        for(let x = 0; x < 10; x++) {
          newHtml = html.replace('%x%', x);
          newHtml = newHtml.replace('%y%', y);
          element.insertAdjacentHTML('beforeend', newHtml);
        }
      }
    },

    placeTankInUI: function(item) {
      document.querySelector('#'+item).style.backgroundImage = "url('Tank.png')";
    },

    showEnemyBoard: function() {
      let containers;
      containers = document.querySelectorAll(DOMstrings.container);

      containers[1].classList.toggle('hidden');

      document.querySelector(DOMstrings.gameSettings).classList.toggle('hidden');
      document.querySelector(DOMstrings.playerBoard).id = "player-board-complete";
      document.querySelector(DOMstrings.computerBoard).classList.toggle('enemy-board-ready');
    }
  };
})();

/* ***************************

          Controller

******************************/
const controller = (function(tanksCtrl, UICtrl) {
  let setupEventListeners = function() {
    const DOM = UICtrl.getDOMelemenets();
    document.querySelector(DOM.gameStartBtn).addEventListener('click', startGame);

    document.querySelector(DOM.playerBoard).addEventListener('click', placeTanks);
  };

  let putTank = function(e, boardData) {
    let item, dividedItem, id, x, y, validated = true, placedX, placedY;

    item = e.target.id;
      dividedItem = item.split('-');
      x = parseInt(dividedItem[1]);
      y = parseInt(dividedItem[2]);
        
      if(boardData.playerBoard.length !== 0) {
        for(let i = 0; i < boardData.playerBoard.length; i++) {
          placedX = boardData.playerBoard[i].x;
          placedY = boardData.playerBoard[i].y;
          
          if(placedX === x && placedY === y) {
            validated = false;
            break;
          } 
              // 2, Sprawdz czy czolg nie jest umieszczany za blisko istniejacego czolgu
          if(x >= 0  && x < 10 && y >= 0 && y < 10) {
            if(  ( placedX + 1 === x && placedY === y )
              || ( placedX - 1 === x && placedY === y )
              || ( placedY + 1 === y && placedX === x ) 
              || ( placedY - 1 === y && placedX === x )
              || ( placedX + 1 === x && placedY + 1 === y )
              || ( placedX - 1 === x && placedY + 1 === y )
              || ( placedX - 1 === x && placedY - 1 === y )
              || ( placedX + 1 === x && placedY - 1 === y )
            ) validated = false;
          } 
        }    
      }
      
      if(typeof placedX === "undefined") placedX = 0;
      if(typeof placedY === "undefined") placedY = 0;

      if(!isNaN(x) && !isNaN(y) && !isNaN(placedX) && !isNaN(placedY)) {
        if(validated) {
          tanksCtrl.setPlayerTank(1, x, y);
          UICtrl.placeTankInUI(item);
        }
      }
  };

  let placeTanks = function(e) {
    let boardData, tankCounter;

    // Pobierz informacje o planszy gracza
    boardData = tanksCtrl.getBoardData();
      
    tankCounter = boardData.playerBoard.length;
    if(tankCounter <= 7) {
      putTank(e, boardData);
      tankCounter = boardData.playerBoard.length;
      if(tankCounter === 7) {
        UICtrl.showEnemyBoard();
      }
    }
  };

  let startGame = function() {
    // 1. Wygeneruj plansze i pokaz je
    UICtrl.createBoards();
    UICtrl.showPlayerSettingBoard();
    tanksCtrl.fillEnemyBoard();

    // // 2. Popros gracza o ustawienie czolgów
    // tanksCtrl.setPlayerTanks();

    // // 3. Ustaw czolgi przeciwnika 
    // tanksCtrl.setComputerTanks();

    // // 4. Pokaz obie planszei ukryj instrukcje
    // UICtrl.showEnemyBoard();
  };

  return {
    init: function() {
      setupEventListeners();
    }
  };
})(tanksController, UIController);

controller.init();