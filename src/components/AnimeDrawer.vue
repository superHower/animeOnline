<script setup>
import { ref } from 'vue'
import { getDetailAnimeService, editAnimeService, addAnimeService, getAnimeListService } from '@/api/anime.js'
import ImageUpload from '@/components/ImageUpload.vue'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
const isAdd = ref(false);

// 默认数据
const defaultForm = {
  name:'',
  info:'',
  time:'',
  nation:'',
  imgUrl:''
}
// 准备数据
const formModel = ref({ ...defaultForm })

const emit = defineEmits(['update-list']); // 定义一个自定义事件


// 提交
const onPublish = async () => {
  console.log(formModel.value.time)
  if (formModel.value.time instanceof Date) {
    formModel.value.time = formModel.value.time.toISOString().substring(0, 10);
  }
  formModel.value.time = formModel.value.time.substring(0, 10);
 
    
  console.log("表单中的内容是")
  console.log(formModel.value)
  if (!isAdd.value) {    // 编辑操作
    await editAnimeService(formModel.value).then(() => {
      ElMessage.success('修改成功')
      visibleDrawer.value = false
      emit('update-list'); 
    })


  } else {  // 添加操作
    await addAnimeService(formModel.value).then(()=> {
      ElMessage.success('添加成功')
      visibleDrawer.value = false
      emit('update-list'); 
    })

  }
}


const handleUploaded = (url) => {
  console.log('Uploaded URL:', url);
  formModel.value.imgUrl = url;
};

const open = async (id) => {
  visibleDrawer.value = true // 显示抽屉
  console.log('id', id)

  if (id) { // 编辑 - 数据回显 (基于 row.id 发送请求)
    isAdd.value = false
    const res = await getDetailAnimeService(id)
    console.log(res.data)

    formModel.value = { ...res.data } 
    console.log(formModel.value.imgUrl)
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
      :title="isAdd ? '增加动漫' : '修改动漫'"
      direction="rtl"
      size="30%"
  >
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formModel.name" placeholder="请输入动漫名称"></el-input>
      </el-form-item>
      <el-form-item label="地区" prop="nation">
        <el-input v-model="formModel.nation"></el-input>
      </el-form-item>
      <el-form-item label="上映时间" prop="time">
        <el-date-picker v-model="formModel.time" type="date" placeholder="选择日期" style="width: 100%"/>
      </el-form-item>
      <el-form-item label="简介" prop="info">
        <el-input v-model="formModel.info" type="textarea"></el-input>
      </el-form-item>
<!--      上传-->
      <span style="padding: 10px"></span>选择封面
      <div style="margin-left: 100px;">     
        <ImageUpload :upUrl="formModel.imgUrl" @uploaded="handleUploaded" >
        </ImageUpload>
      </div>

      <el-form-item>
        <el-button @click="onPublish()" type="primary">确认</el-button>
      </el-form-item>
     
    </el-form>
  </el-drawer>



</template>

<style lang="scss" scoped>
.avatar-uploader {
  width: 220px; /* 设置宽度，可以根据需要进行调整 */
  height: 220px; /* 设置高度，可以根据需要进行调整 */
  margin-left: 100px;

  border: 1px dashed #ccc; /* 设置边框样式，可以根据需要进行调整 */
  border-radius: 4px; /* 设置边框圆角，可以根据需要进行调整 */
  text-align: center; /* 设置内容居中，可以根据需要进行调整 */
  display: flex; /* 设置为弹性布局，可以根据需要进行调整 */
  align-items: center; /* 设置垂直居中，可以根据需要进行调整 */
  justify-content: center; /* 设置水平居中，可以根据需要进行调整 */
}

.avatar-uploader-icon {
  font-size: 28px; /* 设置图标的大小，可以根据需要进行调整 */
  color: #999; /* 设置图标的颜色，可以根据需要进行调整 */
}

.avatar {
  width: 100%; /* 图片宽度填充父容器 */
  height: 100%; /* 图片高度填充父容器 */
  object-fit: cover; /* 设置图片适应方式，可以根据需要进行调整 */
  border-radius: 4px; /* 设置图片圆角，可以根据需要进行调整 */
}


.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
