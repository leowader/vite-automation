const { spawn } = require("child_process");
const projectName = "mi_proyecto_vite";
const directory = "probando"; 

// Comando para crear un proyecto Vite
const comando = `npm create vite@latest ${projectName}`;

// Ejecutar el comando
const proceso = spawn(comando, { cwd: directory, shell: true });
let seleccionado = false;
proceso.stdout.on("data", (data) => {
  const salida = data.toString();
  process.stdout.write(salida); // Imprimir la salida en la consola principal
  if (salida.includes("Select a framework:") && seleccionado===false) {
    proceso.stdin.write("\x1B[B\x1B[B\n");
    seleccionado = true; // Enviar teclas de flecha hacia abajo y Enter para seleccionar 'Vanilla'
  }
  if (salida.includes("Select a variant:")) {
    proceso.stdin.write("x1B[B\n"); // Enviar teclas de flecha hacia abajo y Enter para seleccionar 'Vanilla'
  }
});
proceso.on("close", (codigo) => {
  if (codigo === 0) {
    console.log(
      `Proyecto Vite con React creado correctamente en ${directory}/${projectName}.`
    );
  } else {
    console.error(`Error al crear el proyecto Vite: ${codigo}`);
  }
});
