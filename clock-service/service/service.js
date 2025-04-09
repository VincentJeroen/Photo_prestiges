export const startTimer = async (payload) => {
    const { targetId } = payload;
    console.log(`Bericht ontvangen van publisher met targetId: ${targetId}`);

    return 200;
};
