<template>
  <div class="upload-list__item">
    <div class="upload-list__item-inner">
      <img v-if="fileType === 'image'" :src="fileInfo.filepath" />
      <i
        v-else-if="fileType === 'video' || fileType === 'audio'"
        class="icon el-icon-video-camera"
      ></i>
      <i v-else class="icon el-icon-document"></i>
      <span class="upload-list__item-actions">
        <i class="icon el-icon-zoom-in" @click="handlePreview"></i>
        <i class="icon el-icon-delete" @click="handleRemove"></i>
      </span>
    </div>
    <template v-if="showSelect">
      <!--<el-checkbox
        v-model="fileInfo.id"
        class="upload-list__item-radio"
        :label="fileInfo.id"
        name="radio"
        >{{ fileInfo.name }}</el-checkbox>-->
      <el-checkbox 
        class="upload-list__item-radio"
        :label="fileInfo.id"
        name="radio"
        >{{ fileInfo.name }}</el-checkbox
      >
    </template>
    <!--<template>
      <el-radio
        v-if="type === 'radio'"
        v-model="fileInfo.id"
        class="upload-list__item-radio"
        :label="fileInfo.id"
        name="radio"
        >{{ fileInfo.name }}</el-radio
      >
      <el-input
        v-else
        v-model="fileInfo.name"
        class="upload-list__item-input"
        placeholder="请输入内容"
      ></el-input>
    </template>-->
    <file-view ref="fileView"></file-view>
  </div>
</template>

<script>
import FileView from '@/components/FileView/FileView';

export default {
  name: 'UploadItem',
  components: {
    FileView
  },
  props: {
    fileInfo: {type: Object, default: () => {return {};}},
    showSelect: {type: Boolean, default: false},
    currentIndex: {type: Number, default: 0},
    checkList: {type: Array},
  },
  data() {
    return {
        checked: 1,
    };
  },
  computed: {
    fileType() {
      return this.baseMethod.getFileType(this.fileInfo.extension);
    }
  },
  methods: {
    handleRemove() {
      this.$emit('handleRemove', this.currentIndex);
    },
    handlePreview() {
        console.log(this.fileInfo,'fffffffff');
      this.$refs.fileView.showDialog(this.fileInfo);
    }
  }
};
</script>

<style scoped lang="scss">
.upload-list__item {
  margin: 0 15px 15px 0;
  .upload-list__item-inner {
    overflow: hidden;
    background-color: #ffffff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    display: inline-block;
    position: relative;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
    > .icon {
      font-size: 30px;
      color: #666666;
      line-height: 148px;
    }
    &:hover {
      .upload-list__item-actions {
        opacity: 1;
      }
    }
    .upload-list__item-actions {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      -webkit-transition: opacity 0.3s;
      transition: opacity 0.3s;
      > .icon {
        cursor: pointer;
        font-size: 20px;
        line-height: 148px;
      }
    }
  }
  .upload-list__item-input {
    display: block;
    width: 148px;
    margin-top: 10px;
  }
  .upload-list__item-radio {
    display: block;
    margin-top: 30px;
    width: 248px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 0;
  }
}
</style>
