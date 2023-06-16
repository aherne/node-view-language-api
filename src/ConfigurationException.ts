export default class ConfigurationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigurationException';
    }
}