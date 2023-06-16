export default class ExpressionParser {
    parse(subject: string): string {
        if (subject.indexOf('${')===-1) {
            return subject;
        }
        return subject.replace(
            /\$\{((?:(?:(?!}).)+|(?R))*)\}/g,
            (match: string, variable: string) => {
                const position = variable.indexOf('(');
                if (position !== -1) {
                    const variableName = variable.substring(0, position);
                    const convertedVariable = this.convertToVariable(variable.substring(position));
                    return `<%= ${variableName}${convertedVariable}; %>`;
                } else {
                    const convertedVariable = this.convertToVariable(match);
                    return `<%= ${convertedVariable}; %>`;
                }
            }
        );
    }

    protected parseCallback(matches: string[]): string {
        const position = matches[1].indexOf('(');
        if (position !== -1) {
            const variableName = matches[1].substring(0, position);
            const convertedVariable = this.convertToVariable(matches[1].substring(position));
            return `<%= ${variableName}${convertedVariable}; %>`;
        } else {
            const convertedVariable = this.convertToVariable(matches[0]);
            return `<%= ${convertedVariable}; %>`;
        }
    }

    protected convertToVariable(dottedVariable: string): string {
        if (dottedVariable.indexOf('.')===-1) {
            return dottedVariable.replace(/[\{\}]/g, '');
        } else {
            return dottedVariable.replace(/\${(\w+)(\.)?/g, '$$1[')
                .replace(/\}/g, ']')
                .replace(/\./g, '][')
                .replace(/\[(\w+)\]/g, '["$1"]')
                .replace(/\[\]/g, '');
        }
    }
}