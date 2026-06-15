<template>
    <div class="auth">
        <!-- Left: ink brand panel -->
        <aside class="auth__brand">
            <span class="wordmark">
                {{ appConfig.WEBSITE_NAME }}<span class="wordmark__dot">.</span>
            </span>

            <div class="auth__pitch">
                <div class="t-eyebrow auth__eyebrow">{{ $t('pages.signIn.eyebrow') }}</div>
                <h1>{{ $t('pages.signIn.headline') }}</h1>
                <p>{{ $t('pages.signIn.pitch') }}</p>
            </div>

            <div class="auth__brandfoot">{{ $t('pages.signIn.footer', { name: appConfig.WEBSITE_NAME }) }}</div>
        </aside>

        <!-- Right: paper form panel -->
        <main class="auth__form">
            <div class="auth__form-inner">
                <!-- Sign In -->
                <template v-if="mode === 'signIn'">
                    <div class="auth__head">
                        <h2>{{ $t('pages.signIn.signInTitle') }}</h2>
                        <p>{{ $t('pages.signIn.welcomeBack') }}</p>
                    </div>

                    <UForm :state="signInState" :schema="signInSchema" class="auth__fields" @submit="onSignIn">
                        <UFormField :label="$t('pages.signIn.email')" name="email">
                            <UInput v-model="signInState.email" type="email" autocomplete="username" placeholder="you@company.com" />
                        </UFormField>

                        <UFormField :label="$t('pages.signIn.password')" name="password">
                            <UInput v-model="signInState.password" type="password" autocomplete="current-password" placeholder="••••••••" />
                        </UFormField>

                        <div class="auth__row">
                            <UCheckbox v-model="rememberMe" :label="$t('pages.signIn.rememberMe')" />
                            <a class="auth__link" href="#" @click.prevent>{{ $t('pages.signIn.forgotPassword') }}</a>
                        </div>

                        <p v-if="authError" class="auth__error">
                            {{ authError }}
                        </p>

                        <UButton type="submit" :loading="isLoading" block class="auth__submit" trailing-icon="i-lucide-arrow-right">
                            {{ $t('pages.signIn.signInBtn') }}
                        </UButton>
                    </UForm>

                    <div class="auth__hint">
                        {{ $t('pages.signIn.demoHint') }} <b>admin@__PROJECT_NAME__.com</b> / <b>admin1234</b>
                    </div>

                    <p class="auth__switch">
                        {{ $t('pages.signIn.noAccount') }}
                        <button class="auth__switch-link" @click="switchMode('signUp')">
                            {{ $t('pages.signIn.register') }}
                        </button>
                    </p>
                </template>

                <!-- Sign Up -->
                <template v-else>
                    <div class="auth__head">
                        <h2>{{ $t('pages.signIn.signUpTitle') }}</h2>
                        <p>{{ $t('pages.signIn.createAccount') }}</p>
                    </div>

                    <UForm :state="signUpState" :schema="signUpSchema" class="auth__fields" @submit="onSignUp">
                        <UFormField :label="$t('pages.signIn.username')" name="username">
                            <UInput v-model="signUpState.username" autocomplete="username" />
                        </UFormField>

                        <UFormField :label="$t('pages.signIn.email')" name="email">
                            <UInput v-model="signUpState.email" type="email" placeholder="you@company.com" />
                        </UFormField>

                        <UFormField :label="$t('pages.signIn.password')" name="password">
                            <UInput v-model="signUpState.password" type="password" autocomplete="new-password" placeholder="••••••••" />
                        </UFormField>

                        <UFormField :label="$t('pages.signIn.confirmPassword')" name="passwordConfirm">
                            <UInput v-model="signUpState.passwordConfirm" type="password" autocomplete="new-password" placeholder="••••••••" />
                        </UFormField>

                        <p v-if="authError" class="auth__error">
                            {{ authError }}
                        </p>

                        <UButton type="submit" :loading="isLoading" block class="auth__submit" trailing-icon="i-lucide-arrow-right">
                            {{ $t('pages.signIn.signUpBtn') }}
                        </UButton>
                    </UForm>

                    <p class="auth__switch">
                        {{ $t('pages.signIn.backTo') }}
                        <button class="auth__switch-link" @click="switchMode('signIn')">
                            {{ $t('pages.signIn.signinLink') }}
                        </button>
                    </p>
                </template>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import { ref, computed, onBeforeMount } from 'vue'
import { navigateTo, useAuth, ValidationMessages } from '#imports'

definePageMeta({ layout: 'default', auth: false })

const { t } = useI18n()
const { signIn, status } = useAuth()
const appConfig = useAppConfig()

const mode = ref<'signIn' | 'signUp'>('signIn')
const isLoading = ref(false)
const authError = ref<string | null>(null)
const rememberMe = ref(true)

// ── Sign In ──────────────────────────────────────────
const signInState = ref({ email: 'admin@__PROJECT_NAME__.com', password: 'admin1234' })

const signInSchema = z.object({
    email: z.email(ValidationMessages.email.invalid),
    password: z.string().nonempty(ValidationMessages.password.required).min(3, ValidationMessages.password.minLength),
})

