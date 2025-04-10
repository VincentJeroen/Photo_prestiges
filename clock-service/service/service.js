import {publishToExchange} from '../utils/rabbitmq.js';

export const startTimer = async (payload) => {
    const { targetId } = payload;
    console.log(`Bericht ontvangen van publisher met targetId: ${targetId}`);

    const duration = targetId * 1000;

    setTimeout(async () => {
        try {
            await publishToExchange(
                'registerExchange',
                JSON.stringify({targetId}),
                'register.target.finished',
                'topic'
            );
        } catch (err) {
            console.error('Error sending message to register-service:', err);
        }
    }, duration);

    return 200;
};
