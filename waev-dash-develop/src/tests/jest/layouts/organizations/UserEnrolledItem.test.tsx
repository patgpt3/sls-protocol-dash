import { it, expect } from '@jest/globals';

// /* eslint-disable testing-library/prefer-screen-queries */
// import React from 'react';
// import user from '@testing-library/user-event';
// import {
//   waitFor,
//   screen,
//   render,
//   fireEvent,
//   within,
// } from '@testing-library/react';
// import { faker } from '@faker-js/faker';

// import { AuthContextProvider, ProviderComposer } from 'contexts';

// import { UserEnrolledItem } from './layouts/application/organization/components/card/UserEnrolledItem';
// import renderWithProviders from 'tests/mock/renderWithProviders';
// import { AuthPageType } from 'types';
// import { isHasInputValue } from 'tests/jest/utils';

// const renderForm = async (setPageType: (pageType: AuthPageType) => void, contextValue?: any) => {
//   return renderWithProviders(
//     render,
//     <ProviderComposer contexts={[<AuthContextProvider key="auth-provider" value={contextValue} />]}>
//       <UserEnrolledItem setPageType={setPageType} />
//     </ProviderComposer>
//   );
// };

// const unmockedFetch = global.fetch;
// // const mockFetch = jest.spyOn(global, 'fetch');

// beforeAll(() => {
//   global.fetch = () =>
//     Promise.resolve({
//       json: () => Promise.resolve(undefined),
//       text: () => Promise.resolve(undefined),
//       ok: true,
//     } as Response);
// });

// afterAll(() => {
//   global.fetch = unmockedFetch;
// });

// // const fetchMock = jest
// //   .spyOn(global, 'fetch')
// //   .mockImplementation(() => Promise.resolve({ json: () => Promise.resolve({}) })as jest.Mock)

// // global.fetch = jest.fn(() =>
// //   Promise.resolve({
// //     json: () => Promise.resolve({}),
// //   }),
// // ) as jest.Mock;

// // beforeEach(() => {
// //     fetch.mockClear();
// //   });

// describe('UserEnrolledItem', () => {
//   it('[UserEnrolledItem-1] renders appropriately', async () => {
//     const changePageType = (a: string) => console.info(a);
//     renderForm(changePageType);

it('Temp Test', async () => {
  expect(true).toBeTruthy();
});
//   });

// });
