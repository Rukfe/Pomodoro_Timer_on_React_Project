import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [workMinutes, setWorkMinutes] = useState(50); // Время работы в минутах
  const [breakMinutes, setBreakMinutes] = useState(10); // Время отдыха в минутах
  const [workSeconds, setWorkSeconds] = useState(0); // Время работы в секундах
  const [breakSeconds, setBreakSeconds] = useState(0); // Время отдыха в секундах
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerType, setTimerType] = useState('work'); // 'work' или 'break'
  const [inputError, setInputError] = useState(''); // Новое состояние для отслеживания ошибок ввода

  // Вычисляем totalTime на основе минут и секунд
  const workTime = workMinutes * 60 + workSeconds;
  const breakTime = breakMinutes * 60 + breakSeconds;

  useEffect(() => {
    let interval = null;

    if (isRunning && elapsedSeconds < (timerType === 'work' ? workTime : breakTime)) {
      interval = setInterval(() => {
        setElapsedSeconds((elapsed) => elapsed + 1);
      }, 1000);
    } else if (!isRunning && elapsedSeconds !== 0) {
      clearInterval(interval);
    } else if (elapsedSeconds >= (timerType === 'work' ? workTime : breakTime)) {
      setTimerType((prevType) => (prevType === 'work' ? 'break' : 'work'));
      setElapsedSeconds(0);
      if (Notification.permission === "granted") {
        new Notification(timerType === 'work' ? 'Время отдыха!' : 'Время работать!');
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, elapsedSeconds, workTime, breakTime, timerType]);

  const handleStartStopClick = () => {
    // Прежде чем начать отсчет, проверяем валидность значений
    if ((workMinutes === 0 && workSeconds === 0) || (breakMinutes === 0 && breakSeconds === 0)) {
      setInputError('Введите корректное время');
      return;
    }

    // Если все хорошо, сбрасываем ошибку и начинаем/останавливаем отсчет
    setInputError('');
    setIsRunning(!isRunning);
  };

  const handleResetClick = () => {
    // Сбрасываем ошибку при нажатии кнопки сброса
    setInputError('');
    setElapsedSeconds(0);
    setIsRunning(false);
  };
  

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const calculateProgress = () => {
    const totalTime = timerType === 'work' ? workTime : breakTime;
    return elapsedSeconds / totalTime * 100;
  };

  const progressBarStyle = {
    background: `conic-gradient(${timerType === 'work' ? 'red' : 'green'} ${calculateProgress()}%, lightgray ${calculateProgress()}% 100%)`,
  };



  return (
    <div className="App">
      <h1>Таймер Помодоро</h1>
      <h2>{timerType === 'work' ? 'Время поработать!' : 'Время отдохнуть!'}</h2>
      <div className="timer" style={progressBarStyle}>
        {formatTime(timerType === 'work' ? workTime - elapsedSeconds : breakTime - elapsedSeconds)}
      </div>
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
        {isRunning ? 'Остановить' : 'Начать'}
      </button>
      <button onClick={handleResetClick}>Сбросить</button>
    </div>
  );
}

export default App;
