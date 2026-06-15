<template>
    <div>
        <!-- Page head -->
        <div class="page__head">
            <div>
                <div class="page__title-row">
                    <h1 class="page__title">{{ $t('pages.users.title') }}</h1>
                    <UBadge color="neutral" variant="soft">{{ userPage?.count ?? 0 }}</UBadge>
                </div>
                <p class="page__sub">{{ $t('pages.users.subtitle') }}</p>
            </div>
            <UButton icon="i-lucide-plus">{{ $t('pages.users.invite') }}</UButton>
        </div>

        <!-- Toolbar -->
        <div class="toolbar">
            <UInput
                v-model="q"
                type="search"
                leading-icon="i-lucide-search"
                :placeholder="$t('pages.users.searchPlaceholder')"
                class="toolbar__search"
            />
            <UButton color="neutral" variant="outline" icon="i-lucide-sliders-horizontal">
                {{ $t('pages.users.filters') }}
            </UButton>
        </div>

        <!-- Users table -->
        <div class="tbl-wrap">
            <table class="users">
                <thead>
                    <tr>
                        <th>{{ $t('pages.users.colName') }}</th>
                        <th class="col-status">{{ $t('pages.users.colStatus') }}</th>
                        <th class="col-joined">{{ $t('pages.users.colJoined') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers" :key="user.id">
                        <td>
                            <div class="u-cell">
                                <UAvatar :text="initials(user.username)" size="sm" />
                                <div>
                                    <div class="u-name">{{ user.username }}</div>
                                    <div class="u-email">{{ user.email }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="col-status">
                            <UBadge :color="statusMeta[userStatus(user)].color" variant="soft">
                                <span class="badge-dot" />
                                {{ $t(statusMeta[userStatus(user)].labelKey) }}
                            </UBadge>
                        </td>
                        <td class="col-joined">
                            <span class="u-meta">{{ fmtDate(user.createdAt) }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="filteredUsers.length === 0" class="empty">
                {{ $t('pages.users.empty', { q }) }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAsyncData } from '#imports'
import type { User } from '~~/types/User'

definePageMeta({ layout: 'dashboard' })

// ── Data(MVVM:fetch 只走 model)─────────────────────
const { list } = useUser()
const { data: userPage } = await useAsyncData('users', () => list({ page: 1, pageSize: 100 }))

// ── Status(目前資料庫使用者皆為 active;invited / suspended
//    為設計稿定義的狀態,等資料補上後即可點亮)──────────
type UserStatus = 'active' | 'invited' | 'suspended'

const statusMeta: Record<UserStatus, { color: 'success' | 'neutral' | 'error'; labelKey: string }> = {
    active: { color: 'success', labelKey: 'pages.users.statusActive' },
    invited: { color: 'neutral', labelKey: 'pages.users.statusInvited' },
    suspended: { color: 'error', labelKey: 'pages.users.statusSuspended' },
}

function userStatus(_user: User): UserStatus {
    return 'active'
}

// ── Search(client-side 過濾,照設計稿)────────────────
const q = ref('')

const filteredUsers = computed(() => {
    const items = userPage.value?.items ?? []
    const term = q.value.trim().toLowerCase()
    if (!term) return items
    return items.filter((u) => u.username.toLowerCase().includes(term) || u.email.toLowerCase().includes(term))
})

// ── Helpers ───────────────────────────────────────────
function initials(name: string): string {
    const parts = name.trim().split(/\s+/)
    if (parts.length > 1) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
    return name.slice(0, 2).toUpperCase()
}

// ISO 日期取日(deterministic,SSR/CSR 一致;mono 呈現符合設計)
function fmtDate(iso: string): string {
    return iso?.slice(0, 10) ?? '—'
}
</script>

<style scoped>
/* ── Page head ──────────────────────────────────────── */
.page__head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.page__title {
    font-size: var(--text-h2);
    letter-spacing: var(--tracking-tight);
}

.page__title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.page__sub {
    color: var(--text-secondary);
    margin-top: 0.5rem;
}

/* ── Toolbar ────────────────────────────────────────── */
.toolbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.toolbar__search {
    flex: 1;
    max-width: 340px;
}

/* ── Table(照設計稿:邊框圓角容器 + mono thead)────── */
.tbl-wrap {
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg, 8px);
    overflow: clip;
    background: var(--surface-card);
}

table.users {
    width: 100%;
    border-collapse: collapse;
}

.users thead th {
    text-align: left;
    font-family: var(--font-mono);
    font-size: var(--text-micro);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--text-tertiary);
    font-weight: var(--weight-medium);
    padding: 0.75rem 1.25rem;
    background: var(--surface-subtle);
    border-bottom: 1px solid var(--border-subtle);
}

.users tbody td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-subtle);
    vertical-align: middle;
}

.users tbody tr:last-child td {
    border-bottom: none;
}

.users tbody tr {
    transition: background var(--duration-fast) var(--ease-out);
}

.users tbody tr:hover {
    background: var(--surface-subtle);
}

.u-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.u-name {
    font-weight: var(--weight-medium);
}

.u-email {
    color: var(--text-secondary);
    font-size: var(--text-body-sm);
}

.u-meta {
    font-family: var(--font-mono);
    font-size: var(--text-caption);
    color: var(--text-tertiary);
}

.col-status,
.col-joined {
    width: 1%;
    white-space: nowrap;
}

.badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
}

.empty {
    padding: 4rem;
    text-align: center;
    color: var(--text-tertiary);
}

@media (max-width: 720px) {
    .col-joined {
        display: none;
    }
}
</style>
