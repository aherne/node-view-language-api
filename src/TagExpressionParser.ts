import ExpressionParser from "./ExpressionParser";

export default class TagExpressionParser extends ExpressionParser {
    protected parseCallback(matches: string[]): string {
        return this.convertToVariable(matches[0]); // FIXME: will this work?
    }
}