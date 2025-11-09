const { logger } = require("../utils/logger.js");
const { rpc } = require("../rpc/rpc.js");
const { greenBright } = require("chalk");

const ready = {
	name: "ready",
	once: true,

	execute(client) {
		rpc(client);

		setInterval(() => {
			rpc(client);
		}, 1 * 5000);

		logger.info(`Rich Presence ${greenBright("connected")} to Discord!`);
	}
};

module.exports = ready;