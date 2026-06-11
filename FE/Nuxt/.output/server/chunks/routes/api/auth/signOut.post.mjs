import { d as defineEventHandler, g as getCookie, u as useStorage, a as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const signOut_post = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const sessionId = getCookie(event, config.public.SESSION_COOKIE);
  await useStorage("redis").removeItem(sessionId);
  return { result: true };
});

export { signOut_post as default };
//# sourceMappingURL=signOut.post.mjs.map
