import AttributesParser from "../../AttributesParser";
import ViewException from "../../ViewException";
import * as fs from 'fs';

export default class NamespaceTag {
    private readonly taglibFolder: string;
    private attributesParser: AttributesParser;
    private namespaces: Record<string, string> = {};

    constructor(taglibFolder: string) {
        this.taglibFolder = taglibFolder;
        this.attributesParser = new AttributesParser(["taglib", "folder"]);
    }

    public parse(outputStream: string): string {
        return outputStream.replace(
            /<namespace\s*(.*)\s*\/?>/g,
            (match, p1) => {
                const parameters = this.attributesParser.parse(p1);
                if (!fs.existsSync(parameters["folder"])) {
                    throw new ViewException(`Invalid value of 'folder' attribute @ 'namespace' tag: ${parameters["folder"]}`);
                }
                this.namespaces[parameters["taglib"]] = parameters["folder"];
                return "";
            }
        );
    }

    public get(tagLib: string): string {
        return this.namespaces[tagLib] ?? this.taglibFolder;
    }
}