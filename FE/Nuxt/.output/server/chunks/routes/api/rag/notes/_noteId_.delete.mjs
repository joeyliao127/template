import { d as defineEventHandler, h as getRouterParam, b as backendFetch, a as useRuntimeConfig } from '../../../../nitro/nitro.mjs';
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

const _noteId__delete = defineEventHandler(async (event) => {
  var _a;
  const session = event.context.session;
  const noteId = getRouterParam(event, "noteId");
  const config = useRuntimeConfig();
  await backendFetch(`${config.RAG_API}/notes/${noteId}`, {
    method: "DELETE",
    body: { user_id: (_a = session == null ? void 0 : session.user) == null ? void 0 : _a.userId }
  });
  await backendFetch(`${config.RESOURCE_API}/rag-notes/${noteId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session == null ? void 0 : session.token}` }
  });
  return { deleted: true, noteId };
});

export { _noteId__delete as default };
//# sourceMappingURL=_noteId_.delete.mjs.map
