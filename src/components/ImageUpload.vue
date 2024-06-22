<template>
  <div>
    <form @submit.prevent="uploadImage">
      <div v-show="false">
        <input type="file"  ref="fileInput" @change="onFileChange" />
      </div>
      <div class="file-box" :style="{ height: props.types === 'img' ? '30vh' : '30px'}"  @click="selectFile">
        <img v-if="props.upUrl && props.types === 'img'" :src="props.upUrl" class="avatar" />
        <el-icon v-if="!props.upUrl && props.types === 'img'" class="uploader-icon"><UploadFilled /></el-icon>
        <el-icon v-if="!props.upUrl && props.types === 'video'" class="uploader-icon"><UploadFilled /></el-icon>
        <el-icon v-if="props.upUrl && props.types === 'video'" class="uploader-icon-blue"><UploadFilled /></el-icon>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UploadService } from '@/api/upload';
import {UploadFilled} from "@element-plus/icons-vue";

const file = ref(null);
const ossUrl = ref(null);
const fileInput = ref(null);
const emit = defineEmits(['uploaded']);
const props =  defineProps({
  upUrl: String,
  types: String
})

const selectFile = () => {
  fileInput.value.focus();
  fileInput.value.click();
};

const onFileChange = async (event) => {
  file.value = event.target.files[0];
  await uploadImage();
};

const uploadImage = async () => {
  if (!file.value) {
    alert('请选择一个文件上传');
    return;
  }
  const formData = new FormData();
  formData.append('file', file.value); // 假设您的服务器期望字段名为 'file'

  try {
    const response = await UploadService(formData);
    console.log('上传成功:', response.data.ossUrl);
    ossUrl.value = response.data.ossUrl;
    emit('uploaded', response.data.ossUrl);
  } catch (error) {
    console.error('上传出错:', error);
    ossUrl.value = error.data.ossUrl;
    emit('uploaded', error.data.ossUrl);
  }
};

</script>


<style scoped>
.file-box {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  width: 100%; /* 设置宽度,根据需要调整 */
  height: 30vh; /* 设置高度,根据需要调整 */
  border: 1px solid #ccc; /* 添加边框,根据需要调整 */
  cursor: pointer; /* 鼠标样式改为手型 */
}

.avatar {
  max-width: 100%; /* 图片最大宽度为容器宽度 */
  max-height: 100%; /* 图片最大高度为容器高度 */
}

.uploader-icon {
  font-size: 28px; /* 图标大小 */
  color: #8c939d;
} 
.uploader-icon-blue {
  font-size: 28px; /* 图标大小 */
  color: aqua;
}

</style>