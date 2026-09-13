function login() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (user === APP_USER && pass === APP_PASS) {
      document.getElementById("loginScreen").style.display = "none";

      // Mostrar botones de navegación
      document.getElementById("navButtons").style.display = "flex";

      showScreen("mainScreen");
  } else {
      document.getElementById("mensaje").innerText = "Credenciales incorrectas";
  }
}


function showScreen(screenId) {
  const screens = [
    "mainScreen",
    "procesoScreen",
    "monitoreoScreen",
    "parametrosScreen",
    "diagnosticoScreen"
  ];

  screens.forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  document.getElementById(screenId).style.display = "flex";
}
function ajustarValor(id, sentido) {
  const input = document.getElementById(id);
  if (!input) return;

  const step = parseFloat(input.step) || 1;
  const min = input.min !== "" ? parseFloat(input.min) : -Infinity;
  const max = input.max !== "" ? parseFloat(input.max) : Infinity;
  const decimales = (input.step.split(".")[1] || "").length;

  let v = parseFloat(input.value) || 0;
  v = Math.min(max, Math.max(min, v + sentido * step));
  input.value = v.toFixed(decimales);

  input.dispatchEvent(new Event("input"));
  input.dispatchEvent(new Event("blur"));
}

function activarPantallaCompleta() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
}
