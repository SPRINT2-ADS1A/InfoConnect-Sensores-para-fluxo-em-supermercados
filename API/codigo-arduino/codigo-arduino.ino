#include "Ultrasonic.h"

const int PINO_TRIGGER = 12;
const int PINO_ECHO = 13;

Ultrasonic sensor(PINO_TRIGGER, PINO_ECHO);

void setup() {
  Serial.begin(9600);

}

void loop() {
  Serial.print("");
  Serial.print(sensor.distanceRead());
  Serial.println("");

  delay(1000);
}