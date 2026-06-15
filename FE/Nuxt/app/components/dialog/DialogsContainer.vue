<template>
    <ClientOnly>
        <!-- Alert Dialog -->
        <UModal v-for="dialog in alertDialogs" :key="dialog.id" v-model:open="dialog.isOpen" :ui="UI_DIALOG" @close="handleClose(dialog.id)">
            <template #header />
            <template #body>
                <div class="flex items-center gap-3 px-5 pt-5 pb-4">
                    <UIcon name="i-lucide-triangle-alert" class="w-6 h-6 text-warning shrink-0" />
                    <span class="font-medium text-base leading-snug" v-html="dialog.message" />
                </div>
                <div class="flex justify-center gap-x-4 px-5 pb-5">
                    <UButton color="error" class="min-w-24 h-10 font-medium" @click="handleConfirm(dialog.id, dialog.callback)">
                        確定
                    </UButton>
                </div>
            </template>
        </UModal>

        <!-- Confirm Dialog -->
        <UModal v-for="dialog in confirmDialogs" :key="dialog.id" v-model:open="dialog.isOpen" :ui="UI_DIALOG" @close="handleClose(dialog.id)">
            <template #header />
            <template #body>
                <div class="flex items-center gap-3 pb-4">
                    <UIcon name="i-lucide-triangle-alert" class="w-6 h-6 text-warning shrink-0" />
                    <span class="font-medium text-base leading-snug" v-html="dialog.message" />
                </div>
                <div class="flex justify-center gap-x-4">
                    <UButton color="error" class="min-w-24 h-10 font-medium" @click="handleConfirm(dialog.id, dialog.callback)">
                        確認
                    </UButton>
                    <UButton
                        variant="outline"
                        color="neutral"
                        class="min-w-24 h-10 font-medium"
                        @click="handleClose(dialog.id)"
                    >
                        取消
                    </UButton>
                </div>
            </template>
        </UModal>

        <!-- Inform Dialog -->
        <UModal v-for="dialog in informDialogs" :key="dialog.id" v-model:open="dialog.isOpen" :ui="UI_DIALOG" @close="handleClose(dialog.id)">
            <template #header />
            <template #body>
                <div class="flex items-center gap-3 px-5 pt-5 pb-4">
                    <UIcon name="i-lucide-info" class="w-6 h-6 text-info shrink-0" />
                    <span class="font-medium text-base leading-snug" v-html="dialog.message" />
                </div>
                <div class="flex justify-center gap-x-4 px-5 pb-5">
                    <UButton color="primary" class="min-w-24 h-10 font-medium" @click="handleConfirm(dialog.id, dialog.callback)">
                        知道了
                    </UButton>
                </div>
            </template>
        </UModal>
    </ClientOnly>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDialogs } from '~/composables/useDialogs'

const { dialogs, close } = useDialogs()

const UI_DIALOG = {
    content: 'rounded-xl bg-default ring ring-default max-w-120 shadow-xl',
    header: 'hidden',
    body: 'p-0',
    overlay: 'bg-black/50',
}

// Filter dialogs by type
const alertDialogs = computed(() => dialogs.value.filter((d) => d.type === 'alert'))
const confirmDialogs = computed(() => dialogs.value.filter((d) => d.type === 'confirm'))
const informDialogs = computed(() => dialogs.value.filter((d) => d.type === 'inform'))

const handleClose = (id: string) => {
    close(id)
}

const handleConfirm = async (id: string, callback?: () => void | Promise<void>) => {
    if (callback) {
        await callback()
    }
    close(id)
}
</script>
