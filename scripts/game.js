var isGameGoing = true;

var gameBoard;
const boardWidth = 11;
const boardHeight = 11;

class GameBoard {
    height = 11;
    width = 11;
    #board;

    constructor(height, width) {
        this.height = height;
        this.width = width;

        // Create the array to store the location of pieces
        this.#board = new Array(height);
        for (var i = 0; i < this.#board.length; i++) {
            this.#board[i] = new Array(width);
        }
    }

    setSpace(x, y, piece) {
        this.#board[x][y] = piece;
    }
    getSpace(x, y) {
        return this.#board[x][y];
    }
}

function createBoardTable(width, height) {
    // This is just used to center the table
    var center = document.createElement("center");
    // This will create the table for the board
    var boardTable = document.createElement("table");

    // Create the table
    for (var i = 0; i < height; i++) {
        // Create a row
        var tr = document.createElement("tr");

        // Create the cells in the row
        for (var j = 0; j < width; j++) {
            var td = document.createElement("td");
            td.setAttribute("class", "boardspace");
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
createBoardTable(gameBoard.width, gameBoard.height);
populateBoard(gameBoard);
