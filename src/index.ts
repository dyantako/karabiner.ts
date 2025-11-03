import {
  writeToProfile,
  rule,
  map,
  toApp,
  ifApp,
  withMapper,
  withModifier,
} from 'karabiner.ts'

let rules = [
  rule('Text navigation').manipulators([
    withMapper(['left_arrow', 'right_arrow'])((key) =>
      map(key, 'control', 'shift').to(key, 'option'),
    ),
    map('home', '', 'shift').to('left_arrow', 'command'),
    map('end', '', 'shift').to('right_arrow', 'command'),
    map('delete_or_backspace', 'control').to('delete_or_backspace', 'option'),
  ]),

  rule('App launching').manipulators([
    withModifier('command')({
      1: toApp('Slack'),
      2: toApp('Brave Browser'),
      3: toApp('Visual Studio Code'),
    }),
  ]),

  rule('Browser', ifApp(['com.brave.Browser', "com.google.Chrome"])).manipulators([
    map('f5').to('r', 'command'),
    withMapper(stringToChars('twl'))((key) =>
      map(key, 'control', 'shift').to(key, 'command'),
    ),
  ]),

  rule('Slack', ifApp('com.tinyspeck.slackmacgap')).manipulators([
    map('return_or_enter', 'control').to('return_or_enter', 'command'),
  ]),

  rule('Windows').manipulators([
    withMapper(stringToChars('afszxcv'))((key) =>
      map(key, 'control').to(key, 'command'),
    ),
  ]),

  rule('Rider (using MacOS keymap)', ifApp('com.jetbrains.rider')).manipulators(
    [
      map('p', 'control', 'shift').to('p', 'command'),
      withMapper(stringToChars('/'))((key) =>
        map(key, 'control').to(key, 'command'),
      ),
    ],
  ),
]

writeToProfile("default", rules);

function stringToChars<S extends string>(str: S): StringToChars<S> {
  return str.split('') as StringToChars<S>
}

// Helper type: Recursively split string literal into tuple of characters
type StringToChars<S extends string> = S extends `${infer First}${infer Rest}`
  ? [First, ...StringToChars<Rest>]
  : []