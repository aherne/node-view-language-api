import NamespaceTag from './TagLib/System/NamespaceTag';
import EscapeTag from './TagLib/System/EscapeTag';
import ViewCompilation from './ViewCompilation';
import AttributesParser from './AttributesParser';
import UserTag from './UserTag';
import ViewException from './ViewException';
import * as fs from 'fs';

export default class UserTagParser {
    private readonly tagExtension: string;
    private viewCompilation: ViewCompilation;
    private namespaces: NamespaceTag;
    private attributesParser: AttributesParser;

    constructor(namespaces: NamespaceTag, tagExtension: string, viewCompilation: ViewCompilation) {
        this.namespaces = namespaces;
        this.tagExtension = tagExtension;
        this.viewCompilation = viewCompilation;
        this.attributesParser = new AttributesParser();
    }

    public parse(subject: string, escaper: EscapeTag): string {
        // match start & end tags
        subject = subject.replace(
            /<([\w\-]+):([\w\-]+)\s*([^>]*)?>/,
            (match: string, tagNamespace: string, tagName: string, attributes: string) => {
                const parameters = attributes ? this.attributesParser.parse(attributes) : {};
                return this.getTagInstance(tagNamespace, tagName).parseStartTag(parameters);
            }
        );

        subject = escaper.backup(subject);

        // if it still contains tags, recurse until all tags are parsed
        if (/<([\w\-]+):([\w\-]+)(.*?)>/.test(subject)) {
            subject = this.parse(subject, escaper);
        }

        return subject;
    }

    private getTagInstance(tagNamespace: string, tagName: string): UserTag {
        const tagFolder = this.namespaces.get(tagNamespace);
        const fileLocation = `${tagFolder}/${tagNamespace}/${tagName}.${this.tagExtension}`;
        if (!fs.existsSync(fileLocation)) {
            throw new ViewException(`User tag not found: ${tagNamespace}/${tagName}`);
        }

        this.viewCompilation.addComponent(fileLocation);

        return new UserTag(fileLocation);
    }
}