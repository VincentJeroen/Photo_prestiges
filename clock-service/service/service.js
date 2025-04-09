import { getChannel } from '../utils/rabbitmq.js';

export const startTimer = async () => {
    const exchangeName = 'targetExchange';
    const routingKey = 'target.start';
    const queueName = 'clockQueue';

    const channel = await getChannel();
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchangeName, routingKey);

    channel.consume(queueName, (msg) => {
        if (msg?.content) {
            const payload = JSON.parse(msg.content.toString());
            console.log('📥 Message received:', payload);
        } else {
            console.log('❌ Empty message received');
        }
    }, { noAck: true });

    return 200;
};

