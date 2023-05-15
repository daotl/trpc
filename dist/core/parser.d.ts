export declare type ParserZodEsque<TInput, TParsedInput> = {
    _input: TInput;
    _output: TParsedInput;
};
export declare type ParserMyZodEsque<TInput> = {
    parse: (input: any) => TInput;
};
export declare type ParserSuperstructEsque<TInput> = {
    create: (input: unknown) => TInput;
};
export declare type ParserCustomValidatorEsque<TInput> = (input: unknown) => TInput | Promise<TInput>;
export declare type ParserYupEsque<TInput> = {
    validateSync: (input: unknown) => TInput;
};
export declare type ParserScaleEsque<TInput> = {
    assert(value: unknown): asserts value is TInput;
};
export declare type ParserWithoutInput<TInput> = ParserYupEsque<TInput> | ParserSuperstructEsque<TInput> | ParserCustomValidatorEsque<TInput> | ParserMyZodEsque<TInput> | ParserScaleEsque<TInput>;
export declare type ParserWithInputOutput<TInput, TParsedInput> = ParserZodEsque<TInput, TParsedInput>;
export declare type Parser = ParserWithoutInput<any> | ParserWithInputOutput<any, any>;
export declare type inferParser<TParser extends Parser> = TParser extends ParserWithInputOutput<infer $TIn, infer $TOut> ? {
    in: $TIn;
    out: $TOut;
} : TParser extends ParserWithoutInput<infer $InOut> ? {
    in: $InOut;
    out: $InOut;
} : never;
//# sourceMappingURL=parser.d.ts.map