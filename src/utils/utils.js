const { logger } = require("../utils/logger.js");

function logErrorAndExit(message) {
	logger.error(message);

	process.exit(0);
};

module.exports = { logErrorAndExit };