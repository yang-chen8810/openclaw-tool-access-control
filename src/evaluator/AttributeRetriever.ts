export interface AttributeRetriever {
    getValue(context: Record<string, any> | Map<string, any>): any;
}
