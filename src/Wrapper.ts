import ViewLanguageParser from './ViewLanguageParser';

export default class Wrapper {
    private readonly templatesFolder: string;
    private readonly compilationsFolder: string;
    private readonly tagLibFolder: string;
    private readonly templatesExtension: string = "html";

    constructor(compilationsFolder: string, tagLibFolder: string, templatesFolder: string) {
        this.compilationsFolder = compilationsFolder;
        this.tagLibFolder = tagLibFolder;
        this.templatesFolder = templatesFolder;
    }

    public compile(viewFile: string, data: Record<string, any>): string {
        // gets view file
        if (this.templatesFolder && viewFile.startsWith(this.templatesFolder)) {
            viewFile = viewFile.substring(this.templatesFolder.length + 1);
        }

        // compiles templates recursively into a single PHP file
        const vlp = new ViewLanguageParser(
            this.templatesFolder,
            this.templatesExtension,
            this.compilationsFolder,
            this.tagLibFolder
        );
        const compilationFile = vlp.compile(viewFile);

        // compiles PHP file into HTML
        return require(compilationFile).default(data);
    }
}