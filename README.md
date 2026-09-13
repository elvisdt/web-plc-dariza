# DARIZA SCADA IOT

Panel HMI web para monitoreo y control de bombas vía MQTT.

## Estructura

```
index.html          Estructura de las pantallas (login, proceso, monitoreo, parámetros, diagnóstico)
css/styles.css       Estilos
js/config.js         Credenciales y datos de conexión MQTT (no se sube a git)
js/config.example.js Plantilla de config.js
js/ui.js             Login y navegación entre pantallas
js/mqtt.js           Conexión MQTT, lectura de valores y botones de control
img/                 Logos e imágenes del esquema
manifest.json        Manifest de la PWA
```

## Configuración

1. Copia `js/config.example.js` como `js/config.js`.
2. Completa tus credenciales de acceso (`APP_USER`, `APP_PASS`) y los datos del broker MQTT (`MQTT_BROKER_URL`, `MQTT_USER`, `MQTT_PASS`, topics).

`js/config.js` está en `.gitignore` y no se versiona.

## Uso local

Al ser una página estática, basta con servirla con cualquier servidor HTTP simple:

```
python3 -m http.server 8000
```

Y abrir `http://localhost:8000`.

## Notas

- El login se valida en el navegador (JavaScript del cliente), por lo que no es un mecanismo de seguridad real: cualquiera puede ver el código fuente. Sirve solo para restringir el acceso casual.
- La conexión MQTT usa WebSockets (`wss://`) contra el broker configurado en `js/config.js`.