async function onSignIn() {
    isLoading.value = true
    authError.value = null

    try {
        const result = await signIn(
            {
                email: signInState.value.email,
                password: signInState.value.password,
                redirect: false,
            },
            { callbackUrl: '/' }
        )

        if (result?.error) {
            authError.value = result.error
            return
        }

        await navigateTo('/')
    } catch (error: unknown) {
        const err = error as { data?: { statusMessage?: string }; statusMessage?: string; message?: string }
        authError.value = err?.data?.statusMessage || err?.statusMessage || err?.message || t('common.retryLater')
    } finally {
        isLoading.value = false
    }
}

// ── Sign Up ──────────────────────────────────────────
const signUpState = ref({
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
})

const signUpSchema = computed(() =>
    z
        .object({
            email: z.email(ValidationMessages.email.invalid),
            username: z.string().nonempty(ValidationMessages.username.required),
            password: z.string().nonempty(ValidationMessages.password.required).min(8, ValidationMessages.password.minLength),
            passwordConfirm: z.string().nonempty(ValidationMessages.password.required),
        })
        .refine((d) => d.password === d.passwordConfirm, {
            message: t('pages.signIn.passwordMismatch'),
            path: ['passwordConfirm'],
        })
)

async function onSignUp() {
    isLoading.value = true
    authError.value = null

    try {
        await $fetch('/api/auth/signUp', {
            method: 'POST',
            body: {
                email: signUpState.value.email,
                username: signUpState.value.username,
                password: signUpState.value.password,
            },
        })

        signInState.value = {
            email: signUpState.value.email,
            password: signUpState.value.password,
        }
        mode.value = 'signIn'
        await onSignIn()
    } catch (error: unknown) {
        const err = error as { data?: { message?: string }; message?: string }
        authError.value = err?.data?.message || err?.message || t('pages.signIn.signUpFailed')
    } finally {
        isLoading.value = false
    }
}

// ── Switch ────────────────────────────────────────────
function switchMode(target: 'signIn' | 'signUp') {
    mode.value = target
    authError.value = null
}

// ── Auto-redirect if already logged in ───────────────
onBeforeMount(() => {
    if (status.value === 'authenticated') {
        navigateTo('/')
    }
})
</script>

<style scoped>
/* ── Split layout:左墨黑品牌區 / 右紙白表單 ─────────── */
.auth {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    animation: fade var(--duration-slow) var(--ease-out) both;
}

@keyframes fade {
    from {
        opacity: 0;
        transform: translateY(6px);
    }
    to {
        opacity: 1;
        transform: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .auth {
        animation: none;
    }
}

/* ── Wordmark ───────────────────────────────────────── */
.wordmark {
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-tight);
    font-size: var(--text-h5);
}

.wordmark__dot {
    color: var(--neutral-500);
}

/* ── Brand panel ────────────────────────────────────── */
.auth__brand {
    background: var(--surface-inverse);
    color: var(--text-inverse);
    padding: var(--space-12, 3rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.auth__pitch {
    max-width: 30ch;
}

.auth__eyebrow {
    color: var(--neutral-500);
    margin-bottom: 1rem;
}

.auth__pitch h1 {
    color: var(--text-inverse);
    font-size: var(--text-h1);
    letter-spacing: var(--tracking-tighter);
    margin-bottom: 1rem;
}

.auth__pitch p {
    color: var(--neutral-400);
    font-size: var(--text-body-lg);
}

.auth__brandfoot {
    color: var(--neutral-500);
    font-size: var(--text-caption);
}

/* ── Form panel ─────────────────────────────────────── */
.auth__form {
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: var(--surface-page);
}

.auth__form-inner {
    width: 100%;
    max-width: 360px;
    margin-inline: auto;
}

.auth__head {
    margin-bottom: 2rem;
}

.auth__head h2 {
    font-size: var(--text-h3);
    margin-bottom: 0.5rem;
}

.auth__head p {
    color: var(--text-secondary);
}

.auth__fields {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

/* DS input 高度 40px(Nuxt UI 預設偏矮) */
.auth__fields :deep(input) {
    height: 40px;
    font-size: var(--text-body-sm);
}

.auth__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.auth__link {
    font-size: var(--text-body-sm);
    color: var(--text-secondary);
    text-decoration: none;
}

.auth__link:hover {
    color: var(--text-primary);
}

.auth__error {
    font-size: var(--text-caption);
    color: var(--status-danger);
}

.auth__submit {
    margin-top: 0.5rem;
    height: 40px;
}

/* ── Demo hint(mono,hairline 分隔)──────────────── */
.auth__hint {
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border-subtle);
    font-family: var(--font-mono);
    font-size: var(--text-caption);
    color: var(--text-tertiary);
    line-height: var(--leading-relaxed);
}

.auth__hint b {
    color: var(--text-secondary);
    font-weight: var(--weight-medium);
}

/* ── Mode switch ────────────────────────────────────── */
.auth__switch {
    margin-top: 1.25rem;
    font-size: var(--text-body-sm);
    color: var(--text-secondary);
}

.auth__switch-link {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: var(--text-primary);
    text-decoration: underline;
    text-decoration-color: var(--border-default);
    text-underline-offset: 0.2em;
    cursor: pointer;
}

.auth__switch-link:hover {
    text-decoration-color: var(--text-primary);
}

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 800px) {
    .auth {
        grid-template-columns: 1fr;
    }

    .auth__brand {
        display: none;
    }

    .auth__form {
        min-height: 100vh;
        padding: 1.5rem;
    }
}
</style>
