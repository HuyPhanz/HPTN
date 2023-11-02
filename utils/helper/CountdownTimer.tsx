import React, {useState, useEffect} from "react";

function CountdownTimer(props: {
  initialTimeInSeconds: number;
  className?: string;
  reset?: boolean;
}): JSX.Element {
  const {initialTimeInSeconds, className, reset} = props; // 3 minutes
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    setTimeLeft(initialTimeInSeconds); // Reset the timer to the initial time when props change
  }, [initialTimeInSeconds, reset]);

  return (
    <div className={`timer ${className ?? ""}`}>
      <h2>{formatTime(timeLeft)}</h2>
    </div>
  );
}

export default CountdownTimer;
