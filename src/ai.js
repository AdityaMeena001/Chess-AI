import { Chess, SQUARES } from "chess.js";
import { pieceSquareTable } from "./pieceSquareTable";

let count = 0;
let maxDepth = 0;

const scoreCache = new Map();

const getHash = (fen) => {
  let hash = 0;
  for (let i = 0; i < fen.length; i++) {
    const char = fen.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to a 32-bit integer
  }
  return hash;
};

export const getBestMove = (fen) => {
  const game = new Chess(fen);
  if (game.turn() === "w") {
    return null;
  }
  count = 0;
  scoreCache.clear();
  const Ai_move = game.moves();

  const iterativeDeepening = false;

  if (Ai_move.length !== 0) {
    if (!iterativeDeepening) {
      const res = minimax(game, 3, -Infinity, Infinity, false);
      console.log("Positions Evaluated: ", count);
      return res.move;
    }

    const moves = Ai_move.map((m) => ({ move: m, score: Math.random() }));
    let best_move = moves[0];
    for (let depth = 0; depth < 4; depth++) {
      maxDepth = depth;
      moves.sort((a, b) => {
        return b.score - a.score;
      });
      for (let j = 0; j < moves.length; j++) {
        let move = moves[j];
        game.move(move.move);
        const res = minimax(game, depth, -Infinity, Infinity, true);
        game.undo();
        moves[j].score = res.score;
        if (res.score <= best_move.score) {
          console.log(move, res.score);
          best_move = move;
        }
      }
    }
    // console.log(res);
    console.log("Positions Evaluated: ", count);
    return best_move.move;
  }
  return null;
};

const getEval = (game) => {
  let q = 0,
    k = 0,
    b = 0,
    r = 0,
    n = 0,
    p = 0,
    val = 0;

  count++;
  // let fen2 = fen.split(" ")[0];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = game.board()[i][j];
      let mul = 1;
      if (piece?.color === "b") mul = -1;
      switch (piece?.type) {
        case "q":
          q += mul;
          val += mul * pieceSquareTable.q[mul === 1 ? i : 7 - i][j];
          break;
        case "k":
          k += mul;
          val += mul * pieceSquareTable.k[mul === 1 ? i : 7 - i][j];
          break;
        case "b":
          b += mul;
          val += mul * pieceSquareTable.b[mul === 1 ? i : 7 - i][j];
          break;
        case "r":
          r += mul;
          val += mul * pieceSquareTable.r[mul === 1 ? i : 7 - i][j];
          break;
        case "n":
          n += mul;
          val += mul * pieceSquareTable.n[mul === 1 ? i : 7 - i][j];
          break;
        case "p":
          p += mul;
          val += mul * pieceSquareTable.p[mul === 1 ? i : 7 - i][j];

          // console.log(pieceSquareTable.p[mul===1?i:7-i][j],piece?.color,mul===1?i:7-i, i , j );
          break;
      }
    }
  }

  const mobility = game.moves()?.length;

  const Eval =
    20000 * k +
    900 * q +
    500 * r +
    330 * b +
    320 * n +
    100 * p +
    val +
    mobility;

  // console.log( new Chess(fen).ascii(), Eval);
  // console.log(k, q, r, b, n, p, mobility, Eval);
  return Eval;
};

const minimax = (game, depth, alpha, beta, maximizingPlayer) => {
  if (depth === 0) {
    return { score: getEval(game), move: null };
  }
  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove = null;
    // const fen = game.fen();
    // const hash = getHash(fen);
    // if (scoreCache.has(hash)) {
    //   return scoreCache.get(hash);
    // }
    // let scores = [];
    let all_move = game.moves();
    if (depth <= 0) {
      const movesWithCapture = all_move({ verbose: true }).filter(
        (move) => move.captured
      );
      all_move = movesWithCapture;
    }
    for (const move of all_move.sort(() => 0.5 - Math.random())) {
      game.move(move);
      const res = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      if (bestMove === null) {
        bestMove = move;
        maxEval = res.score;
      }
      if (res.score > maxEval) {
        maxEval = res.score;
        bestMove = move;
      }
      // scores.push(res.score);
      alpha = Math.max(alpha, res.score);
      if (beta <= alpha) {
        break;
      }
      // console.log(depth, bestMove, maxEval);
    }
    // console.log(scores, bestMove, maxEval);
    // if (maxDepth -depth >= 3) {
    //   scoreCache.set(hash, { score: maxEval, move: bestMove });
    // }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    let bestMove = null;
    // const fen = game.fen();
    // const hash = getHash(fen);
    // if (scoreCache.has(hash)) {
    //   return scoreCache.get(hash);
    // }
    let all_move = game.moves();
    if (depth <= 0) {
      const movesWithCapture = all_move({ verbose: true }).filter(
        (move) => move.captured
      );
      all_move = movesWithCapture;
    }
    for (const move of all_move.sort(() => 0.5 - Math.random())) {
      game.move(move);
      const res = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      if (bestMove === null) {
        bestMove = move;
        minEval = res.score;
      }
      if (res.score < minEval) {
        minEval = res.score;
        bestMove = move;
      }
      beta = Math.min(beta, res.score);
      if (beta <= alpha) {
        break;
      }
    }
    // console.log(depth, bestMove, minEval);
    // if (maxDepth -depth >= 3) {
    //   scoreCache.set(hash, { score: minEval, move: bestMove });
    // }
    return { score: minEval, move: bestMove };
  }
};

// Score evaluation cache
