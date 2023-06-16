import AttributesParser from "./AttributesParser";
import StartTag from "./StartTag";
import StartEndTag from "./StartEndTag";
import * as fs from 'fs';
import ViewException from "./ViewException";

export default class SystemTagParser {
    private attributesParser: AttributesParser;

    constructor() {
        this.attributesParser = new AttributesParser();
    }

    public parse(subject: string): string {
        // match start & end tags
        subject = subject.replace(
            /<:([a-z]+)(\s*(.*)\s*=\s*\"(.*)\"\s*)?\/?>/g,
            (match, tagName, attributes) => {
                const parameters = attributes ? this.attributesParser.parse(attributes) : {};
                return this.getTagInstance(tagName).parseStartTag(parameters);
            }
        );
        return subject.replace(
            /<\/:([a-z]+)>/g,
            (match, tagName) => {
                let tagInstance = this.getTagInstance(tagName);
                if ("parseEndTag" in tagInstance) {
                    return tagInstance.parseEndTag();
                } else {
                    throw new Error(`Tag '${tagName}' does not support end tag`);
                }
            }
        );
    }

    private getTagInstance(tagName: string): StartTag | StartEndTag {
        const className = `Std${tagName.charAt(0).toUpperCase() + tagName.slice(1)}Tag`;
        const fileName = `./TagLib/Std/${className}.ts`;
        if (!fs.existsSync(fileName)) {
            throw new ViewException(`Tag '${tagName}' is not defined`);
        }
        // FIXME: This is a hack to get around the fact that we can't import (or require) a class
        return new (window as any)[className]();
    }
}