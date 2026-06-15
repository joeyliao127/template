<template>
    <div>
        <!-- Page head -->
        <div class="page__head">
            <div>
                <p class="t-eyebrow mb-3">Design system</p>
                <h1 class="page__title">{{ $t('pages.components.title') }}</h1>
                <p class="page__sub">{{ $t('pages.components.subtitle') }}</p>
            </div>
        </div>

        <!-- ── Buttons ─────────────────────────────────── -->
        <section class="demo">
            <h2 class="t-eyebrow demo__label">Buttons · Variants</h2>
            <div class="demo__row">
                <UButton>Primary</UButton>
                <UButton color="neutral" variant="outline">Secondary</UButton>
                <UButton color="neutral" variant="ghost">Ghost</UButton>
                <UButton color="neutral" variant="link">Link</UButton>
                <UButton color="error">Danger</UButton>
            </div>

            <h2 class="t-eyebrow demo__label">Buttons · Sizes</h2>
            <div class="demo__row">
                <UButton size="xs">Extra small</UButton>
                <UButton size="sm">Small</UButton>
                <UButton size="md">Medium</UButton>
                <UButton size="lg">Large</UButton>
                <UButton size="xl">Extra large</UButton>
            </div>

            <h2 class="t-eyebrow demo__label">Buttons · Icons & states</h2>
            <div class="demo__row">
                <UButton icon="i-lucide-plus">Create project</UButton>
                <UButton color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">Read the docs</UButton>
                <UButton color="neutral" variant="outline" icon="i-lucide-settings-2" aria-label="Settings" />
                <UButton color="neutral" variant="ghost" icon="i-lucide-bell" aria-label="Notifications" />
                <UButton loading>Saving…</UButton>
                <UButton disabled>Disabled</UButton>
            </div>

            <div class="demo__block">
                <UButton block trailing-icon="i-lucide-arrow-right">Continue</UButton>
            </div>
        </section>

        <!-- ── Form inputs ─────────────────────────────── -->
        <section class="demo">
            <h2 class="t-eyebrow demo__label">Form · Inputs</h2>
            <div class="demo__grid">
                <UFormField label="Email" hint="We'll never share it.">
                    <UInput v-model="email" type="email" placeholder="you@company.com" />
                </UFormField>

                <UFormField label="Search">
                    <UInput v-model="search" leading-icon="i-lucide-search" placeholder="Search name or email…" />
                </UFormField>

                <UFormField label="Workspace name" error="This name is already taken.">
                    <UInput model-value="acme" />
                </UFormField>

                <UFormField label="Disabled">
                    <UInput model-value="Read only" disabled />
                </UFormField>

                <UFormField label="Role">
                    <USelect v-model="role" :items="roles" placeholder="Select role" class="w-full" />
                </UFormField>

                <UFormField label="Notes" hint="Markdown is supported.">
                    <UTextarea v-model="notes" placeholder="Say less, leave room." :rows="3" />
                </UFormField>
            </div>
        </section>

        <!-- ── Selection controls ──────────────────────── -->
        <section class="demo">
            <h2 class="t-eyebrow demo__label">Form · Selection</h2>
            <div class="demo__row demo__row--loose">
                <UCheckbox v-model="agreed" label="Remember me" />
                <USwitch v-model="enabled" label="Email notifications" />
                <URadioGroup v-model="plan" orientation="horizontal" :items="plans" />
            </div>
        </section>

        <!-- ── Badges & avatars ────────────────────────── -->
        <section class="demo">
            <h2 class="t-eyebrow demo__label">Badges</h2>
            <div class="demo__row">
                <UBadge color="neutral" variant="soft">Default</UBadge>
                <UBadge color="neutral" variant="solid">Solid</UBadge>
                <UBadge color="neutral" variant="outline">Outline</UBadge>
                <UBadge color="success" variant="soft"><span class="badge-dot" />Active</UBadge>
                <UBadge color="warning" variant="soft"><span class="badge-dot" />Pending</UBadge>
                <UBadge color="error" variant="soft"><span class="badge-dot" />Suspended</UBadge>
                <UBadge color="info" variant="soft"><span class="badge-dot" />Beta</UBadge>
            </div>

            <h2 class="t-eyebrow demo__label">Avatars</h2>
            <div class="demo__row">
                <UAvatar text="AL" size="xs" />
                <UAvatar text="AL" size="sm" />
                <UAvatar text="AL" size="md" />
                <UAvatar text="AL" size="lg" />
                <UAvatar text="AL" size="xl" />
            </div>
        </section>

        <!-- ── Card ────────────────────────────────────── -->
        <section class="demo">
            <h2 class="t-eyebrow demo__label">Card</h2>
            <div class="demo__grid">
                <UCard :ui="{ footer: 'bg-[var(--surface-subtle)]' }">
                    <template #header>
                        <p class="font-semibold">Invite your team</p>
                    </template>
                    <p class="text-sm text-[var(--text-secondary)]">
                        Cards are bordered, not shadowed. Hover styles lift the border and add a soft shadow only when the card is interactive.
                    </p>
                    <template #footer>
                        <div class="flex justify-end gap-2">
                            <UButton color="neutral" variant="ghost" size="sm">Cancel</UButton>
                            <UButton size="sm">Invite people</UButton>
                        </div>
                    </template>
                </UCard>

                <UCard>
                    <div class="flex items-center gap-4">
                        <UAvatar text="AL" size="lg" />
                        <div>
                            <p class="font-medium">Ava Lin</p>
                            <p class="text-sm text-[var(--text-secondary)]">ava@template.co</p>
                        </div>
                        <UBadge color="success" variant="soft" class="ms-auto"><span class="badge-dot" />Active</UBadge>
                    </div>
                </UCard>
            </div>
        </section>

        <!-- ── Feedback ────────────────────────────────── -->
        <section class="demo">
            <h2 class="t-eyebrow demo__label">Feedback · Modal / Toast / Tooltip</h2>
            <div class="demo__row">
                <UModal title="Invite people" description="Send an invitation by email.">
                    <UButton color="neutral" variant="outline">Open modal</UButton>
                    <template #body>
                        <UFormField label="Email">
                            <UInput placeholder="you@company.com" />
                        </UFormField>
                    </template>
                    <template #footer="{ close }">
                        <div class="flex w-full justify-end gap-2">
                            <UButton color="neutral" variant="ghost" @click="close">Cancel</UButton>
                            <UButton @click="close">Send invite</UButton>
                        </div>
                    </template>
                </UModal>

                <UButton color="neutral" variant="outline" @click="showToast('success')">Success toast</UButton>
                <UButton color="neutral" variant="outline" @click="showToast('error')">Error toast</UButton>
                <UButton color="neutral" variant="outline" @click="showToast('info')">Info toast</UButton>

                <UTooltip text="Quiet, like everything here.">
                    <UButton color="neutral" variant="ghost">Hover me</UButton>
                </UTooltip>
            </div>
        </section>

        <!-- ── Tabs ────────────────────────────────────── -->
        <section class="demo">
            <h2 class="t-eyebrow demo__label">Tabs</h2>
            <UTabs :items="tabs" variant="link" :content="false" class="max-w-md" />
        </section>

        <!-- ── Typography ──────────────────────────────── -->
        <section class="demo">
            <h2 class="t-eyebrow demo__label">Typography</h2>
            <div class="type-specimen">
                <div class="type-row">
                    <span class="type-meta">h1 · 36–52</span>
                    <p class="type-sample" style="font-size: var(--text-h1)">Design, quietly.</p>
                </div>
                <div class="type-row">
                    <span class="type-meta">h2 · 36</span>
                    <p class="type-sample" style="font-size: var(--text-h2)">Say less, leave room.</p>
                </div>
                <div class="type-row">
                    <span class="type-meta">h3 · 28</span>
                    <p class="type-sample" style="font-size: var(--text-h3)">A starting skeleton</p>
                </div>
                <div class="type-row">
                    <span class="type-meta">h4 · 22</span>
                    <p class="type-sample" style="font-size: var(--text-h4)">Borders do the work</p>
                </div>
                <div class="type-row">
                    <span class="type-meta">body · 16</span>
                    <p class="type-body">Whitespace is a feature. Sections breathe, content sits in a centered container, and nothing fills space for its own sake.</p>
                </div>
                <div class="type-row">
                    <span class="type-meta">body-sm · 14</span>
                    <p class="type-body" style="font-size: var(--text-body-sm)">Secondary copy uses the grey ramp — never pure black at small sizes.</p>
                </div>
                <div class="type-row">
                    <span class="type-meta">eyebrow · mono</span>
                    <p class="t-eyebrow">Workspace · Console</p>
                </div>
                <div class="type-row">
                    <span class="type-meta">mono · 13</span>
                    <p class="type-mono">admin@template.co · 2026-06-11 · v1.0.0</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({ layout: 'dashboard' })

