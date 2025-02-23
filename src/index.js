const { auth } = require("./config.json");
const { logger } = require("./utils/logger.js");
const { updateNotifier } = require("./utils/updateNotifier.js");
const { verifyConfig } = require("./utils/verifyConfig.js");
const { eventsHandler } = require("./utils/handlers.js");
const { Client } = require("discord-rpc");

const client = new Client({
	transport: "ipc"
});

async function initializeClient() {
	try {
		await updateNotifier();
		await verifyConfig();
		await eventsHandler(client);

		await client.login({
			clientId: auth.discord.rpc.client_id
		});
	} catch (error) {
		logger.error(error);
	};
};

initializeClient();