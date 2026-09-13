const topicVar = MQTT_TOPIC_VAR;
const topicIO  = MQTT_TOPIC_IO;
const client = MQTT_USER
    ? mqtt.connect(MQTT_BROKER_URL, { username: MQTT_USER, password: MQTT_PASS })
    : mqtt.connect(MQTT_BROKER_URL);

// ====== SPANS VARIADOR 1 ======
const estadoSpan = document.getElementById("estadoValor");
const potenciaSpan = document.getElementById("potenciaValor");
const corrienteSpan = document.getElementById("corrienteValor");
const voltajeSpan = document.getElementById("voltajeValor");
const frecuenciaSpan = document.getElementById("frecuenciaValor");

// ====== SPANS VARIADOR 2 ======
const estado2Span = document.getElementById("estadoValor2");
const potencia2Span = document.getElementById("potenciaValor2");
const corriente2Span = document.getElementById("corrienteValor2");
const voltaje2Span = document.getElementById("voltajeValor2");
const frecuencia2Span = document.getElementById("frecuenciaValor2");

const presionpsiSpan = document.getElementById("presionpsi");
const alarmaImg = document.getElementById("alarmaImg");
client.on("connect", () => {
    console.log("[MQTT] Conectado:", MQTT_BROKER_URL);
    client.subscribe(topicVar, (err) => {
        if (err) console.error("[MQTT] Error suscribiendo a", topicVar, err);
        else console.log("[MQTT] Suscrito a", topicVar);
    });
    client.subscribe(topicIO, (err) => {
        if (err) console.error("[MQTT] Error suscribiendo a", topicIO, err);
        else console.log("[MQTT] Suscrito a", topicIO);
    });
});
client.on("error", (err) => console.error("[MQTT] Error de conexión:", err));
client.on("reconnect", () => console.warn("[MQTT] Reconectando..."));
client.on("close", () => console.warn("[MQTT] Conexión cerrada"));
client.on("offline", () => console.warn("[MQTT] Cliente offline"));

