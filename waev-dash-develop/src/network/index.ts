import { API_URL as default_API_URL } from './NetworkRoutes';
// import socket from './socket';

export * from './accesses';
export * from './auth';
export * from './organizations';
export * from './records';
export * from './users';
export * from './unions';
export * from './deployments';
export { API_URL } from './NetworkRoutes';

// const API_URL = process.env.API_URL || default_API_URL;
const API_URL = default_API_URL;

interface ApiResource {
  entity: string;
  id?: number;
}

interface RequestParams {
  [K: string]: any;
}

export class Network {
  private url: string;

  constructor() {
    this.url = `${API_URL}`;
  }

  async get(resources: ApiResource[], params?: Object) {
    return this.request(resources, 'GET', params);
  }

  async post(resources: ApiResource[], body?: Object) {
    return this.request(resources, 'POST', body);
  }

  async put(resources: ApiResource[], body?: Object) {
    return this.request(resources, 'PUT', body);
  }

  async patch(resources: ApiResource[], body?: Object) {
    return this.request(resources, 'PATCH', body);
  }

  async delete(resources: ApiResource[]) {
    return this.request(resources, 'DELETE');
  }

  private async request(resources: ApiResource[], method: string, params?: RequestParams) {
    let url = `${this.url}`;
    for (const resource of resources) {
      url = `${url}/${resource.entity}`;
      if (resource.id) {
        url = `${url}/${resource.id}`;
      } else {
        break;
      }
    }

    const options: RequestInit = {
      method,
      // mode: 'cors' as RequestMode,
      mode: 'no-cors' as RequestMode,
      credentials: 'true' as RequestCredentials,
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow' as RequestRedirect,
      referrerPolicy: 'no-referrer' as ReferrerPolicy,
    };

    if (params) {
      if (method.toLowerCase() === 'get') {
        url = `${url}?`;
        for (const key in params) {
          url = `${url}${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
        }
      } else {
        options.body = JSON.stringify(params) as BodyInit;
      }
    }

    // return fetch(url, options).then((result) => {
    //   return Promise.resolve(result);
    // });
    return fetch(url, options);
  }
}
