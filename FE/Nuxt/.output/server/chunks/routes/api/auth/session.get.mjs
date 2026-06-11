import { d as defineEventHandler, g as getCookie, u as useStorage } from '../../../nitro/nitro.mjs';
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

const SESSION_COOKIE = "ln_auth_session";
const session_get = defineEventHandler(async (event) => {
  const raw = getCookie(event, SESSION_COOKIE);
  const session = await useStorage("redis").getItem(raw || "");
  if (!session) {
    return { user: null, token: null };
  }
  try {
    return typeof session === "string" ? JSON.parse(session) : session;
  } catch {
    return { user: null, token: null };
  }
});

export { session_get as default };
//# sourceMappingURL=session.get.mjs.map
