export interface RuleFunction {
    getName(): string;
    execute(args: any[], context: Record<string, any> | Map<string, any>): any;
}
