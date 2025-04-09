import { getChannel } from '../utils/rabbitmq.js'; // Zorg ervoor dat dit goed geïmporteerd is

export const startConsumer = async () => {
    const exchangeName = 'targetExchange';
    const routingKey = 'target.start';
    const queueName = 'clockQueue'; // 👈 vaste queue naam

    const channel = await getChannel();

    // 👇 vaste, durable queue gebruiken
    await channel.assertQueue(queueName, { durable: true });

    // 👇 bind aan exchange met juiste routing key
    await channel.bindQueue(queueName, exchangeName, routingKey);

    console.log(`👂 Waiting for messages on "${routingKey}" in queue "${queueName}"`);

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

