/* description: Parses end executes mathematical expressions. */

%{
    function createNodeWithDepth (depth:number): number {
      return depth;
    }
%}

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
        {$$=createNodeWithDepth(0);}
    | "(" optParens ")"
        {$$=createNodeWithDepth(1 + $2);}
    ;
