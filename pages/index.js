import { useEffect, useState } from "react";
import Head from "next/head";

const timeType = {
  pomodoro: { time: 25 * 60, stopmessage: "Bạn đã hoàn thành pomodoro 🍅" },
  sbreak: {
    time: 5 * 60,
    stopmessage: "Bạn đã hết thời gian nghỉ bắt đầu làm việc thôi nào 😊",
  },
  lbreak: {
    time: 15 * 60,
    stopmessage: "Bạn đã hết thời gian nghỉ bắt đầu làm việc thôi nào 😉",
  },
};

function pomodoro() {
  const [time, setTime] = useState(25 * 60);
  const [active, setActive] = useState(false);
  const [inter, setInter] = useState();
  const [type, setType] = useState("pomodoro");
  const [currentTime, setCurrentTime] = useState(0);
  // Change type
  useEffect(() => {
    timeReset();
  }, [type]);

  // Send notification
  useEffect(async () => {
    console.log("time :>> ", time);
    if (time <= 0) {
      if (Notification.permission == "granted") {
        navigator.serviceWorker.getRegistration().then(function (reg) {
          reg.showNotification(timeType[type].stopmessage);
        });
      }
      clearInterval(inter);
      setActive(false);
      setInter(null);
    }
  }, [time]);

  // Active time
  useEffect(() => {
    if (active) {
      setInter(

        setInterval(() => {
          // Đặt thời gian bàng thời gian của 1 pomodoro công thời gian lúc ấn start trừ thời gian hiện tại
          setTime(
            Math.floor(
              timeType[type].time + currentTime/1000 - new Date().getTime()/1000
            )
          );
        }, 10)
      );
    }
    return () => {
      clearInterval(inter);
    };
  }, [active]);

  function timeStart() {
    if(currentTime===0){
      // Lưu thời gian hiện tại vào biến
      setCurrentTime(new Date().getTime());
    }
    else{
      // Đặt thời gian hiện tại bằng thời gian hiện tại trừ Thời gian đã chạy đc.
      setCurrentTime(new Date().getTime() - (timeType[type].time*1000 - time*1000));
    }
    if (Notification.permission != "granted") {
      alert("You need turn on Notification");
      Notification.requestPermission(function (status) {
        console.log("Notification permission status:", status);
      });
    }
    setActive((a) => !a);
  }

  function timeStop() {
    clearInterval(inter);
    setActive(false);
    setCurrentTime(new Date().getTime());
  }

  // resetTime
  function timeReset() {
    clearInterval(inter);
    setActive(false);
    setTime(timeType[type].time);
    setCurrentTime(0)
  }
  return (
    <div>
      <Head>
        <title>{type}</title>
        {type == "pomodoro" && (
          <link rel="icon" href="/1.svg" type="image/svg" sizes="16x16" />
        )}
        {type == "sbreak" && (
          <link rel="icon" href="/2.svg" type="image/svg" sizes="16x16" />
        )}
        {type == "lbreak" && (
          <link rel="icon" href="/3.svg" type="image/svg" sizes="16x16" />
        )}
      </Head>
      <div className="flex h-screen w-screen bg-gray-700  justify-center items-center">
        <div className="flex flex-col w-full min-w-md md:w-1/2 h-4/5 bg-white rounded-lg">
          <div className="flex flex-row w-full justify-between p-5 space-x-2">
            <div
              onClick={() => {
                setType("pomodoro");
              }}
              className={`flex-1 text-center text-xl border rounded-lg hover:bg-red-300 p-1 ${
                type == "pomodoro" && "bg-red-300"
              }`}
            >
              Pomodoro
            </div>
            <div
              onClick={() => {
                setType("sbreak");
              }}
              className={`flex-1 text-center text-xl border rounded-lg hover:bg-green-300 p-1 ${
                type == "sbreak" && "bg-green-300"
              }`}
            >
              Nghỉ
            </div>
            <div
              onClick={() => {
                setType("lbreak");
              }}
              className={`flex-1  text-center text-xl border rounded-lg hover:bg-blue-300 p-1  ${
                type == "lbreak" && "bg-blue-300"
              }`}
            >
              Nghỉ dài
            </div>
          </div>
          <div className="w-full text-9xl text-center">
            {`${parseInt(time / 60)
              .toString()
              .padStart(2, "0")} : ${(time % 60).toString().padStart(2, "0")}`}
          </div>
          {/* Control button */}
          <div className="w-full text-9xl text-center space-x-4">
            <button
              className="text-5xl p-5 rounded-lg border border-blue-400 hover:bg-blue-400 hover:text-white focus:outline-none"
              style={active ? { display: "none" } : { display: "initial" }}
              onClick={timeStart}
            >
              Start
            </button>
            <button
              className="text-5xl p-5 rounded-lg border border-yellow-400 hover:bg-yellow-400 hover:text-white focus:outline-none"
              style={active ? { display: "initial" } : { display: "none" }}
              onClick={timeStop}
            >
              Stop
            </button>

            <button
              className="text-5xl p-5 rounded-lg border border-red-400 hover:bg-red-400 hover:text-white focus:outline-none"
              onClick={timeReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default pomodoro;
