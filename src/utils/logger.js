const chalk = require("chalk");

const levels = {
    debug: chalk.bold.blueBright,
    info: chalk.bold.cyanBright,
    warn: chalk.bold.hex("#F0AD4E"),
    error: chalk.bold.redBright,
    fatal: chalk.bold.red
};

function logMessage(level, message) {
    const logColor = levels[level];
    const logDate = chalk.gray(`[${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}]`);
    const logLevel = `[${level.toUpperCase()}]`;

    if (level === "debug") {
        return console.debug(logColor(`${logDate} ${logLevel}`), message);
    } else if (level === "info") {
        return console.info(logColor(`${logDate} ${logLevel}`), message);
    } else if (level === "warn") {
        return console.warn(logColor(`${logDate} ${logLevel}`), message);
    } else if (level === "error" || level === "fatal") {
        return console.error(logColor(`${logDate} ${logLevel}`), message);
    };
};

const logger = {
    debug: (message) => logMessage("debug", message),
    info: (message) => logMessage("info", message),
    warn: (message) => logMessage("warn", message),
    error: (message) => logMessage("error", message),
    fatal: (message) => logMessage("fatal", message)
};

module.exports = { logger };