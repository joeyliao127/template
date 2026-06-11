<template>
    <div class="flex rounded-md hover:bg-[var(--background)]">
        <!-- 顯示模式 -->
        <div v-if="!isEditing" class="cursor-pointer px-2.5 py-1.5 transition-colors font-semibold" @click="startEdit">
            {{ model || '點擊輸入文字' }}
        </div>

        <!-- 編輯模式 -->
        <UInput v-else ref="input" v-model="model" @blur="handleBlur" @keydown="handleKeydown" @change="change" />
    </div>
</template>

<script setup lang="ts">
// const props = defineProps<{ title: string }>();
const model = defineModel<string>()
const emits = defineEmits<{
    (e: 'change'): void
}>()

const isEditing = ref(false)
const inputRef = useTemplateRef('input')

function startEdit() {
    isEditing.value = true
    nextTick(() => {
        inputRef.value?.inputRef?.focus()
        inputRef.value?.inputRef?.select()
    })
}

function finishEdit() {
    isEditing.value = false
}

function handleBlur() {
    finishEdit()
}

function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
        finishEdit()
    }
    if (e.key === 'Escape') {
        isEditing.value = false
    }
}

function change() {
    emits('change')
}
</script>
