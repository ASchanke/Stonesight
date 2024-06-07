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
    let piece = this.#board[x][y];
    return piece;
  }
  getSpaceTeam(x, y) {
    let piece = this.getSpace(x, y);
    if (piece === "king") {
      piece = "defender";
    }
    return piece;
  }
  getAdjacentSpaces(x, y) {
    // Create a list of the adjacent spaces
    let open = [];
    if (x > 0) {
      open.push([x - 1, y]);
    }
    if (x < this.#board[y].length - 1) {
      open.push([x + 1, y]);
    }
    if (y > 0) {
      open.push([x, y - 1]);
    }
    if (y < this.#board.length - 1) {
      open.push([x, y + 1]);
    }
    return open;
  }
  getValidMoves(x, y, piece) {
    // IN PROGRESS
    // Given a space with a piece, return the places that piece can move.
    // Create a 2D array to store adjacent open spaces to return later.
    let openSpaces = [];
    // Get all the possible spaces
    let adjacentSpaces = this.getAdjacentSpaces(x, y);
    // Go through that list and find which ones are allowed
    for (let i = 0; i < adjacentSpaces.length; i++) {
      let possibleX = adjacentSpaces[i][0];
      let possibleY = adjacentSpaces[i][1];
      // If the space is empty
      if (this.getSpace(possibleX, possibleY) == null) {
        // Count number of surrounding enemies
        let enemyNum = 0;
        for (let space1 of this.getAdjacentSpaces(possibleX, possibleY)) {
          // Check if there is a surrounding piece there
          if (this.getSpace(space1[0], space1[1]) != null) {
            // Check if the piece is on the opposite team, not including the king.
            let targetPiece = this.getSpace(space1[0], space1[1]);
            if (
              (piece === "attacker" && targetPiece === "defender") ||
              (piece === "defender" && targetPiece === "attacker") ||
              (piece === "king" && targetPiece === "attacker")
            ) {
              // Check if there are any ally pieces adjacent to the enemy piece. If there is, it's automatically a valid move.
              // This isn't valid for kings because you can't sacrifice them.
              if (piece != "king") {
                for (let space2 of this.getAdjacentSpaces(
                  space1[0],
                  space1[1]
                )) {
                  // If there is a piece
                  if (this.getSpace(space2[0], space2[1]) != null) {
                    // Check if it's an ally

                    let targetPiece = this.getSpace(space2[0], space2[1]);
                    if (
                      (piece === "attacker" && targetPiece === "attacker") ||
                      (piece === "defender" && targetPiece === "defender")
                    ) {
                      enemyNum = -999999; // So enemyNum will be less than 2 and move will be valid
                    }
                  }
                }
              }
              enemyNum++;
            }
          }
        }

        // If the number of surrounding enemies is less than 2, it's a valid move
        if (enemyNum < 2) {
          openSpaces.push(adjacentSpaces[i]);
        }
      }
      // If the space isn't empty, it's not a possible move. Don't do anything with it.
    }
    return openSpaces;
  }

  clearInvalidPieces() {
    let spacesToClear = [];
    // Go through the board
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        // If there's a piece in this space
        if (this.getSpace(j, i) != null) {
          // Count the number of enemies
          let adjacentEnemies = 0;
          let team = this.getSpaceTeam(j, i);

          for (let space of this.getAdjacentSpaces(j, i)) {
            if (this.getSpace(space[0], space[1]) != null) {
              let adjacentPiece = this.getSpace(space[0], space[1]);
              if (team !== adjacentPiece) {
                // Exclude the king from this search because it can't take pieces
                if (adjacentPiece !== "king") {
                  adjacentEnemies++;
                }
              }
            }
          }
          if (adjacentEnemies > 1) {
            let space = [j, i];
            spacesToClear.push(space);
          }
        }
      }
    }
    console.log(spacesToClear);

    for (let space of spacesToClear) {
      this.setSpace(space[0], space[1], null);
    }
  }
}
