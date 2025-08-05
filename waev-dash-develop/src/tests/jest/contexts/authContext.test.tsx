import { it, expect } from '@jest/globals';

it('Temp Test', async () => {
  expect(true).toBeTruthy();
});

// import { render } from '@testing-library/react';
// import {AuthContext, AuthContextProvider } from 'contexts';
// import {useContext} from hooks;

// const TestingComponent = () => {
//   const { user, isAdmin } = useContext(AuthContext);
//   return (
//     <>
//       <p>{user?.name}</p>
//       <p>{isAdmin?.toString()}</p>
//     </>
//   );
// };

// const regularUser = {
//   name: 'Jhon Doe',
//   /* fields that resolve as not admin */
// };

// const adminUser = {
//   name: 'Jane Doe',
//   /* fields that resolve as admin user */
// };

// describe('<AuthContextProvider />', () => {
//   test('provides expected AuthContext to child elements', () => {
//    [
//      {
//        scenario: 'regular user',
//        user: regularUser,
//        expectedName: 'Jhon Doe',
//        expectedAdmin: 'false',
//      },
//      {
//        scenario: 'admin user',
//        user: adminUser,
//        expectedName: 'Jane Doe',
//        expectedAdmin: 'true',
//      }
//    ].forEach(({ scenario, user, expectedName, expectedAdmin }) => {

//     test(scenario, () => {
//       /* mock the HTTP request */

//       const { getByTestId } = render(
//         <AuthContextProvider>
//           <TestingComponent />
//         </AuthContextProvider>,
//       );

//       const userName = getByTestId('user-name');
//       const isAdminValue = getByTestId('is-admin');
//       expect(userName.textContent).toEqual(expectedName);
//       expect(isAdminValue.textContent).toEqual(expectedAdmin);
//     });

//   });
// });
