<script setup>
import { ref } from 'vue'
import { getDetailAnimeService, editAnimeService, addAnimeService } from '@/api/anime.js'
import { getAnimeEpisodesService, editEpisodesName, addEpisodesService } from '@/api/episode.js'
import ImageUpload from '@/components/ImageUpload.vue'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
const isAdd = ref(false);
const aid = ref(0)

// 默认数据
const defaultForm = {
  name:'',
  info:'',
  time:'',
  nation:'',
  imgUrl:'',
  episodes: []
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


const handleUploaded = async (data) => {
  console.log('Uploaded URL:', data);
  if(data.type === 'img') {
    formModel.value.imgUrl = data.url;
  }
  else{
    await getAnimeEpisodesService(aid.value).then((res) => {
      formModel.value.episodes = res.data
    })
  }
};

const handleEditName = async (id, name) => {
  const obj = {
    id: id,
    name: name
  }
  await editEpisodesName(obj).then(() => {
    ElMessage.success('修改成功')
  })
}
const handelAddEpisode = async () => {
  const obj = {
    aid: aid.value,
    number: formModel.value.episodes.length + 1,
    name: '新剧集',
    duration: 0,
    videoUrl: ''
  }
  await addEpisodesService(obj).then(() => {
    ElMessage.success('添加成功')
    getAnimeEpisodesService(aid.value).then((res) => {
      formModel.value.episodes = res.data
    })
  })
}

const open = async (id) => {
  visibleDrawer.value = true // 显示抽屉
  aid.value = id

  if (id) {
    isAdd.value = false
    await getDetailAnimeService(id).then((res) => {
      formModel.value = { ...res.data } 
    })
    await getAnimeEpisodesService(id).then((res) => {
      formModel.value.episodes = res.data
    })

  } else {
    isAdd.value = true
    formModel.value = { ...defaultForm } 

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
      size="40%"
  >
    <el-button @click="onPublish()" type="primary" style="position: absolute;top: 55px; width: 45px;">保存</el-button>
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
        <ImageUpload :upUrl="formModel.imgUrl" :types="'img'" @uploaded="handleUploaded" >
        </ImageUpload>
      </div>

      <el-button @click="handelAddEpisode" type="primary">添加剧集</el-button>
      <el-table :data="formModel.episodes" height="300" border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="剧集名称" prop="name">
          <template #default="scope">
            <el-input v-model="scope.row.name" @change="handleEditName(scope.row.id, scope.row.name)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="剧集视频">
          <template #default="scope">
            <ImageUpload :upUrl="scope.row.videoUrl" :eid="scope.row.id" :types="'video'"  @uploaded="handleUploaded">
            </ImageUpload>
          </template>
        </el-table-column>
      </el-table>

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
.el-form-item {
  margin-bottom: 8px;
}
.el-drawer__header {
  margin-bottom: 32px !important;
}
</style>
