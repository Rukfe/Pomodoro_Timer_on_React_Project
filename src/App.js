import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import CircleProgress from './CircleProgress'; // Импортируем наш SVG компонент


function App() {
  const [workMinutes, setWorkMinutes] = useState(0); // Время работы в минутах
  const [breakMinutes, setBreakMinutes] = useState(0); // Время отдыха в минутах
  const [workSeconds, setWorkSeconds] = useState(5); // Время работы в секундах
  const [breakSeconds, setBreakSeconds] = useState(5); // Время отдыха в секундах
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerType, setTimerType] = useState('work'); // 'work' или 'break'
  const [inputError, setInputError] = useState(''); // Новое состояние для отслеживания ошибок ввода
  const [timerFinished, setTimerFinished] = useState(false);
  // Вычисляем totalTime на основе минут и секунд
  const workTime = workMinutes * 60 + workSeconds;
  const breakTime = breakMinutes * 60 + breakSeconds;

  const notifyEndOfTime = useCallback(() => {
    if (Notification.permission === "granted") {
      const message = timerType === 'work' ? 'Время отдохнуть!' : 'Время поработать!';
      new Notification(message);
    }
  }, [timerType]);
  
  useEffect(() => {
    if (!isRunning) return undefined;
  
    const totalSeconds = timerType === 'work' ? workTime : breakTime;
    const interval = setInterval(() => {
      setElapsedSeconds((elapsed) => {
        if (elapsed < totalSeconds) {
          return elapsed + 1;
        }
        clearInterval(interval);
        setTimerFinished(true);
        return elapsed;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [isRunning, timerType, workTime, breakTime]);
  
  useEffect(() => {
    if (timerFinished) {
      notifyEndOfTime();
      setTimerType(prevType => prevType === 'work' ? 'break' : 'work');
      setElapsedSeconds(0);
      setTimerFinished(false);
    }
  }, [notifyEndOfTime, timerFinished]);
  
  const handleStartStopClick = () => {
    const hasValidTime = (minutes, seconds) => minutes > 0 || seconds > 0;
  
    if (isRunning) {
      setIsRunning(false); // Остановить сразу при нажатии, если таймер работает.
      // Не нужно проверять время, потому что таймер уже запущен.
    } else {
      // Запустить таймер только если время валидно.
      if (!hasValidTime(workMinutes, workSeconds) || !hasValidTime(breakMinutes, breakSeconds)) {
        setInputError('Введите корректное время');
        setTimeout(() => setInputError(''), 2000);
        return;
      }
  
      setInputError('');
      setIsRunning(true);
    }
  };
  
  const handleResetClick = () => {
    setInputError('');
    setElapsedSeconds(0);
    setTimerFinished(false);
    setIsRunning(false);
  };
  
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    // Вызов calculateProgress для демонстрации прогресса (если это необходимо)
    const progressPercentage = calculateProgress();
    // Вероятно, здесь следует что-то сделать с progressPercentage
    return formattedTime;
  };
  
  const calculateProgress = () => {
    const totalTime = timerType === 'work' ? workTime : breakTime;
    const progress = (elapsedSeconds / totalTime) * 100;
    return Math.min(progress, 100);
  };
  

  return (
    <div className="App">
      <h1>Таймер Помодоро</h1>
      <h2>{timerType === 'work' ? 'Время поработать!' : 'Время отдохнуть!'}</h2>
      <CircleProgress percentage={calculateProgress()}>
        <div className="timer-text">
          {formatTime(timerType === 'work' ? workTime - elapsedSeconds : breakTime - elapsedSeconds)}
        </div>
      </CircleProgress>
      <div>
        <label>
          Работа:
          <input
            type="number"
            disabled={isRunning}
            value={workMinutes}
            onChange={(e) => setWorkMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
          />
          минут
          <input
            type="number"
            disabled={isRunning}
            value={workSeconds}
            onChange={(e) => setWorkSeconds(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
          />
          секунд
        </label>
        <label>
          Отдых:
          <input
            type="number"
            disabled={isRunning}
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
          />
          минут
          <input
            type="number"
            disabled={isRunning}
            value={breakSeconds}
            onChange={(e) => setBreakSeconds(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
          />
          секунд
        </label>
      </div>
      {inputError && <div className="error">{inputError}</div>}
      <button
        onClick={handleStartStopClick}
        className={inputError ? 'shake' : ''}
      >
        {isRunning ? 'Пауза' : 'Начать'}
      </button>
      <button onClick={handleResetClick}>Сбросить</button>
    </div>
  );
}

export default App;
