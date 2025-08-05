/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import user from '@testing-library/user-event';
import {
  waitFor,
  screen,
  render,
  fireEvent,
  within,
} from '@testing-library/react';
// import { faker } from '@faker-js/faker';

import { AuthContextProvider, ProviderComposer } from 'contexts';

import { Register } from 'layouts/authentication/components/Register';
import renderWithProviders from 'tests/mock/renderWithProviders';
import { AuthPageType } from 'types';
import { isHasInputValue } from 'tests/jest/utils';

const renderForm = async (setPageType: (pageType: AuthPageType) => void, contextValue?: any) => {
  return renderWithProviders(
    render,
    <ProviderComposer contexts={[<AuthContextProvider key="auth-provider" value={contextValue} />]}>
      {/* <Register setPageType={setPageType} /> */}
      <Register />
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

describe('Register', () => {
  it('[register-1] renders appropriately', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType);

    const firstNameInputElement = screen.getAllByTestId('register-first-name')[0];
    expect(firstNameInputElement).toBeTruthy();
    const lastNameInputElement = screen.getAllByTestId('register-last-name')[0];
    expect(lastNameInputElement).toBeTruthy();
    const emailInputElement = screen.getAllByTestId('register-email')[0];
    expect(emailInputElement).toBeTruthy();
  });

  it('[register-2] should render working inputs', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType);

    const firstNameInputElement = screen.getAllByTestId('register-first-name')[0];
    expect(firstNameInputElement).not.toBeUndefined();
    const lastNameInputElement = screen.getAllByTestId('register-last-name')[0];
    expect(lastNameInputElement).not.toBeUndefined();
    const emailInputElement = screen.getAllByTestId('register-email')[0];
    expect(emailInputElement).not.toBeUndefined();

    const firstName = 'John';
    const lastName = 'Doe';
    const emailValue = 'john.doe@example.com';

    user.type(firstNameInputElement, firstName);
    user.type(lastNameInputElement, lastName);
    user.type(emailInputElement, emailValue);

    expect(isHasInputValue(firstNameInputElement, firstName)).toBeTruthy();
    expect(isHasInputValue(lastNameInputElement, lastName)).toBeTruthy();
    expect(isHasInputValue(emailInputElement, emailValue)).toBeTruthy();
  });

  it('[register-3] should show error tip with invalid email', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType);
    expect(screen.queryByText('Email is invalid')).toBeFalsy();

    const emailInputElement = screen.getAllByTestId('register-email')[0];
    const button = await screen.findByRole('button', { name: 'sign up' });
    expect(button).toHaveProperty('disabled', true);

    const emailValue = 'invalid-email';
    user.type(emailInputElement, emailValue);
    expect(screen.getByText('Email is invalid')).toBeTruthy();
    expect(button).toHaveProperty('disabled', true);
  });

  it('[register-4] should send appropriately', async () => {
    const register = jest.fn();
    const changePageType = (a: string) => console.info(a);
    const { getByTestId } = await renderForm(changePageType, { register });

    const emailInputElement = screen.getAllByTestId('register-email')[0];
    const checkbox = within(getByTestId('register-checkbox')).getByRole('checkbox');
    const button = await screen.findByRole('button', { name: 'sign up' });

    // On Load
    expect(screen.queryByText('Email is invalid')).toBeFalsy();
    expect((checkbox as any).checked).toBe(false);

    // User Type Email
    const emailValue = 'test@example.com';
    user.type(emailInputElement, emailValue);

    // User Click
    fireEvent.click(checkbox);
    expect((checkbox as any).checked).toBe(true);

    // After Both
    expect(button).toHaveProperty('disabled', false);
    fireEvent.click(button);

    expect(register).toBeCalled();
    // // TODO(): Test if API fires
  });

  it('[register-5] should render as loading when loading', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType, { isLoadingRegister: true });

    // On Load
    const button = await screen.findByRole('button');

    // Loader loads
    expect(screen.queryByText('sign up')).toBeFalsy();
    expect(screen.getAllByTestId('register-loading-status')[0]).toBeTruthy();
    expect(button).toHaveProperty('disabled', true);
  });

  it('[register-6] should render success message on successful response', async () => {
    const changePageType = (a: string) => console.info(a);
    renderForm(changePageType, {
      isRegisterSuccess: true,
      isLoadingRegister: false,
    });

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeTruthy();
    });
    await waitFor(() => {
      expect(
        screen.getByText('An email has been sent.')
      ).toBeTruthy();
    });
  });

  it('[register-7] should render error message on bad response', async () => {
    const changePageType = (a: string) => console.info(a);
    const errorRegister = { errors: [{ source: 'TEST ERROR!' }] };
    renderForm(changePageType, {
      isLoadingRegister: false,
      errorRegister,
    });

    await waitFor(() => {
      expect(screen.getByText('TEST ERROR!')).toBeTruthy();
    });
  });
  it('[register-8] should render error message on unknown bad response', async () => {
    const changePageType = (a: string) => console.info(a);
    const errorRegister = true;
    renderForm(changePageType, {
      isLoadingRegister: false,
      errorRegister,
    });

    await waitFor(() => {
      expect(
        screen.getByText('Something went wrong with registration. Try again later.')
      ).toBeTruthy();
    });
  });
});
