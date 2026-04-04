import { CharStreams, CommonTokenStream } from 'antlr4';
import RuleExprLexer from '../antlr4/RuleExprLexer.js';
import RuleExprParser, {
    AndExpContext,
    ArrayContext,
    AttributeContext,
    CompExpContext,
    FunctionArgContext,
    FunctionCallContext,
    JsonPathContext,
    JsonStepContext,
    LiteralContext,
    NotExpContext,
    OrExpContext,
    ParenExpContext,
    ParseContext,
    PrimaryContext,
    PrimaryExpContext
} from '../antlr4/RuleExprParser.js';
import RuleExprVisitor from '../antlr4/RuleExprVisitor.js';
import type { RuleFunction } from './RuleFunction.js';
import type { AttributeRetriever } from './AttributeRetriever.js';
import { resolvePath } from '../utils/path-utils.js';

export const ERROR = Symbol('ERROR');

export class RuleExprEvaluator extends RuleExprVisitor<any> {
    private externalFunctions: Map<string, RuleFunction> = new Map();
    private attributeRetrievers: Map<string, AttributeRetriever> = new Map();
    private currentContext: Record<string, any> = {};
    private parseTree: ParseContext | null = null;
    private caseSensitive: boolean;
    private unconditional: boolean = false;

    constructor(expr: string, caseSensitive: boolean = true) {
        super();
        this.caseSensitive = caseSensitive;
        if (!expr || expr.trim() === '') {
            this.unconditional = true;
            return;
        }

        const chars = CharStreams.fromString(expr);
        const lexer = new RuleExprLexer(chars);
        const errorListener = {
            syntaxError: (recognizer: any, offendingSymbol: any, line: number, charPositionInLine: number, msg: string, e: any) => {
                throw new Error(`Syntax error in expression at line ${line}:${charPositionInLine} - ${msg}`);
            },
            reportAmbiguity: () => {},
            reportAttemptingFullContext: () => {},
            reportContextSensitivity: () => {}
        };

        (lexer as any).removeErrorListeners();
        (lexer as any).addErrorListener(errorListener);

        const tokens = new CommonTokenStream(lexer);
        const parser = new RuleExprParser(tokens as any);
        
        (parser as any).removeErrorListeners();
        (parser as any).addErrorListener(errorListener);

        this.parseTree = parser.parse();
    }

    public registerFunction(fn: RuleFunction): void {
        this.externalFunctions.set(fn.getName(), fn);
    }

    public registerAttributeRetriever(name: string, retriever: AttributeRetriever): void {
        this.attributeRetrievers.set(name, retriever);
    }

    public evaluate(context: Record<string, any> | null): any {
        if (this.unconditional) {
            return true;
        }
        this.currentContext = context || {};

        try {
            return (this as any).visit(this.parseTree);
        } catch (e) {
            console.error(`Exception during evaluation of '${this.parseTree!.getText()}'`, e);
            return ERROR;
        } finally {
            this.currentContext = {};
        }
    }

    private evaluateInternal(ctx: any): any {
        if (!ctx) return null;
        try {
            return (this as any).visit(ctx);
        } catch (e) {
            console.error(`Exception during evaluation of '${ctx.getText()}'`, e);
            return ERROR;
        }
    }

    visitParse = (ctx: ParseContext): any => {
        return this.evaluateInternal(ctx.expression());
    }

    visitParenExp = (ctx: ParenExpContext): any => {
        return this.evaluateInternal(ctx.expression());
    }

    visitNotExp = (ctx: NotExpContext): any => {
        const val = this.evaluateInternal(ctx.expression());
        if (val === ERROR) return ERROR;
        if (val === null) return null;

        if (typeof val === 'boolean') {
            return !val;
        }
        console.warn(`NOT operator requires boolean operand, got: ${typeof val}`);
        return ERROR;
    }

    visitAndExp = (ctx: AndExpContext): any => {
        const left = this.evaluateInternal(ctx._left);
        const right = this.evaluateInternal(ctx._right);

        if (left === ERROR || right === ERROR) return ERROR;

        if (left === null) {
            if (right === false) return false;
            return null;
        }
        if (right === null) {
            if (left === false) return false;
            return null;
        }

        if (typeof left === 'boolean' && typeof right === 'boolean') {
            return left && right;
        }

        console.warn(`AND operator requires boolean operands. left: ${typeof left}, right: ${typeof right}`);
        return ERROR;
    }

