<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>

<script setup lang="ts">
import { useAppConfig, useRuntimeConfig } from "nuxt/app";

const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
</script>
