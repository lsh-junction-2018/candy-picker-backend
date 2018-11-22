import mqtt from 'libs/mqtt';

async function sendCandyPickerCommand(ctx) {
    const { action } = ctx.request.body;
    await mqtt.publishPickCandy(action)  
    ctx.ok({ msg: "Command send successfully!" });
}

export default {
    sendCandyPickerCommand
}
