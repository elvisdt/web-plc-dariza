function login() {
  const user = document.getElementById("usuario").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (user === APP_USER && pass === APP_PASS) {
      activarPantallaCompleta(); // FULL SCREEN

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
function activarPantallaCompleta() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
}
