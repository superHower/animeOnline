<template>
  <div>
    <form>
      <div v-show="false">
        <input type="file"  ref="fileInput" @change="onFileChange" />
      </div>
      <div class="file-box" :style="{ height: props.types === 'img' ? '30vh' : '30px'}"  @click="selectFile">
        <img v-if="props.upUrl && props.types === 'img'" :src="props.upUrl" class="avatar" />
        <el-icon v-if="!props.upUrl && props.types === 'img'" class="uploader-icon"><UploadFilled /></el-icon>
        <el-icon v-if="!props.upUrl && props.types === 'video'" class="uploader-icon"><UploadFilled /></el-icon>
        <el-icon v-if="props.upUrl && props.types === 'video'" class="uploader-icon-blue"><UploadFilled /></el-icon>
      </div>
      <div v-if="uploading && uploadProgress !== 100" style="position: relative; left: 10%;">
        <el-progress :percentage="uploadProgress" :stroke-width="15" :status=uploading striped striped-flow :duration="10"/>
      </div>
      <div v-if="uploading && uploadProgress === 100" class="upload-process-finish">
        加速处理中...
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { uploadChunk, uploadMerge, UploadService } from '@/api/upload';
import {UploadFilled} from "@element-plus/icons-vue";

const file = ref(null);
const uploadProgress = ref(0);
const uploading = ref(false);

const fileInput = ref(null);
const emit = defineEmits(['uploaded']);
const props =  defineProps({
  upUrl: String,
  types: String
})

const selectFile = () => {
  fileInput.value.click();
};

const onFileChange = async (event) => {
  file.value = event.target.files[0];
  if (props.types === 'img') {
    await uploadImage();
  } else {
    await uploadVideo();
  }
};

const uploadVideo = async () => {
  if (!file.value) {
    alert('请选择一个文件上传');
    return;
  }

  const chunkSize = 2 * 1024 * 1024; // 分包大小
  const totalChunks = Math.ceil(file.value.size / chunkSize); // 总分包数
  let chunksUploaded = 0; // 已经上传的分包个数

  uploading.value = true;
  uploadProgress.value = 0;
  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.value.slice(i * chunkSize, (i + 1) * chunkSize);
    const formData = new FormData();
    formData.append('file', chunk, `${file.value.name}_part_${i + 1}`);

    await uploadChunk(formData).then(()=> {
    }).catch(() => {
      chunksUploaded++;
      uploadProgress.value = Math.floor((chunksUploaded / totalChunks) * 100);
      console.log(chunksUploaded,totalChunks,uploadProgress.value  )
    });

  }


  // 所有分片上传完成后，调用服务器端API来合并分片
  if (chunksUploaded === totalChunks) {
    const formData = new FormData();
    formData.append('fileName',  file.value.name)
    formData.append('totalChunks',  totalChunks)
    const obj = {
      fileName:  file.value.name,
      totalChunks: totalChunks
    }
    await uploadMerge(obj).then(()=> {
    }).catch((mergeResponse) => {
      if (mergeResponse.data.success) {
        console.log('文件上传成功:', mergeResponse.data.ossUrl);
        ElMessage.success('文件上传成功');
        emit('uploaded', mergeResponse.data.ossUrl);
      } else {
        ElMessage.error('文件上传失败');
      }
    });


  }

  uploading.value = false;
};

const uploadImage = async () => {
  if (!file.value) {
    alert('请选择一个图片上传');
    return;
  }
  const formData = new FormData();
  formData.append('file', file.value); // 假设您的服务器期望字段名为 'file'

  await UploadService(formData).then(()=>{
  }).catch ((response)=> {
    if(response.data.success) {
      emit('uploaded', response.data.ossUrl);
      ElMessage.success('文件上传成功');
    }else {
      ElMessage.error('文件上传失败');
    }
  })

  
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


.upload-process-finish {
  font-family: 'Arial', sans-serif;
  color: #333;
  background-color: #f5f5f5;
  padding: 5px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 可以添加一些动画效果，比如旋转的加载图标 */
.upload-process-finish::before {
  content: '';
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db; /* 加载图标的颜色 */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  margin-right: 10px; /* 与文本的间距 */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>