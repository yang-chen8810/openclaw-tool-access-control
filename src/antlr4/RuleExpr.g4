grammar RuleExpr;

// --- Parser Rules ---
parse
    : expression EOF
    ;

expression
    : primary                           # primaryExp
    | '(' expression ')'                # parenExp
    | 'not' expression                  # notExp
    | left=expression op=('<' | '<=' | '>' | '>=' | '==' | '!=' 
        | 'contain' | 'not_contain' | 'match' | 'not_match' 
        | 'start_with' | 'not_start_with' | 'in' | 'not_in' | 'like' | 'not_like') right=expression # compExp
    | left=expression op='and' right=expression # andExp
    | left=expression op='or' right=expression  # orExp
    ;

primary
    : literal
    | attribute
    | functionCall
    ;

functionCall
    : IDENTIFIER '(' (functionArg (',' functionArg)*)? ')'
    ;

functionArg
    : literal
    | attribute
    ;

literal
    : LONG_LITERAL
    | DOUBLE_LITERAL
    | STRING_LITERAL
    | BOOLEAN_LITERAL
    | DATE_LITERAL
    | DATETIME_LITERAL
    | array
    ;

array
    : '[' literal (',' literal)* ']'
    | '[' ']'
    ;

attribute
    : jsonPath
    ;

jsonPath
    : IDENTIFIER jsonStep*
    ;

jsonStep
    : '.' IDENTIFIER
    | '[' LONG_LITERAL ']'
    | '[' STRING_LITERAL ']'
    ;

// --- Lexer Rules ---

// Keywords
AND: 'and';
OR: 'or';
NOT: 'not';
CONTAIN: 'contain';
NOT_CONTAIN: 'not_contain';
MATCH: 'match';
NOT_MATCH: 'not_match';
START_WITH: 'start_with';
NOT_START_WITH: 'not_start_with';
IN: 'in';
NOT_IN: 'not_in';
LIKE: 'like';
NOT_LIKE: 'not_like';

BOOLEAN_LITERAL: 'true' | 'false';

// Literals
DATETIME_LITERAL
    : [0-9]+ '/' [0-9]+ '/' [0-9][0-9][0-9][0-9] ('T' | ' ') [0-9][0-9]? ':' [0-9][0-9] (':' [0-9][0-9])? ('Z' | ('+'|'-') [0-9][0-9]? ':' [0-9][0-9])?
    ;

DATE_LITERAL
    : [0-9]+ '/' [0-9]+ '/' [0-9][0-9][0-9][0-9]
    ;

DOUBLE_LITERAL
    : '-'? [0-9]+ '.' [0-9]+
    ;

LONG_LITERAL
    : '-'? [0-9]+
    ;

STRING_LITERAL
    : '"' (~["\r\n] | '\\"')* '"'
    | '\'' (~['\r\n] | '\\\'')* '\''
    ;

IDENTIFIER
    : [a-zA-Z_] [a-zA-Z0-9_]*
    ;

WS
    : [ \t\r\n]+ -> skip
    ;
