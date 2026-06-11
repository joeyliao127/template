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

const sent_get = defineEventHandler(async (event) => {
  const session = event.context.session;
  const query = getQuery(event);
  const config = useRuntimeConfig();
  return await backendFetch(`${config.RESOURCE_API}/invitations/sent`, {
    method: "GET",
    headers: { Authorization: `Bearer ${session == null ? void 0 : session.token}` },
    query
  });
});

export { sent_get as default };
//# sourceMappingURL=sent.get.mjs.map
