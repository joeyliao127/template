<template>
	<div class="page">
		<p>現在時間 {{ dayjs().format("YYYY/MM/DD") }}</p>
		<FormInput></FormInput>
		<slot />
	</div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
const appConfig = useAppConfig();
</script>
<style></style>
