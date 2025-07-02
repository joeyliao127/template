<template>
    <div class="p-8 space-y-6">
        <h1 class="text-3xl font-bold text-primary">Sample Color Test</h1>

        <USeparator icon="i-lucide-pencil"></USeparator>
        <div class="space-x-4">
            <h2 class="text-white pb-4 font-medium text-2xl">Buttons</h2>
            <div class="flex gap-2">
                <UButton class="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90">Primary</UButton>
                <UButton class="bg-accent text-white px-4 py-2 rounded shadow hover:bg-accent/90">Accent</UButton>
            </div>
            <h3>Button with icon</h3>

            <UButton icon="i-lucide-sun">accessibility</UButton>
        </div>
    </div>
</template>
