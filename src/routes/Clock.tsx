import { useEffect, useState } from "react";

function padZero(num: number) {
  return num.toString().padStart(2, '0');
}

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerID);
  }, []);

  return (
    <div className="clock">
      {padZero(time.getHours())}:{padZero(time.getMinutes())}:{padZero(time.getSeconds())}
    </div>
  );
}
