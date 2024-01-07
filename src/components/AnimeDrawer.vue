<script setup>
import { ref } from 'vue'
import { getDetailAnimeService, editAnimeService, addAnimeService } from '@/api/anime.js'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
const isAdd = ref(false);

// 默认数据
const defaultForm = {
  name:'',
  info:'',
  time:'',
  nation:''
}
// 准备数据
const formModel = ref({ ...defaultForm })


// 提交
const onPublish = async () => {

  console.log("表单中的内容是")
  console.log(formModel.value)
  if (!isAdd.value) {    // 编辑操作
    await editAnimeService(formModel.value)
    ElMessage.success('修改成功')
    visibleDrawer.value = false

  } else {  // 添加操作
    await addAnimeService(formModel.value)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
  }
}


const open = async (id) => {
  visibleDrawer.value = true // 显示抽屉
  console.log(id)

  if (id) { // 编辑 - 数据回显 (基于 row.id 发送请求)
    isAdd.value = false
    const res = await getDetailAnimeService(id)
    console.log(res)
    formModel.value = res.data.data
  } else {
    // 添加 - 数据重置
    isAdd.value = true
    formModel.value = { ...defaultForm } // 基于默认的数据，重置form数据

  }
}


defineExpose({
  open
})
</script>

<template>
  <el-drawer
      v-model="visibleDrawer"
      :title="formModel.name ? '修改动漫' : '添加动漫'"
      direction="rtl"
      size="30%"
  >

    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="名称" prop="title">
        <el-input v-model="formModel.name" placeholder="请输入动漫名称"></el-input>
      </el-form-item>
      <el-form-item label="地区" prop="name">
        <el-input v-model="formModel.nation"></el-input>
      </el-form-item>
      <el-form-item label="上映时间" prop="name">
        <el-date-picker v-model="formModel.time" type="date" placeholder="选择日期" style="width: 100%"/>
      </el-form-item>
      <el-form-item label="简介" prop="name">
        <el-input v-model="formModel.info" type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish()" type="primary">确认</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep(1) {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
