// start-all.js
// Lance tous les microservices en parallèle

const { spawn } = require("child_process");
const path = require("path");

const services = [
  { name: "Auth", cwd: "Auth", script: "app.js" },
  { name: "Users", cwd: "Users", script: "app.js" },
  { name: "Mail", cwd: "Mail", script: "app.js" },
  { name: "Gateway", cwd: "Gateway", script: "app.js" },
  { name: "Vehicles", cwd: "Vehicles", script: "app.js" },
  { name: "Maintains", cwd: "Maintains", script: "app.js" },
  {name: "Navigate", cwd: "Navigate", script: "app.js" },
];

services.forEach(({ name, cwd, script }) => {
  const proc = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["nodemon", script],
    {
      cwd: path.join(__dirname, cwd),
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      env: process.env,
    }
  );

  proc.stdout.on("data", (data) => {
    process.stdout.write(`[${name}] ${data}`);
  });
  proc.stderr.on("data", (data) => {
    process.stderr.write(`[${name}][ERR] ${data}`);
  });
  proc.on("close", (code) => {
    console.log(`[${name}] exited with code ${code}`);
  });
});
