#!/usr/bin/env python3
"""Simulador de la bomba: publica datos falsos de variadores/IO y escucha
los comandos que la web envia por MQTT. Solo para pruebas locales, no se
usa dentro de Docker."""

import json
import random
import time

import paho.mqtt.client as mqtt

BROKER_HOST = "pesajeapp.site"
BROKER_PORT = 1883
MQTT_USER = "dispositivo"
MQTT_PASS = "daryza20"

TOPIC_VAR = "lurin/factory/bombas/var"
TOPIC_IO = "lurin/factory/bombas/io"
TOPIC_CONTROL = "lurin/factory/bombas"

INTERVALO = 2  # segundos entre publicaciones

estado = {
    "freq1": 30.0, "encendido1": True,
    "freq2": 25.0, "encendido2": False,
    "presion": 65.0,
    "tanque1": 1, "tanque2": 1, "tanque3": 0,
    "alarma": 0,
    "modo": "AUTOMATICO",       # AUTOMATICO | MANUAL (mutuamente excluyentes)
    "seleccion": "BOMBA1",      # BOMBA1 | BOMBA2 | ALTERNADO (mutuamente excluyentes)
    "alternado_tick": 0,
}


def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("[SIM] Conectado al broker")
        client.subscribe(TOPIC_CONTROL)
    else:
        print("[SIM] Error de conexion, codigo:", rc)


def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    print(f"[SIM] Comando recibido en {msg.topic}: {payload}")

    if ":" in payload:
        clave, valor = payload.split(":", 1)
        try:
            valor = float(valor)
        except ValueError:
            return
        if clave == "variador1freq":
            estado["freq1"] = valor
        elif clave == "variador2freq":
            estado["freq2"] = valor
    elif payload == "variador1on":
        estado["encendido1"] = True
    elif payload == "variador1off":
        estado["encendido1"] = False
    elif payload == "variador2on":
        estado["encendido2"] = True
    elif payload == "variador2off":
        estado["encendido2"] = False
    elif payload == "alarmaon":
        estado["alarma"] = 1
    elif payload == "alarmaoff":
        estado["alarma"] = 0
    elif payload == "automatico":
        estado["modo"] = "AUTOMATICO"
    elif payload == "manual":
        estado["modo"] = "MANUAL"
    elif payload == "selectbomba1":
        estado["seleccion"] = "BOMBA1"
    elif payload == "selectbomba2":
        estado["seleccion"] = "BOMBA2"
    elif payload == "selectalternado":
        estado["seleccion"] = "ALTERNADO"


def publicar_var(client):
    freq1 = estado["freq1"] + random.uniform(-0.3, 0.3)
    freq2 = estado["freq2"] + random.uniform(-0.3, 0.3)
    data = {
        "H100": round(freq1 * 100),
        "H101": 220 + random.randint(-3, 3),
        "H102": round((5 + random.uniform(-0.5, 0.5)) * 100),
        "H103": round((3 + random.uniform(-0.3, 0.3)) * 10),
        "Status1": "ENCENDIDO" if estado["encendido1"] else "APAGADO",
        "H105": round(estado["freq1"] * 100),

        "H200": round(freq2 * 100),
        "H201": 380 + random.randint(-3, 3),
        "H202": round((3 + random.uniform(-0.3, 0.3)) * 100),
        "H203": round((2 + random.uniform(-0.2, 0.2)) * 10),
        "Status2": "ENCENDIDO" if estado["encendido2"] else "APAGADO",
        "H205": round(estado["freq2"] * 100),
    }
    client.publish(TOPIC_VAR, json.dumps(data))
    print("[SIM] VAR ->", data)


def publicar_io(client):
    estado["presion"] += random.uniform(-1, 1)
    estado["presion"] = max(0, min(145, estado["presion"]))

    if estado["seleccion"] == "ALTERNADO":
        estado["alternado_tick"] += 1
        activa = "BOMBA1" if (estado["alternado_tick"] // 3) % 2 == 0 else "BOMBA2"
    else:
        activa = estado["seleccion"]

    data = {
        "H300": estado["tanque1"],
        "H301": estado["tanque2"],
        "H302": estado["tanque3"],
        "H303": 0,
        "H304": 1 if activa == "BOMBA1" else 0,
        "H305": 1 if activa == "BOMBA2" else 0,
        "H306": 1 if estado["modo"] == "AUTOMATICO" else 0,
        "H307": estado["alarma"],
        "H311": 1 if estado["modo"] == "MANUAL" else 0,
        "H313": 1 if estado["seleccion"] == "ALTERNADO" else 0,
        "H312": round(estado["presion"] * 100),
        "H308": 50,
        "H309": 8000,
        "H310": 3,
    }
    client.publish(TOPIC_IO, json.dumps(data))
    print("[SIM] IO  ->", data)


def crear_cliente():
    try:
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    except AttributeError:
        client = mqtt.Client()
    return client


def main():
    client = crear_cliente()
    client.username_pw_set(MQTT_USER, MQTT_PASS)
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER_HOST, BROKER_PORT, 60)
    client.loop_start()

    print("Simulador de bomba corriendo. Ctrl+C para detener.")
    try:
        while True:
            publicar_var(client)
            publicar_io(client)
            time.sleep(INTERVALO)
    except KeyboardInterrupt:
        print("\n[SIM] Detenido")
    finally:
        client.loop_stop()
        client.disconnect()


if __name__ == "__main__":
    main()
