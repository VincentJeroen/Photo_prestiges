import amqplib from 'amqplib';

let connection = null;
let channel = null;

export const getChannel = async () => {
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