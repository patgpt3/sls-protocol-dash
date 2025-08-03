import {
  QueryFunction,
  UseInfiniteQueryOptions,
  UseQueryOptions,
  useInfiniteQuery,
  // useQueries,
  useQuery,
} from 'react-query';

import { isSampleMode } from 'utils';
// const isSampleMode = false;

// Replaces key with mock key if in mock mode
// Changes key to "trash" if any value is null
export const useStrictQuery = <T, U, V>(
  key: (string | null | boolean)[],
  queryFn: QueryFunction<T>,
  options?: UseQueryOptions<T, U, V>
) => {
  key[0] = `${isSampleMode ? 'Sample-' : ''}${key[0]}`;
  key = key.some((value) => value === null || value === undefined || value === false)
    ? ['trash']
    : key;

  return useQuery<T, U, V>(key, queryFn, options);
};

export const useStrictInfiniteQuery = <T, U, V>(
  key: (string | null | boolean)[],
  queryFn: QueryFunction<T>,
  options?: UseInfiniteQueryOptions<T, U, V, T>
) => {
  key[0] = `${isSampleMode ? 'Sample-' : ''}${key[0]}`;
  key = key.some((value) => value === null || value === undefined || value === false)
    ? ['trash']
    : key;

  return useInfiniteQuery<T, U, V>(key, queryFn, options);
};

export const useSetQueryItem = (queryClient: any, name: string, value: string | null) => {
  queryClient.removeQueries([`--${name}`]);
  queryClient.setQueryData([`--${name}`, value], value);
};
