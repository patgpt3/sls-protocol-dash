import { rest } from 'msw';
import { ORGANIZATIONS_URL, ORGANIZATION_URL } from 'network';
import { mockOrganizationsResponse, mockNotFoundResponse } from 'tests/mock';
import { mswFormat } from 'tests/utils';

export const handlers = [
  // rest.post('/login', (req, res, ctx) => {
  //   // Persist user's authentication in the session
  //   sessionStorage.setItem('is-authenticated', 'true')
  //   return res(
  //     // Respond with a 200 status code
  //     ctx.status(200),
  //   )
  // }),

  // rest.get('http://localhost:3000/organizations', (req, res, ctx) => {
  rest.get(ORGANIZATIONS_URL, (req, res, ctx) => {
    return res(ctx.json(mockOrganizationsResponse));
  }),

  rest.get(mswFormat(ORGANIZATION_URL), (req, res, ctx) => {
    const { organization_id } = req.params;
    // const isAuthenticated = sessionStorage.getItem('is-authenticated')
    // if (!isAuthenticated) {
    //   // If not authenticated, respond with a 403 error
    //   return res(
    //     ctx.status(403),
    //     ctx.json({
    //       errorMessage: 'Not authorized',
    //     }),
    //   )
    // }
    if (organization_id === 'not_found') {
      return res(ctx.status(404), ctx.json(mockNotFoundResponse));
    }

    return res(ctx.json(mockOrganizationsResponse));
  }),
  // rest.post('/login', (req, res, ctx) => {
  //   const { username } = req.body

  //   return res(
  //     ctx.json({
  //       id: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
  //       username,
  //       firstName: 'John',
  //       lastName: 'Maverick',
  //     })
  //   )
  // }),
];
