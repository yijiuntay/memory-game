import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [board, setBoard] = useState([]);
  const [flippedItems, setFlippedItems] = useState([]);
  const [matchedItems, setMatchedItems] = useState([]);
  const [flips, setFlips] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const nums1To8 = [...Array(8).keys()].map((i) => i + 1);
  const nums1To18 = [...Array(18).keys()].map((i) => i + 1);

  const Board = () => {
    return (
      <div className="board">
        {board.map((data, i) => {
          const flipped = flippedItems.includes(i);
          const matched = matchedItems.includes(i);
          return (
            <div
              key={i}
              className={`card ${flipped || matched ? "active" : ""} ${
                matched ? "matched" : ""
              } ${gameOver ? "gameover" : ""}`}
              onClick={() => onFlip(i)}
            >
              <div className="card-front">{data}</div>
              <div className="card-back" />
            </div>
          );
        })}
      </div>
    );
  };

  const shuffle = () => {
    const newBoard = [...nums1To8, ...nums1To8]
      .sort(() => Math.random() - 0.5)
      .map((v) => v);
    setBoard(newBoard);
  };

  const initialize = () => {
    shuffle();
    setGameOver(false);
    setFlippedItems([]);
    setMatchedItems([]);
    setFlips(0);
  };

  // handler function when user chooses item to flip
  const onFlip = (i) => {
    // check if the current item is not matched or flipped yet
    if (!matchedItems.includes(i) && !flippedItems.includes(i)) {
      // check how many items have been flipped on the board currently
      if (flippedItems.length === 1) {
        // check if the current chosen item is the same as the other flipped item on the board
        if (board[i] === board[flippedItems[0]]) {
          setMatchedItems((prev) => [...prev, i, flippedItems[0]]);
        }

        setFlippedItems([...flippedItems, i]);
      } else if (flippedItems.length === 2) {
        setFlippedItems([i]);
      } else {
        setFlippedItems([...flippedItems, i]);
      }

      setFlips((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (matchedItems.length === 16) {
      setGameOver(true);
    }
  }, [flips]);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Head>
        <title>Memory Game</title>
        <meta name="description" content="Memory Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <nav>memory</nav>
        <Board />
        <div>footer, moves: {Math.floor(flips / 2)}</div>
      </main>
    </>
  );
}
