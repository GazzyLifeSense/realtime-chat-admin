<template>
	<component :is="LayoutClassic" />
</template>

<script setup lang="ts" name="layout">
import LayoutClassic from "./LayoutClassic/index.vue";
</script>

<style scoped lang="scss">
.layout {
	min-width: 760px;
}
</style>
