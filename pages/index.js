/* eslint-disable react/jsx-key */
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import Stopwatch from "../components/Stopwatch";
import ModalDialog from "../components/ModalDialog";
import {
  FaCanadianMapleLeaf,
  FaCss3Alt,
  FaDev,
  FaBasketballBall,
  FaEllo,
  FaEdge,
  FaFontAwesomeFlag,
  FaFreebsd,
  FaFreeCodeCamp,
  FaFortAwesome,
  FaGithub,
  FaInstagram,
  FaJenkins,
  FaLinux,
  FaNpm,
  FaPagelines,
  FaBabyCarriage,
  FaBath,
} from "react-icons/fa";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [theme, setTheme] = useState("nums");
  const [numPlayers, setNumPlayers] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [players, setPlayers] = useState([]);
  const [board, setBoard] = useState([]);
  const [flippedItems, setFlippedItems] = useState([]);
  const [matchedItems, setMatchedItems] = useState([]);
  const [flips, setFlips] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const iconArray = [
    <FaCanadianMapleLeaf />,
    <FaCss3Alt />,
    <FaDev />,
    <FaBasketballBall />,
    <FaEllo />,
    <FaEdge />,
    <FaFontAwesomeFlag />,
    <FaFreebsd />,
    <FaFreeCodeCamp />,
    <FaFortAwesome />,
    <FaGithub />,
    <FaInstagram />,
    <FaJenkins />,
    <FaLinux />,
    <FaNpm />,
    <FaPagelines />,
    <FaBabyCarriage />,
    <FaBath />,
  ];

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
    const content =
      theme === "nums"
        ? gridSize === 4
          ? [...Array(8).keys()].map((i) => i + 1)
          : [...Array(18).keys()].map((i) => i + 1)
        : gridSize === 4
        ? iconArray.slice(0, 8)
        : iconArray.slice();

    const newBoard = [...content, ...content]
      .sort(() => Math.random() - 0.5)
      .map((v) => v);
    setBoard(newBoard);
  };

  const createPlayers = () => {
    const playerScores = [...Array(numPlayers).keys()].map((i) => i - i);
    setPlayers(playerScores);
  };

  const initialize = () => {
    setShowMenu(false);
    shuffle();
    createPlayers();
    setCurrentPlayer(0);
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
          const newScore = players.map((score, index) =>
            index === currentPlayer ? score + 1 : score
          );
          setPlayers(newScore);
        }

        setFlippedItems([...flippedItems, i]);
      } else if (flippedItems.length === 2) {
        setFlippedItems([i]);
      } else {
        setFlippedItems([...flippedItems, i]);
      }

      if ((flips + 1) % 2 === 0) {
        setCurrentPlayer((prev) => (prev < numPlayers - 1 ? prev + 1 : 0));
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

  const getModalContent = () => {
    const rankedScore = players.map((score, index) => [index + 1, score]);
    rankedScore.sort((a, b) => b[1] - a[1]);
    const topScore = rankedScore[0] ? rankedScore[0][1] : "";
    const numTopScore = players.filter((i) => i === topScore).length;
    const playerIndex = players.indexOf(topScore);

    return (
      <div className={styles.statContainer}>
        <span className={`${styles.textLevel1} ${styles.textPrimary}`}>
          {numPlayers === 1
            ? "You did it!"
            : numTopScore > 1
            ? "It's a tie!"
            : `Player ${playerIndex + 1} Wins!`}
        </span>
        <span className={styles.textSecondary}>
          {`Game over! ${
            numPlayers === 1 ? "Here's how you got on" : "Here are the results"
          }...`}
        </span>
        <div className={styles.statSubcontainer}>
          {numPlayers === 1 ? (
            <>
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
            </>
          ) : (
            <>
              {rankedScore.map(([index, score]) => (
                <div
                  className={`${styles.statItem} ${
                    score === topScore ? styles.winner : ""
                  }`}
                >
                  <span
                    className={
                      score === topScore
                        ? styles.textWhite
                        : styles.textSecondary
                    }
                  >{`Player ${index} ${
                    score === topScore ? "(Winner!)" : ""
                  }`}</span>
                  <span
                    className={`${styles.textLevel2} ${
                      score === topScore ? styles.textWhite : styles.textPrimary
                    }`}
                  >
                    {score} Pairs
                  </span>
                </div>
              ))}
            </>
          )}
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
    );
  };

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
                <span className={styles.textSecondary}>Select Theme</span>
                <div className={styles.buttonContainer}>
                  <button
                    className={`${styles.button} ${styles.menu} ${
                      theme === "nums" ? styles.active : ""
                    } ${styles.wider}`}
                    onClick={() => setTheme("nums")}
                  >
                    Numbers
                  </button>
                  <button
                    className={`${styles.button} ${styles.menu} ${
                      theme === "icons" ? styles.active : ""
                    } ${styles.wider}`}
                    onClick={() => setTheme("icons")}
                  >
                    Icons
                  </button>
                </div>
              </div>
              <div className={styles.eachSetting}>
                <span className={styles.textSecondary}>Number of Players</span>
                <div className={styles.buttonContainer}>
                  <button
                    className={`${styles.button} ${styles.menu} ${
                      numPlayers === 1 ? styles.active : ""
                    } ${styles.narrower}`}
                    onClick={() => setNumPlayers(1)}
                  >
                    1
                  </button>
                  <button
                    className={`${styles.button} ${styles.menu} ${
                      numPlayers === 2 ? styles.active : ""
                    } ${styles.narrower}`}
                    onClick={() => setNumPlayers(2)}
                  >
                    2
                  </button>
                  <button
                    className={`${styles.button} ${styles.menu} ${
                      numPlayers === 3 ? styles.active : ""
                    } ${styles.narrower}`}
                    onClick={() => setNumPlayers(3)}
                  >
                    3
                  </button>
                  <button
                    className={`${styles.button} ${styles.menu} ${
                      numPlayers === 4 ? styles.active : ""
                    } ${styles.narrower}`}
                    onClick={() => setNumPlayers(4)}
                  >
                    4
                  </button>
                </div>
              </div>
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

            {/* footer */}
            {numPlayers === 1 ? (
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
            ) : (
              <div className={styles.multiplayerStatContainer}>
                <div className={styles.footer}>
                  {players.map((score, index) => (
                    <div
                      className={`${styles.footerItem} ${
                        index === currentPlayer ? styles.active : ""
                      }`}
                    >
                      <span
                        className={
                          index === currentPlayer
                            ? styles.textWhite
                            : styles.textSecondary
                        }
                      >
                        Player {index + 1}
                      </span>
                      <span
                        className={`${styles.textLevel2} ${
                          index === currentPlayer ? styles.textWhite : ""
                        }`}
                      >
                        {score}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.footer}>
                  {players.map((score, index) => (
                    <div className={styles.secondaryFooterItem}>
                      {index === currentPlayer && "CURRENT TURN"}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <ModalDialog ref={modalRef}>{getModalContent()}</ModalDialog>
    </>
  );
}
