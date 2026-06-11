import { d as defineEventHandler, e as getQuery, b as backendFetch, a as useRuntimeConfig } from '../../../../nitro/nitro.mjs';
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

const notes = defineEventHandler(async (event) => {
  var _a;
  const session = event.context.session;
  const query = getQuery(event);
  const notebookId = (_a = event.context.params) == null ? void 0 : _a.id;
  console.log("query", query);
  const config = useRuntimeConfig();
  return await backendFetch(`${config.RESOURCE_API}/notebooks/${notebookId}/notes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session == null ? void 0 : session.token}`
    },
    query
  });
});

export { notes as default };
//# sourceMappingURL=notes.mjs.map
