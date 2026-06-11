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

const ingest_post = defineEventHandler(async (event) => {
  const session = event.context.session;
  const { noteIds } = await readBody(event);
  const config = useRuntimeConfig();
  const notes = await $fetch(`${config.RESOURCE_API}/notes/batch`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session == null ? void 0 : session.token}` },
    body: { noteIds }
  });
  await backendFetch(`${config.RAG_API}/ingest`, {
    method: "POST",
    body: {
      notes: notes.map((note) => {
        var _a, _b, _c, _d, _e;
        return {
          note_id: note.id,
          user_id: (_a = session == null ? void 0 : session.user) == null ? void 0 : _a.userId,
          notebook_id: note.notebookId,
          title: (_b = note.title) != null ? _b : "",
          question: (_c = note.question) != null ? _c : null,
          content: (_d = note.content) != null ? _d : null,
          keypoint: (_e = note.keypoint) != null ? _e : null
        };
      })
    }
  });
  await Promise.all(
    notes.map(
      (note) => $fetch(`${config.RESOURCE_API}/rag-notes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session == null ? void 0 : session.token}` },
        body: {
          noteId: note.id,
          notebookId: note.notebookId,
          noteUpdatedAt: note.updatedAt
        }
      })
    )
  );
  return { success: true, count: notes.length };
});

export { ingest_post as default };
//# sourceMappingURL=ingest.post.mjs.map
