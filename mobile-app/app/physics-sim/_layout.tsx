import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from "matter-js";

type EntityProps = {
    body: Matter.Body;
    color: string;
    renderer: (props: any) => JSX.Element;
};

const Ball = (props: EntityProps) => {
    const { body, color } = props;
    const radius = 20;

    return (
        <View
            style={{
                position: 'absolute',
                left: body.position.x - radius,
                top: body.position.y - radius,
                width: radius * 2,
                height: radius * 2,
                borderRadius: radius,
                backgroundColor: color,
            }}
        />
    );
};

const Physics = (entities: any, { time }: any) => {
    const engine: Matter.Engine = entities.physics.engine;
    Matter.Engine.update(engine, time.delta);
    return entities;
};

export default function App() {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;

    const ball = Matter.Bodies.circle(100, 100, 20, { restitution: 0.8 });
    const floor = Matter.Bodies.rectangle(200, 600, 400, 40, {
        isStatic: true,
    });

    Matter.World.add(world, [ball, floor]);

    // Apply initial velocity and acceleration (via force)
    Matter.Body.setVelocity(ball, { x: 2, y: -10 }); // Initial velocity
    Matter.Body.applyForce(ball, ball.position, { x: 0.002, y: 0 }); // Simulate acceleration

    return (
        <GameEngine
            systems={[Physics]}
            entities={{
                physics: { engine, world },
                ball: {
                    body: ball,
                    color: 'tomato',
                    renderer: Ball,
                },
                floor: {
                    body: floor,
                    color: 'black',
                    renderer: (props: any) => (
                        <View
                            style={{
                                position: 'absolute',
                                left: props.body.position.x - 200,
                                top: props.body.position.y - 20,
                                width: 400,
                                height: 40,
                                backgroundColor: 'black',
                            }}
                        />
                    ),
                },
            }}
            style={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
