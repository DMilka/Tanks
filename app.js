/* ***************************

        Tanks Controller

******************************/
const tanksController = (function() {

})();


/* ***************************

  User Interface Controller

******************************/
const UIController = (function() {
  let DOMstrings = {
    playerBoard: '#player-board',
    computerBoard: '#computer-board'
  }

  return {
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
    }
  };
})();

/* ***************************

          Controller

******************************/
const controller = (function(tanksCtrl, UICtrl) {
  let setupEventListeners = function() {

  }

  return {
    init: function() {
      setupEventListeners();
      UICtrl.createBoards();
    }
  };
})(tanksController, UIController);

controller.init();