<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <div class="header-title">{{ title }}</div>
        <div class="prefix"><slot name="prefix"></slot> </div>
        <div class="extra"><slot name="extra"></slot> </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    color: teal;
    .header-title {
      margin-left: 20px;
    }
  }
}
.el-card {
  --el-card-padding: 0px
}
</style>
