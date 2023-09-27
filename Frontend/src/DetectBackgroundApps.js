const { exec } = require("child_process");

const cmdCommand = "wmic process get description";

const newArr = [
  "firefox.exe",
  "Code.exe",
  "chrome.exe",
  "mesedge.exe",
  "Discord.exe",
  "Whatsapp.exe",
  "sublime_text.exe",
];

let processesList = [];

exec(cmdCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error}`);
    return;
  }

  processesList = `${stdout}`.split("\r\r\n");
  const newArr = [];
  for (let i of processesList) {
    newArr.push(i.trim());
  }
  const runningApps = newArr.filter((element) =>
    [
      "Code.exe",
      "chrome.exe",
      "mesedge.exe",
      "Discord.exe",
      "Whatsapp.exe",
      "sublime_text.exe",
    ].includes(element)
  );

  console.log(runningApps);
});
