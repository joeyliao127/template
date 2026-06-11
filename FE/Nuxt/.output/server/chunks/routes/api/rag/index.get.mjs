import { d as defineEventHandler, e as getQuery, a as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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
  const session = event.context.session;
  const { notebookId } = getQuery(event);
  const config = useRuntimeConfig();
  const authHeader = { Authorization: `Bearer ${session == null ? void 0 : session.token}` };
  const ragNotes = await $fetch(`${config.RESOURCE_API}/rag-notes`, {
    headers: authHeader,
    query: notebookId ? { notebookId } : {}
  });
  if (!ragNotes.length) return [];
  const notebookIds = [...new Set(ragNotes.map((rn) => rn.notebookId).filter(Boolean))];
  const noteMap = /* @__PURE__ */ new Map();
  await Promise.all(
    notebookIds.map(async (nbId) => {
      var _a;
      try {
        const res = await $fetch(`${config.RESOURCE_API}/notebooks/${nbId}/notes`, {
          headers: authHeader,
          query: { pageSize: 200 }
        });
        for (const note of (_a = res.items) != null ? _a : []) {
          noteMap.set(note.id, note);
        }
      } catch {
      }
    })
  );
  return ragNotes.map((rn) => {
    const note = noteMap.get(rn.noteId);
    if (!note) {
      return { ...rn, noteTitle: null, status: "deleted", behindDays: 0 };
    }
    const diffMs = new Date(note.updatedAt).getTime() - new Date(rn.noteUpdatedAt).getTime();
    const isOutdated = diffMs > 0;
    return {
      ...rn,
      noteTitle: note.title,
      noteUpdatedAt: note.updatedAt,
      ragUpdatedAt: rn.noteUpdatedAt,
      status: isOutdated ? "outdated" : "up_to_date",
      behindDays: isOutdated ? Math.ceil(diffMs / (1e3 * 60 * 60 * 24)) : 0
    };
  });
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
