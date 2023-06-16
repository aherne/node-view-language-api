import StartTag from "./StartTag";

export default interface StartEndTag extends StartTag {
    parseEndTag(): string;
}