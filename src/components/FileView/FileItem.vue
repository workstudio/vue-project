<template>
  <div class="upload-list__item">
    <div class="upload-list__item-inner">
      <img v-if="itemInfo.fileType === 'image'" :src="itemInfo.fileUrl" />
      <i
        v-else-if="itemInfo.fileType === 'video' || itemInfo.fileType === 'audio'"
        class="icon el-icon-video-camera"
      ></i>
      <i v-else class="icon el-icon-document"></i>
      <span class="upload-list__item-actions">
        <i class="icon el-icon-zoom-in" @click="handlePreview"></i>
        <i class="icon el-icon-delete" @click="handleRemove"></i>
      </span>
    </div>
    <template>
      <el-radio
        v-if="type === 'radio'"
        v-model="itemInfo.id"
        class="upload-list__item-radio"
        :label="itemInfo.id"
        name="radio"
        >{{ itemInfo.name }}</el-radio
      >
      <el-input
        v-else
        v-model="itemInfo.name"
        class="upload-list__item-input"
        placeholder="请输入内容"
      ></el-input>
    </template>
    <preview-dialog ref="previewDialog"></preview-dialog>
  </div>
</template>

<script>
import PreviewDialog from '@/components/FileView/PreviewDialog';

export default {
  name: 'UploadItem',
  components: {
    PreviewDialog
  },
  props: {
    itemInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },
    type: {
      type: String,
      default: ''
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    handleRemove() {
      this.$emit('handleRemove', this.currentIndex);
    },
    handlePreview() {
      this.$refs.previewDialog.showDialog(this.itemInfo);
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
    width: 148px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 0;
  }
}
</style>
