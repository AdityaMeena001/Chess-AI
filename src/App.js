import "./App.css";
import { useState } from "react";
import { Chess } from "chess.js";
import {
  StartingBoard,
  SQUARES,
  pieceImages,
  isValidMove,
  movePiece,
} from "./Chess.js";

import { getBestMove } from "./ai.js";

function App() {
  const colors = ["light", "dark"];

  const [game, setGame] = useState(new Chess());
  const [prevPiece, setPrevPiece] = useState(null);
  // const [prevPiece, setPrevPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [promotionPiece, setPromotionPiece] = useState("q");

  const handleSquareClick = (row, col) => {
    console.log(row, col);
    const piece = game.board()[row][col];
    if (prevPiece && game.board()[row][col]?.color !== "w") {
      // const moveString = `${prevPiece}-${SQUARES[row][col]}`;
      try {
        if (row === 0 && prevPiece.type === "p") {
          game.move({
            from: prevPiece.square,
            to: SQUARES[row][col],
            promotion: promotionPiece,
          });
        } else {
          game.move({ from: prevPiece.square, to: SQUARES[row][col] });
        }
        console.log(prevPiece, row);
      } catch (error) {
        console.error("invalid move ", error.message);
      }
      setPrevPiece(null);
      setPossibleMoves([]);

      const Ai_move = getBestMove(game.fen());

      if (Ai_move !== null) {
        console.log(Ai_move);
        game.move(Ai_move);
      }

      console.log(Ai_move);
    } else if (piece && piece.color === "w") {
      setPrevPiece(piece);
      const allPossibleMoves = game.moves({ square: piece.square });
      const moves = allPossibleMoves.map((move) => {
        // Remove special characters and numbers
        const cleanedMove = move.replace(/[^a-h1-8]/g, "");
        // Get the last two characters which should be the destination square
        return cleanedMove.slice(-2);
      });
      if (allPossibleMoves.includes("O-O")) moves.push("g1");
      if (allPossibleMoves.includes("O-O-O")) moves.push("c1");
      setPossibleMoves(moves);
      console.log(moves);
    }
  };

  const promotionPieces = ["q", "r", "b", "n"];

  return (
    <div className="  bg-slate-900 px-12 h-[100vh] gap-4 flex flex-row items-center justify-center ">
      <div className="flex w-[25%] flex-col items-center justify-center gap-4">
        {promotionPieces.map((piece) => (
          <div
            key={piece}
            onClick={() => setPromotionPiece(piece)}
            className={`cursor-pointer w-16 h-16 flex justify-center items-center ${
              promotionPiece === piece ? " bg-amber-400" : "light"
            }`}
          >
            <img className=" w-[80%] h-[80%]" src={pieceImages[`w${piece}`]} />
          </div>
        ))}
      </div>

      <div className=" flex flex-1 w-fit h-fit items-center justify-center flex-col gap-0 p-2">
        {game.board().map((row, rowIdx) => (
          <div className=" flex w-fit h-fit flex-row gap-0">
            {row.map((piece, colIdx) => (
              <div
                onClick={() => handleSquareClick(rowIdx, colIdx)}
                className={`flex justify-center items-center w-20 h-20 ${
                  colors[(rowIdx + colIdx) % 2]
                } ${
                  possibleMoves.includes(SQUARES[rowIdx][colIdx])
                    ? "highlight"
                    : ""
                }`}
              >
                {piece && (
                  <img
                    className=" w-[80%] h-[80%]"
                    src={pieceImages[`${piece.color}${piece.type}`]}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex w-[25%] bg-[#5a5688] border-[0.2rem] border-[#c4d3f2] text-white p-4 h-[40rem] font-semibold  flex-col">
        {game
          .pgn({ maxWidth: 5, newline: "_" })
          .split("_")
          .map((move, index) => {
            return <p>{move}</p>;
          })}
      </div>
    </div>
  );
}

export default App;
