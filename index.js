const { spawn } = require("child_process");
const fs = require("fs");
const projectName = "demo";
const directory = "projects";
const comando = `npm create vite@latest ${projectName}`;
const { structureReact } = require("./src/Arquitecture");
// Ejecutar el comando
const proceso = spawn(comando, { cwd: directory, shell: true });
let seleccionado = false;
proceso.stdout.on("data", (data) => {
  const salida = data.toString();
  if (salida.includes("Select a framework:") && seleccionado === false) {
    proceso.stdin.write("\x1B[B\x1B[B\n");
    seleccionado = true; // Enviar teclas de flecha hacia abajo y Enter para seleccionar 'React'
  }
  if (salida.includes("Select a variant:")) {
    proceso.stdin.write("x1B[B\n"); // Enviar teclas de flecha hacia abajo y Enter para seleccionar 'TypeScript'
  }
});
proceso.on("close", (code) => {});
setTimeout(() => {
  createStructure();
}, 5000);
function createStructure() {
  const lovitePath = `${directory}/${projectName}`;
  fs.access(lovitePath, fs.constants.F_OK, (err) => {
    if (!err) {
      console.log("lov", lovitePath);
      structureReact.forEach((folder) => {
        const ruta = `${lovitePath}/src/${folder}`;
        if (!fs.existsSync(ruta)) {
          fs.mkdirSync(ruta);
          console.log(`Carpeta '${folder}' creada exitosamente!`);
        } else {
          console.log(`La carpeta '${folder}' ya existe.`);
        }
      });
    } else {
      console.error(`Error: No se encontró el directorio ${lovitePath}`);
    }
  });
}
