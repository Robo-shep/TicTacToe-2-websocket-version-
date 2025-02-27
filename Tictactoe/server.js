const express = require('express');

// Create two separate Express applications
const app1 = express();
const app2 = express();

// Use express JSON parser for both apps
app1.use(express.json());
app2.use(express.json());

// Shared game state object
let game = {
  board: Array(9).fill(''),
  currentPlayer: 'X',
  winner: null
};

// Function to check for a winning combination
function checkWinner(board) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Function to set up routes on an Express app
function setupRoutes(app, playerMarker) {
  // Serve the HTML page with the board interface
  app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
  <head>
    <title>Tic Tac Toe - Player ${playerMarker}</title>
    <style> /* Use CSS Grid to layout the board */ 
    #board { display: grid; grid-template-columns: repeat(3, 60px); 
    grid-template-rows: repeat(3, 60px); 
    gap: 2px; margin-bottom: 20px; } 
    button { width: 60px; height: 60px; 
    font-size: 24px; } 
    </style> 
  </head>
  <body>
    <h1>Tic Tac Toe - Player ${playerMarker}</h1>
    <div id="board"></div>
    <p id="status"></p>
    <script>
      function updateBoard(state) {
        const boardDiv = document.getElementById('board');
        boardDiv.innerHTML = '';
        for (let i = 0; i < state.board.length; i++) {
          const cell = document.createElement('button');
          cell.innerText = state.board[i] || '';
          // Only allow a move if the cell is empty and if it's this player's turn
          cell.onclick = function() {
            if (!state.board[i] && state.currentPlayer === '${playerMarker}') {
              fetch('/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ position: i })
              })
              .then(response => response.json())
              .then(data => console.log(data));
            }
          };
          boardDiv.appendChild(cell);
        }
        const statusP = document.getElementById('status');
        if (state.winner) {
          statusP.innerText = 'Winner: ' + state.winner;
        } else {
          statusP.innerText = 'Current Turn: ' + state.currentPlayer;
        }
      }
      
      function fetchState() {
        fetch('/state')
          .then(response => response.json())
          .then(data => updateBoard(data));
      }
      // Poll the game state every second
      setInterval(fetchState, 1000);
      fetchState();
    </script>
  </body>
</html>
    `);
  });

  // Endpoint to return the current game state
  app.get('/state', (req, res) => {
    res.json(game);
  });

  // Endpoint to process a move request
  app.post('/move', (req, res) => {
    const pos = req.body.position;
    // Make the move only if the cell is empty, it's the correct player's turn, and the game is not over
    if (game.board[pos] === '' && game.currentPlayer === playerMarker && !game.winner) {
      game.board[pos] = playerMarker;
      const winner = checkWinner(game.board);
      if (winner) {
        game.winner = winner;
      } else {
        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
      }
      res.json({ status: "move accepted", game });
    } else {
      res.json({ status: "invalid move", game });
    }
  });
}

// Set up the routes for each player's server
setupRoutes(app1, 'X'); // Player X
setupRoutes(app2, 'O'); // Player O

// Define ports for the two separate apps
const PORT1 = 3000;
const PORT2 = 3001;

// Start the servers
app1.listen(PORT1, () => {
  console.log(`Player X server running on http://localhost:${PORT1}`);
});
app2.listen(PORT2, () => {
  console.log(`Player O server running on http://localhost:${PORT2}`);
});
