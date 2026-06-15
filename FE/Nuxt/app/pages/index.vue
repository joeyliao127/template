<template>
    <div class="space-y-8">
        <!-- Header -->
        <div>
            <p class="t-eyebrow mb-3">{{ $t('pages.index.breadcrumb') }}</p>
            <h1 class="page-title">{{ $t('pages.index.greeting') }}</h1>
        </div>

        <!-- Welcome card -->
        <UCard>
            <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-lg bg-[var(--surface-sunken)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                    <UIcon name="i-lucide-sparkles" class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-lg font-semibold text-[var(--text-primary)]">Hi {{ userInfo?.username || 'there' }}</p>
                    <p class="text-sm text-[var(--text-secondary)]">
                        {{ $t('pages.index.recentNotesDesc') }}
                    </p>
                </div>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
import { useFetch } from '#imports'

definePageMeta({ layout: 'dashboard' })

const { data: userInfo } = useFetch<{
    userId: string
    email: string
    username: string
}>('/api/user/token')
</script>

<style scoped>
.page-title {
    font-size: var(--text-h2);
    letter-spacing: var(--tracking-tight);
}
</style>
