<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useAppConfig, useRuntimeConfig } from "nuxt/app";

const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
</script>
