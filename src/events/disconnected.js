const { logger } = require("../utils/logger.js");
const { rpc } = require("../rpc/rpc.js");
const { Client } = require("discord-rpc");
const { redBright, greenBright } = require("chalk");

const disconnected = {
	name: "disconnected",
	once: false,

	async execute(oldClient) {
		logger.warn(`Rich Presence ${redBright("disconnected")} from Discord!`);

		oldClient.destroy();

		logger.warn(`${greenBright("Reconnecting")} to Discord...`);

		await reconnectRPC();
	}
};

async function reconnectRPC() {
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
		setTimeout(() => reconnectRPC(), 5 * 1000);
	};
};

module.exports = disconnected;