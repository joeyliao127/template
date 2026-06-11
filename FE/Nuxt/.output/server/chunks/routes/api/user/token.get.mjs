import { d as defineEventHandler, b as backendFetch, a as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'ioredis';
import 'node:url';
import '@iconify/utils';
import 'consola';

const token_get = defineEventHandler(async (event) => {
  const session = event.context.session;
  const config = useRuntimeConfig();
  return await backendFetch(`${config.AUTH_API}/users/token`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session == null ? void 0 : session.token}`
    }
  });
});

export { token_get as default };
//# sourceMappingURL=token.get.mjs.map
