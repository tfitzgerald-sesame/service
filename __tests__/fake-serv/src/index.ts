import { RestApiErrorResponse, RestApiSuccessResponse } from 'rest-api-support';

import type { Service, ServiceLocals } from '../../../src/types';
import { useService } from '../../../src';

export interface FakeServLocals extends ServiceLocals {
  services: {
    fakeServ: {
      get_something(): RestApiSuccessResponse<{ things: string[] }> | RestApiErrorResponse;
    }
  }
}

export function service(): Service<FakeServLocals> {
  const base = useService<FakeServLocals>();
  return {
    ...base,
    async start(app) {
      await base.start(app);
      app.locals.services.fakeServ = {
        get_something() { throw new Error('Should not be called.'); },
      };
    },
    async onRequest(req, res) {
      await base.onRequest?.(req, res);
      res.locals.rawBody = true;
    },
    async healthy(app) {
      await base.healthy?.(app);
      return new Promise((accept) => {
        setTimeout(accept, 1000);
      });
    },
  };
}
