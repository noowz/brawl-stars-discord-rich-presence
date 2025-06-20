const { name, version, bugs, repository } = require("../../package.json");
const { apis } = require("../config.json");
const { logger } = require("../utils/logger.js");
const { logErrorAndExit } = require("../utils/utils.js");
const axios = require("axios");
const gplay = require("google-play-scraper");

let firstTimeRunningRichPresence = true;

let startDate = firstTimeRunningRichPresence ? Date.now() : startDate;

const rpc = async function setActivity(client) {
	let brawlAPINutellaResponseNull = false;

	const brawlstarsResponse = await axios({
		method: "GET",
		url: `${apis.brawlstars.base_url}/players/%23${process.env.BRAWL_STARS_PLAYER_TAG.replace("#", "")}`,
		headers: {
			Authorization: `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
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

	const brawlAPINutellaResponse = await axios({
		method: "GET",
		url: `${apis.brawlAPINutella.base_url}/profile`,
		params: {
			tag: process.env.BRAWL_STARS_PLAYER_TAG.replace("#", "")
		},
		headers: {
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		},
	}).catch((error) => {
		if (error.response.status === 429) {
			brawlAPINutellaResponseNull = true;

			logger.error("Request was throttled, because amount of requests was above the threshold defined for the used API token.");

			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.detail})`);
		} else {
			brawlAPINutellaResponseNull = true;

			logger.error(`An error has occurred. Report this at ${bugs.url} !`);

			logger.error(`ERROR: ${error.response.status} - ${error.response.statusText}`);
		};
	});

	if (!brawlAPINutellaResponseNull && brawlAPINutellaResponse.data.result === null) {
		brawlAPINutellaResponseNull = true;

		logger.warn("BrawlAPINutella returned an empty response. Ignoring BrawlAPINutella data.");
	};

	const player = brawlAPINutellaResponseNull ? {
		...brawlstarsResponse.data
	} : {
		...brawlstarsResponse.data,
		...brawlAPINutellaResponse.data.result
	};

	const rankedRanks = [
		"Bronze I",
		"Bronze II",
		"Bronze III",
		"Silver I",
		"Silver II",
		"Silver III",
		"Gold I",
		"Gold II",
		"Gold III",
		"Diamond I",
		"Diamond II",
		"Diamond III",
		"Mythic I",
		"Mythic II",
		"Mythic III",
		"Legendary I",
		"Legendary II",
		"Legendary III",
		"Masters I",
		"Masters II",
		"Masters III",
		"Pro"
	];

	const app = await gplay.app({
		appId: "com.supercell.brawlstars"
	});

	client.request("SET_ACTIVITY", {
		pid: process.pid,
		activity: {
			details: brawlAPINutellaResponseNull ? `🏆 Trophies: ${player.trophies}/${player.highestTrophies}` : `🏆 Trophies: ${player.trophies}/${player.highestTrophies} • 🏅 Rank: ${rankedRanks[player.stats.find(stat => stat.id === 23).value - 1]}/${player.stats.find(stat => stat.id === 22).value === 0 ? rankedRanks[player.stats.find(stat => stat.id === 22).value] : rankedRanks[player.stats.find(stat => stat.id === 22).value - 1]}`,
			state: brawlAPINutellaResponseNull ? `🥊 3 vs 3 Victories: ${player["3vs3Victories"]} • 👤 Solo Victories: ${player.soloVictories} • 👥 Duo Victories: ${player.duoVictories}` : `🥊 3 vs 3 Victories: ${player["3vs3Victories"]} • 👤 Solo Victories: ${player.soloVictories} • 👥 Duo Victories: ${player.duoVictories} • 🔥 Max Win Streak: ${player.max_winstreak}`,
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