<script setup lang="ts">
import MainLayout from '../components/layout/MainLayout.vue'
import AgentWorkspace from '../components/collaboration/AgentWorkspace.vue'
</script>

<template>
  <MainLayout>
    <div class="h-[calc(100vh-5rem)]">
      <AgentWorkspace />
    </div>
  </MainLayout>
</template>
