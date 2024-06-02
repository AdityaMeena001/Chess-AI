import bb from "./pieces/bb.png";
import bk from "./pieces/bk.png";
import bn from "./pieces/bn.png";
import bp from "./pieces/bp.png";
import bq from "./pieces/bq.png";
import br from "./pieces/br.png";
import wb from "./pieces/wb.png";
import wk from "./pieces/wk.png";
import wn from "./pieces/wn.png";
import wp from "./pieces/wp.png";
import wq from "./pieces/wq.png";
import wr from "./pieces/wr.png";

export const pieceImages = {
  bb,bk,bn,bp,bq,br,wb,wk,wn,wp,wq,wr,
};

export const StartingBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

export const SQUARES = [
  ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
  ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
  ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
  ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
  ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
  ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
];


export const updateBoard = (fenString, board, setBoard) => {
  const fenParts = fenString.split(" ");
  const boardRows = fenParts[0].split("/");

  const newBoard = new StartingBoard();

  for (let idx = 0; idx < 8; idx++) {
    let row = boardRows[idx];
    let newRow = [];
    for (let i = 0; i < row.length; i++) {
      if (!isNaN(row[i])) {
        // Empty squares
        for (let j = 0; j < parseInt(row[i]); j++) {
          newRow.push("");
        }
      } else {
        // Piece on the square
        newRow.push(row[i]);
      }
    }
    newBoard[idx] = newRow;
  }

  setBoard(newBoard);
};

export const isValidMove = (board, posFrom, posTo) => {
  return true;
};

export const movePiece = (board, posFrom, posTo) => {
  if (posFrom === null || posTo === null) {
    return;
  }

  const [fx, fy] = posFrom;
  const [tx, ty] = posTo;

  if (fx && fy && tx && ty) {
    board[tx][ty] = board[fx][fy];
    board[fx][fy] = "";
  }
};
