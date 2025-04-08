import amqplib from 'amqplib';

async function connectToRabbitMQ() {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue('authQueue', {durable: true});

    return channel;
}

async function sendMessage(channel, message) {
    channel.sendToQueue('authQueue', Buffer.from(message), {persistent: true});
}

export {connectToRabbitMQ, sendMessage};
