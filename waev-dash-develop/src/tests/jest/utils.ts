import { screen } from '@testing-library/react';

type TestElement = Document | Element | Window | Node;

export function isHasInputValue (e: TestElement, inputValue: string) {
  return screen.getByDisplayValue(inputValue) === e;
}

// export function isHasInputValue(e: TestElement, inputValue: string) {
//   if (screen.queryByText(inputValue) === e) {
//     return screen.getByDisplayValue(inputValue) === e;
//   }
//   return false;
// }
