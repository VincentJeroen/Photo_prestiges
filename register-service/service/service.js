import Target from '../models/target.js';
import TargetEntry from '../models/target-entry.js';
import {publishToExchange} from '../utils/rabbitmq.js';
import axios from "axios";

// As User
export async function joinTarget({targetId, email}) {
    const existingTarget = await Target.findById(targetId);
    if (existingTarget) {
        return 400;
    }

    const existingTargetEntry = await TargetEntry.findOne({targetId: targetId, user: email});
    if (existingTargetEntry) {
        return 400;
    } else {
        const targetEntry = new TargetEntry({targetId: targetId, user: email});
        await targetEntry.save();
        return 201;
    }
}

// As Owner
export async function createTarget({email, imageUrl}) {
    const target = new Target({owner: email, imageUrl: imageUrl});
    target.save();

    return target.id;
}

export async function setTargetStart({targetId, start}) {
    const existingTarget = await Target.findById(targetId);

    if (!existingTarget) {
        return 400;
    } else {
        existingTarget.start = start;
        await existingTarget.save();
        return 201;
    }
}

export async function setTargetEnd({targetId, end}) {
    const existingTarget = await Target.findById(targetId);

    if (!existingTarget) {
        return 400;
    } else {
        existingTarget.end = end;
        await existingTarget.save();
        return 201;
    }
}

export async function startTarget({ targetId }) {
    // const existingTarget = await Target.findById(targetId);
    //
    // if (!existingTarget) {
    //     return 400;
    // }
    // else {
    // TODO: start clock service

    // Debug logging voor het publiceren van het bericht
    console.log(`📤 Publishing message to exchange "targetExchange" with routing key "target.start"`);
    await publishToExchange('targetExchange', JSON.stringify({ targetId, action: 'Hallo' }), 'target.start', 'topic');
    console.log('✅ Message published to exchange.');

    const response = await axios.get('http://clock-service:3001/auth/ditiseentest');
    console.log('Axios aangeroepen');

    return 200;
    // }
}