    visitOrExp = (ctx: OrExpContext): any => {
        const left = this.evaluateInternal(ctx._left);
        const right = this.evaluateInternal(ctx._right);

        if (left === ERROR || right === ERROR) return ERROR;

        if (left === null) {
            if (right === true) return true;
            return null;
        }
        if (right === null) {
            if (left === true) return true;
            return null;
        }

        if (typeof left === 'boolean' && typeof right === 'boolean') {
            return left || right;
        }

        console.warn(`OR operator requires boolean operands. left: ${typeof left}, right: ${typeof right}`);
        return ERROR;
    }

    visitCompExp = (ctx: CompExpContext): any => {
        const left = this.evaluateInternal(ctx._left);
        const right = this.evaluateInternal(ctx._right);
        const op = (ctx as any).getChild(1).getText();

        if (left === ERROR || right === ERROR) return ERROR;
        if (left === null || right === null) return null;

        try {
            switch (op) {
                case '==': return this.compare(left, right) === 0;
                case '!=': return this.compare(left, right) !== 0;
                case '>': return this.compare(left, right) > 0;
                case '>=': return this.compare(left, right) >= 0;
                case '<': return this.compare(left, right) < 0;
                case '<=': return this.compare(left, right) <= 0;
                case 'contain':
                    if (typeof left === 'string' && typeof right === 'string') {
                        return this.caseSensitive ? left.includes(right) : left.toLowerCase().includes(right.toLowerCase());
                    }
                    console.warn(`contain operator requires string operands`);
                    return ERROR;
                case 'not_contain':
                    if (typeof left === 'string' && typeof right === 'string') {
                        return this.caseSensitive ? !left.includes(right) : !left.toLowerCase().includes(right.toLowerCase());
                    }
                    console.warn(`not_contain operator requires string operands`);
                    return ERROR;
                case 'match':
                    if (typeof left === 'string' && typeof right === 'string') {
                        return new RegExp(right, this.caseSensitive ? "" : "i").test(left);
                    }
                    console.warn(`match operator requires string operands`);
                    return ERROR;
                case 'not_match':
                    if (typeof left === 'string' && typeof right === 'string') {
                        return !new RegExp(right, this.caseSensitive ? "" : "i").test(left);
                    }
                    console.warn(`not_match operator requires string operands`);
                    return ERROR;
                case 'start_with':
                    if (typeof left === 'string' && typeof right === 'string') {
                        return this.caseSensitive ? left.startsWith(right) : left.toLowerCase().startsWith(right.toLowerCase());
                    }
                    console.warn(`start_with operator requires string operands`);
                    return ERROR;
                case 'not_start_with':
                    if (typeof left === 'string' && typeof right === 'string') {
                        return this.caseSensitive ? !left.startsWith(right) : !left.toLowerCase().startsWith(right.toLowerCase());
                    }
                    console.warn(`not_start_with operator requires string operands`);
                    return ERROR;
                case 'in':
                    if (Array.isArray(right)) {
                        return this.deepIncludes(right, left);
                    }
                    console.warn(`in operator requires a list as right operand`);
                    return ERROR;
                case 'not_in':
                    if (Array.isArray(right)) {
                        return !this.deepIncludes(right, left);
                    }
                    console.warn(`not_in operator requires a list as right operand`);
                    return ERROR;
                case 'like':
                    if (typeof left === 'string' && typeof right === 'string') {
                        return this.likeMatch(left, right);
                    }
                    console.warn(`like operator requires string operands`);
                    return ERROR;
                case 'not_like':
                    if (typeof left === 'string' && typeof right === 'string') {
                        return !this.likeMatch(left, right);
                    }
                    console.warn(`not_like operator requires string operands`);
                    return ERROR;
                default:
                    console.warn(`Unsupported operator: ${op}`);
                    return ERROR;
            }
        } catch (e) {
            console.error(`Error evaluating compExp with operator ${op}`, e);
            return ERROR;
        }
    }

    visitPrimaryExp = (ctx: PrimaryExpContext): any => {
        return this.evaluateInternal(ctx.primary());
    }

