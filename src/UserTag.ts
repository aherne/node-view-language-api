import StartTag from "./StartTag";
import * as fs from 'fs';

export default class UserTag implements StartTag {
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    /**
     * Parses start tag.
     *
     * @param  {Record<string,string>} parameters
     * @returns string
     */
    public parseStartTag(parameters: Record<string, string> = {}): string {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        return content.replace(/\${([\w\-.]+)}/g, (match, p1) => {
            return parameters[p1] ?? '';
        });
    }
}