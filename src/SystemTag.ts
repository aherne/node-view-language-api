import TagExpressionParser from './TagExpressionParser';
import ViewException from './ViewException';

export default abstract class SystemTag {
    protected isExpression(expression: string): boolean {
        return expression.includes('${');
    }

    protected parseExpression(expression: string): string {
        const expressionObject = new TagExpressionParser();
        return expressionObject.parse(expression);
    }

    protected checkParameters(parameters: Record<string, string>, requiredParameters: string[]): void {
        for (const name of requiredParameters) {
            if (!(name in parameters)) {
                const matches = new RegExp("/Std(.*)Tag/").exec(this.constructor.name);
                throw new ViewException(`Tag '${matches[1].toLowerCase()}' requires attribute: ${name}`);
            }
        }
    }
}