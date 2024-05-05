<template>
  <div class="main">
    <span>{{ props.content }}</span>
  </div>
</template>

<script setup>
const props = defineProps(["content"]);
</script>

<style scoped>
.main {
  display: flex;
  align-items: center;
  height: 1cm;
  border-left: 7px solid #02A7F0FF;
}

.main span {
  font: 400 18px 'Leto';
  margin: 0 10px;
  color: #02A7F0;
}
</style>