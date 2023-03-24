let i = 0;
let timer;
addEventListener("message", (event: MessageEvent<any>) => {
  console.log("message from main script", event.data);
  // postMessage("hello from worker");

  timer = setInterval(() => {
    console.log("worker", i);
    postMessage(i++);
  }, 1000);
  // close();

  if (event.data === "close") {
    clearInterval(timer);
  }
});

export default null;
