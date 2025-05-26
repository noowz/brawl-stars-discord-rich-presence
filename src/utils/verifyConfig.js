const { logErrorAndExit } = require("./utils.js");

const CLIENT_ID = "839894528953810944";

async function verifyConfig() {
	if (!process.env.NODE_ENV) {
		logErrorAndExit("No development environment provided. Please update the 'NODE_ENV' field in the environment variable file with 'development', 'production', or 'test'.");
	};

	if (!process.env.DISCORD_CLIENT_ID) {
		logErrorAndExit("No Discord Rich Presence client ID provided. Please update the 'DISCORD_CLIENT_ID' field in the environment variable file with your Discord Rich Presence client ID.");
	} else if (!process.env.DISCORD_CLIENT_ID.match(/\d/)) {
		logErrorAndExit("The provided Discord Rich Presence client ID is invalid. Ensure the 'DISCORD_CLIENT_ID' field in the environment variable file contains a valid numeric ID.");
	} else if (!process.env.DISCORD_CLIENT_ID.match(CLIENT_ID)) {
		logErrorAndExit(`The provided Discord Rich Presence client ID does not match the required client ID. Update the 'DISCORD_CLIENT_ID' field in the environment variable file to ${CLIENT_ID}.`);
	};

	if (!process.env.BRAWL_STARS_API_KEY) {
		logErrorAndExit("No Brawl Stars API key provided. Please update the 'BRAWL_STARS_API_KEY' field in the environment variable file with your Brawl Stars API key.");
	};

	if (!process.env.BRAWL_STARS_PLAYER_TAG) {
		logErrorAndExit("No Brawl Stars player tag provided. Please update the 'BRAWL_STARS_PLAYER_TAG' field in the environment variable file with your Brawl Stars player tag.");
	};
};

module.exports = { verifyConfig };