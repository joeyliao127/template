import { d as defineEventHandler, r as readBody, b as backendFetch, a as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const profile_put = defineEventHandler(async (event) => {
  var _a;
  const session = event.context.session;
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const userId = (_a = session == null ? void 0 : session.user) == null ? void 0 : _a.userId;
  return await backendFetch(`${config.AUTH_API}/users/${userId}/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session == null ? void 0 : session.token}`
    },
    body
  });
});

export { profile_put as default };
//# sourceMappingURL=profile.put.mjs.map
