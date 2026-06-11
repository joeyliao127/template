import { d as defineEventHandler, r as readBody, b as backendFetch, a as useRuntimeConfig } from '../../../../nitro/nitro.mjs';
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

const tags_put = defineEventHandler(async (event) => {
  var _a;
  const session = event.context.session;
  const body = await readBody(event);
  const config = useRuntimeConfig();
  return await backendFetch(`${config.RESOURCE_API}/notes/${(_a = event.context.params) == null ? void 0 : _a.id}/tags`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${session == null ? void 0 : session.token}`
    },
    body
  });
});

export { tags_put as default };
//# sourceMappingURL=tags.put.mjs.map
