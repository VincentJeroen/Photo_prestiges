import TargetEntry from '../models/target-entry.js';
import { publishToExchange } from '../utils/rabbitmq.js';

export async function generateScore({ targetId, email, photoUrl }) {
    const existingEntry = await TargetEntry.findOne({ targetId, user: email });
    if (!existingEntry) {
        throw new Error('User not in target');
    }

    existingEntry.score = 10;
    existingEntry.save();
    return { score: existingEntry.score };
}

export async function joinTarget({ targetId, email, sendMail }) {
    const existingEntry = await TargetEntry.findOne({ targetId: targetId, user: email });
    if (existingEntry) {
        return false;
    }

    const targetEntry = new TargetEntry({ targetId: targetId, user: email });
    await targetEntry.save();

    if (sendMail) {
        await publishToExchange(
            'mailExchange',
            JSON.stringify({ to: email, subject: 'You joined the target!', html: 'Good luck!' }),
            'score.sendMail',
            'topic'
        );
    }

    return true;
};

export async function createNewEntry({ targetId, email }) {

}

export async function getScore({ targetId, email }) {
    const targetEntry = await TargetEntry.findOne({ targetId: targetId, user: email });
    if (!targetEntry) {
        throw new Error('User not found in target');
    }

    return targetEntry.score;
}

export async function getAllScore({ targetId }) {
    const entries = await TargetEntry.find({ targetId: targetId });
    if (!entries) {
        throw new Error('No entries found');
    }

    return entries;
}