    visitPrimary = (ctx: PrimaryContext): any => {
        if (ctx.literal()) return this.evaluateInternal(ctx.literal());
        if (ctx.attribute()) return this.evaluateInternal(ctx.attribute());
        if (ctx.functionCall()) return this.evaluateInternal(ctx.functionCall());
        return null;
    }

    visitLiteral = (ctx: LiteralContext): any => {
        if (ctx.BOOLEAN_LITERAL()) {
            return ctx.BOOLEAN_LITERAL()!.getText() === 'true';
        }
        if (ctx.STRING_LITERAL()) {
            const str = ctx.STRING_LITERAL()!.getText();
            return this.unescapeString(str.substring(1, str.length - 1));
        }
        if (ctx.LONG_LITERAL()) {
            return Number(ctx.LONG_LITERAL()!.getText());
        }
        if (ctx.DOUBLE_LITERAL()) {
            return Number(ctx.DOUBLE_LITERAL()!.getText());
        }
        if (ctx.DATE_LITERAL()) {
            const val = ctx.DATE_LITERAL()!.getText();
            const [MM, DD, YYYY] = val.split('/');
            return new Date(`${YYYY}-${MM!.padStart(2, '0')}-${DD!.padStart(2, '0')}T00:00:00`);
        }
        if (ctx.DATETIME_LITERAL()) {
            let val = ctx.DATETIME_LITERAL()!.getText().replace(' ', 'T');
            if (!val.includes('T')) val = val.replace(/(\d{4}) (\d{2})/, '$1T$2');
            return new Date(val);
        }
        if (ctx.array()) {
            return this.evaluateInternal(ctx.array());
        }
        return null;
    }

    visitArray = (ctx: ArrayContext): any => {
        const list: any[] = [];
        const literals = ctx.literal_list();
        for (const literalCtx of literals) {
            const item = this.evaluateInternal(literalCtx);
            if (item === ERROR) return ERROR;
            list.push(item);
        }
        return list;
    }

    visitAttribute = (ctx: AttributeContext): any => {
        return this.evaluateInternal(ctx.jsonPath());
    }

