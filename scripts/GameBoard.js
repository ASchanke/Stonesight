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
  getAdjacentSpaces(x, y) {
    // Create a list of the adjacent spaces
    let open;
    if (x > 0) {
      open.push([x - 1, y]);
    }
    if (x < spaces[y].length - 1) {
      open.push([x + 1, y]);
    }
    if (y > 0) {
      open.push([x, y - 1]);
    }
    if (y < spaces.length - 1) {
      open.push([x, y + 1]);
    }
    return open;
  }
  getValidMoves(x, y) {
    // IN PROGRESS
    // Given a space with a piece, return the places that piece can move.
    // Create a 2D array to store adjacent open spaces to return later.
    let openSpaces = [];
    // Get all the possible spaces
    adjacentSpaces = this.getAdjacentSpaces(x, y);
    // Go through that list and find which ones are allowed
    for (let i = 0; i < adjacentSpaces.length; i++) {
      let possibleX = adjacentSpaces[i][0];
      let possibleY = adjacentSpaces[i][1];
      // If the space is empty
      if (this.#board.getSpace(possibleX, possibleY) == null) {
        // Count number of surrounding enemies
        let enemyNum = 0;
        for (space1 of getAdjacentSpaces(possibleX, possibleY)) {
          // Check if there is a surrounding piece there
          if (checkSpace(space1[0], space1[1]) != null) {
            // Check if the piece is on the opposite team, not including the king.
            let originalPieceTeam = checkSpace(x, y);
            let targetPieceTeam = checkSpace(space1[0], space1[1]);
            if (
              (originalPieceTeam == "attacker" &&
                targetPieceTeam == "defender") ||
              (originalPieceTeam == "defender" && targetPieceTeam == "attacker")
            ) {
              //Log.d("Step 3", "Enemy found");
              // Check if there are any ally pieces adjacent to the enemy piece. If there is, it's automatically a valid move.
              for (space2 of getAdjacentSpaces(space1[0], space1[1])) {
                // If there is a piece
                if (checkSpace(space2[0], space2[1]) != null) {
                  // Check if it's an ally
                  let targetPieceTeam = checkSpace(space2[0], space2[1]);
                  if (
                    (originalPieceTeam == "attacker" &&
                      targetPieceTeam == "attacker") ||
                    (originalPieceTeam == "defender" &&
                      targetPieceTeam == "defender")
                  ) {
                    enemyNum = -999999; // So enemyNum will be less than 2 and move will be valid
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
}
