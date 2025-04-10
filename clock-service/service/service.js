import {publishToExchange} from '../utils/rabbitmq.js';

export const startTimer = async (payload) => {
    const { targetId, duration } = payload;
    console.log(`Bericht ontvangen van publisher met targetId: ${targetId}`);

    try {
        await publishToExchange(
            'registerDelayedExchange',
            JSON.stringify({targetId}),
            'clock.finishTarget',
            'topic',
            { headers: { 'x-delay': duration * 1000 } }
        );
    } catch (err) {
        console.error('Error sending message to register-service:', err);
    }

    return 200;
};