let sincronizadoProceso = false; // para las frecuencias
let sincronizadoIO = false;      // para H308, H309, H310
let lastStatus1 = "DESCONOCIDO";
let lastStatus2 = "DESCONOCIDO";
client.on("message", (topic, message) => {
    console.log("[MQTT] Mensaje recibido en", topic, "->", message.toString());
    try {
        const data = JSON.parse(message.toString());

        if (topic === topicVar) {
            // ====== VARIADOR 1 ======
            const freq1 = (data.H100 / 100).toFixed(2);
            const volt1 = data.H101.toFixed(0);
            const amp1  = (data.H102 / 100).toFixed(2);
            const pot1  = (data.H103 / 10).toFixed(2);
            const status1 = data.Status1 || "DESCONOCIDO";
            lastStatus1 = data.Status1;

            estadoSpan.innerText     = status1;
            potenciaSpan.innerText   = pot1 + " kW";
            corrienteSpan.innerText  = amp1 + " A";
            voltajeSpan.innerText    = volt1 + " V";
            frecuenciaSpan.innerText = freq1 + " Hz";

            // ====== VARIADOR 2 ======
            const freq2 = (data.H200 / 100).toFixed(2);
            const volt2 = data.H201.toFixed(0);
            const amp2  = (data.H202 / 100).toFixed(2);
            const pot2  = (data.H203 / 10).toFixed(2);
            const status2 = data.Status2 || "DESCONOCIDO";
            lastStatus2 = data.Status2;
            estado2Span.innerText     = status2;
            potencia2Span.innerText   = pot2 + " kW";
            corriente2Span.innerText  = amp2 + " A";
            voltaje2Span.innerText    = volt2 + " V";
            frecuencia2Span.innerText = freq2 + " Hz";

            // ====== SINCRONIZAR INPUT SOLO UNA VEZ ======
            if (!sincronizadoProceso) {
                const hmi_freq1 = (data.H105 / 100).toFixed(2);
                const hmi_freq2 = (data.H205 / 100).toFixed(2);

                inputFreqProceso.value = hmi_freq1;
                inputFreq2Proceso.value = hmi_freq2;

                sincronizadoProceso = true;

                console.log("Sincronizado FRECUENCIAS:", hmi_freq1, hmi_freq2);
            }

        } else if (topic === topicIO) {
            const rectV1  = document.getElementById("rectV1");
            const rectV2Y0 = document.getElementById("rectV2Y0");
            const rectV2Y1 = document.getElementById("rectV2Y1");
            // ====== DIAGNOSTICO RECTANGULOS ======
            const h300 = data.H300;
            const h301 = data.H301;
            const h302 = data.H302;
            const h303 = data.H303;
            const h304 = data.H304;
            const h305 = data.H305;
            const h306 = data.H306;
            const h307 = data.H307;
	    const h311 = data.H311;
            const h313 = data.H313;
            const presionpsi = (data.H312 / 100).toFixed(2);
	    presionpsiSpan.innerText = presionpsi + " psi";

	    if (h307 == 1) {
  	    alarmaImg.style.display = "block";
	    } else {
            alarmaImg.style.display = "none";
            }
            // ====== RECTÁNGULO 1 → SOLO STATUS V1 ======
            if (lastStatus1 === "ENCENDIDO") {
              rectV1.style.backgroundColor = "#2ea043";
            } else {
              rectV1.style.backgroundColor = "#e5484d";
            }

            // ====== RECTÁNGULO 2 → STATUS V2 + Y0 ======
            if (lastStatus2 === "ENCENDIDO" && h304 == 1) {
               rectV2Y0.style.backgroundColor = "#2ea043";
            } else {
               rectV2Y0.style.backgroundColor = "#e5484d";
            }

            // ====== RECTÁNGULO 3 → STATUS V2 + Y1 ======
            if (lastStatus2 === "ENCENDIDO" && h305 == 1) {
            rectV2Y1.style.backgroundColor = "#2ea043";
            } else {
                rectV2Y1.style.backgroundColor = "#e5484d";
            }
	function setRectColor(rectId, valor, tanqueImgId) {
   	   const rect = document.getElementById(rectId);
   	   if (!rect) return;

  	   rect.style.backgroundColor = valor ? "#2ea043" : "#e5484d";

   	   // Mostrar u ocultar imagen del tanque si se pasa el ID
  	   if(tanqueImgId) {
    	     const img = document.getElementById(tanqueImgId);
      	     if(img) img.style.display = valor ? "block" : "none";
    	   }
	}

	// ENTRADAS (tanques)
	setRectColor("rect1", h300, "tanque1Img"); // X0 → tanque 1
	setRectColor("rect2", h301, "tanque2Img"); // X1 → tanque 2
	setRectColor("rect3", h302, "tanque3Img"); // X2 → tanque 3
	setRectColor("rect4", h303);               // X3 → solo rectángulo, sin imagen

            // SALIDAS
            setRectColor("rect5", h304);
            setRectColor("rect6", h305);
            setRectColor("rect7", h304);
            setRectColor("rect8", h305);
            setRectColor("rect9", h306);
            setRectColor("rect10", h311);
            setRectColor("rect11", h313);
            // ====== SINCRONIZAR INPUTS H308, H309, H310 SOLO UNA VEZ ======
            if (!sincronizadoIO) {
                const hmi_retardopresion = (data.H308 / 10).toFixed(1);
                const hmi_presionminima  = (data.H309 / 100).toFixed(2);
                const hmi_reintentos     = (data.H310 / 1).toFixed(0);

                inputRetardoPresion.value = hmi_retardopresion;
                inputPresionMinima.value  = hmi_presionminima;
                inputReintentos.value     = hmi_reintentos;

                sincronizadoIO = true;
                console.log("Sincronizado I/O:", hmi_retardopresion, hmi_presionminima, hmi_reintentos);
            }
        }

    } catch(e) {
        console.error("Error parseando JSON:", e);
    }
});

const topicControl = MQTT_TOPIC_CONTROL;

