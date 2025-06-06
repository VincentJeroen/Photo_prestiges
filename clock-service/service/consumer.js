import {getChannel} from '../utils/rabbitmq.js';
import {startTimer} from './service.js';

export const handleMessages = async () => {
    try {
        const channel = await getChannel();

        const queueName = 'clockQueue';
        const exchangeName = 'registerExchange';
        const routingKey = '*.startTimer';
        const type = 'topic';

        // Exchanges
        await channel.assertExchange(exchangeName, type, { durable: true });

        // Queues
        await channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue(queueName, exchangeName, routingKey);

        console.log('Waiting for messages in queue');
        channel.consume(queueName, async (msg) => {
            if (!msg?.content) return;

            try {
                const payload = JSON.parse(msg.content.toString());
                console.log(payload);

                switch (msg.fields.routingKey) {
                    case 'register.startTimer':
                        await startTimer(payload);
                        break;
                    default:
                        console.warn(`Unknown routing key: ${msg.fields.routingKey}`);
                }
            } catch (err) {
                console.error('Error handling message:', err);
            }
        }, {noAck: true});

    } catch (error) {
        console.error('Error setting up RabbitMQ consumer:', error);
    }
};
