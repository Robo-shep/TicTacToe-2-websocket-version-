# Tic Tac Toe Multiplayer with Express.js

This project is a simple multiplayer Tic Tac Toe game using two separate Express.js applications, one for each player (X and O). The game state is shared between both servers, allowing real-time play.

## Features

 - Two independent Express servers for Player X and Player O
 - Shared game state synchronized between both servers
 - Simple front-end using HTML, CSS, and JavaScript
 - Automatic game state polling every second
 - Win detection logic implemented

## Setup Instructions

### Prerequisites

 - Ensure you have Node.js installed.

### Clone the Repository
```
git clone https://github.com/Roboshep/TicTacToe-2-websocket-version-.git
```
### Install Dependencies
```
npm install express
```
### Run the Servers

Start both Player X and Player O servers:
```
node server.js
```
### Access the Game

 - Player X: http://localhost:3000

 - Player O: http://localhost:3001

## How to Play

 - Open both URLs in separate browser windows/tabs.

 - Players take turns by clicking empty cells.

 - The game updates in real-time.

 - The winner is displayed when a player gets three marks in a row.

## Game Logic

 - The board is a 3x3 grid.

 - Players alternate turns (X starts first).

 - The game detects winning conditions and prevents invalid moves.

## Future Improvements

 - WebSocket support for real-time updates instead of polling

 - Enhanced UI/UX with animations and styling

 - Persistent game state using a database
---
Happy coding! 🎮
