const { logger } = require("../utils/logger.js");

const error = {
    name: "error",
    once: false,

    execute() {
        logger.error(error);
    }
};

module.exports = error;