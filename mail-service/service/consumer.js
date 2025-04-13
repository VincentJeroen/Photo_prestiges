import {getChannel} from '../utils/rabbitmq.js';
import {sendMail} from './service.js';

export const handleMessages = async () => {
    try {
        const channel = await getChannel();

        const queueName = 'mailQueue';
        const exchangeName = 'mailExchange';
        const routingKey = '*.sendMail';
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
                    case 'score.sendMail':
                        await sendMail(payload);
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
