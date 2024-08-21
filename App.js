import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';

const Board = ({ board, onPress, disabled }) => {
  return (
    <View style={styles.board}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={styles.cell}
              onPress={() => onPress(rowIndex, colIndex)}
              disabled={disabled || !!cell}
            >
              <Text style={styles.cellText}>{cell}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const calculateWinner = (board) => {
  const lines = [
    // Rows
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // Columns
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // Diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
      return board[a[0]][a[1]];
    }
  }

  return null;
};

const getNextPlayer = (player) => (player === 'X' ? 'O' : 'X');

const isBoardFull = (board) => {
  return board.every((row) => row.every((cell) => cell));
};

const getAvailableMoves = (board) => {
  const moves = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) {
        moves.push([rowIndex, colIndex]);
      }
    });
  });
  return moves;
};

const minimax = (board, depth, maximizingPlayer, alpha, beta) => {
  const winner = calculateWinner(board);
  if (winner || isBoardFull(board)) {
    return winner === 'X' ? 10 - depth : winner === 'O' ? depth - 10 : 0;
  }

  const moves = getAvailableMoves(board);

  if (maximizingPlayer) {
    let bestScore = -Infinity;

    for (const move of moves) {
      const [row, col] = move;
      board[row][col] = 'X';
      const score = minimax(board, depth + 1, false, alpha, beta);
      board[row][col] = null;
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) {
        break;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;

    for (const move of moves) {
      const [row, col] = move;
      board[row][col] = 'O';
      const score = minimax(board, depth + 1, true, alpha, beta);
      board[row][col] = null;
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) {
        break;
      }
    }
    return bestScore;
  }
};


const getBestMove = (board) => {
  let bestScore = -Infinity;
  let bestMove = null;

  const moves = getAvailableMoves(board);
  moves.forEach((move) => {
    const [row, col] = move;
    board[row][col] = 'X';
    const score = minimax(board, 0, false);
    board[row][col] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = [row, col];
    }
  });

  return bestMove;
};

const App = () => {
  const [board, setBoard] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [player, setPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState(`Player ${player}'s turn`);
  const [replaying, setReplaying] = useState(false);

  const handlePress = (rowIndex, colIndex) => {
    if (winner || board[rowIndex][colIndex]) {
      return;
    }

    const newBoard = board.map((row, i) => row.map((cell, j) => (i === rowIndex && j === colIndex ? player : cell)));
    setBoard(newBoard);
    setMoveHistory([...moveHistory, { player, rowIndex, colIndex }]);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setStatus(`Player ${newWinner} has won!`);
    } else if (isBoardFull(newBoard)) {
      setWinner('DRAW');
      setStatus('The game is a draw!');
    } else {
      setPlayer(getNextPlayer(player));
    }
  };

useEffect(() => {
  if (player === 'O' && !winner && !replaying) {
    const [rowIndex, colIndex] = getBestMove(board);
    handlePress(rowIndex, colIndex);
  }
}, [player, winner, replaying]);
  
const [replayBoard, setReplayBoard] = useState(null);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


 const handleReplay = async () => {
  if (moveHistory.length === 0 || replaying) {
    return;
  }

  // Set replaying state to true
  setReplaying(true);

  // Save the current game state
  const savedBoard = JSON.parse(JSON.stringify(board));
  const savedPlayer = player;
  const savedWinner = winner;
  const savedStatus = status;

  // Clear the board
  setBoard([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  setPlayer('X');
  setStatus(`Player X's turn`);

  // Initialize a temporary board to store intermediate states
  let tempBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  // Replay moves with a delay
  for (let i = 0; i < moveHistory.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const move = moveHistory[i];
    tempBoard = tempBoard.map((row, rowIndex) =>
      row.map((cell, colIndex) => (rowIndex === move.rowIndex && colIndex === move.colIndex ? move.player : cell))
    );
    setBoard(JSON.parse(JSON.stringify(tempBoard)));
    if (i < moveHistory.length - 1) {
      setPlayer(getNextPlayer(move.player));
      setStatus(`Player ${getNextPlayer(move.player)}'s turn`);
    } else {
      // Restore the original game state after the last move is shown
      setPlayer(savedPlayer);
      setWinner(savedWinner);
      setStatus(savedStatus);
    }
  }

  // Set replaying state to false
  setReplaying(false);
};

  
  const handleReset = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setPlayer('X');
    setWinner(null);
    setMoveHistory([]);
    setStatus(`Player ${player}'s turn`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <Text style={styles.status}>{status}</Text>
      <Board board={board} onPress={handlePress} disabled={!!winner} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.replayButton} onPress={handleReplay}>
          <Text style={styles.replayButtonText}>Replay</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>Made by Andriy Kinash</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4a4a4a',
    marginTop: 20,
    marginBottom: 20,
    letterSpacing: 1.5, // Added letter spacing
  },
  status: {
    fontSize: 24,
    marginBottom: 20,
    color: '#555',
    fontStyle: 'italic', // Added italic font style
  },
  board: {
    borderWidth: 2,
    borderColor: '#8e8e8e',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    padding: 5, // Added padding around the board
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#8e8e8e',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3e3e3', // Changed cell background color
  },
  cellText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4a4a4a',
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Added text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#5A9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  replayButton: {
    backgroundColor: '#38A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  replayButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
    fontStyle: 'italic', // Added italic font style
  },
});
export default App;


