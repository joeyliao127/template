<template>
    <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-content-muted">{{ $t('pages.index.breadcrumb') }}</p>
                <h1 class="text-2xl font-semibold text-content">
                    {{ $t('pages.index.greeting') }}
                </h1>
            </div>
        </div>

        <!-- Welcome card -->
        <UCard class="bg-[var(--glass-bg)] border-[var(--glass-border)]">
            <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                    <UIcon name="i-lucide-sparkles" class="w-6 h-6" />
                </div>
                <div>
                    <p class="text-lg font-semibold text-content">
                        Hi {{ userInfo?.username || 'there' }}
                    </p>
                    <p class="text-sm text-content-muted">
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
