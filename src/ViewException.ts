export default class ViewException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ViewException';
    }
}