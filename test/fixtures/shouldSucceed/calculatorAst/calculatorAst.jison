/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
"("                   return '('
")"                   return ')'
"PI"                  return 'PI'
"E"                   return 'E'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        {return $1;}
    ;

e
    : e '+' e
        {$$ = { nodeType: 'BinaryOperation', operation: '+', left: $1, right: $3 };}
    | e '-' e
        {$$ = { nodeType: 'BinaryOperation', operation: '-', left: $1, right: $3 };}
    | e '*' e
        {$$ = { nodeType: 'BinaryOperation', operation: '*', left: $1, right: $3 };}
    | e '/' e
        {$$ = { nodeType: 'BinaryOperation', operation: '/', left: $1, right: $3 };}
    | e '^' e
        {$$ = { nodeType: 'BinaryOperation', operation: '^', left: $1, right: $3 };}
    | '-' e %prec UMINUS
        {$$ = { nodeType: 'UnaryOperation', operation: '-', right: $2 };}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = { nodeType: 'Number', value: Number(yytext) };}
    | E
        {$$ = { nodeType: 'Number', value: Math.E };}
    | PI
        {$$ = { nodeType: 'Number', value: Math.PI };}
    ;
