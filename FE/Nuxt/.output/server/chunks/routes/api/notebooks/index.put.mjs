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

const index_put = defineEventHandler(async (event) => {
  var _a, _b;
  const session = event.context.session;
  const body = await readBody(event);
  console.log("PUT id:", (_a = event.context.params) == null ? void 0 : _a.id);
  const config = useRuntimeConfig();
  return await backendFetch(`${config.RESOURCE_API}/notebooks/${(_b = event.context.params) == null ? void 0 : _b.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session == null ? void 0 : session.token}`
    },
    body
  });
});

export { index_put as default };
//# sourceMappingURL=index.put.mjs.map
