const { name, version, repository } = require("../../package.json");
const { apis } = require("../config.json");
const { logger } = require("../utils/logger");
const axios = require("axios");
const { app } = require("google-play-scraper");

let firstTimeRunningRichPresence = true;

let startDate = firstTimeRunningRichPresence
	? Date.now()
	: startDate;

const rpc = async function setActivity(client) {
	let brawlAPINutellaResponseNull = false;

	const brawlstarsResponse = await axios({
		method: "GET",
		url: `${apis.brawlstars.base_url}/v1/players/%23${process.env.BRAWL_STARS_PLAYER_TAG.replace("#", "")}`,
		headers: {
			Authorization: `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		}
	}).catch((error) => {
		logger.error(error);

		return;
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
		logger.error(error);

		return;
	});

	if (!brawlAPINutellaResponseNull && brawlAPINutellaResponse.data.result === null) {
		brawlAPINutellaResponseNull = true;

		logger.warn("BrawlAPINutella returned an empty response. Ignoring BrawlAPINutella data.");
	};

	const player = brawlAPINutellaResponseNull
		? {
			...brawlstarsResponse.data
		}
		: {
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

	const gameApp = await app({
		appId: "com.supercell.brawlstars"
	});

	client.request("SET_ACTIVITY", {
		pid: process.pid,
		activity: {
			details: brawlAPINutellaResponseNull
				? `🏆 Trophies: ${player.trophies}/${player.highestTrophies}`
				: `🏆 Trophies: ${player.trophies}/${player.highestTrophies} • 🏅 Rank: ${rankedRanks[player.stats.find(stat => stat.id === 23).value - 1]}/${player.stats.find(stat => stat.id === 22).value === 0 ? rankedRanks[player.stats.find(stat => stat.id === 22).value] : rankedRanks[player.stats.find(stat => stat.id === 22).value - 1]} (${player.stats.find(stat => stat.id === 24).value}/${player.stats.find(stat => stat.id === 25).value})`,
			state: brawlAPINutellaResponseNull ? `🥊 3 vs 3 Victories: ${player["3vs3Victories"]} • 💀 Victories: ${player.soloVictories + player.duoVictories}` : `🥊 3 vs 3 Victories: ${player["3vs3Victories"]} • 💀 Victories: ${player.soloVictories + player.duoVictories} • 🔥 Max Win Streak: ${player.max_winstreak} • 👁️ Record Points: ${player.stats.find(stat => stat.id === 31).value} (Level ${player.stats.find(stat => stat.id === 32).value})`,
			timestamps: {
				start: startDate
			},
			assets: {
				large_image: gameApp.icon,
				large_text: gameApp.title,
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