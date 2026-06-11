import { d as defineEventHandler, b as backendFetch, a as useRuntimeConfig } from '../../nitro/nitro.mjs';
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

const index_delete = defineEventHandler(async (event) => {
  var _a;
  const session = event.context.session;
  const config = useRuntimeConfig();
  const userId = (_a = session == null ? void 0 : session.user) == null ? void 0 : _a.userId;
  await backendFetch(`${config.AUTH_API}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session == null ? void 0 : session.token}`
    }
  });
  return { success: true };
});

export { index_delete as default };
//# sourceMappingURL=index.delete2.mjs.map
