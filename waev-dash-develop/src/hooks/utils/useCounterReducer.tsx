import { useReducer } from 'react';

const INITIAL_STATE = 0;

const reducer = (state: number, action: 'increment' | 'decrement' | 'reset'): number => {
  switch (action) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    case 'reset':
      return INITIAL_STATE;
    default:
      return state;
  }
};

const useCounterReducer = (): [number, (action: 'increment' | 'decrement' | 'reset') => void] => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return [state, dispatch];
};

export default useCounterReducer;
