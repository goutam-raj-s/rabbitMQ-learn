import amqp from 'amqp-connection-manager';

const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';

export const mqConnection = amqp.connect([rabbitMqUrl]);

mqConnection.on('connect', () => {
    console.log('[RabbitMQConnectionManager] Connected to RabbitMQ!');
});

mqConnection.on('disconnect', ({ err }) => {
    console.error('[RabbitMQConnectionManager] Disconnected from RabbitMQ.', err);
});
