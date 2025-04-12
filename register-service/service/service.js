import Target from '../models/target.js';
import {publishToExchange} from '../utils/rabbitmq.js';

// As User
export async function isTargetJoinable({targetId}) {
    const existingTarget = await Target.findById(targetId);
    if (existingTarget) {
        if (existingTarget.canRegister) {
            return true;
        }
    }

    return false;
}

// As Owner
export async function createTarget({email}) {
    const target = new Target({owner: email});
    target.save();

    return target.id;
}

export async function setTargetDuration({targetId, duration}) {
    const existingTarget = await Target.findById(targetId);

    if (!existingTarget) {
        return 400;
    } else {
        existingTarget.duration = duration;
        await existingTarget.save();
        return 200;
    }
}

export async function startTarget({targetId}) {
    const existingTarget = await Target.findById(targetId);
    
    if (!existingTarget) {
        console.log('aaa');
        return 400;
    }
    else {
        existingTarget.canRegister = true;
        existingTarget.save();

        await publishToExchange(
            'registerExchange',
            JSON.stringify({ targetId: targetId, duration: existingTarget.duration }),
            'register.startTimer',
            'topic'
        );

        return 200;
    }
}

//
export async function finishTarget({targetId}) {
    //const existingTarget = await Target.findById(targetId);

    //if (existingTarget) {
        console.log(`Target ${targetId} is finished, calculate the results!`);
        //return 201;
    //}
}

export async function getOverview() {
    const targets = await Target.find({});
    return targets;
}