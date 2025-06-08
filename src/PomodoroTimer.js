import React, { useState, useEffect } from 'react';
import './PomodoroTimer.css';

function PomodoroTimer() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    }
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const toggleTimer = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(25 * 60);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <section className="pomodoro-container" aria-label="Pomodoro Timer">
      <h3>Pomodoro Timer</h3>
      <div className="timer-display" aria-live="polite" aria-atomic="true">
        {formatTime(secondsLeft)}
      </div>
      <div className="timer-buttons">
        <button onClick={toggleTimer} aria-pressed={isRunning}>
          {isRunning ? 'Pause' : secondsLeft === 0 ? 'Start Again' : 'Start'}
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </section>
  );
}

export default PomodoroTimer;