// === INPUTS EXISTENTES VARIADOR 1 y 2 ===
const inputFreqProceso = document.getElementById("inputFreqProceso");
const inputFreq2Proceso = document.getElementById("inputFreq2Proceso");

// === NUEVOS INPUTS PARAMETROS ===
const inputRetardoPresion = document.getElementById("inputRetardoPresion");
const inputPresionMinima  = document.getElementById("inputPresionMinima");
const inputReintentos = document.getElementById("inputReintentos");

// =======================
//   LIMITES MIENTRAS ESCRIBE
// =======================
inputFreqProceso.addEventListener("input", () => {
    let v = parseFloat(inputFreqProceso.value);
    if (isNaN(v)) return;
    if (v < 0) inputFreqProceso.value = 0;
    if (v > 60) inputFreqProceso.value = 60;
});
inputFreq2Proceso.addEventListener("input", () => {
    let v = parseFloat(inputFreq2Proceso.value);
    if (isNaN(v)) return;
    if (v < 0) inputFreq2Proceso.value = 0;
    if (v > 50) inputFreq2Proceso.value = 50;
});
inputRetardoPresion.addEventListener("input", () => {
    let v = parseFloat(inputRetardoPresion.value);
    if (isNaN(v)) return;
    if (v < 0.0) inputRetardoPresion.value = 0.0;
    if (v > 60.0) inputRetardoPresion.value = 60.0;
});
inputPresionMinima.addEventListener("input", () => {
    let v = parseFloat(inputPresionMinima.value);
    if (isNaN(v)) return;
    if (v < 0.00) inputPresionMinima.value = 0.00;
    if (v > 145.00) inputPresionMinima.value = 145.00;
});
inputReintentos.addEventListener("input", () => {
    let v = parseInt(inputReintentos.value);
    if (isNaN(v)) return;
    if (v < 1) inputReintentos.value = 1;
    if (v > 10) inputReintentos.value = 10;
});

// =======================
//   AL PERDER FOCO → FORMATEAR + PUBLICAR MQTT
// =======================
inputFreqProceso.addEventListener("blur", () => {
    let v = parseFloat(inputFreqProceso.value) || 0;
    v = Math.min(60, Math.max(0, v));
    inputFreqProceso.value = v.toFixed(2);
    if(client.connected){
        client.publish(topicControl, "variador1freq:" + v.toFixed(2));
    }
});
inputFreq2Proceso.addEventListener("blur", () => {
    let v = parseFloat(inputFreq2Proceso.value) || 0;
    v = Math.min(50, Math.max(0, v));
    inputFreq2Proceso.value = v.toFixed(2);
    if(client.connected){
        client.publish(topicControl, "variador2freq:" + v.toFixed(2));
    }
});
inputRetardoPresion.addEventListener("blur", () => {
    let v = parseFloat(inputRetardoPresion.value) || 0.0;
    v = Math.min(60.0, Math.max(0.0, v));
    inputRetardoPresion.value = v.toFixed(1);
    if(client.connected){
        client.publish(topicControl, "retardoPresion:" + v.toFixed(1));
    }
});
inputPresionMinima.addEventListener("blur", () => {
    let v = parseFloat(inputPresionMinima.value) || 0.00;
    v = Math.min(145.00, Math.max(0.00, v));
    inputPresionMinima.value = v.toFixed(2);
    if(client.connected){
        client.publish(topicControl, "presionMinima:" + v.toFixed(2));
    }
});
inputReintentos.addEventListener("blur", () => {
    let v = parseInt(inputReintentos.value) || 1;
    v = Math.min(10, Math.max(1, v));
    inputReintentos.value = v;
    if(client.connected){
        client.publish(topicControl, "cantidadReintentos:" + v);
    }
});

// =======================
//   BOTONES MQTT
// =======================
document.querySelectorAll('.boton-mqtt').forEach(btn => {
    btn.onclick = () => {
        const msg = btn.dataset.msg;
        if(client && client.connected){
            client.publish(topicControl, msg);
            console.log("Enviado MQTT:", msg);
        } else {
            console.warn("Cliente MQTT no conectado");
        }
    };
});
