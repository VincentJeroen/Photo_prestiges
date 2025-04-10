import {publishToExchange} from '../utils/rabbitmq.js';

export const startTimer = async (payload) => {
    const { targetId } = payload;
    console.log(`Bericht ontvangen van publisher met targetId: ${targetId}`);

    // TODO, stuur in payload ook "start, end" mee en breken daarmee duration
    const duration = targetId * 1000;

    try {
        await publishToExchange(
            'registerDelayedExchange',
            JSON.stringify({targetId}),
            'clock.finishTarget',
            'topic',
            { headers: { 'x-delay': duration } }
        );
    } catch (err) {
        console.error('Error sending message to register-service:', err);
    }

    return 200;
};
