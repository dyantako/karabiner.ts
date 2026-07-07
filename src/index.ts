import {
  writeToProfile,
  rule,
  map,
  toApp,
  ifApp,
  withMapper,
  withModifier,
} from 'karabiner.ts'

const globalWindowsKey = stringToChars('afszxcvtwl');

/**
 * Windows keys for 'c' are excluded for some terminals to allow ctrl+c to kill
 * cmux is excluded because it has this line to enable cmd+c to kill
 * ~/.config/ghostty/config:
 * keybind = cmd+c=text:\x03
 *
 * For everything else, it MUST contextually rebind cmd+c to SIGINT when there is no text selection if possible
 * Note to self, maybe try to just use ctrl+d on mac instead
 */
const terminalBundles = ['com.googlecode.iterm2'];
const browserBundles = ['com.brave.Browser', 'com.google.Chrome'];
const jetbrainsBundles = ['com.jetbrains.rider', 'com.google.android.studio'];

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

  rule('Windows', ifApp(terminalBundles).unless()).manipulators([
    withMapper(globalWindowsKey)((key) =>
      map(key, 'control', 'shift').to(key, 'command'),
    ),
  ]),

  rule('Terminals', ifApp(terminalBundles)).manipulators([
    withMapper(globalWindowsKey.filter(key => key !== 'c'))((key) =>
      // excluding c so that ctrl+c can kill terminal
      // can remove handling if the terminal is manually configured to rebind cmd+c to kill instead
      map(key, 'control', 'shift').to(key, 'command'),
    ),
  ]),

  rule('Screenshotting').manipulators([
    map('f4', 'command').to('4', ['control', 'shift', 'command']),
    map('f5', 'command').to('5', ['shift', 'command']),
  ]),

  rule('Browser', ifApp(browserBundles)).manipulators([
    map('f5').to('r', 'command'),
  ]),

  rule('Slack', ifApp('com.tinyspeck.slackmacgap')).manipulators([
    map('return_or_enter', 'control').to('return_or_enter', 'command'),
  ]),

  rule('Rider (using VSCode MacOS keymap)', ifApp(jetbrainsBundles)).manipulators(
    [
      map('p', 'control', 'shift').to('p', 'command'),
      map('tab', ['control', 'shift']).to('[', ['command', 'shift']),
      map('tab', ['control']).to(']', ['command', 'shift']),
      map('l', ['option', 'shift']).to('k', 'command').to('e'),
      withMapper(stringToChars('/'))((key) =>
        map(key, 'control').to(key, 'command'),
      ),
    ],
  ),
];

writeToProfile('default', rules);

function stringToChars<S extends string>(str: S): StringToChars<S> {
  return str.split('') as StringToChars<S>;
}

// Helper type: Recursively split string literal into tuple of characters
type StringToChars<S extends string> = S extends `${infer First}${infer Rest}`
  ? [First, ...StringToChars<Rest>]
  : [];