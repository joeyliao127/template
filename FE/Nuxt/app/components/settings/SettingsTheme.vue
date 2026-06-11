<template>
    <div class="space-y-3">
        <p class="text-sm text-content-muted">{{ $t('settings.theme.description') }}</p>
        <div class="flex gap-3">
            <UButton
                v-for="option in themeOptions"
                :key="option.value"
                :variant="colorMode.preference === option.value ? 'solid' : 'outline'"
                :color="colorMode.preference === option.value ? 'primary' : 'neutral'"
                :icon="option.icon"
                @click="setTheme(option.value)"
            >
                {{ option.label }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()

const themeOptions = [
    { value: 'dark', label: t('settings.theme.dark'), icon: 'i-lucide-moon' },
    { value: 'light', label: t('settings.theme.light'), icon: 'i-lucide-sun' },
]

function setTheme(mode: string) {
    colorMode.preference = mode
}
</script>
