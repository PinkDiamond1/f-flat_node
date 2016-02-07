# F♭

F♭ (pronounced F-flat) is a toy language.

F♭ is a dynamically typed array-oriented concatenative language like Forth and Joy. F♭ is meant to be used interactively, for example in a CLI REPL, , like R or the command shell, or in a stack based calculator.  This constraint dictates many of the language features.

## Project Goals

* interactive first
  * minimal hidden state
  * easy to type and read
  * reads left to right, top to bottom
  * whitespace not significant syntax
  * no lambdas/parameters
* flat language
* no surprises
  * decimal and complex numbers
  * both double and single quotes
  * returns error objects
* pure functions
* immutable data
* host language interface
* Session saving (TBD)
  * undo/redo
  * state is serializable
* modules and namespaces (TBD)

## Features

* Arbitrary-precision decimal and complex number type.
* Flat functional concatinative language, without unnecessary parentheses.
* JSON format is value f-flat programs. (But not all f-flat programs are JSON).

## Example

```forth
** Welcome to f♭ **

f♭> 0.1 0.2 +
[ 0.3 ]

f♭> 0.3 =
[ true ]

f♭> clr
[]

f♭> -1 sqrt
[ 0+1i ]

f♭> 1 atan 4 *
[ 0+1i, 3.1415926535897932385 ]

f♭> * exp
[ -1-3.7356616720497115803e-20i ]

f♭> abs
[ 1 ]

f♭> clr
[]

f♭> [ 2 swap ^ 1 - prime? ] "mersenne?" def
[]

f♭> 10 integers
[ [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ] ]

f♭> [ mersenne? ] map
[ [ true, true, true, false, true, false, true, false, false, false ] ]

f♭> clr
[]

f♭> 1000 !
[ 4.0238726007709377384e+2567 ]

f♭> clr
[]

f♭> i !
[ 0.49801566811835599106-0.15494982830181068731i ]

f♭> { first: "Manfred" }
[ { first: 'Manfred' } ]

f♭> {
[ { first: 'Manfred' }, Symbol(() ]

f♭>> last:
[ { first: 'Manfred' }, Symbol((), last: ]

f♭>> "von Thun"
[ { first: 'Manfred' }, Symbol((), last:, 'von Thun' ]

f♭>> }
[ { first: 'Manfred' }, { last: 'von Thun' } ]

f♭> +
[ { first: 'Manfred', last: 'von Thun' } ]
```

Why?

* Designing a programming language in another language is a great way to learn about programming languages in general and the host language in particular.

* Concatinative languages, with inherent functional composition, are a great way to explore functional programming and mathematics.  Higher order functions (including math functions) are composed of smaller functions.

* Because 0.1 + 0.2 = 0.3 and sqrt of -1 is not "not a number".

## Influences

* HP RPL
* Forth
* Joy
* Factor
* XY
* Haskell
* JavaScript

## License

MIT
