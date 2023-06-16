import ViewCompilation from './ViewCompilation';
import EscapeTag from './TagLib/System/EscapeTag';
import ImportTag from './TagLib/System/ImportTag';
import NamespaceTag from './TagLib/System/NamespaceTag';
import UserTagParser from './UserTagParser';
import SystemTagParser from './SystemTagParser';
import ExpressionParser from './ExpressionParser';

export default class ViewLanguageParser {
    private readonly templatesFolder: string;
    private readonly compilationsFolder: string;
    private readonly templatesExtension: string;
    private readonly tagLibFolder: string;

    constructor(
        templatesFolder: string,
        templatesExtension: string,
        compilationsFolder: string,
        tagLibFolder: string = ''
    ) {
        this.templatesFolder = templatesFolder;
        this.templatesExtension = templatesExtension;
        this.compilationsFolder = compilationsFolder;
        this.tagLibFolder = tagLibFolder;
    }

    public compile(templatePath: string): string {
        // opens existing compilation (if exists)
        const viewCompilation = new ViewCompilation(
            this.compilationsFolder,
            templatePath
        );

        // if compilation components haven't changed, do not go further
        if (!viewCompilation.hasChanged()) {
            return viewCompilation.getCompilationPath();
        }

        // instantiate template escaping logic
        const escapeTag = new EscapeTag();

        // includes dependant tree of templates
        const importTag = new ImportTag(
            this.templatesFolder,
            this.templatesExtension,
            viewCompilation
        );
        let outputStream = importTag.parse(templatePath, escapeTag);

        const namespaceTag = new NamespaceTag(this.tagLibFolder);
        outputStream = namespaceTag.parse(outputStream);

        // run user tag parser
        const userTagParser = new UserTagParser(
            namespaceTag,
            this.templatesExtension,
            viewCompilation
        );
        outputStream = userTagParser.parse(outputStream, escapeTag);

        // run system tag parser
        const systemTagParser = new SystemTagParser();
        outputStream = systemTagParser.parse(outputStream);

        // run expression parser
        const expressionParser = new ExpressionParser();
        outputStream = expressionParser.parse(outputStream);

        // restore escaped content
        outputStream = escapeTag.restore(outputStream);

        // saves new compilation
        viewCompilation.save(outputStream);

        return viewCompilation.getCompilationPath();
    }
}
