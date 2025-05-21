import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Physics constants
const PIXELS_PER_METER = 10;
const UPDATE_INTERVAL_MS = 30; // ~33 FPS
const A_CAR_VELOCITY = 20; // pixels per second (constant)
const B_CAR_ACCELERATION = 10; // pixels per second squared
const screenHeight = Dimensions.get('window').height;

export default function App() {
  const [carAPosition, setCarAPosition] = useState(50);
  const [carBPosition, setCarBPosition] = useState(50);
  const [carASpeed, setCarASpeed] = useState(0);
  const [carBSpeed, setCarBSpeed] = useState(0);
  const [simulationEnded, setSimulationEnded] = useState(false);

  // Physics state
  const carAVelocity = useRef(A_CAR_VELOCITY); // pixels per second (constant)
  const carBVelocity = useRef(0);    // starts at 0
  const carBAcceleration = useRef(B_CAR_ACCELERATION);      // pixels per second squared

  const lastUpdateTime = useRef(Date.now());
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTime.current) / 1000; // in seconds
      lastUpdateTime.current = now;

      // Update Car A (constant velocity)
      const newCarAPos = carAPosition + carAVelocity.current * deltaTime;
      const newCarASpeed = carAVelocity.current / PIXELS_PER_METER;

      // Update Car B (accelerating)
      carBVelocity.current += carBAcceleration * deltaTime;
      const newCarBPos = carBPosition + carBVelocity.current * deltaTime;
      const newCarBSpeed = carBVelocity.current / PIXELS_PER_METER;

      setCarAPosition(newCarAPos);
      setCarASpeed(newCarASpeed);

      setCarBPosition(newCarBPos);
      setCarBSpeed(newCarBSpeed);

      // End simulation if both cars are off-screen
      if (newCarAPos > screenHeight && newCarBPos > screenHeight) {
        clearInterval(gameLoopRef.current);
        setSimulationEnded(true);
      }
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(gameLoopRef.current);
  }, [carAPosition, carBPosition]);

  return (
    <View style={styles.container}>
      <Text style={styles.speedText}>🚗 Car A (Constant): {carASpeed.toFixed(2)} m/s</Text>
      <Text style={styles.speedText}>🏎️ Car B (Accelerating): {carBSpeed.toFixed(2)} m/s</Text>
      {simulationEnded && <Text style={styles.endedText}>🏁 Simulation Ended</Text>}

      <View style={styles.track}>
        {/* Car A (blue) */}
        <View style={[styles.car, styles.carA, { left: 200, top: carAPosition }]} />
        
        {/* Car B (red) */}
        <View style={[styles.car, styles.carB, { left: 300, top: carBPosition }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  track: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 20,
  },
  car: {
    position: 'absolute',
    width: 30,
    height: 60,
    borderRadius: 6,
  },
  carA: {
    backgroundColor: 'blue',
  },
  carB: {
    backgroundColor: 'red',
  },
  speedText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 4,
  },
  endedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginLeft: 20,
    marginTop: 10,
  },
});
