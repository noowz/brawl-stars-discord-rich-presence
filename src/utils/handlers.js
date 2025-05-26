const { logger } = require("../utils/logger.js");
const { join } = require("node:path");
const { readdirSync } = require("node:fs");
const { yellowBright, bold } = require("chalk");

async function eventsHandler(client) {
	const eventsPath = join(__dirname, "../events");
	const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".js"));

	let eventsLoaded = 0;

	for (const file of eventFiles) {
		const filePath = join(eventsPath, file);
		const event = require(filePath);

		if (event.once) {
			client.once(event.name, (...args) => {
				event.execute(client, ...args);
			});

			eventsLoaded++;

			logger.info(`Loaded ${yellowBright(file.slice(0, -3))} event ${bold.white(`(${eventsLoaded}/${eventFiles.length})`)}!`);
		} else {
			client.on(event.name, (...args) => {
				event.execute(client, ...args)
			});

			eventsLoaded++;

			logger.info(`Loaded ${yellowBright(file.slice(0, -3))} event ${bold.white(`(${eventsLoaded}/${eventFiles.length})`)}!`);
		};
	};
};

module.exports = { eventsHandler };