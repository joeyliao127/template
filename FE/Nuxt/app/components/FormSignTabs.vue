<template>
    <UCard class="flex gap-8 h-[560px] aspect-[4/5]">
        <div class="w-100">
            <UTabs :items="tabsForm" color="neutral">
                <template #signin>
                    <FormSignIn />
                </template>
                <template #signup>
                    <FormSignUp />
                </template>
            </UTabs>
        </div>
    </UCard>
</template>
<script setup lang="ts">
import { ref } from "vue";
import FormSignIn from "~/components/FormSignIn.vue";
import type { TabsItem } from "@nuxt/ui";
import FormSignUp from "~/components/FormSignUp.vue";

const tabsForm: TabsItem[] = [
    {
        label: "SignIn",
        slot: "signin" as const,
    },
    {
        label: "SignUp",
        slot: "signup" as const,
    },
];
</script>

<style></style>
