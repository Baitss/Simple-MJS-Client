import { Client, Presence } from "discord-rpc";

const APPLICATION_ID = "1094154059625283584";

const createDefaultActivity = () => {
    const activity: Presence = {
        largeImageKey: "logo",
        state: "Mahjong Soul",
        startTimestamp: new Date()
    };

    return activity;
};

const initDiscord = async (clientId?: string) => {
    const targetClientId = typeof clientId != "undefined" ? clientId : APPLICATION_ID;

    const client = new Client({ transport: "ipc" });

    client.on("connected", () => {
        console.log(`Discord Client Logged in with ID: ${targetClientId}`);
    });

    console.log(`Trying to Login Discord with ID: ${targetClientId}`);
    return client.login({
        clientId: targetClientId
    });
};

const setActivity = async (client: Client, activity?: Presence) => {
    const targetActivity = typeof activity == "undefined" ? createDefaultActivity() : activity;

    console.log("Set Discord Activity");
    console.log(targetActivity);

    await client.setActivity(
        targetActivity
    );
};

export { initDiscord, setActivity };
