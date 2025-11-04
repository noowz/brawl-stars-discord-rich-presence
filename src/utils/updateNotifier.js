const { name, version, author } = require("../../package.json");
const { logger } = require("./logger.js");
const { greenBright, yellowBright, redBright, blueBright } = require("chalk");
const boxen = require("boxen").default;
const axios = require("axios");

async function updateNotifier() {
	const response = await axios({
		method: "GET",
		url: `https://api.github.com/repos/${author.name}/${name}/releases/latest`,
		headers: {
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		}
	}).catch((error) => {
		logger.error(error);

		process.exit(1);
	});

	const release = await response.data;

	const currentVersion = version;
	const latestVersion = release.tag_name.replace("v", "");

	if (currentVersion < latestVersion) {
		const text = [
			`${greenBright("🚀 A new version of")} ${yellowBright(name)} ${greenBright("is available!")}`,
			``,
			`${redBright(`• Current version: ${currentVersion}`)}`,
			`${greenBright(`• Latest version: ${latestVersion}`)}`,
			``,
			`${blueBright(release.html_url)}`
		].join("\n");

		console.log(boxen(text, {
			borderStyle: "round",
			title: `${greenBright("New Update Available")}`,
			padding: 1,
			margin: 1
		}));
	};
};

module.exports = { updateNotifier };