<template>
    <UFormField :label="label" :required="required">
        <UInput class="w-full" :trailing-icon="getIcon" :placeholder="placeholder" />
    </UFormField>
</template>

<script setup lang="ts">
import type { pickLinkProps } from "@nuxt/ui/runtime/utils/link.js";
import { computed } from "vue";

const { label, required, icon, placeholder } = defineProps({
    label: {
        type: String,
        required: false,
    },

    required: {
        type: Boolean,
        required: false,
        default: false,
    },

    icon: {
        type: String,
        required: false,
        default: "",
    },

    placeholder: {
        type: String,
        required: false,
        default: "",
    },
});

const getIcon = computed(() => {
    if (icon) return `i-lucide-${icon}`;
    else return "";
});
</script>

<style></style>
