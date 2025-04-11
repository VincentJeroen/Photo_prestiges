import {getChannel} from '../utils/rabbitmq.js';
import { finishTarget } from './service.js';

export const handleMessages = async () => {
    try {
        const channel = await getChannel();

        const queueName = 'registerQueue';
        const delayedExchangeName = 'clockDelayedExchange';
        const routingKey = '*.finishTarget';
        const type = 'topic';

        // Exchanges
        await channel.assertExchange(delayedExchangeName, 'x-delayed-message', {
            durable: true,
            arguments: { 'x-delayed-type': type }
        });

        // Queues
        await channel.assertQueue(queueName, {durable: true});
        await channel.bindQueue(queueName, delayedExchangeName, routingKey);

        console.log('Waiting for messages in queue');
        channel.consume(queueName, async (msg) => {
            if (!msg?.content) return;

            try {
                const payload = JSON.parse(msg.content.toString());

                switch (msg.fields.routingKey) {
                    case 'clock.finishTarget':
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
