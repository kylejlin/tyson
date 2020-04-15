/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
"("                   return '('
")"                   return ')'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

%start start

%% /* language grammar */

start
    : optParens EOF
        {return $1;}
    ;

optParens
    : %empty
        {$$=yy.createNodeWithDepth(0);}
    | "(" optParens ")"
        {$$=yy.createNodeWithDepth($2.depth + 1);}
    ;
