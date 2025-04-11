import TargetEntry from '../models/target-entry.js';

export async function generateScore({ targetId, email, photoUrl }) {
    return { score: 10 };
}

export async function joinTarget({ targetId, email }) {
    const existingEntry = TargetEntry.findOne({ targetId: targetId, user: email });
    if (existingEntry) {
        return false;
    }

    const targetEntry = new TargetEntry({ targetId: targetId, user: email });
    await targetEntry.save();

    return true;
};

export async function createNewEntry({ targetId, email }) {

}