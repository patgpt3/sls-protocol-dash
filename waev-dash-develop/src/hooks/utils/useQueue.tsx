import { Dispatch, SetStateAction, useState } from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

export function useStringsQueue(
  initialQueue: string[]
): [string[], SetValue<string | string[]>, SetValue<string | string[]>] {
  const [queue, setQueue] = useState<string[]>(initialQueue);

  const addToQueue = (value: string | string[]) => setQueue(queue.concat(value));
  const removeFromQueue = (value: string | string[]) =>
    setQueue(
      (queue || []).filter((stateElement) =>
        typeof value === 'string' ? stateElement !== value : !value.includes(stateElement)
      )
    );
  // @ts-ignore
  return [queue, addToQueue, removeFromQueue];
}

export function useQueue<T>(
  initialQueue: T[]
): [T[], (value: T | T[]) => void, (value: T) => void, (value: T[]) => void] {
  const [queue, setQueue] = useState<T[]>(initialQueue);

  const addToQueue = (value: T | T[]) => setQueue(queue.concat(value));
  const removeFromQueue = (value: T) =>
    // @ts-ignore
    setQueue((queue || []).filter((stateElement) => !value === stateElement));

  return [queue, addToQueue, removeFromQueue, setQueue];
}
