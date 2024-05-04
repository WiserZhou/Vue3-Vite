<template>
    <div class="wrapper">
        <span>{{ props.content }}</span>
    </div>
</template>

<script setup>
const props = defineProps(["content"]);
</script>

<style scoped>
.wrapper {
    display: flex;
    align-items: center;
    height: 30px;
    border-left: 6px solid rgba(2, 167, 240, 1);
}

.wrapper span {
    font: 400 18px 'Microsoft YaHei';
    margin: 0 10px;
    color: #02A7F0;
}
</style>