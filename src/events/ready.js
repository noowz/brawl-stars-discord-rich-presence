const { logger } = require("../utils/logger.js");
const { rpc } = require("../rpc/rpc.js");
const { Events } = require("discord.js");

const ready = {
    name: Events.ClientReady,
    once: true,

	execute(client) {
		rpc(client);

		setInterval(() => {
			rpc(client);
		}, 10000);

		logger.info("Rich Presence connected to Discord!");
	}
};

module.exports = ready;