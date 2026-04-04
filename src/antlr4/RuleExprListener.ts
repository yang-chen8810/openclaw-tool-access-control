// Generated from RuleExpr.g4 by ANTLR 4.13.1

import {ParseTreeListener} from "antlr4";


import { ParseContext } from "./RuleExprParser";
import { AndExpContext } from "./RuleExprParser";
import { CompExpContext } from "./RuleExprParser";
import { PrimaryExpContext } from "./RuleExprParser";
import { ParenExpContext } from "./RuleExprParser";
import { OrExpContext } from "./RuleExprParser";
import { NotExpContext } from "./RuleExprParser";
import { PrimaryContext } from "./RuleExprParser";
import { FunctionCallContext } from "./RuleExprParser";
import { FunctionArgContext } from "./RuleExprParser";
import { LiteralContext } from "./RuleExprParser";
import { ArrayContext } from "./RuleExprParser";
import { AttributeContext } from "./RuleExprParser";
import { JsonPathContext } from "./RuleExprParser";
import { JsonStepContext } from "./RuleExprParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `RuleExprParser`.
 */
export default class RuleExprListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `RuleExprParser.parse`.
	 * @param ctx the parse tree
	 */
	enterParse?: (ctx: ParseContext) => void;
	/**
	 * Exit a parse tree produced by `RuleExprParser.parse`.
	 * @param ctx the parse tree
	 */
	exitParse?: (ctx: ParseContext) => void;
	/**
	 * Enter a parse tree produced by the `andExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	enterAndExp?: (ctx: AndExpContext) => void;
	/**
	 * Exit a parse tree produced by the `andExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	exitAndExp?: (ctx: AndExpContext) => void;
	/**
	 * Enter a parse tree produced by the `compExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	enterCompExp?: (ctx: CompExpContext) => void;
	/**
	 * Exit a parse tree produced by the `compExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	exitCompExp?: (ctx: CompExpContext) => void;
	/**
	 * Enter a parse tree produced by the `primaryExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	enterPrimaryExp?: (ctx: PrimaryExpContext) => void;
	/**
	 * Exit a parse tree produced by the `primaryExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	exitPrimaryExp?: (ctx: PrimaryExpContext) => void;
	/**
	 * Enter a parse tree produced by the `parenExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	enterParenExp?: (ctx: ParenExpContext) => void;
	/**
	 * Exit a parse tree produced by the `parenExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	exitParenExp?: (ctx: ParenExpContext) => void;
	/**
	 * Enter a parse tree produced by the `orExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	enterOrExp?: (ctx: OrExpContext) => void;
	/**
	 * Exit a parse tree produced by the `orExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	exitOrExp?: (ctx: OrExpContext) => void;
	/**
	 * Enter a parse tree produced by the `notExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	enterNotExp?: (ctx: NotExpContext) => void;
	/**
	 * Exit a parse tree produced by the `notExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 */
	exitNotExp?: (ctx: NotExpContext) => void;
	/**
	 * Enter a parse tree produced by `RuleExprParser.primary`.
	 * @param ctx the parse tree
	 */
	enterPrimary?: (ctx: PrimaryContext) => void;
	/**
	 * Exit a parse tree produced by `RuleExprParser.primary`.
	 * @param ctx the parse tree
	 */
	exitPrimary?: (ctx: PrimaryContext) => void;
	/**
	 * Enter a parse tree produced by `RuleExprParser.functionCall`.
	 * @param ctx the parse tree
	 */
	enterFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by `RuleExprParser.functionCall`.
	 * @param ctx the parse tree
	 */
	exitFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Enter a parse tree produced by `RuleExprParser.functionArg`.
	 * @param ctx the parse tree
	 */
	enterFunctionArg?: (ctx: FunctionArgContext) => void;
	/**
	 * Exit a parse tree produced by `RuleExprParser.functionArg`.
	 * @param ctx the parse tree
	 */
	exitFunctionArg?: (ctx: FunctionArgContext) => void;
	/**
	 * Enter a parse tree produced by `RuleExprParser.literal`.
	 * @param ctx the parse tree
	 */
	enterLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Exit a parse tree produced by `RuleExprParser.literal`.
	 * @param ctx the parse tree
	 */
	exitLiteral?: (ctx: LiteralContext) => void;
	/**
	 * Enter a parse tree produced by `RuleExprParser.array`.
	 * @param ctx the parse tree
	 */
	enterArray?: (ctx: ArrayContext) => void;
	/**
	 * Exit a parse tree produced by `RuleExprParser.array`.
	 * @param ctx the parse tree
	 */
	exitArray?: (ctx: ArrayContext) => void;
	/**
	 * Enter a parse tree produced by `RuleExprParser.attribute`.
	 * @param ctx the parse tree
	 */
	enterAttribute?: (ctx: AttributeContext) => void;
	/**
	 * Exit a parse tree produced by `RuleExprParser.attribute`.
	 * @param ctx the parse tree
	 */
	exitAttribute?: (ctx: AttributeContext) => void;
	/**
	 * Enter a parse tree produced by `RuleExprParser.jsonPath`.
	 * @param ctx the parse tree
	 */
	enterJsonPath?: (ctx: JsonPathContext) => void;
	/**
	 * Exit a parse tree produced by `RuleExprParser.jsonPath`.
	 * @param ctx the parse tree
	 */
	exitJsonPath?: (ctx: JsonPathContext) => void;
	/**
	 * Enter a parse tree produced by `RuleExprParser.jsonStep`.
	 * @param ctx the parse tree
	 */
	enterJsonStep?: (ctx: JsonStepContext) => void;
	/**
	 * Exit a parse tree produced by `RuleExprParser.jsonStep`.
	 * @param ctx the parse tree
	 */
	exitJsonStep?: (ctx: JsonStepContext) => void;
}

