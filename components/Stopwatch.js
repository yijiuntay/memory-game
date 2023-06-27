import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const Stopwatch = forwardRef((props, ref) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  {
    /* useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime((time) => time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]); */
  }

  useImperativeHandle(ref, () => ({
    startStopwatch: () => startStopwatch(),
    stopStopwatch: () => stopStopwatch(),
    resetStopwatch: () => resetStopwatch(),
  }));

  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
    }
  };

  const stopStopwatch = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
  };

  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);

  return (
    <>
      {minutes.toString().padStart(1, "0")}:
      {seconds.toString().padStart(2, "0")}
    </>
  );
});

Stopwatch.displayName = "Stopwatch";

export default Stopwatch;
