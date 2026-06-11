<template>
    <UFormField :label="props.label" :name="props.name" :required="props.required">
        <UInput class="w-full auth-input" :type="props.type" :trailing-icon="getIcon" :placeholder="props.placeholder" />
    </UFormField>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        label?: string
        name?: string
        type?: string
        required?: boolean
        icon?: string
        placeholder?: string
    }>(),
    {
        required: false,
        icon: '',
        placeholder: '',
    }
)

const getIcon = computed(() => {
    if (props.icon) return `i-lucide-${props.icon}`
    else return ''
})
</script>

<style></style>
