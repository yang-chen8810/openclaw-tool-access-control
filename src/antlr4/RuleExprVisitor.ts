// Generated from RuleExpr.g4 by ANTLR 4.13.1

import {ParseTreeVisitor} from 'antlr4';


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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `RuleExprParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class RuleExprVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `RuleExprParser.parse`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParse?: (ctx: ParseContext) => Result;
	/**
	 * Visit a parse tree produced by the `andExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAndExp?: (ctx: AndExpContext) => Result;
	/**
	 * Visit a parse tree produced by the `compExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompExp?: (ctx: CompExpContext) => Result;
	/**
	 * Visit a parse tree produced by the `primaryExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimaryExp?: (ctx: PrimaryExpContext) => Result;
	/**
	 * Visit a parse tree produced by the `parenExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParenExp?: (ctx: ParenExpContext) => Result;
	/**
	 * Visit a parse tree produced by the `orExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOrExp?: (ctx: OrExpContext) => Result;
	/**
	 * Visit a parse tree produced by the `notExp`
	 * labeled alternative in `RuleExprParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNotExp?: (ctx: NotExpContext) => Result;
	/**
	 * Visit a parse tree produced by `RuleExprParser.primary`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimary?: (ctx: PrimaryContext) => Result;
	/**
	 * Visit a parse tree produced by `RuleExprParser.functionCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCall?: (ctx: FunctionCallContext) => Result;
	/**
	 * Visit a parse tree produced by `RuleExprParser.functionArg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionArg?: (ctx: FunctionArgContext) => Result;
	/**
	 * Visit a parse tree produced by `RuleExprParser.literal`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLiteral?: (ctx: LiteralContext) => Result;
	/**
	 * Visit a parse tree produced by `RuleExprParser.array`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArray?: (ctx: ArrayContext) => Result;
	/**
	 * Visit a parse tree produced by `RuleExprParser.attribute`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttribute?: (ctx: AttributeContext) => Result;
	/**
	 * Visit a parse tree produced by `RuleExprParser.jsonPath`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonPath?: (ctx: JsonPathContext) => Result;
	/**
	 * Visit a parse tree produced by `RuleExprParser.jsonStep`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJsonStep?: (ctx: JsonStepContext) => Result;
}

