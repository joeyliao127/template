<template>
    <div class="dashboard-container">
        <div class="dashboard-bg" :style="{ backgroundImage: bgImage }" />
        <div class="dashboard-layout">
            <aside class="dashboard-sidebar">
                <Sidebar @logout="handleLogout" />
            </aside>
            <main class="dashboard-main">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useRouter } from '#imports'
import Sidebar from '~/components/dashboard/Sidebar.vue'

const router = useRouter()
const colorMode = useColorMode()

const bgImage = computed(() =>
    colorMode.value === 'light' ? "url('/image/light.jpg')" : "url('/image/fugi.jpeg')"
)

function handleLogout() {
    router.push('/signIn')
}
</script>

<style scoped>
.dashboard-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.dashboard-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
}

.dashboard-layout {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    height: 100%;
}

.dashboard-sidebar {
    width: 16rem;
    height: 100%;
    flex-shrink: 0;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-right: 1px solid var(--glass-border);
    overflow-y: auto;
}

.dashboard-main {
    flex: 1;
    height: 100%;
    background: var(--glass-bg-subtle);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    overflow-y: auto;
    padding: 0;
    color: var(--text-secondary);
}
</style>
