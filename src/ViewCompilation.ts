import TemplateFile from './TemplateFile';
import { createHash } from 'crypto';
export default class ViewCompilation {
    private readonly compilationPath: string;
    private readonly checksumPath: string;
    private readonly components: string[] = [];

    constructor(compilationsFolder: string, templatePath: string) {
        this.compilationPath = `${compilationsFolder}/${templatePath}.ts`;
        this.checksumPath = `${compilationsFolder}/checksums/${this.crc32(templatePath)}.crc`;
        // preset components referenced in checksum
        const file = new TemplateFile(this.checksumPath);
        if (file.exists()) {
            const contents = file.getContents();
            this.components = contents.split(',');
        }
    }

    public getCompilationPath(): string {
        return this.compilationPath;
    }

    public addComponent(path: string): void {
        this.components.push(path);
    }

    private getLatestModificationTime(): number {
        let latestDate = 0;
        for (const file of this.components) {
            const templateFile = new TemplateFile(file);
            if (!templateFile.exists()) {
                return -1;
            }
            const time = templateFile.getModificationTime();
            if (time > latestDate) {
                latestDate = time;
            }
        }
        return latestDate;
    }

    public save(outputStream: string): void {
        // saves checksum
        const file = new TemplateFile(this.checksumPath);
        file.putContents(this.components.join(','));

        // saves compilation
        const compilation = new TemplateFile(this.compilationPath);
        compilation.putContents(outputStream);
    }

    public hasChanged(): boolean {
        const compilation = new TemplateFile(this.compilationPath);
        if (this.components.length > 0) {
            if (compilation.exists()) {
                const time = this.getLatestModificationTime();
                if (time === -1) {
                    this.components.length = 0;
                    return true;
                }
                if (compilation.getModificationTime() >= time) {
                    return false;
                }
            }
            // reset components
            this.components.length = 0;
        }
        return true;
    }

    private crc32(str: string): number {
        const buf = Buffer.from(str);
        const hash = createHash('crc32');
        hash.update(buf);
        return parseInt(hash.digest('hex'), 16);
    }
}