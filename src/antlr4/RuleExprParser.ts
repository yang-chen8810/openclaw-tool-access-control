// Generated from RuleExpr.g4 by ANTLR 4.13.1
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token,
	Interval, IntervalSet
} from 'antlr4';
import RuleExprListener from "./RuleExprListener.js";
import RuleExprVisitor from "./RuleExprVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class RuleExprParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly AND = 13;
	public static readonly OR = 14;
	public static readonly NOT = 15;
	public static readonly CONTAIN = 16;
	public static readonly NOT_CONTAIN = 17;
	public static readonly MATCH = 18;
	public static readonly NOT_MATCH = 19;
	public static readonly START_WITH = 20;
	public static readonly NOT_START_WITH = 21;
	public static readonly IN = 22;
	public static readonly NOT_IN = 23;
	public static readonly LIKE = 24;
	public static readonly NOT_LIKE = 25;
	public static readonly BOOLEAN_LITERAL = 26;
	public static readonly DATETIME_LITERAL = 27;
	public static readonly DATE_LITERAL = 28;
	public static readonly DOUBLE_LITERAL = 29;
	public static readonly LONG_LITERAL = 30;
	public static readonly STRING_LITERAL = 31;
	public static readonly IDENTIFIER = 32;
	public static readonly WS = 33;
	public static readonly EOF = Token.EOF;
	public static readonly RULE_parse = 0;
	public static readonly RULE_expression = 1;
	public static readonly RULE_primary = 2;
	public static readonly RULE_functionCall = 3;
	public static readonly RULE_functionArg = 4;
	public static readonly RULE_literal = 5;
	public static readonly RULE_array = 6;
	public static readonly RULE_attribute = 7;
	public static readonly RULE_jsonPath = 8;
	public static readonly RULE_jsonStep = 9;
	public static readonly literalNames: (string | null)[] = [ null, "'('", 
                                                            "')'", "'<'", 
                                                            "'<='", "'>'", 
                                                            "'>='", "'=='", 
                                                            "'!='", "','", 
                                                            "'['", "']'", 
                                                            "'.'", "'and'", 
                                                            "'or'", "'not'", 
                                                            "'contain'", 
                                                            "'not_contain'", 
                                                            "'match'", "'not_match'", 
                                                            "'start_with'", 
                                                            "'not_start_with'", 
                                                            "'in'", "'not_in'", 
                                                            "'like'", "'not_like'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, "AND", 
                                                             "OR", "NOT", 
                                                             "CONTAIN", 
                                                             "NOT_CONTAIN", 
                                                             "MATCH", "NOT_MATCH", 
                                                             "START_WITH", 
                                                             "NOT_START_WITH", 
                                                             "IN", "NOT_IN", 
                                                             "LIKE", "NOT_LIKE", 
                                                             "BOOLEAN_LITERAL", 
                                                             "DATETIME_LITERAL", 
                                                             "DATE_LITERAL", 
                                                             "DOUBLE_LITERAL", 
                                                             "LONG_LITERAL", 
                                                             "STRING_LITERAL", 
                                                             "IDENTIFIER", 
                                                             "WS" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"parse", "expression", "primary", "functionCall", "functionArg", "literal", 
		"array", "attribute", "jsonPath", "jsonStep",
	];
	public get grammarFileName(): string { return "RuleExpr.g4"; }
	public get literalNames(): (string | null)[] { return RuleExprParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return RuleExprParser.symbolicNames; }
	public get ruleNames(): string[] { return RuleExprParser.ruleNames; }
	public get serializedATN(): number[] { return RuleExprParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: any) {
		super(input);
		this._interp = new ParserATNSimulator(this, RuleExprParser._ATN, RuleExprParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public parse(): ParseContext {
		let localctx: ParseContext = new ParseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, RuleExprParser.RULE_parse);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 20;
			this.expression(0);
			this.state = 21;
			this.match(RuleExprParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: ExpressionContext = new ExpressionContext(this, this._ctx, _parentState);
		let _prevctx: ExpressionContext = localctx;
		let _startState: number = 2;
		this.enterRecursionRule(localctx, 2, RuleExprParser.RULE_expression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 31;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 10:
			case 26:
			case 27:
			case 28:
			case 29:
			case 30:
			case 31:
			case 32:
				{
				localctx = new PrimaryExpContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 24;
				this.primary();
				}
				break;
			case 1:
				{
				localctx = new ParenExpContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 25;
				this.match(RuleExprParser.T__0);
				this.state = 26;
				this.expression(0);
				this.state = 27;
				this.match(RuleExprParser.T__1);
				}
				break;
			case 15:
				{
				localctx = new NotExpContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 29;
				this.match(RuleExprParser.NOT);
				this.state = 30;
				this.expression(4);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 44;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 42;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 1, this._ctx) ) {
					case 1:
						{
						localctx = new CompExpContext(this, new ExpressionContext(this, _parentctx, _parentState));
						(localctx as CompExpContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, RuleExprParser.RULE_expression);
						this.state = 33;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 34;
						(localctx as CompExpContext)._op = this._input.LT(1);
						_la = this._input.LA(1);
						if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 67043832) !== 0))) {
						    (localctx as CompExpContext)._op = this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 35;
						(localctx as CompExpContext)._right = this.expression(4);
						}
						break;
					case 2:
						{
						localctx = new AndExpContext(this, new ExpressionContext(this, _parentctx, _parentState));
						(localctx as AndExpContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, RuleExprParser.RULE_expression);
						this.state = 36;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 37;
						(localctx as AndExpContext)._op = this.match(RuleExprParser.AND);
						this.state = 38;
						(localctx as AndExpContext)._right = this.expression(3);
						}
						break;
					case 3:
						{
						localctx = new OrExpContext(this, new ExpressionContext(this, _parentctx, _parentState));
						(localctx as OrExpContext)._left = _prevctx;
						this.pushNewRecursionContext(localctx, _startState, RuleExprParser.RULE_expression);
						this.state = 39;
						if (!(this.precpred(this._ctx, 1))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 1)");
						}
						this.state = 40;
						(localctx as OrExpContext)._op = this.match(RuleExprParser.OR);
						this.state = 41;
						(localctx as OrExpContext)._right = this.expression(2);
						}
						break;
					}
					}
				}
				this.state = 46;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public primary(): PrimaryContext {
		let localctx: PrimaryContext = new PrimaryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, RuleExprParser.RULE_primary);
		try {
			this.state = 50;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 47;
				this.literal();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 48;
				this.attribute();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 49;
				this.functionCall();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionCall(): FunctionCallContext {
		let localctx: FunctionCallContext = new FunctionCallContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, RuleExprParser.RULE_functionCall);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 52;
			this.match(RuleExprParser.IDENTIFIER);
			this.state = 53;
			this.match(RuleExprParser.T__0);
			this.state = 62;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 10)) & ~0x1F) === 0 && ((1 << (_la - 10)) & 8323073) !== 0)) {
				{
				this.state = 54;
				this.functionArg();
				this.state = 59;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===9) {
					{
					{
					this.state = 55;
					this.match(RuleExprParser.T__8);
					this.state = 56;
					this.functionArg();
					}
					}
					this.state = 61;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 64;
			this.match(RuleExprParser.T__1);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionArg(): FunctionArgContext {
		let localctx: FunctionArgContext = new FunctionArgContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, RuleExprParser.RULE_functionArg);
		try {
			this.state = 68;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 10:
			case 26:
			case 27:
			case 28:
			case 29:
			case 30:
			case 31:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 66;
				this.literal();
				}
				break;
			case 32:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 67;
				this.attribute();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public literal(): LiteralContext {
		let localctx: LiteralContext = new LiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, RuleExprParser.RULE_literal);
		try {
			this.state = 77;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 30:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 70;
				this.match(RuleExprParser.LONG_LITERAL);
				}
				break;
			case 29:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 71;
				this.match(RuleExprParser.DOUBLE_LITERAL);
				}
				break;
			case 31:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 72;
				this.match(RuleExprParser.STRING_LITERAL);
				}
				break;
			case 26:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 73;
				this.match(RuleExprParser.BOOLEAN_LITERAL);
				}
				break;
			case 28:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 74;
				this.match(RuleExprParser.DATE_LITERAL);
				}
				break;
			case 27:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 75;
				this.match(RuleExprParser.DATETIME_LITERAL);
				}
				break;
			case 10:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 76;
				this.array();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public array(): ArrayContext {
		let localctx: ArrayContext = new ArrayContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, RuleExprParser.RULE_array);
		let _la: number;
		try {
			this.state = 92;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 9, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 79;
				this.match(RuleExprParser.T__9);
				this.state = 80;
				this.literal();
				this.state = 85;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===9) {
					{
					{
					this.state = 81;
					this.match(RuleExprParser.T__8);
					this.state = 82;
					this.literal();
					}
					}
					this.state = 87;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 88;
				this.match(RuleExprParser.T__10);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 90;
				this.match(RuleExprParser.T__9);
				this.state = 91;
				this.match(RuleExprParser.T__10);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public attribute(): AttributeContext {
		let localctx: AttributeContext = new AttributeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, RuleExprParser.RULE_attribute);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 94;
			this.jsonPath();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public jsonPath(): JsonPathContext {
		let localctx: JsonPathContext = new JsonPathContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, RuleExprParser.RULE_jsonPath);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 96;
			this.match(RuleExprParser.IDENTIFIER);
			this.state = 100;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 10, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 97;
					this.jsonStep();
					}
					}
				}
				this.state = 102;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 10, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public jsonStep(): JsonStepContext {
		let localctx: JsonStepContext = new JsonStepContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, RuleExprParser.RULE_jsonStep);
		try {
			this.state = 111;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 11, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 103;
				this.match(RuleExprParser.T__11);
				this.state = 104;
				this.match(RuleExprParser.IDENTIFIER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 105;
				this.match(RuleExprParser.T__9);
				this.state = 106;
				this.match(RuleExprParser.LONG_LITERAL);
				this.state = 107;
				this.match(RuleExprParser.T__10);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 108;
				this.match(RuleExprParser.T__9);
				this.state = 109;
				this.match(RuleExprParser.STRING_LITERAL);
				this.state = 110;
				this.match(RuleExprParser.T__10);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 1:
			return this.expression_sempred(localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 3);
		case 1:
			return this.precpred(this._ctx, 2);
		case 2:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,33,114,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,1,
	0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,32,8,1,1,1,1,1,1,1,1,1,1,
	1,1,1,1,1,1,1,1,1,5,1,43,8,1,10,1,12,1,46,9,1,1,2,1,2,1,2,3,2,51,8,2,1,
	3,1,3,1,3,1,3,1,3,5,3,58,8,3,10,3,12,3,61,9,3,3,3,63,8,3,1,3,1,3,1,4,1,
	4,3,4,69,8,4,1,5,1,5,1,5,1,5,1,5,1,5,1,5,3,5,78,8,5,1,6,1,6,1,6,1,6,5,6,
	84,8,6,10,6,12,6,87,9,6,1,6,1,6,1,6,1,6,3,6,93,8,6,1,7,1,7,1,8,1,8,5,8,
	99,8,8,10,8,12,8,102,9,8,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,3,9,112,8,9,1,
	9,0,1,2,10,0,2,4,6,8,10,12,14,16,18,0,1,2,0,3,8,16,25,124,0,20,1,0,0,0,
	2,31,1,0,0,0,4,50,1,0,0,0,6,52,1,0,0,0,8,68,1,0,0,0,10,77,1,0,0,0,12,92,
	1,0,0,0,14,94,1,0,0,0,16,96,1,0,0,0,18,111,1,0,0,0,20,21,3,2,1,0,21,22,
	5,0,0,1,22,1,1,0,0,0,23,24,6,1,-1,0,24,32,3,4,2,0,25,26,5,1,0,0,26,27,3,
	2,1,0,27,28,5,2,0,0,28,32,1,0,0,0,29,30,5,15,0,0,30,32,3,2,1,4,31,23,1,
	0,0,0,31,25,1,0,0,0,31,29,1,0,0,0,32,44,1,0,0,0,33,34,10,3,0,0,34,35,7,
	0,0,0,35,43,3,2,1,4,36,37,10,2,0,0,37,38,5,13,0,0,38,43,3,2,1,3,39,40,10,
	1,0,0,40,41,5,14,0,0,41,43,3,2,1,2,42,33,1,0,0,0,42,36,1,0,0,0,42,39,1,
	0,0,0,43,46,1,0,0,0,44,42,1,0,0,0,44,45,1,0,0,0,45,3,1,0,0,0,46,44,1,0,
	0,0,47,51,3,10,5,0,48,51,3,14,7,0,49,51,3,6,3,0,50,47,1,0,0,0,50,48,1,0,
	0,0,50,49,1,0,0,0,51,5,1,0,0,0,52,53,5,32,0,0,53,62,5,1,0,0,54,59,3,8,4,
	0,55,56,5,9,0,0,56,58,3,8,4,0,57,55,1,0,0,0,58,61,1,0,0,0,59,57,1,0,0,0,
	59,60,1,0,0,0,60,63,1,0,0,0,61,59,1,0,0,0,62,54,1,0,0,0,62,63,1,0,0,0,63,
	64,1,0,0,0,64,65,5,2,0,0,65,7,1,0,0,0,66,69,3,10,5,0,67,69,3,14,7,0,68,
	66,1,0,0,0,68,67,1,0,0,0,69,9,1,0,0,0,70,78,5,30,0,0,71,78,5,29,0,0,72,
	78,5,31,0,0,73,78,5,26,0,0,74,78,5,28,0,0,75,78,5,27,0,0,76,78,3,12,6,0,
	77,70,1,0,0,0,77,71,1,0,0,0,77,72,1,0,0,0,77,73,1,0,0,0,77,74,1,0,0,0,77,
	75,1,0,0,0,77,76,1,0,0,0,78,11,1,0,0,0,79,80,5,10,0,0,80,85,3,10,5,0,81,
	82,5,9,0,0,82,84,3,10,5,0,83,81,1,0,0,0,84,87,1,0,0,0,85,83,1,0,0,0,85,
	86,1,0,0,0,86,88,1,0,0,0,87,85,1,0,0,0,88,89,5,11,0,0,89,93,1,0,0,0,90,
	91,5,10,0,0,91,93,5,11,0,0,92,79,1,0,0,0,92,90,1,0,0,0,93,13,1,0,0,0,94,
	95,3,16,8,0,95,15,1,0,0,0,96,100,5,32,0,0,97,99,3,18,9,0,98,97,1,0,0,0,
	99,102,1,0,0,0,100,98,1,0,0,0,100,101,1,0,0,0,101,17,1,0,0,0,102,100,1,
	0,0,0,103,104,5,12,0,0,104,112,5,32,0,0,105,106,5,10,0,0,106,107,5,30,0,
	0,107,112,5,11,0,0,108,109,5,10,0,0,109,110,5,31,0,0,110,112,5,11,0,0,111,
	103,1,0,0,0,111,105,1,0,0,0,111,108,1,0,0,0,112,19,1,0,0,0,12,31,42,44,
	50,59,62,68,77,85,92,100,111];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!RuleExprParser.__ATN) {
			RuleExprParser.__ATN = new ATNDeserializer().deserialize(RuleExprParser._serializedATN);
		}

		return RuleExprParser.__ATN;
	}


	static DecisionsToDFA = RuleExprParser._ATN.decisionToState.map( (ds: any, index: number) => new DFA(ds, index) );

}

