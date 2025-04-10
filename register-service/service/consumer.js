import {getChannel} from '../utils/rabbitmq.js';
import { finishTarget } from './service.js';

export const handleMessages = async () => {
    try {
        const channel = await getChannel();

        const queueName = 'registerQueue';
        const exchangeName = 'registerExchange';
        const routingKey = 'register.target.finished';

        await channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue(queueName, exchangeName, routingKey);

        console.log('Waiting for messages in queue');
        channel.consume(queueName, async (msg) => {
            if (!msg?.content) return;

            try {
                const payload = JSON.parse(msg.content.toString());

                switch (msg.fields.routingKey) {
                    case 'register.target.finished':
                        await finishTarget(payload);
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
