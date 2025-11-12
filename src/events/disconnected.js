const { logger } = require("../utils/logger.js");
const { reconnectRpc } = require("../utils/reconnectRpc.js");
const { redBright, greenBright } = require("chalk");

const disconnected = {
	name: "disconnected",
	once: false,

	async execute(oldClient) {
		logger.warn(`Rich Presence ${redBright("disconnected")} from Discord!`);

		oldClient.destroy();

		logger.warn(`${greenBright("Reconnecting")} to Discord...`);

		await reconnectRpc();
	}
};

module.exports = disconnected;