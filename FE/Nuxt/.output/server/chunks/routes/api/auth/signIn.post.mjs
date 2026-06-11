import { d as defineEventHandler, r as readBody, c as createError, u as useStorage, s as setCookie, a as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const signIn_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const email = body == null ? void 0 : body.email;
  const password = body == null ? void 0 : body.password;
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u7F3A\u5C11 email \u6216 password"
    });
  }
  const runtimeConfig = useRuntimeConfig();
  const apiBase = runtimeConfig.AUTH_API;
  try {
    const response = await $fetch(`${apiBase}/users/signIn`, {
      method: "POST",
      body: { email, password }
    });
    if (!(response == null ? void 0 : response.token) || !(response == null ? void 0 : response.userId)) {
      throw createError({
        statusCode: 502,
        statusMessage: "\u5F8C\u7AEF\u767B\u5165\u56DE\u61C9\u4E0D\u5B8C\u6574"
      });
    }
    const session = {
      token: response.token,
      user: {
        userId: response.userId,
        email
      }
    };
    const sessionId = crypto.randomUUID();
    await useStorage("redis").setItem(sessionId, JSON.stringify(session));
    setCookie(event, config.public.SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.COOKIE_SECURE === "true",
      maxAge: 60 * 60 * 24 * 7
      // 7 天
    });
    return session;
  } catch (error) {
    const err = error;
    const statusCode = (_c = (_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.status) != null ? _b : err == null ? void 0 : err.statusCode) != null ? _c : 500;
    const statusMessage = (_f = (_e = (_d = err == null ? void 0 : err.data) == null ? void 0 : _d.message) != null ? _e : err == null ? void 0 : err.statusMessage) != null ? _f : "\u767B\u5165\u5931\u6557\uFF0C\u8ACB\u7A0D\u5F8C\u518D\u8A66";
    throw createError({ statusCode, statusMessage });
  }
});

export { signIn_post as default };
//# sourceMappingURL=signIn.post.mjs.map
