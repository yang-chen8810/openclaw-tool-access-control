
/**
 * A singleton logger wrapper that allows the official OpenClaw api.logger
 * to be used across all files in the plugin.
 */
class PluginLogger {
    private logger: any = console; // Default to console before initialization

    /**
     * Set the actual logger instance (e.g., api.logger from OpenClaw)
     */
    setLogger(logger: any) {
        this.logger = logger;
    }

    info(message: string) {
        this.logger.info ? this.logger.info(message) : console.log(message);
    }

    error(message: string) {
        this.logger.error ? this.logger.error(message) : console.error(message);
    }

    warn(message: string) {
        this.logger.warn ? this.logger.warn(message) : console.warn(message);
    }

    debug(message: string) {
        this.logger.debug ? this.logger.debug(message) : console.debug(message);
    }
}

export const logger = new PluginLogger();
