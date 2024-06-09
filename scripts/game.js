var isGameGoing = true; // Is the game running
var turn = "defender"; // Whose turn is it? Defenders go first
var isFleePhase = false; // Do we have the phase with flee turns?
var hasFleeTurn = true; // Have the defenders used their flee turn?

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
  // Previously moved defender for flee rules
  prevMovedCell = null;

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
        // Select or deselect the square and piece movement
        td.addEventListener("click", (event) => {
          if (isGameGoing) {
            // Reset the style of all the boardspaces
            for (let i = 0; i < boardHeight; i++) {
              for (let j = 0; j < boardWidth; j++) {
                let cellId = this.coordinatesToCellId(j, i);
                let cell = document.getElementById(cellId);
                cell.style.background = "white";
              }
            }

            // If we're clicking with a space highlighted as a valid move, do the move
            if (this.validMoveCells !== null) {
              let cellIndex = this.validMoveCells.indexOf(event.target.id);
              if (cellIndex !== -1) {
                let newSpace = this.cellIdToCoordinates(event.target.id);
                let oldSpace = this.cellIdToCoordinates(this.selectedCell);
                let piece = gameBoard.getSpace(oldSpace[0], oldSpace[1]);

                gameBoard.setSpace(newSpace[0], newSpace[1], piece);
                gameBoard.setSpace(oldSpace[0], oldSpace[1], null);

                // Change the turn
                if (turn === "defender") {
                  // If it wasn't the flee phase or if it was but the defender used the flee turn, swap teams.
                  if ((isFleePhase && !hasFleeTurn) || !isFleePhase) {
                    turn = "attacker";
                    this.prevMovedCell = null; // Clear this so you call move any piece next turn
                  } else if (isFleePhase && hasFleeTurn) {
                    // If we are in the flee phase and the defender did their first turn
                    hasFleeTurn = false;
                    // Save the piece so you can't move it again immediately
                    if (piece === "defender") {
                      this.prevMovedCell = event.target.id;
                    }
                  }
                } else {
                  turn = "defender";
                  hasFleeTurn = true; // Reset the flee turn counter in case the defenders used it
                }

                // Remove all the pieces that are taken
                gameBoard.clearInvalidPieces();
                // Update if we're in the flee phase
                isFleePhase = gameBoard.getFleePhase();
                // Check if the game is over
                let checkIfGameOver = gameBoard.checkIfGameOver();
                if (checkIfGameOver != null) {
                  isGameGoing = false;
                  if (checkIfGameOver === "attacker") {
                    console.log("The attackers have captured the king!");
                  } else {
                    console.log(
                      "The defenders successfully protected the king!"
                    );
                  }
                }
                // Update the display
                this.updateBoardTable(gameBoard);

                // Clear all the saved states
                this.selectedCell = null;
                this.validMoveCells = null;

                return;
              }
            }

            // If there already is a space selected, deselect it.
            if (this.selectedCell != null) {
              let cell = document.getElementById(this.selectedCell);
              this.selectedCell = null;
              this.validMoveCells = null;
            }

            // Get the coordinates from the cell ID
            let cellCoords = this.cellIdToCoordinates(event.target.id);
            // If there is a piece where we're clicking, select that cell
            if (gameBoard.getSpace(cellCoords[0], cellCoords[1]) != null) {
              // Check if it's the correct turn
              let team = gameBoard.getSpaceTeam(cellCoords[0], cellCoords[1]);
              if (turn === team) {
                // Check if it's the flee phase and that this piece wasn't already moved
                if (
                  !isFleePhase ||
                  (isFleePhase && this.prevMovedCell != event.target.id)
                ) {
                  // Select the piece
                  this.selectedCell = td.id;
                  event.target.style.color = "";
                  event.target.style.background = "orange";
                  // Highlight all the valid moves
                  let piece = gameBoard.getSpace(cellCoords[0], cellCoords[1]);
                  let validMoves = gameBoard.getValidMoves(
                    cellCoords[0],
                    cellCoords[1],
                    piece
                  );
                  this.validMoveCells = []; // Save these moves for the next input.
                  // Set the background of the cells with valid moves.
                  for (let space of validMoves) {
                    let cellId = this.coordinatesToCellId(space[0], space[1]);
                    this.validMoveCells.push(cellId); // Add it to the array of validMoveCells
                    let cell = document.getElementById(cellId);
                    cell.style.color = "";
                    cell.style.background = "green";
                  }
                }
              }
            }
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
