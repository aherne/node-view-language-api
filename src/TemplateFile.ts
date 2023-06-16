import * as fs from 'fs';

export default class TemplateFile {
    private readonly path: string;

    constructor(name: string) {
        this.path = name;
    }

    public putContents(content: string): void {
        const folder = this.path.substring(0, this.path.lastIndexOf('/'));
        if (!fs.existsSync(folder)) {
            const parts = folder.split('/');
            let currentFolder = '';
            parts.forEach((component) => {
                currentFolder += component + '/';
                if (!fs.existsSync(currentFolder)) {
                    fs.mkdirSync(currentFolder);
                }
            });
        }
        fs.writeFileSync(this.path, content);
    }

    public getContents(): string {
        return fs.readFileSync(this.path, { encoding: 'utf-8' });
    }

    public exists(): boolean {
        return fs.existsSync(this.path);
    }

    public getModificationTime(): number {
        return fs.statSync(this.path).mtimeMs;
    }
}