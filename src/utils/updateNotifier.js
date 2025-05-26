const { name, version, author, bugs } = require("../../package.json");
const { logger } = require("../utils/logger.js");
const { logErrorAndExit } = require("../utils/utils.js");
const { white, green, yellow, redBright, greenBright, blueBright } = require("chalk");
const axios = require("axios");

async function updateNotifier() {
	const response = await axios({
		method: "GET",
		url: `https://api.github.com/repos/${author.name}/${name}/releases/latest`,
		headers: {
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		}
	}).catch(error => {
		if (error.response.status === 404) {
			logger.error("Resource was not found.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText}`);
		} else {
			logger.error(`An error has occurred. Report this at ${bugs.url} !`);

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText}`);
		};
	});

	const release = await response.data;

	const currentVersion = version;
	const latestVersion = release.tag_name.replace("v", "");

	if (currentVersion < latestVersion) {
		console.log(white("┌────────────────────────────────────────────────────────────────────────────────┐"));
		console.log(white("│ ") + green("🚀 A new version of ") + yellow(name) + green(" is available!") + "            " + white("│"));
		console.log(white("│") + "                                                                                " + white("│"));
		console.log(white("│ ") + redBright(`• Current version: ${currentVersion}`) + "                                                       " + white("│"));
		console.log(white("│ ") + greenBright(`• Latest version: ${latestVersion.replace("v", "")}`) + "                                                        " + white("│"));
		console.log(white("│") + "                                                                                " + white("│"));
		console.log(white("│ ") + blueBright(release.html_url) + " " + white("│"));
		console.log(white("└────────────────────────────────────────────────────────────────────────────────┘"));
		console.log("\n");
	};
};

module.exports = { updateNotifier };