    visitJsonPath = (ctx: JsonPathContext): any => {
        const rootIdCtx = ctx.IDENTIFIER();
        const rootId = rootIdCtx ? rootIdCtx.getText() : null;
        if (!rootId) return null;

        let current: any;
        if (rootId in this.currentContext) {
            current = this.currentContext[rootId];
        } else if (this.attributeRetrievers.has(rootId)) {
            current = this.attributeRetrievers.get(rootId)!.getValue(this.currentContext);
        } else {
            current = null;
        }

        const steps = ctx.jsonStep_list();
        for (const step of steps) {
            if (current == null) {
                return null;
            }

            if (step.IDENTIFIER()) {
                if (typeof current === 'object') {
                    current = current[step.IDENTIFIER()!.getText()];
                    if (current === undefined) return null;
                } else {
                    return null;
                }
            } else if (step.LONG_LITERAL()) {
                if (Array.isArray(current)) {
                    const idx = Number(step.LONG_LITERAL()!.getText());
                    if (idx >= 0 && idx < current.length) {
                        current = current[idx];
                        if (current === undefined) return null;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            } else if (step.STRING_LITERAL()) {
                if (typeof current === 'object') {
                    let key = step.STRING_LITERAL()!.getText();
                    key = key.substring(1, key.length - 1);
                    current = current[key];
                    if (current === undefined) return null;
                } else {
                    return null;
                }
            }
        }
        return current === undefined ? null : current;
    }

    visitFunctionCall = (ctx: FunctionCallContext): any => {
        const funcName = ctx.IDENTIFIER()!.getText();
        const args: any[] = [];
        
        const functionArgs = ctx.functionArg_list();
        for (const argCtx of functionArgs) {
            const argVal = this.evaluateInternal(argCtx);
            if (argVal === ERROR) return ERROR;
            args.push(argVal);
        }

        if (this.externalFunctions.has(funcName)) {
            try {
                return this.externalFunctions.get(funcName)!.execute(args, this.currentContext);
            } catch (e) {
                console.error(`Error executing plugin function ${funcName}`, e);
                return ERROR;
            }
        }

        switch (funcName) {
            case 'path':
                if (args.length === 1 && typeof args[0] === 'string') {
                    return resolvePath(args[0]);
                }
                console.warn(`path function expects 1 string argument, got ${args.length}`);
                return ERROR;
            case 'length':
                if (args.length === 1) {
                    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
                        return args[0].length;
                    }
                    console.warn(`length function requires string or list argument, got ${typeof args[0]}`);
                    return ERROR;
                }
                console.warn(`length function expects 1 argument, got ${args.length}`);
                return ERROR;
            case 'substring':
                if (args.length === 3) {
                    if (typeof args[0] === 'string' && typeof args[1] === 'number' && typeof args[2] === 'number') {
                        return args[0].substring(args[1], args[2]);
                    }
                    console.warn(`substring function requires (string, number, number) arguments`);
                    return ERROR;
                }
                console.warn(`substring function expects 3 arguments, got ${args.length}`);
                return ERROR;
            case 'now':
                return new Date();
            case 'upper':
                if (args.length === 1) {
                    if (typeof args[0] === 'string') {
                        return args[0].toUpperCase();
                    }
                    console.warn(`upper function requires string argument`);
                    return ERROR;
                }
                return ERROR;
            case 'lower':
                if (args.length === 1) {
                    if (typeof args[0] === 'string') {
                        return args[0].toLowerCase();
                    }
                    console.warn(`lower function requires string argument`);
                    return ERROR;
                }
                return ERROR;
            case 'trim':
                if (args.length === 1) {
                    if (typeof args[0] === 'string') {
                        return args[0].trim();
                    }
                    console.warn(`trim function requires string argument`);
                    return ERROR;
                }
                return ERROR;
            case 'toString':
                if (args.length === 1) {
                    const val = args[0];
                    if (val === null) return 'null';
                    return typeof val === 'object' ? JSON.stringify(val) : String(val);
                }
                console.warn(`toString function expects 1 argument, got ${args.length}`);
                return ERROR;
            default:
                console.warn(`Unknown function: ${funcName}`);
                return ERROR;
        }
    }

    visitFunctionArg = (ctx: FunctionArgContext): any => {
        if (ctx.literal()) return this.evaluateInternal(ctx.literal());
        if (ctx.attribute()) return this.evaluateInternal(ctx.attribute());
        return null;
    }

    private likeMatch(str: string, pattern: string): boolean {
        if (!this.caseSensitive) {
            str = str.toLowerCase();
            pattern = pattern.toLowerCase();
        }
        let s = 0, p = 0, match = 0, starIdx = -1;
        while (s < str.length) {
            if (p < pattern.length && (pattern[p] === '?' || str[s] === pattern[p])) {
                s++;
                p++;
            } else if (p < pattern.length && pattern[p] === '*') {
                starIdx = p;
                match = s;
                p++;
            } else if (starIdx !== -1) {
                p = starIdx + 1;
                match++;
                s = match;
            } else {
                return false;
            }
        }
        while (p < pattern.length && pattern[p] === '*') {
            p++;
        }
        return p === pattern.length;
    }

    private deepIncludes(arr: any[], item: any): boolean {
        if (item instanceof Date) {
            const t = item.getTime();
            return arr.some(el => el instanceof Date && el.getTime() === t);
        }
        if (!this.caseSensitive && typeof item === 'string') {
            const lowerItem = item.toLowerCase();
            return arr.some(el => typeof el === 'string' ? el.toLowerCase() === lowerItem : el === item);
        }
        return arr.includes(item);
    }

    private unescapeString(s: string): string {
        return s.replace(/\\(.)/g, (_, ch: string) => {
            switch (ch) {
                case 'n': return '\n';
                case 't': return '\t';
                case 'r': return '\r';
                case '\\': return '\\';
                case '"': return '"';
                case "'": return "'";
                default: return ch;
            }
        });
    }

    private compare(left: any, right: any): number {
        if (typeof left === 'number' && typeof right === 'number') {
            return left < right ? -1 : (left > right ? 1 : 0);
        }
        if (typeof left === 'string' && typeof right === 'string') {
            if (!this.caseSensitive) {
                left = left.toLowerCase();
                right = right.toLowerCase();
            }
            return left.localeCompare(right);
        }
        if (left instanceof Date && right instanceof Date) {
            return left.getTime() < right.getTime() ? -1 : (left.getTime() > right.getTime() ? 1 : 0);
        }
        console.warn(`Incompatible types for comparison: ${typeof left} and ${typeof right}`);
        throw new Error('Incompatible types for comparison');
    }
}
