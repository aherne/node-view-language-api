export default class EscapeTag {
    private matches: string[] = [];
    private counter = 0;

    backup(subject: string): string {
        return subject.replace(/\<escape\>(.*?)\<\/escape\>/si, (match: string, content: string) => {
            this.matches.push(content);
            ++this.counter;
            return "<bkp>" + (this.counter - 1) + "</bkp>";
        });
    }

    restore(subject: string): string {
        // if no escape tags were found, do not continue
        if (this.counter === 0) {
            return subject;
        }

        // restore content of escape tags
        return subject.replace(/\<bkp\>(.*?)\<\/bkp\>/si, (match: string, index: string) => {
            return this.matches[parseInt(index)];
        });
    }
}