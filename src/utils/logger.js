const { magentaBright, cyanBright, yellowBright, redBright, bold, gray } = require("chalk");

const levels = {
	debug: magentaBright,
	info: cyanBright,
	warn: yellowBright,
	error: redBright,
	fatal: bold.redBright,
	application: bold.blueBright
};

const levelPriority = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
	fatal: 4,
	application: 5
};

const envLogLevels = {
	development: "debug",
	production: "info",
	test: "error"
};

const currentEnv = process.env.NODE_ENV;
const minLogLevel = envLogLevels[currentEnv];
const minLogLevelPriority = levelPriority[minLogLevel];

function logMessage(level, message) {
	if (levelPriority[level] < minLogLevelPriority) {
		return;
	};

	const logColor = levels[level];
	const logDate = gray(`[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}]`);
	const logLevel = `[${level.toUpperCase()}]`;

	const prefix = logColor(`${logDate} ${logLevel}`);

	if (level === "debug") {
		return console.debug(prefix, message);
	} else if (level === "info") {
		return console.info(prefix, message);
	} else if (level === "warn") {
		return console.warn(prefix, message);
	} else if (level === "error" || level === "fatal") {
		return console.error(prefix, message);
	} else if (level === "application") {
		return console.log(prefix, message);
	};
};

const logger = {
	debug: (message) => logMessage("debug", message),
	info: (message) => logMessage("info", message),
	warn: (message) => logMessage("warn", message),
	error: (message) => logMessage("error", message),
	fatal: (message) => logMessage("fatal", message),
	application: (message) => logMessage("application", message)
};

module.exports = { logger };