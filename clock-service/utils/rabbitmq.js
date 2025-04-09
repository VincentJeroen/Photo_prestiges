import amqplib from 'amqplib';

let connection = null;
let channel = null;

const getChannel = async () => {
    if (connection && channel) return channel;

    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        process.on('exit', () => {
            channel.close();
            connection.close();
        });

        return channel;
    } catch (error) {
        console.error('(PP) Failed to establish connection with RabbitMQ: ', error);
        throw error;
    }
};

const sendToQueue = async (queueName, message) => {
    const ch = await getChannel();
    await ch.assertQueue(queueName, { durable: true });
    ch.sendToQueue(queueName, Buffer.from(message), { persistent: true });
};

const publishToExchange = async (exchangeName, message, routingKey = '', type = 'fanout') => {
    const ch = await getChannel();
    await ch.assertExchange(exchangeName, type, { durable: true });
    ch.publish(exchangeName, routingKey, Buffer.from(message));
};

export {
    getChannel,
    sendToQueue,
    publishToExchange
};
