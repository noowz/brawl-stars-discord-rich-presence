const { logger } = require("./logger.js");

const VALID_ENVIRONMENTS = [
	"development",
	"production",
	"test"
];

const REQUIRED_CLIENT_ID = "839894528953810944";

const GAME = "Brawl Stars";

async function verifyConfig() {
	if (!process.env.NODE_ENV) {
		logger.error(`No development environment provided. Please update the 'NODE_ENV' field in the environment variable file to ${VALID_ENVIRONMENTS.map(env => `'${env}'`).join(", ")}.`);

		process.exit(1);
	} else if (!VALID_ENVIRONMENTS.includes(process.env.NODE_ENV.toLowerCase())) {
		logger.error(`The provided development environment is not recognized. Please update the 'NODE_ENV' field in the environment variable file to ${VALID_ENVIRONMENTS.map(env => `'${env}'`).join(", ")}.`);

		process.exit(1);
	};

	if (!process.env.DISCORD_CLIENT_ID) {
		logger.error("No Discord Rich Presence client ID provided. Please update the 'DISCORD_CLIENT_ID' field in the environment variable file with your Discord Rich Presence client ID.");

		process.exit(1);
	} else if (!/^\d+$/.test(process.env.DISCORD_CLIENT_ID)) {
		logger.error("The provided Discord Rich Presence client ID is invalid. Ensure the 'DISCORD_CLIENT_ID' field in the environment variable file contains a valid numeric ID.");

		process.exit(1);
	} else if (process.env.DISCORD_CLIENT_ID !== REQUIRED_CLIENT_ID) {
		logger.error(`The provided Discord Rich Presence client ID does not match the required client ID. Update the 'DISCORD_CLIENT_ID' field in the environment variable file to '${REQUIRED_CLIENT_ID}'.`);

		process.exit(1);
	};

	if (!process.env.BRAWL_STARS_API_KEY) {
		logger.error(`No ${GAME} API key provided. Please update the 'CLASH_OF_CLANS_API_KEY' field in the environment variable file with your ${GAME} API key.`);

		process.exit(1);
	} else if (typeof process.env.BRAWL_STARS_API_KEY !== "string") {
		logger.error(`The provided ${GAME} API key is invalid. Ensure the 'CLASH_OF_CLANS_API_KEY' field in the environment variable file contains a valid string.`);

		process.exit(1);
	};

	if (!process.env.BRAWL_STARS_PLAYER_TAG) {
		logger.error(`No ${GAME} player tag provided. Please update the 'CLASH_OF_CLANS_PLAYER_TAG' field in the environment variable file with your ${GAME} player tag.`);

		process.exit(1);
	} else if (typeof process.env.BRAWL_STARS_PLAYER_TAG !== "string") {
		logger.error(`The provided ${GAME} player tag is invalid. Ensure the 'CLASH_OF_CLANS_PLAYER_TAG' field in the environment variable file contains a valid string.`);

		process.exit(1);
	};
};

module.exports = { verifyConfig };