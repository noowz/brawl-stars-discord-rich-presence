const { logger } = require("../utils/logger.js");
const { rpc } = require("../rpc/rpc.js");
const { Client } = require("discord-rpc");
const { greenBright } = require("chalk");

async function reconnectRpc() {
    try {
        const newClient = new Client({
            transport: "ipc"
        });

        newClient.once("ready", () => {
            logger.info(`Rich Presence ${greenBright("reconnected")} to Discord!`);

            rpc(newClient);
        });

        await newClient.login({
            clientId: process.env.DISCORD_CLIENT_ID
        });
    } catch (error) {
        setTimeout(() => reconnectRpc(), 5 * 1000);
    };
};

module.exports = { reconnectRpc };