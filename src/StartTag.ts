export default interface StartTag {
    parseStartTag(parameters: Record<string, string>): string;
}