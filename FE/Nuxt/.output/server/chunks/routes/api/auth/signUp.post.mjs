import { d as defineEventHandler, r as readBody, c as createError, b as backendFetch, a as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const signUp_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const email = body == null ? void 0 : body.email;
  const password = body == null ? void 0 : body.password;
  const username = body == null ? void 0 : body.username;
  if (!email || !password || !username) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u7F3A\u5C11 email\u3001password \u6216 username"
    });
  }
  const runtimeConfig = useRuntimeConfig();
  const apiBase = runtimeConfig.AUTH_API;
  try {
    await backendFetch(`${apiBase}/users/signUp`, {
      method: "POST",
      body: { email, password, username }
    });
    return { result: true, message: "\u8A3B\u518A\u6210\u529F" };
  } catch (error) {
    const err = error;
    const statusCode = ((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.status) || (err == null ? void 0 : err.statusCode) || 500;
    const statusMessage = ((_b = err == null ? void 0 : err.data) == null ? void 0 : _b.message) || (err == null ? void 0 : err.message) || "\u8A3B\u518A\u5931\u6557\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66";
    throw createError({
      statusCode,
      statusMessage
    });
  }
});

export { signUp_post as default };
//# sourceMappingURL=signUp.post.mjs.map
