import { d as defineEventHandler, e as getQuery, b as backendFetch, a as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  var _a;
  const session = event.context.session;
  const query = getQuery(event);
  const config = useRuntimeConfig();
  return await backendFetch(`${config.RESOURCE_API}/notebooks/${(_a = event.context.params) == null ? void 0 : _a.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session == null ? void 0 : session.token}`
    },
    query
  });
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
