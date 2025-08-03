import { ResponseDeployment, ResponseDeployments } from 'types';

export const mockDeploymentsResponse: ResponseDeployments = {
  data: [
    {
      type: 'deployments',
      attributes: {
        config: {
          fields: [
            {
              name: 'f1',
              required: false,
              opt_in: null,
            },
          ],
          private_fields: [
            {
              name: 'p1',
              required: false,
              opt_in: null,
            },
          ],
          user_field: 'p1',
        },
        name: 'Mock Deployment',
        fingerprint: '',
      },
      relationships: {
        organization: {
          links: {
            self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/relationships/organizations',
            related: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c',
          },
          data: [
            {
              type: 'organizations',
              id: '134a2ab5-4208-48c2-83aa-bc0ea86cfdf5',
            },
          ],
        },
        accesses: {
          links: {
            self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/relationships/accesses',
            related: '/accesses?id=f2ab970a-b76c-4e73-abb1-60329a5cc63c',
          },
        },
        permissions: {
          links: {
            related: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/permissions',
          },
          data: [
            {
              type: 'permissions',
              id: '3b369e87-1bc9-4af2-bf90-644b5744e00b',
            },
          ],
        },
      },
      id: 'f2ab970a-b76c-4e73-abb1-60329a5cc63c',
      links: {
        self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c',
      },
    },
  ],

  included: [
    {
      type: 'permissions',
      attributes: {
        deployment_id: 'f2ab970a-b76c-4e73-abb1-60329a5cc63c',
        pending: false,
        user_id: 'mike+read@waevdata.com',
        permissions: {
          owner: false,
          admin: false,
          read: true,
          write: false,
          delete: false,
        },
        fingerprint: '',
      },
      id: '3b369e87-1bc9-4af2-bf90-644b5744e00b',
      links: {
        self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/permissions/3b369e87-1bc9-4af2-bf90-644b5744e00b',
      },
    },
  ],
  meta: {
    count: 1,
  },
  fingerprint: '75ba4bc9b9257f2eb2b82ce2c9df511cb3de9f53',
  jsonapi: {
    version: '1.0',
  },
};

export const mockDeploymentResponse: ResponseDeployment = {
  data: {
    type: 'deployments',
    attributes: {
      config: {
        fields: [
          {
            name: 'f1',
            required: false,
            opt_in: null,
          },
        ],
        private_fields: [
          {
            name: 'p1',
            required: false,
            opt_in: null,
          },
        ],
        user_field: 'p1',
      },
      name: 'Mock Deployment',
      fingerprint: '',
    },
    relationships: {
      organization: {
        links: {
          self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/relationships/organizations',
          related: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c',
        },
        data: {
          type: 'organizations',
          id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
        },
      },
      accesses: {
        links: {
          self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/relationships/accesses',
          related: '/accesses?id=f2ab970a-b76c-4e73-abb1-60329a5cc63c',
        },
      },
      permissions: {
        links: {
          related: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c/permissions',
        },
        data: [],
      },
    },
    id: 'f2ab970a-b76c-4e73-abb1-60329a5cc63c',
    links: {
      self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c',
    },
  },
  links: {
    self: '/deployments/f2ab970a-b76c-4e73-abb1-60329a5cc63c',
  },
  included: [
    {
      type: 'organizations',
      relationships: {
        permissions: {
          links: {
            related: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/permissions',
          },
          data: [
            {
              type: 'permissions',
              id: '9d39a5c4-134f-40be-9ae3-d973969f5fff',
            },
          ],
        },
        deployments: {
          links: {
            self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2/relationships/deployments',
            related: '/deployments?id=b7df77fe-3273-49a2-bb27-3f32bf0666a2',
          },
        },
      },
      id: 'b7df77fe-3273-49a2-bb27-3f32bf0666a2',
      attributes: {
        name: 'Mock Organization',
        fingerprint: '',
      },
      links: {
        self: '/organizations/b7df77fe-3273-49a2-bb27-3f32bf0666a2',
      },
    },
  ],
  fingerprint: '75ba4bc9b9257f2eb2b82ce2c9df511cb3de9f53',
  jsonapi: {
    version: '1.0',
  },
};
