var isGameGoing = true;

const boardRows = 11;
const boardColumns = 11;


function createBoard(x, y) {
  // This is just used to center the table
  var center = document.createElement('center'); 
  // This will create the table for the board
  var boardTable = document.createElement('table');

  // Create the table
  for (var i = 0; i < y; i++) {
    // Create a row
    var tr = document.createElement('tr');

    // Create the cells in the row
    for (var j = 0; j < x; j++) {
      var td = document.createElement('td');
      td.setAttribute('class', 'boardspace');
      // Add the cell to the row
      tr.appendChild(td);
    }
    // Add the row to the table
    boardTable.appendChild(tr);
  }

  // Set the attributes
  center.appendChild(boardTable);
  boardTable.setAttribute('cellspacing', 0);
  document.body.appendChild(center);
}


createBoard(boardRows, boardColumns);