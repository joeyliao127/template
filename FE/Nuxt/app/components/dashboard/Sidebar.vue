<template>
    <div class="flex flex-col h-full w-full text-content-dim text-sm">
        <!-- ── 頂部：Hi user ──────────────────────────── -->
        <div class="px-4 py-3 mt-2">
            <div class="flex flex-col gap-y-2 justify-center px-4 py-6 bg-[var(--bg-overlay)] rounded">
                <div class="flex justify-center items-center gap-3">
                    <UIcon name="i-lucide-user-circle" class="w-8 h-8 text-content-dim shrink-0" />
                    <p class="text-2xl font-semibold text-content leading-tight">Hi {{ userInfo?.username || username }}</p>
                </div>
                <p class="text-base text-center font-semibold text-content leading-tight">{{ $t('nav.welcomeTo') }} __PROJECT_DISPLAY__ !</p>
            </div>
        </div>

        <!-- ── 導航區塊（剩餘高度） ─────────────────── -->
        <nav class="flex-1 overflow-y-auto border-y border-[var(--glass-border)] py-2 flex flex-col">
            <!-- Setting -->
            <div class="sb-settings-wrap">
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
                        <SettingsTheme v-else-if="section === 'theme'" />
                        <SettingsAccount v-else-if="section === 'account'" />
                    </template>
                </SettingsModal>
            </div>
        </nav>

        <!-- ── 底部：email + 登出 ──────────────────── -->
        <div class="px-4 py-3 flex flex-col gap-2">
            <div class="flex items-center gap-2 px-3 py-2 bg-[var(--surface-hover)] rounded">
                <span class="w-2 h-2 rounded-full bg-primary shrink-0" />
                <span class="text-[0.8rem] text-content-dim overflow-hidden text-ellipsis whitespace-nowrap">
                    {{ userInfo?.email || userEmail }}
                </span>
            </div>
            <UButton block color="primary" icon="i-lucide-log-out" class="font-semibold" @click="onLogout">
                {{ $t('common.signOut') }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth, useFetch } from '#imports'
import SettingsModal from './SettingsModal.vue'
import SettingsTheme from '~/components/settings/SettingsTheme.vue'

const { t } = useI18n()

const props = withDefaults(
    defineProps<{
        settingsSections?: {
            label: string
            value: string
            description?: string
            icon?: string
        }[]
    }>(),
    {
        settingsSections: () => [],
    }
)

const resolvedSections = computed(() =>
    props.settingsSections.length > 0
        ? props.settingsSections
        : [
              { label: t('nav.profile'), value: 'profile', icon: 'i-lucide-user' },
              { label: t('nav.security'), value: 'security', icon: 'i-lucide-shield' },
              { label: t('nav.language'), value: 'language', icon: 'i-lucide-languages' },
              { label: t('nav.theme'), value: 'theme', icon: 'i-lucide-palette' },
              { label: t('nav.account'), value: 'account', icon: 'i-lucide-circle-user' },
          ]
)

const emit = defineEmits<{
    (e: 'logout'): void
}>()

// ── Auth ──────────────────────────────────────────────
const { data, signOut } = useAuth()
const userEmail = computed(() => data.value?.user?.email ?? '')
const username = computed(() => userEmail.value.split('@')[0] ?? 'user')

// ── User info from BFF ────────────────────────────────
const { data: userInfo } = useFetch<{
    userId: string
    email: string
    username: string
}>('/api/user/token')

async function onLogout() {
    emit('logout')
    await signOut({ callbackUrl: '/signIn' })
}

// ── Settings ──────────────────────────────────────────
const settingsOpen = ref(false)
const activeSettings = ref('profile')
</script>

<style scoped>
/* ── SettingsModal trigger (custom component, needs deep) */
.sb-settings-wrap :deep(button) {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    padding: 0.6rem 1.25rem;
    text-align: left;
    color: var(--text-primary);
    background: none;
    border: none;
    border-radius: 0;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 120ms ease;
}

.sb-settings-wrap :deep(button:hover) {
    background: var(--surface-hover);
}
</style>
