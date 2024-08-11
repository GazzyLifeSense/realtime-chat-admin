<template>
    <div class="header-lf">
        <div class="logo flx-center">
            <img src="@/assets/images/logo.svg" alt="logo" />
            <span>RealtimeChat Admin</span>
        </div>
        <CollapseIcon id="collapseIcon" />
    </div>
    
</template>

<script setup lang="ts">
import CollapseIcon from './components/CollapseIcon.vue';
</script>

<style setup lang="scss">
.header-lf {
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    .logo {
        flex-shrink: 0;
        width: 210px;
        margin-right: 16px;
        span {
            font-size: 21.5px;
            font-weight: bold;
            color: #dadada;
            white-space: nowrap;
        }
        img {
            width: 28px;
            object-fit: contain;
            margin-right: 6px;
        }
    }
}
</style>