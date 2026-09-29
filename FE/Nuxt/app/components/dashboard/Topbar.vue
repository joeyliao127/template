<template>
    <header class="topbar">
        <div class="topbar__in">
            <!-- Left: wordmark + quiet nav -->
            <div class="topbar__left">
                <NuxtLink to="/" class="wordmark">
                    {{ appConfig.WEBSITE_NAME }}<span class="wordmark__dot">.</span>
                </NuxtLink>

                <nav class="topbar__nav">
                    <NuxtLink to="/" class="topbar__navlink" exact-active-class="is-active">
                        {{ $t('nav.overview') }}
                    </NuxtLink>
                    <NuxtLink to="/users" class="topbar__navlink" active-class="is-active">
                        {{ $t('nav.users') }}
                    </NuxtLink>
                    <NuxtLink to="/components" class="topbar__navlink" active-class="is-active">
                        {{ $t('nav.components') }}
                    </NuxtLink>
                </nav>
            </div>

            <!-- Right: notifications / settings / user / sign out -->
            <div class="topbar__right">
                <UButton variant="ghost" color="neutral" icon="i-lucide-bell" :aria-label="$t('nav.notification')" class="topbar__bell" />

                <SettingsModal
                    v-model="settingsOpen"
                    :sections="resolvedSections"
                    :active="activeSettings"
                    @change="activeSettings = $event"
                    @close="settingsOpen = false"
                >
                    <template #content="{ section }">
                        <SettingsProfile
                            v-if="section === 'profile'"
                            :username="userInfo?.username ?? ''"
                            :email="userInfo?.email ?? ''"
                            @saved="
                                (name) => {
                                    if (userInfo) userInfo.username = name
                                }
                            "
                        />
                        <SettingsSecurity v-else-if="section === 'security'" />
                        <SettingsLanguage v-else-if="section === 'language'" />
                        <SettingsAccount v-else-if="section === 'account'" />
                    </template>
                </SettingsModal>

                <div class="topbar__user">
                    <span class="topbar__name">{{ userInfo?.email || userEmail }}</span>
                    <UAvatar :text="initials" size="sm" />
                </div>

                <UButton variant="ghost" color="neutral" icon="i-lucide-log-out" :aria-label="$t('common.signOut')" @click="onLogout">
                    <span class="topbar__signout-text">{{ $t('common.signOut') }}</span>
                </UButton>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth, useFetch } from '#imports'
import SettingsModal from './SettingsModal.vue'

const { t } = useI18n()
const appConfig = useAppConfig()

// ── Auth ──────────────────────────────────────────────
const { data, signOut } = useAuth()
const userEmail = computed(() => data.value?.user?.email ?? '')

// ── User info from BFF ────────────────────────────────
const { data: userInfo } = useFetch<{
    userId: string
    email: string
    username: string
}>('/api/user/token')

const initials = computed(() => {
    const name = userInfo.value?.username || userEmail.value.split('@')[0] || 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length > 1) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
    return name.slice(0, 2).toUpperCase()
})

async function onLogout() {
    await signOut({ callbackUrl: '/signIn' })
}

// ── Settings(主題切換待 dark tokens 到位後再加回)──
const settingsOpen = ref(false)
const activeSettings = ref('profile')

const resolvedSections = computed(() => [
    { label: t('nav.profile'), value: 'profile', icon: 'i-lucide-user' },
    { label: t('nav.security'), value: 'security', icon: 'i-lucide-shield' },
    { label: t('nav.language'), value: 'language', icon: 'i-lucide-languages' },
    { label: t('nav.account'), value: 'account', icon: 'i-lucide-circle-user' },
])
</script>

<style scoped>
.topbar {
    height: 64px;
    border-bottom: 1px solid var(--border-subtle);
    background: var(--surface-page);
    position: sticky;
    top: 0;
    z-index: 5;
}

.topbar__in {
    height: 100%;
    max-width: var(--container-lg);
    margin-inline: auto;
    padding-inline: var(--gutter);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.topbar__left {
    display: flex;
    align-items: center;
    gap: 2rem;
    min-width: 0;
}

.wordmark {
    display: inline-flex;
    align-items: baseline;
    gap: 2px;
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-tight);
    font-size: var(--text-h5);
    color: var(--text-primary);
    text-decoration: none;
    white-space: nowrap;
}

.wordmark__dot {
    color: var(--text-tertiary);
}

.topbar__nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.topbar__navlink {
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-md, 6px);
    font-size: var(--text-body-sm);
    font-weight: var(--weight-medium);
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
}

.topbar__navlink:hover {
    color: var(--text-primary);
    background: var(--surface-hover);
}

.topbar__navlink.is-active {
    color: var(--text-primary);
}

.topbar__right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.topbar__user {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-inline: 0.5rem;
    min-width: 0;
}

.topbar__name {
    font-size: var(--text-body-sm);
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (max-width: 720px) {
    .topbar__name,
    .topbar__bell,
    .topbar__signout-text {
        display: none;
    }

    .topbar__left {
        gap: 0.75rem;
    }

    .wordmark {
        min-width: 0;
        overflow: hidden;
    }

    .topbar__user {
        padding-inline: 0.25rem;
    }
}
</style>
