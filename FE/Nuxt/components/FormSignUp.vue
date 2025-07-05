<template>
    <UForm :state="state">
        <USeparator><p class="text-center text-2xl font-bold">SignUp</p></USeparator>

        <div class="flex flex-col gap-6 mb-6">
            <FormInput label="Email" name="email" :required="true" icon="mail" placeholder="Enter your email" />
            <FormInput label="Password" name="password" :required="true" icon="lock" placeholder="Enter your password" />
            <FormInput label="Confirm Password" name="password_confirm" :required="true" icon="lock" placeholder="Enter your password again" />
            <UButton class="justify-center text-white font-bold">Continue</UButton>
        </div>
    </UForm>
</template>
<script setup lang="ts">
import { ref } from "vue";

interface SignIn {
    email: String;
    password: String;
}

const state = ref<SignIn>({
    email: "",
    password: "",
});
</script>

<style></style>
