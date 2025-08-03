import React from 'react';
import user from '@testing-library/user-event';
import {
  waitFor,
  screen,
  render,
  //   waitForElementToBeRemoved,
} from '@testing-library/react';
import { faker } from '@faker-js/faker';

import { AuthContextProvider, ProviderComposer } from 'contexts';

import { ForgotPassword } from 'layouts/authentication/components/ForgotPassword';
import renderWithProviders from 'tests/mock/renderWithProviders';
import { AuthPageType } from 'types';
import { isHasInputValue } from 'tests/jest/utils';

const renderForm = async (setPageType: (pageType: AuthPageType) => void, contextValue?: any) => {
  return renderWithProviders(
    render,
    <ProviderComposer contexts={[<AuthContextProvider key="auth-provider" value={contextValue} />]}>
      <ForgotPassword setPageType={setPageType} />
    </ProviderComposer>
  );
};

const unmockedFetch = global.fetch;
// const mockFetch = jest.spyOn(global, 'fetch');

beforeAll(() => {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve([]),
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

describe('ForgotPassword', () => {
  it('[forgot-1] renders appropriately', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType);

    const emailInputElement = screen.getAllByTestId('forgot-pass-email')[0];
    expect(emailInputElement).toBeTruthy();
  });

  it('[forgot-2] should render working email input', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType);

    const emailInputElement = screen.getAllByTestId('forgot-pass-email')[0];
    expect(emailInputElement).not.toBeUndefined();

    const emailValue = faker.internet.email();
    await user.type(emailInputElement, emailValue);
    expect(isHasInputValue(emailInputElement, emailValue)).toBeTruthy();
  });

  it('[forgot-3] should show error tip with invalid email', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType);
    expect(screen.queryByText('Email is invalid')).toBeFalsy();

    const emailInputElement = screen.getAllByTestId('forgot-pass-email')[0];
    const button = await screen.findByRole('button', { name: 'Send Request' });
    expect(button).toHaveProperty('disabled', true);

    const emailValue = faker.name.firstName();
    await user.type(emailInputElement, emailValue);
    expect(screen.getByText('Email is invalid')).toBeTruthy();
    expect(screen.getByText('Send Request')).toBeTruthy();
    // const buttons = screen.getAllByRole('button');
    // expect(buttons[0]).toHaveProperty('disabled', true)
    expect(button).toHaveProperty('disabled', true);
  });

  it('[forgot-4] should send appropriately', async () => {
    const sendForgotPassword = jest.fn();
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType, { sendForgotPassword });

    // On Load
    expect(screen.queryByText('Email is invalid')).toBeFalsy();
    const emailInputElement = screen.getAllByTestId('forgot-pass-email')[0];
    const button = await screen.findByRole('button');
    expect(sendForgotPassword).not.toBeCalled();

    // User Type Email
    const emailValue = faker.internet.email();
    user.type(emailInputElement, emailValue);

    // User Click
    expect(screen.queryByText('Email is invalid')).toBeFalsy();
    expect(button).toHaveProperty('disabled', false);
    user.click(button);
    expect(sendForgotPassword).toBeCalled();
    // TODO(): Test if API fires
  });

  it('[forgot-5] should render as loading when loading', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType, { isLoadingForgotPasswordRequest: true });

    // On Load
    const button = await screen.findByRole('button');

    // Loader loads
    expect(screen.queryByText('Send Request')).toBeFalsy();
    expect(screen.getAllByTestId('forgot-password-loading-status')[0]).toBeTruthy();
    expect(button).toHaveProperty('disabled', true);
  });

  it('[forgot-6] should render success message on successful response', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType, {
      isForgotPasswordRequestSuccess: true,
      isLoadingForgotPasswordRequest: false,
    });

    // await waitFor(() => {
    //   expect(screen.getByText('Success!')).toBeTruthy();
    // });
    await waitFor(() => {
      expect(
        screen.getByText('If the email was in the system, a request has been sent.')
      ).toBeTruthy();
    });
  });

  it('[forgot-7] should render error message on bad response', async () => {
    const changePageType = (a: string) => console.info(a);
    const errorForgotPassword = { errors: [{ source: 'TEST ERROR!' }] };
    renderForm(changePageType, {
      isLoadingForgotPasswordRequest: false,
      errorForgotPassword,
    });

    await waitFor(() => {
      expect(screen.getByText('TEST ERROR!')).toBeTruthy();
    });
  });
  it('[forgot-8] should render error message on unknown bad response', async () => {
    const changePageType = (a: string) => console.info(a);
    const errorForgotPassword = true;
    renderForm(changePageType, {
      isLoadingForgotPasswordRequest: false,
      errorForgotPassword,
    });

    await waitFor(() => {
      expect(
        screen.getByText('Something went wrong with the password request. Try again later.')
      ).toBeTruthy();
    });
  });
});
