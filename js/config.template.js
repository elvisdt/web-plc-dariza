const APP_USER = "__APP_USER__";
const APP_PASS = "__APP_PASS__";

// El navegador se conecta al broker-puente local (contenedor mqtt-bridge),
// que a su vez reenvia todo al broker real (pesajeapp.site) via bridge MQTT.
const MQTT_BROKER_URL = (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/mqtt";
const MQTT_USER = "";
const MQTT_PASS = "";

const MQTT_TOPIC_VAR = "lurin/factory/bombas/var";
const MQTT_TOPIC_IO = "lurin/factory/bombas/io";
const MQTT_TOPIC_CONTROL = "lurin/factory/bombas";
