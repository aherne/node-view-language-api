import ViewCompilation from "../../ViewCompilation";
import EscapeTag from "./EscapeTag";
import ViewException from "../../ViewException";
import TemplateFile from "../../TemplateFile";

export default class ImportTag {
    private viewCompilation: ViewCompilation;
    private readonly templatesFolder: string;
    private readonly templatesExtension: string;

    constructor(
        templatesFolder: string,
        templatesExtension: string,
        viewCompilation: ViewCompilation
    ) {
        this.templatesFolder = templatesFolder;
        this.templatesExtension = templatesExtension;
        this.viewCompilation = viewCompilation;
    }

    public parse(templateFile: string, escaper: EscapeTag): string {
        const path =
            (this.templatesFolder ? `${this.templatesFolder}/` : '') +
            `${templateFile}.${this.templatesExtension}`;
        const file = new TemplateFile(path);
        if (!file.exists()) {
            throw new ViewException(
                `Invalid value of 'file' attribute @ 'import' tag: ${templateFile}`
            );
        }
        let subject = file.getContents();
        subject = escaper.backup(subject);
        this.viewCompilation.addComponent(path);

        return subject.replace(
            /<import\s*(file\s*=\s*"([^"]*)"\s*)?\/?>/g,
            (match: string, p1: string, p2: string) => {
                if (!p2) {
                    throw new ViewException("Tag 'import' requires attribute: file");
                }
                return this.parse(p2, escaper);
            }
        );
    }
}