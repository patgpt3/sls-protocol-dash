/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import user from '@testing-library/user-event';
import {
  // waitFor,
  screen,
  render,
  fireEvent,
  //  within
} from '@testing-library/react';
// import { faker } from '@faker-js/faker';

import { AuthContextProvider, ProviderComposer } from 'contexts';

import { SignIn } from 'layouts/authentication/components/SignIn';
import renderWithProviders from 'tests/mock/renderWithProviders';
import { AuthPageType } from 'types';
import { isHasInputValue } from 'tests/jest/utils';

const renderForm = async (setPageType: (pageType: AuthPageType) => void, contextValue?: any) => {
  return renderWithProviders(
    render,
    <ProviderComposer contexts={[<AuthContextProvider key="auth-provider" value={contextValue} />]}>
      <SignIn setPageType={setPageType} />
    </ProviderComposer>
  );
};

const unmockedFetch = global.fetch;
// const mockFetch = jest.spyOn(global, 'fetch');

beforeAll(() => {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve(undefined),
      text: () => Promise.resolve(undefined),
      ok: true,
    } as Response);
});

afterAll(() => {
  global.fetch = unmockedFetch;
});

// const fetchMock = jest
//   .spyOn(global, 'fetch')
//   .mockImplementation(() => Promise.resolve({ json: () => Promise.resolve({}) })as jest.Mock)

// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//   }),
// ) as jest.Mock;

// beforeEach(() => {
//     fetch.mockClear();
//   });

describe('SignIn', () => {
  it('[sign-in-1] renders appropriately', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType);

    const emailInputElement = screen.getAllByTestId('sign-in-email-input')[0];
    expect(emailInputElement).toBeTruthy();
  });

  it('[sign-in-2] should render working inputs', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType);

    const emailInputElement = screen.getAllByTestId('sign-in-email-input')[0];
    expect(emailInputElement).not.toBeUndefined();
    const totpInputElement = screen.getAllByTestId('totp-input')[0];
    expect(totpInputElement).not.toBeUndefined();

    const emailValue = 'test@example.com';

    user.type(emailInputElement, emailValue);

    expect(isHasInputValue(emailInputElement, emailValue)).toBeTruthy();
  });
  it('[sign-in-3] TOTP accepts proper keys', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType);

    const totpInputElement = screen.getAllByTestId('totp-input')[0];
    expect(totpInputElement).not.toBeUndefined();

    const totpBadValue = 'invalid';

    // The input doesn't change.
    fireEvent.change(totpInputElement, { target: { value: totpBadValue } });

    // @ts-ignore
    expect(totpInputElement.value).toEqual('_ _ _  _ _ _');

    // TODO(): We need to make a function that looks for an element, and tests that the value is NOT a specific value.
    const totpGoodValueZero = 0;
    // The input changes to a number.
    fireEvent.change(totpInputElement, { target: { value: totpGoodValueZero } });

    // @ts-ignore
    expect(totpInputElement.value).toEqual('0 _ _  _ _ _');

    const totpGoodValue = 123456;
    fireEvent.change(totpInputElement, { target: { value: totpGoodValue } });

    // @ts-ignore
    expect(totpInputElement.value).toEqual('1 2 3  4 5 6');
  });

  // it('[sign-in-3] should show error tip with invalid email', async () => {
  //   const changePageType = (a: string) => console.info(a);
  //   renderForm(changePageType);
  //   expect(screen.queryByText('Email is invalid')).toBeFalsy();

  //   const emailInputElement = screen.getAllByTestId('sign-in-email-input')[0];
  //   const button = await screen.findByRole('button', { name: 'sign up' });
  //   expect(button).toHaveProperty('disabled', true);

  //   const emailValue = faker.name.firstName();
  //   user.type(emailInputElement, emailValue);
  //   expect(screen.getByText('Email is invalid')).toBeTruthy();
  //   expect(button).toHaveProperty('disabled', true);
  // });

  it('[sign-in-4] should send appropriately', async () => {
    const login = jest.fn();
    // const totp = '000000'
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType, { login });

    const emailInputElement = screen.getAllByTestId('sign-in-email-input')[0];
    const totpInputElement = screen.getAllByTestId('totp-input')[0];

    // On Load
    expect(screen.queryByText('Email is invalid')).toBeFalsy();

    // User Type Email
    const emailValue = 'test@example.com';
    user.type(emailInputElement, emailValue);

    expect(login).not.toBeCalled();
    // User Type TOTP
    fireEvent.change(totpInputElement, { target: { value: 999999 } });
    // @ts-ignore
    // console.info('---- xx totpInputElement:', totpInputElement.value);
    // After Both
    expect(login).toBeCalled();
  });

  // it('[sign-in-5] should render as loading when loading', async () => {
  //   const changePageType = (a: string) => console.info(a);
  //   renderForm(changePageType, { isLoadingSignIn: true });

  //   // On Load
  //   const button = await screen.findByRole('button');

  //   // Loader loads
  //   expect(screen.queryByText('sign up')).toBeFalsy();
  //   expect(screen.getAllByTestId('sign-in-loading-status')[0]).toBeTruthy();
  //   expect(button).toHaveProperty('disabled', true);
  // });

  // it('[sign-in-7] should render error message on bad response', async () => {
  //   expect(screen.queryByText('There was a problem signing in.')).toBeFalsy();
  //   const changePageType = (a: string) => console.info(a);
  //   const errorLogin = { errors: [{ source: 'TEST ERROR!' }] };
  //   renderForm(changePageType, {
  //     isLoadingSignIn: false,
  //     errorLogin,
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText('There was a problem signing in.')).toBeTruthy();
  //   });
  // });
});
