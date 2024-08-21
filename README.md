# Tic-Tac-Toe Game - React Native

## Overview
This project is a React Native implementation of the classic Tic-Tac-Toe game. It offers a single-player mode where users can play against an AI opponent that uses the Minimax algorithm to make optimal moves. The game features a clean, responsive design, making it enjoyable to play on various device sizes.

## Features
- **Single Player vs AI:** Play against a computer opponent with advanced AI that always makes the best move.
- **Minimax Algorithm:** The AI is powered by the Minimax algorithm, ensuring a challenging and strategic gameplay experience.
- **Move Replay:** The game includes a feature to replay all moves from the start, allowing users to review their gameplay.
- **Responsive Design:** The game is optimized for both small and large screens, providing a consistent user experience across devices.

## How to Play
- The game board is a 3x3 grid where players take turns marking a square with 'X' or 'O'.
- The objective is to align three of your marks in a row, column, or diagonal.
- The game ends when one player wins, or all squares are filled resulting in a draw.

## Technical Details

### Minimax Algorithm
- The AI uses the Minimax algorithm, which evaluates the possible outcomes of each move to choose the one that maximizes its chances of winning.
- The algorithm is optimized with alpha-beta pruning to improve performance, especially in scenarios where the game can have numerous possible outcomes.

### Replay Feature
- Users can replay the entire game move by move. The game resets the board and plays each move in sequence, offering a visual replay of the game.

### Responsive UI
- The UI is designed to be responsive and user-friendly, ensuring a consistent experience across different device sizes and orientations.

## Project Structure
- **`App.js`**: The main file that contains the game logic and rendering.
- **`assets/`**: This directory contains all the images and icons used in the app.
- **`babel.config.js`**: The Babel configuration file.
- **`package.json`**: Lists the project's dependencies and scripts.
- **`app.json`**: Configuration file for the Expo project.

## Demonstration Video
[![Tic-Tac-Toe Demo](https://img.youtube.com/vi/5Mbs9T8fREA/0.jpg)](https://youtu.be/5Mbs9T8fREA)
