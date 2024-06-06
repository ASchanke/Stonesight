var isGameGoing = true;

var gameBoard;
var boardTable;
const boardWidth = 11;
const boardHeight = 11;

class BoardTable {
  table;
  gameBoard;

  height;
  width;

  // Stores the id of the selected cell
  selectedCell = null;
  // Stores the id of cells the pieces can be moved to
  validMoveCells = null;

  constructor(gameBoard) {
    this.height = gameBoard.height;
    this.width = gameBoard.width;
    this.gameBoard = gameBoard;
    this.table = this.createBoardTable(this.width, this.height);
  }

  createBoardTable(width, height) {
    // This is just used to center the table
    let center = document.createElement("center");
    // This will create the table for the board
    let boardTable = document.createElement("table");

    // Create the table
    for (let i = 0; i < height; i++) {
      // Create a row
      let tr = document.createElement("tr");

      // Create the cells in the row
      for (let j = 0; j < width; j++) {
        let td = document.createElement("td");
        // Give each cell the class "boardspace"
        td.setAttribute("class", "boardspace");
        // Give each boardspace a unique ID based on its location
        td.setAttribute("id", this.coordinatesToCellId(j, i));
        // Set the event listeners
        // Highlight on mouseover
        td.addEventListener(
          "mouseover",
          (event) => {
            // highlight the mouseover target
            event.target.style.color = "orange";
          },
          false
        );
        // Remove the highlight when the mouse leaves it
        td.addEventListener("mouseleave", (event) => {
          event.target.style.color = "";
        });
        // Select or deselect the square
        td.addEventListener("click", (event) => {
          // Check if there is a piece there
          let cellCoords = this.cellIdToCoordinates(event.target.id);
          console.log(cellCoords[0] + "-" + cellCoords[1]);
          // If there already is a space selected, deselect it.
          if (this.selectedCell != null) {
            let cell = document.getElementById(this.selectedCell);
            cell.style.background = "";
            this.selectedCell = null;
          }
          // If there is a piece where we're clicking, select that cell
          if (gameBoard.getSpace(cellCoords[0], cellCoords[1]) != null) {
            // If there is, select it
            this.selectedCell = td.id;
            event.target.style.color = "";
            event.target.style.background = "orange";
          }
        });
        // Add the cell to the row
        tr.appendChild(td);
      }
      // Add the row to the table
      boardTable.appendChild(tr);
    }

    // Set the attributes
    center.appendChild(boardTable);
    boardTable.setAttribute("cellspacing", 0);
    document.body.appendChild(center);

    return boardTable;
  }

  updateBoardTable(gameBoard) {
    // Go through the board
    for (let i = 0; i < gameBoard.height; i++) {
      for (let j = 0; j < gameBoard.width; j++) {
        // Find the cell for that space
        let cellId = this.coordinatesToCellId(j, i);
        // Set its value
        let spaceValue = gameBoard.getSpace(j, i);
        if (spaceValue === "attacker") {
          document.getElementById(cellId).innerHTML = "A";
        } else if (spaceValue === "defender") {
          document.getElementById(cellId).innerHTML = "D";
        } else if (spaceValue === "king") {
          document.getElementById(cellId).innerHTML = "K";
        } else {
          document.getElementById(cellId).innerHTML = "";
        }
      }
    }
  }

  coordinatesToCellId(x, y) {
    // Takes coordinates and turns them into a string that is the id for the matching cell
    let cellId = "boardspace" + x + "." + y;
    return cellId;
  }
  cellIdToCoordinates(cellId) {
    // Takes a string and splits it into the coordinates of the cell
    let split = cellId.split("space");
    let x = parseInt(split[1]);
    split = cellId.split(".");
    let y = parseInt(split[1]);
    let coordinates = [x, y];
    return coordinates;
  }
}

function populateBoard(board) {
  // Create the attackers
  board.setSpace(1, 3, "attacker");
  board.setSpace(1, 5, "attacker");
  board.setSpace(1, 7, "attacker");
  board.setSpace(2, 2, "attacker");
  board.setSpace(2, 8, "attacker");
  board.setSpace(3, 1, "attacker");
  board.setSpace(3, 9, "attacker");
  board.setSpace(5, 1, "attacker");
  board.setSpace(5, 9, "attacker");
  board.setSpace(7, 1, "attacker");
  board.setSpace(7, 9, "attacker");
  board.setSpace(8, 2, "attacker");
  board.setSpace(8, 8, "attacker");
  board.setSpace(9, 3, "attacker");
  board.setSpace(9, 5, "attacker");
  board.setSpace(9, 7, "attacker");

  // Create the Defenders
  board.setSpace(3, 3, "defender");
  board.setSpace(3, 5, "defender");
  board.setSpace(3, 7, "defender");
  board.setSpace(5, 3, "defender");
  board.setSpace(5, 7, "defender");
  board.setSpace(7, 3, "defender");
  board.setSpace(7, 5, "defender");
  board.setSpace(7, 7, "defender");

  // Create the King
  board.setSpace(5, 5, "king");
}

gameBoard = new GameBoard(boardWidth, boardHeight);
boardTable = new BoardTable(gameBoard);
populateBoard(gameBoard);
boardTable.updateBoardTable(gameBoard);