// ── Form demo state ───────────────────────────────────
const email = ref('')
const search = ref('')
const notes = ref('')
const role = ref<string | undefined>(undefined)
const roles = ['Admin', 'Member', 'Viewer']

const agreed = ref(true)
const enabled = ref(true)
const plan = ref('Monthly')
const plans = ['Monthly', 'Annual']

const tabs = [
    { label: 'Overview', icon: 'i-lucide-layout-dashboard' },
    { label: 'Members', icon: 'i-lucide-users' },
    { label: 'Billing', icon: 'i-lucide-credit-card' },
]

// ── Toast demo ────────────────────────────────────────
const toast = useToast()

function showToast(kind: 'success' | 'error' | 'info') {
    const meta = {
        success: { title: 'Profile updated', description: 'Your changes have been saved.' },
        error: { title: 'Something went wrong', description: 'Please try again later.' },
        info: { title: 'Heads up', description: 'A new version is available.' },
    }[kind]
    toast.add({ ...meta, color: kind })
}
</script>

<style scoped>
/* ── Page head(與 users.vue 同款)────────────────── */
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

.page__sub {
    color: var(--text-secondary);
    margin-top: 0.5rem;
}

/* ── Demo sections(hairline 分隔,大量留白)──────── */
.demo {
    padding-block: 2.5rem;
    border-top: 1px solid var(--border-subtle);
}

.demo__label {
    display: block;
    margin-bottom: 1.25rem;
}

.demo__label:not(:first-child) {
    margin-top: 2rem;
}

.demo__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
}

.demo__row--loose {
    gap: 2.5rem;
}

.demo__block {
    max-width: 360px;
    margin-top: 2rem;
}

.demo__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    align-items: start;
}

/* ── Badge dot(與 users.vue 同款)────────────────── */
.badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
}

/* ── Type specimen ────────────────────────────────── */
.type-specimen {
    display: flex;
    flex-direction: column;
}

.type-row {
    display: flex;
    align-items: baseline;
    gap: 2rem;
    padding-block: 1rem;
}

.type-row + .type-row {
    border-top: 1px solid var(--border-subtle);
}

.type-meta {
    flex: none;
    width: 8rem;
    font-family: var(--font-mono);
    font-size: var(--text-micro);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--text-tertiary);
}

.type-sample {
    font-weight: var(--weight-semibold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
}

.type-body {
    color: var(--text-secondary);
    max-width: 56ch;
}

.type-mono {
    font-family: var(--font-mono);
    font-size: var(--text-caption);
    color: var(--text-tertiary);
}

@media (max-width: 640px) {
    .type-row {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
