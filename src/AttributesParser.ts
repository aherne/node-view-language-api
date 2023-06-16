export default class AttributesParser {
    private readonly required: string[];

    constructor(required: string[] = []) {
        this.required = required;
    }

    public parse(parameters: string): Record<string, string> {
        if (!parameters || parameters === '/') {
            if (this.required.length === 0) {
                return {};
            } else {
                throw new Error(`Tag '${this.getTagName()}' requires attributes: ${this.required.join(', ')}`);
            }
        }

        const tmp: RegExpMatchArray[] = [];
        const pattern = /([\w\-.]+)\s*=\s*"([^"]+)"/g;
        let matches = pattern.exec(parameters);

        while (matches) {
            tmp.push(matches);
            matches = pattern.exec(parameters);
        }

        const output: Record<string, string> = {};
        for (const values of tmp) {
            output[values[1]] = values[2];
        }

        for (const attributeName of this.required) {
            if (!output[attributeName]) {
                throw new Error(`Tag '${this.getTagName()}' requires attribute: ${attributeName}`);
            }
        }

        return output;
    }

    private getTagName(): string {
        const trace = (new Error()).stack?.split('\n');
        const matches = /([a-zA-Z])\/([a-zA-Z])Tag\.ts/.exec(trace ? trace[2] : '');

        return `${matches?.[1] === 'Std' ? ':' : ''}${(matches?.[2] || '').toLowerCase()}`;
    }
}