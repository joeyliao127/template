import { d as defineEventHandler, r as readBody, b as backendFetch, a as useRuntimeConfig } from '../../nitro/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const session = event.context.session;
  const body = await readBody(event);
  const config = useRuntimeConfig();
  return await backendFetch(`${config.RESOURCE_API}/invitations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session == null ? void 0 : session.token}` },
    body
  });
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
