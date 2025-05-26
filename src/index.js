require("dotenv").config();
const { logger } = require("./utils/logger.js");
const { updateNotifier } = require("./utils/updateNotifier.js");
const { verifyConfig } = require("./utils/verifyConfig.js");
const { eventsHandler } = require("./utils/handlers.js");
const { yellow } = require("chalk");
const { Client } = require("discord-rpc");

const currentEnv = process.env.NODE_ENV;

logger.application(`The current development environment is set to ${yellow(currentEnv)}!`);

async function initializeClient() {
	try {
		await verifyConfig();
		await updateNotifier();

		const client = new Client({
			transport: "ipc"
		});
		await eventsHandler(client);

		await client.login({
			clientId: process.env.DISCORD_CLIENT_ID
		});
	} catch (error) {
		logger.error(error);
	};
};

initializeClient();