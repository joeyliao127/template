<template>
    <div>
        <UModal v-model="open" :ui="modalUi">
            <UButton variant="ghost" color="neutral" icon="i-lucide-settings-2" :aria-label="$t('nav.settings')" @click="openModal" />
            <template #content>
                <div
                    class="flex w-[760px] max-w-[calc(100vw-2rem)] h-[600px] rounded-xl bg-default ring ring-default text-default shadow-xl overflow-hidden"
                >
                    <div class="w-48 border-r border-default p-3 space-y-1 bg-muted">
                        <template v-for="item in sections" :key="item.value">
                            <UButton
                                block
                                :variant="activeSection === item.value ? 'soft' : 'ghost'"
                                :color="activeSection === item.value ? 'primary' : 'neutral'"
                                class="justify-start"
                                @click="changeSection(item.value)"
                            >
                                <UIcon :name="item.icon || 'i-lucide-circle'" class="w-4 h-4 mr-2" />
                                {{ item.label }}
                            </UButton>
                        </template>
                    </div>
                    <div class="flex-1 p-5 space-y-4">
                        <div class="flex items-start justify-between">
                            <div class="space-y-1">
                                <p class="text-lg font-semibold">
                                    {{ sections.find((tab) => tab.value === activeSection)?.label }}
                                </p>
                            </div>
                            <UButton variant="ghost" color="neutral" icon="i-lucide-x" size="sm" @click="closeModal" />
                        </div>

                        <div class="space-y-3">
                            <slot name="content" :section="activeSection">
                                <p class="text-sm text-content-muted">此處預留設定表單內容（由外部注入）。</p>
                            </slot>
                        </div>

                        <div class="pt-4 border-t border-default flex flex-wrap gap-2">
                            <slot name="footer" :close="closeModal" />
                        </div>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface SettingsSection {
    label: string
    value: string
    description?: string
    icon?: string
}

const props = withDefaults(
    defineProps<{
        modelValue?: boolean
        sections?: SettingsSection[]
        active?: string
    }>(),
    {
        modelValue: false,
        sections: () => [
            { label: '個人資料', value: 'profile', icon: 'i-lucide-user' },
            { label: '帳號安全', value: 'security', icon: 'i-lucide-lock' },
            { label: '通知', value: 'notification', icon: 'i-lucide-bell' },
        ],
        active: '',
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'change', value: string): void
    (e: 'close'): void
}>()

const open = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value),
})

const activeSection = ref(props.active || props.sections[0]?.value || '')

watch(
    () => props.active,
    (val) => {
        if (val) activeSection.value = val
    }
)

function changeSection(value: string) {
    activeSection.value = value
    emit('change', value)
}

function openModal() {
    emit('update:modelValue', true)
}

function closeModal() {
    emit('update:modelValue', false)
    emit('close')
}

const modalUi = {
    overlay: 'bg-[rgba(9,9,11,0.32)] backdrop-blur-[2px]',
    content: '!bg-transparent !ring-0 !shadow-none !p-0 w-fit',
}
</script>
