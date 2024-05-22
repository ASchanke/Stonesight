var isGameGoing = true;

var gameBoard;
var boardTable;
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
        for (let i = 0; i < this.#board.length; i++) {
            this.#board[i] = new Array(width);
        }
    }

    getBoard() {
        return this.#board;
    }
    setSpace(x, y, piece) {
        this.#board[x][y] = piece;
    }
    getSpace(x, y) {
        return this.#board[x][y];
    }
}

class BoardTable {
    table;
    height;
    width;

    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.table = this.createBoardTable(width, height);
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

    updateBoardTable(gameBoard){
        // Go through the board
        for (let i = 0; i < gameBoard.height; i++) {
            for (let j = 0; j < gameBoard.width; j++) {
                // Find the cell for that space
                let cellId = this.coordinatesToCellId(j,i);
                // Set its value
                let spaceValue = gameBoard.getSpace(j,i);
                if (spaceValue === "attacker") {
                    document.getElementById(cellId).innerHTML = "A";
                } else if (spaceValue === "defender") {
                    document.getElementById(cellId).innerHTML = "D";
                } else if (spaceValue === "king") {
                    document.getElementById(cellId).innerHTML = "K";
                }
            }
        }
    }

    coordinatesToCellId(x,y) {
        let cellId = "boardspace" + x + "." + y;
        return cellId;
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
boardTable = new BoardTable(gameBoard.width, gameBoard.height);
populateBoard(gameBoard);
boardTable.updateBoardTable(gameBoard);

