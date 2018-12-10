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
    computerBoard: [],
    playerTanksDestroyed: 0,
    computerTanksDestroyed: 0
  };

  return {
    test: function() {
      return boardData;
    },

    
    getBoardData: function() {
      return boardData;
    },

    resetBoardData: function() {
      boardData.playerBoard = [];
      boardData.computerBoard = [];
      boardData.playerTanksDestroyed = 0;
      boardData.computerTanksDestroyed = 0;
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
    boardElement: '.board-element',
    restartGame: '#restart-game-btn',
    winnerContainer: '.winner-container',
    winnerTitle: '.winner-title',
    tanksCounter: '#tanks-counter'
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
      document.querySelector(DOMstrings.playerBoard).classList.toggle('default');
      document.querySelector(DOMstrings.computerBoard).classList.toggle('enemy-board-ready');
    },

    showShotInUI: function(item, hit) {
      if(hit === 1) {
        document.querySelector('#'+item).classList.add('hit');
      } else if (hit === 0) {
        document.querySelector('#'+item).classList.add('miss');
      }
    },

    showWinner: function(winner) {
      document.querySelector(DOMstrings.winnerTitle).textContent = winner + " wygrał!";
      document.querySelector(DOMstrings.winnerContainer).classList.toggle('hidden');
    },

    restartGameUI: function() {
      let playerBrd = document.querySelector(DOMstrings.playerBoard);
      let enemyBrd = document.querySelector(DOMstrings.computerBoard);

      document.querySelector(DOMstrings.winnerContainer).classList.toggle('hidden');
      document.querySelector(DOMstrings.gameSettings).classList.toggle('hidden');
      document.querySelector(DOMstrings.computerBoard).classList.toggle('enemy-board-ready');
      document.querySelectorAll(DOMstrings.container)[1].classList.toggle('hidden');
      document.querySelector(DOMstrings.playerBoard).classList.toggle('default');

      while (playerBrd.firstChild) {
        playerBrd.removeChild(playerBrd.firstChild);
      }

      while (enemyBrd.firstChild) {
        enemyBrd.removeChild(enemyBrd.firstChild);
      }
    },

    upgradeCounter: function(dataLength) {
      let counter = 7;
      counter = counter - dataLength;
      document.querySelector(DOMstrings.tanksCounter).textContent = counter;
    },

    getBoardElement: function(x,y) {
      let element;

      element = document.querySelector('#player_board-'+x+'-'+y);

      return element;
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

    document.querySelector(DOM.restartGame).addEventListener('click', restartGame);

    document.querySelector(DOM.playerBoard).addEventListener('click', placeTanks);

    document.querySelector(DOM.computerBoard).addEventListener('click', shot);
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
          tanksCtrl.setPlayerTank(boardData.playerBoard.length, x, y);
          UICtrl.placeTankInUI(item);
          UICtrl.upgradeCounter(boardData.playerBoard.length);
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

  let computerShot = function() {
    let x,y, computerBoardItem, validatedBoardItem = false, item, boardData, miss = true;
    // 1. Generuj wspolrzedne x,y
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);  

      // 2. Sprawdz czy wczesniej nie padl juz strzal na wybranych wspolrzednych 
        // 2.1 Pobierz diva o wygenerowanych wspolrzednych
        computerBoardItem = UICtrl.getBoardElement(x,y);
        // 2.2 Sprawdz czy div ten zawiera klasy miss lub hit
        if(!computerBoardItem.classList.contains('miss') && !computerBoardItem.classList.contains('hit')) {
           // 2.3 Jesli zawiera wroc do punktu 1
           //     Jesli nie zawiera przejdz do punktu 3
          validatedBoardItem = true;
        }
    } while(validatedBoardItem === false);
     
    item = computerBoardItem.id;
    boardData = tanksCtrl.getBoardData();

    // 3. Dodaj klase miss lub hit w zaleznosci od trafienia
      // 3.1 Jesli hit dodaj informacje o trafieniiu do strukury danych
      for (let i = 0; i < boardData.playerBoard.length; i++) {
        if(boardData.playerBoard[i].x === x && boardData.playerBoard[i].y === y) {
          boardData.playerTanksDestroyed++;
          UICtrl.showShotInUI(item, 1);
          miss = false;
          break;
        } 
      }
  
      if(boardData.playerTanksDestroyed === 7) {
        UICtrl.showWinner("Computer");
      } 
  
      if(miss) {
        UICtrl.showShotInUI(item, 0);
      }
     
  };


  let shot = function(e) {
    let item, dividedItem, x, y, boardData, miss = true;

    if(!e.target.classList.contains('miss') && !e.target.classList.contains('hit')) {
      boardData = tanksCtrl.getBoardData();
      item = e.target.id;
      dividedItem = item.split('-');
      x = parseInt(dividedItem[1]);
      y = parseInt(dividedItem[2]);
  
      if(dividedItem[0] === 'computer_board') {
        for (let i = 0; i < boardData.computerBoard.length; i++) {
          if(boardData.computerBoard[i].x === x && boardData.computerBoard[i].y === y) {
            boardData.computerTanksDestroyed++;
            UICtrl.showShotInUI(item, 1);
            miss = false;
            break;
          } 
        }
    
        if(boardData.computerTanksDestroyed === 7) {
          UICtrl.showWinner("Player");
        } 
    
        if(miss) {
          UICtrl.showShotInUI(item, 0);
        }
        setTimeout(computerShot, 800);
        
      }
    }
  };

  


  let startGame = function() {
    // 1. Wygeneruj plansze i pokaz je
    UICtrl.createBoards();
   
    

    // // 2. Popros gracza o ustawienie czolgów
    UICtrl.showPlayerSettingBoard();

    // // 3. Ustaw czolgi przeciwnika 
    tanksCtrl.fillEnemyBoard();

    // // 4. Pokaz obie planszei ukryj instrukcje
    // UICtrl.showEnemyBoard();
  };


  let restartGame = function() {
    UICtrl.restartGameUI();
    tanksCtrl.resetBoardData();
    startGame();
  }

  return {
    init: function() {
      setupEventListeners();
    }
  };
})(tanksController, UIController);

controller.init();