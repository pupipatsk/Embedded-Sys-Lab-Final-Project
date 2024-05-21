#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "T";
const char* password = "11111111";
const char* mqtt_server = "broker.netpie.io";
const int mqtt_port = 1883;
const char* mqtt_Client = "a80f1ca2-1d2b-4cd1-9fce-e930b7a59ef8";
const char* mqtt_username = "Hbxd2iAMGYpeCPXSbFQwUruaptgHDFNe";
const char* mqtt_password = "zcCHPg7fWTLFUTEystPXesd1xrVQQFKM";

WiFiClient espClient;
PubSubClient client(espClient);

char msg[100];

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection…");
    if (client.connect(mqtt_Client, mqtt_username, mqtt_password)) {
      Serial.println("connected");
    }
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.enableInsecureWEP();
  WiFi.disconnect();
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(WiFi.status());
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  client.setServer(mqtt_server, mqtt_port);
}

int state = 0;
void loop() {
  // put your main code here, to run repeatedly:
 
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  if(state == 1) state--;
  else state++;
  String data = "{\"data\": {\"val\":" + String(state) + "}}";
  Serial.println(data);

  data.toCharArray(msg, (data.length() + 1));
  client.publish("  ", msg);
  delay(5000);
}
