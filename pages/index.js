import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Stopwatch from "../components/Stopwatch";
import ModalDialog from "../components/ModalDialog";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [board, setBoard] = useState([]);
  const [flippedItems, setFlippedItems] = useState([]);
  const [matchedItems, setMatchedItems] = useState([]);
  const [flips, setFlips] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const nums1To8 = [...Array(8).keys()].map((i) => i + 1);
  const nums1To18 = [...Array(18).keys()].map((i) => i + 1);

  const Board = () => {
    return (
      <div className={`${styles.board} ${gridSize === 6 ? styles.six : ""}`}>
        {board.map((data, i) => {
          const flipped = flippedItems.includes(i);
          const matched = matchedItems.includes(i);
          return (
            <div
              key={i}
              className={`${styles.card} ${
                gridSize === 6 ? styles.smaller : ""
              } ${flipped || matched ? styles.active : ""} ${
                matched ? styles.matched : ""
              } ${gameOver ? styles.gameover : ""}`}
              onClick={() => onFlip(i)}
            >
              <div className={styles.cardFront}>{data}</div>
              <div className={styles.cardBack} />
            </div>
          );
        })}
      </div>
    );
  };

  // ref for stopwatch component
  const stopwatchRef = useRef(null);

  // Method to start and stop timer
  const startStopwatch = () => {
    if (stopwatchRef.current) {
      stopwatchRef.current.startStopwatch();
    }
  };

  const stopStopwatch = () => {
    if (stopwatchRef.current) {
      stopwatchRef.current.stopStopwatch();
    }
  };

  // Method to reset timer back to 0
  const resetStopwatch = () => {
    if (stopwatchRef.current) {
      stopwatchRef.current.resetStopwatch();
    }
  };

  const getTime = () => {
    if (stopwatchRef.current) {
      return stopwatchRef.current.getTime();
    }
  };

  const shuffle = () => {
    const content = gridSize === 4 ? nums1To8 : nums1To18;
    const newBoard = [...content, ...content]
      .sort(() => Math.random() - 0.5)
      .map((v) => v);
    setBoard(newBoard);
  };

  const initialize = () => {
    setShowMenu(false);
    shuffle();
    setGameOver(false);
    setFlippedItems([]);
    setMatchedItems([]);
    setFlips(0);
    resetStopwatch();
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

    // check to start timer if first flip
    if (flips < 1) {
      startStopwatch();
    }
  };

  const modalRef = useRef(null);

  function openModal() {
    const dialog = modalRef.current;

    if (dialog) {
      dialog.showModal();
    }
  }

  function closeModal() {
    const dialog = modalRef.current;

    if (dialog) {
      dialog.close();
    }
  }

  function endGame() {
    setGameOver(true);
    stopStopwatch();
    openModal();
  }

  useEffect(() => {
    if (gridSize === 4) {
      if (matchedItems.length === 16) {
        endGame();
      }
    } else {
      if (matchedItems.length === 36) {
        endGame();
      }
    }
  }, [matchedItems]);

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
      <main className={`${styles.main} ${showMenu ? styles.menu : ""}`}>
        {showMenu ? (
          <div className={styles.menuContainer}>
            <span className={`${styles.textWhite} ${styles.textLevel1}`}>
              memory
            </span>
            <div className={styles.settings}>
              <div className={styles.eachSetting}>
                <span className={styles.textSecondary}>Grid Size</span>
                <div className={styles.buttonContainer}>
                  <button
                    className={`${styles.button} ${styles.menu} ${
                      gridSize === 4 ? styles.active : ""
                    } ${styles.wider}`}
                    onClick={() => setGridSize(4)}
                  >
                    4x4
                  </button>
                  <button
                    className={`${styles.button} ${styles.menu} ${
                      gridSize === 6 ? styles.active : ""
                    } ${styles.wider}`}
                    onClick={() => setGridSize(6)}
                  >
                    6x6
                  </button>
                </div>
              </div>
              <button
                className={`${styles.button} ${styles.primary}`}
                onClick={initialize}
              >
                Start Game
              </button>
            </div>
          </div>
        ) : (
          <>
            <nav className={styles.nav}>
              <span className={styles.textLevel1}>memory</span>
              <div className={styles.navButtonContainer}>
                <button
                  className={`${styles.button} ${styles.primary}`}
                  onClick={() => initialize()}
                >
                  Restart
                </button>
                <button
                  className={`${styles.button} ${styles.secondary} ${styles.textPrimary}`}
                  onClick={() => setShowMenu(true)}
                >
                  New Game
                </button>
              </div>
            </nav>
            <div className={styles.boardContainer}>
              <Board />
            </div>
            <button onClick={openModal}>open modal</button>
            {/* footer */}
            <div className={styles.footer}>
              <div className={styles.footerItem}>
                <span className={styles.textSecondary}>Timer</span>
                <span className={styles.textLevel2}>
                  <Stopwatch ref={stopwatchRef} />
                </span>
              </div>
              <div className={styles.footerItem}>
                <span className={styles.textSecondary}>Moves</span>
                <span className={styles.textLevel2}>
                  {Math.floor(flips / 2)}
                </span>
              </div>
            </div>
          </>
        )}
      </main>
      <ModalDialog ref={modalRef}>
        <div className={styles.statContainer}>
          <span className={`${styles.textLevel1} ${styles.textPrimary}`}>
            You did it!
          </span>
          <span className={styles.textSecondary}>
            Game over! Here&apos;s how you got on...
          </span>
          <div className={styles.statSubcontainer}>
            <div className={styles.statItem}>
              <span className={styles.textSecondary}>Time Elapsed</span>
              <span className={`${styles.textLevel2} ${styles.textPrimary}`}>
                {getTime()}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.textSecondary}>Moves Taken</span>
              <span className={`${styles.textLevel2} ${styles.textPrimary}`}>
                {Math.floor(flips / 2)} Moves
              </span>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={`${styles.button} ${styles.primary} ${styles.statButton}`}
              onClick={() => {
                closeModal();
                initialize();
              }}
            >
              Restart
            </button>
            <button
              className={`${styles.button} ${styles.secondary} ${styles.textPrimary} ${styles.statButton}`}
              onClick={() => {
                closeModal();
                setShowMenu(true);
              }}
            >
              Setup New Game
            </button>
          </div>
        </div>
      </ModalDialog>
    </>
  );
}
