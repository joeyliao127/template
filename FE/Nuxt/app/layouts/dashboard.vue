<template>
    <div class="app-shell">
        <Topbar />
        <main class="page">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import Topbar from '~/components/dashboard/Topbar.vue'
</script>

<style scoped>
.app-shell {
    min-height: 100vh;
    background: var(--surface-page);
    color: var(--text-primary);
}

.page {
    max-width: var(--container-lg);
    margin-inline: auto;
    padding: 3rem var(--gutter) 5rem;
}
</style>
