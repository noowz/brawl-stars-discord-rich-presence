const { name, version, bugs, repository } = require("../../package.json");
const { apis, auth, settings } = require("../config.json");
const { logger } = require("../utils/logger.js");
const { logErrorAndExit } = require("../utils/utils.js");
const axios = require("axios");
const gplay = require("google-play-scraper");

let firstTimeRunningRichPresence = true;

let startDate = firstTimeRunningRichPresence ? Date.now() : startDate;

const rpc = async function setActivity(client) {
	const brawlstarsResponse = await axios({
		method: "GET",
		url: `${apis.brawlstars.base_url}/players/%23${settings.player.player_tag.replace("#", "")}`,
		headers: {
			Authorization: `Bearer ${auth.brawlstars.api.token}`,
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		}
	}).catch((error) => {
		if (error.response.status === 400) {
			logger.error("Client provided incorrect parameters for the request.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 403) {
			logger.error("Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 404) {
			logger.error("Resource was not found.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 429) {
			logger.error("Request was throttled, because amount of requests was above the threshold defined for the used API token.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 500) {
			logger.error("Unknown error happened when handling the request.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 503) {
			logger.error("Service is temporarily unavailable because of maintenance.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else {
			logger.error(`An error has occurred. Report this at ${bugs.url} !`);

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		};
	});

	const player = brawlstarsResponse.data;

	const app = await gplay.app({
		appId: "com.supercell.brawlstars"
	});

	client.request("SET_ACTIVITY", {
		pid: process.pid,
		activity: {
			details: `🏆 Trophies: ${player.trophies}/${player.highestTrophies}`,
			state: `🥊 3 vs 3 Victories: ${player["3vs3Victories"]} • 👤 Solo Victories: ${player.soloVictories} • 👥 Duo Victories: ${player.duoVictories}`,
			timestamps: {
				start: startDate
			},
			assets: {
				large_image: app.icon,
				large_text: app.title,
				small_image: `https://cdn.brawlify.com/profile-icons/regular/${player.icon.id}.png`,
				small_text: `${player.name} (${player.tag})`
			},
			buttons: [
				{
					label: "🚀 Download",
					url: repository.url
				}
			]
		}
	});
};

firstTimeRunningRichPresence = false;

module.exports = { rpc };