export class ParseContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public EOF(): TerminalNode {
		return this.getToken(RuleExprParser.EOF, 0);
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_parse;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterParse) {
	 		listener.enterParse(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitParse) {
	 		listener.exitParse(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitParse) {
			return visitor.visitParse(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_expression;
	}
	public copyFrom(ctx: ExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class AndExpContext extends ExpressionContext {
	public _left!: ExpressionContext;
	public _op!: Token;
	public _right!: ExpressionContext;
	constructor(parser: RuleExprParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public AND(): TerminalNode {
		return this.getToken(RuleExprParser.AND, 0);
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterAndExp) {
	 		listener.enterAndExp(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitAndExp) {
	 		listener.exitAndExp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitAndExp) {
			return visitor.visitAndExp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class CompExpContext extends ExpressionContext {
	public _left!: ExpressionContext;
	public _op!: Token;
	public _right!: ExpressionContext;
	constructor(parser: RuleExprParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public CONTAIN(): TerminalNode {
		return this.getToken(RuleExprParser.CONTAIN, 0);
	}
	public NOT_CONTAIN(): TerminalNode {
		return this.getToken(RuleExprParser.NOT_CONTAIN, 0);
	}
	public MATCH(): TerminalNode {
		return this.getToken(RuleExprParser.MATCH, 0);
	}
	public NOT_MATCH(): TerminalNode {
		return this.getToken(RuleExprParser.NOT_MATCH, 0);
	}
	public START_WITH(): TerminalNode {
		return this.getToken(RuleExprParser.START_WITH, 0);
	}
	public NOT_START_WITH(): TerminalNode {
		return this.getToken(RuleExprParser.NOT_START_WITH, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(RuleExprParser.IN, 0);
	}
	public NOT_IN(): TerminalNode {
		return this.getToken(RuleExprParser.NOT_IN, 0);
	}
	public LIKE(): TerminalNode {
		return this.getToken(RuleExprParser.LIKE, 0);
	}
	public NOT_LIKE(): TerminalNode {
		return this.getToken(RuleExprParser.NOT_LIKE, 0);
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterCompExp) {
	 		listener.enterCompExp(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitCompExp) {
	 		listener.exitCompExp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitCompExp) {
			return visitor.visitCompExp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PrimaryExpContext extends ExpressionContext {
	constructor(parser: RuleExprParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primary(): PrimaryContext {
		return this.getTypedRuleContext(PrimaryContext, 0) as PrimaryContext;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterPrimaryExp) {
	 		listener.enterPrimaryExp(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitPrimaryExp) {
	 		listener.exitPrimaryExp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitPrimaryExp) {
			return visitor.visitPrimaryExp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenExpContext extends ExpressionContext {
	constructor(parser: RuleExprParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterParenExp) {
	 		listener.enterParenExp(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitParenExp) {
	 		listener.exitParenExp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitParenExp) {
			return visitor.visitParenExp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class OrExpContext extends ExpressionContext {
	public _left!: ExpressionContext;
	public _op!: Token;
	public _right!: ExpressionContext;
	constructor(parser: RuleExprParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public OR(): TerminalNode {
		return this.getToken(RuleExprParser.OR, 0);
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterOrExp) {
	 		listener.enterOrExp(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitOrExp) {
	 		listener.exitOrExp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitOrExp) {
			return visitor.visitOrExp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NotExpContext extends ExpressionContext {
	constructor(parser: RuleExprParser, ctx: ExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NOT(): TerminalNode {
		return this.getToken(RuleExprParser.NOT, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterNotExp) {
	 		listener.enterNotExp(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitNotExp) {
	 		listener.exitNotExp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitNotExp) {
			return visitor.visitNotExp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public literal(): LiteralContext {
		return this.getTypedRuleContext(LiteralContext, 0) as LiteralContext;
	}
	public attribute(): AttributeContext {
		return this.getTypedRuleContext(AttributeContext, 0) as AttributeContext;
	}
	public functionCall(): FunctionCallContext {
		return this.getTypedRuleContext(FunctionCallContext, 0) as FunctionCallContext;
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_primary;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterPrimary) {
	 		listener.enterPrimary(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitPrimary) {
	 		listener.exitPrimary(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitPrimary) {
			return visitor.visitPrimary(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionCallContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RuleExprParser.IDENTIFIER, 0);
	}
	public functionArg_list(): FunctionArgContext[] {
		return this.getTypedRuleContexts(FunctionArgContext) as FunctionArgContext[];
	}
	public functionArg(i: number): FunctionArgContext {
		return this.getTypedRuleContext(FunctionArgContext, i) as FunctionArgContext;
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_functionCall;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterFunctionCall) {
	 		listener.enterFunctionCall(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitFunctionCall) {
	 		listener.exitFunctionCall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitFunctionCall) {
			return visitor.visitFunctionCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionArgContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public literal(): LiteralContext {
		return this.getTypedRuleContext(LiteralContext, 0) as LiteralContext;
	}
	public attribute(): AttributeContext {
		return this.getTypedRuleContext(AttributeContext, 0) as AttributeContext;
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_functionArg;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterFunctionArg) {
	 		listener.enterFunctionArg(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitFunctionArg) {
	 		listener.exitFunctionArg(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitFunctionArg) {
			return visitor.visitFunctionArg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LiteralContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LONG_LITERAL(): TerminalNode {
		return this.getToken(RuleExprParser.LONG_LITERAL, 0);
	}
	public DOUBLE_LITERAL(): TerminalNode {
		return this.getToken(RuleExprParser.DOUBLE_LITERAL, 0);
	}
	public STRING_LITERAL(): TerminalNode {
		return this.getToken(RuleExprParser.STRING_LITERAL, 0);
	}
	public BOOLEAN_LITERAL(): TerminalNode {
		return this.getToken(RuleExprParser.BOOLEAN_LITERAL, 0);
	}
	public DATE_LITERAL(): TerminalNode {
		return this.getToken(RuleExprParser.DATE_LITERAL, 0);
	}
	public DATETIME_LITERAL(): TerminalNode {
		return this.getToken(RuleExprParser.DATETIME_LITERAL, 0);
	}
	public array(): ArrayContext {
		return this.getTypedRuleContext(ArrayContext, 0) as ArrayContext;
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_literal;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterLiteral) {
	 		listener.enterLiteral(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitLiteral) {
	 		listener.exitLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitLiteral) {
			return visitor.visitLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public literal_list(): LiteralContext[] {
		return this.getTypedRuleContexts(LiteralContext) as LiteralContext[];
	}
	public literal(i: number): LiteralContext {
		return this.getTypedRuleContext(LiteralContext, i) as LiteralContext;
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_array;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterArray) {
	 		listener.enterArray(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitArray) {
	 		listener.exitArray(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitArray) {
			return visitor.visitArray(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AttributeContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public jsonPath(): JsonPathContext {
		return this.getTypedRuleContext(JsonPathContext, 0) as JsonPathContext;
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_attribute;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterAttribute) {
	 		listener.enterAttribute(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitAttribute) {
	 		listener.exitAttribute(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitAttribute) {
			return visitor.visitAttribute(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonPathContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RuleExprParser.IDENTIFIER, 0);
	}
	public jsonStep_list(): JsonStepContext[] {
		return this.getTypedRuleContexts(JsonStepContext) as JsonStepContext[];
	}
	public jsonStep(i: number): JsonStepContext {
		return this.getTypedRuleContext(JsonStepContext, i) as JsonStepContext;
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_jsonPath;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterJsonPath) {
	 		listener.enterJsonPath(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitJsonPath) {
	 		listener.exitJsonPath(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitJsonPath) {
			return visitor.visitJsonPath(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JsonStepContext extends ParserRuleContext {
	constructor(parser?: RuleExprParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RuleExprParser.IDENTIFIER, 0);
	}
	public LONG_LITERAL(): TerminalNode {
		return this.getToken(RuleExprParser.LONG_LITERAL, 0);
	}
	public STRING_LITERAL(): TerminalNode {
		return this.getToken(RuleExprParser.STRING_LITERAL, 0);
	}
    public get ruleIndex(): number {
    	return RuleExprParser.RULE_jsonStep;
	}
	public enterRule(listener: RuleExprListener): void {
	    if(listener.enterJsonStep) {
	 		listener.enterJsonStep(this);
		}
	}
	public exitRule(listener: RuleExprListener): void {
	    if(listener.exitJsonStep) {
	 		listener.exitJsonStep(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RuleExprVisitor<Result>): Result {
		if (visitor.visitJsonStep) {
			return visitor.visitJsonStep(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
