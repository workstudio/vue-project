<template>
  <el-form-item :label="elem.options.name" prop="field">
    <div class="upload-wrap">
      <el-radio-group v-model="uploadInfo.selectId" size="mini">
        <ul v-if="uploadInfo.fileList.length" class="upload-list">
          <file-item
            v-for="(item, index) in uploadInfo.fileList"
            :key="index"
            :currentIndex="index"
            :itemInfo="item"
            :type="uploadInfo.type"
            @handleRemove="handleRemove"
          >
          </file-item>
        </ul>
      </el-radio-group>
                      <el-button
                    type="primary"
                    @click="handleChangeFile('image', 'gif_resource_id', 'gifResourceName')"
                    >选择文件</el-button
                >
                                <el-button
                    type="primary"
                    @click="handleUploadFile('image', 'gif_resource_id', 'gifResourceName')"
                    >上传文件</el-button
                >
    </div>
    <!--<asset-dialog ref="assetDialog" @confirm="getFileList" :appendToBody="appendToBody"></asset-dialog>-->
    <pop-table ref="popTable" :appendToBody="appendToBody"></pop-table>
    <upload-dialog ref="uploadDialog" @confirm="getFileList" :appendToBody="appendToBody"></upload-dialog>
  </el-form-item>
</template>
<script>
import {form} from '@/applications/mixins/form';

//import AssetDialog from '@/components/FileView/AssetDialog';
import PopTable from '@/views/common/PopTable';
import UploadDialog from '@/components/FileView/UploadDialog';
import FileItem from '@/components/FileView/FileItem';

export default {
  mixins: [form],
  components: {
    //AssetDialog,
    PopTable,
    UploadDialog,
    FileItem
  },
  props: {
    current: {
      type: Number,
      default: 0
    },
    /*uploadInfo: {
      type: Object,
      default: () => {
        return {};
      }
    },*/
    typeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      appendToBody: true,
      uploadInfo: {fileList: []},
      options: [
        {
          value: '',
          label: '无'
        },
        {
          value: 'tape',
          label: '录音'
        },
        {
          value: 'breakup',
          label: '笔画分解'
        }
      ],
    };
  },
  created() {},
  methods: {
    handleChangeFile() {
      const { type } = this.uploadInfo;
      let fileType = '';
      if (type === 'radio') {
        fileType = 'image';
      } else if (type === 'video') {
        fileType = 'video';
      }
      //this.$refs.popTable.showDialog({ fileType: fileType, lineType: 3 });
      let elems = {};
      this.$refs.popTable.handlePopTable(elems);
    },
    handleUploadFile() {
      const { type } = this.uploadInfo;
      let fileType = '';
      if (type === 'radio') {
        fileType = 'image';
      } else if (type === 'video') {
        fileType = 'video';
      }
      this.$refs.uploadDialog.showDialog({ fileType: fileType, lineType: 3 });
    },
    handleRemove(index) {
      this.uploadInfo.fileList.splice(index, 1);
    },
    // 选择语音文件
    handleChangeAudioFile() {
      this.$refs.assetDialog.showDialog({ fileType: 'audio', lineType: 3 });
    },
    handleAudioRemove() {
      this.uploadInfo.audioResource = '';
    },
    getFileList(data) {
      if (this.uploadInfo.type === 'radio' && data[0].fileType === 'audio') {
        this.uploadInfo.audioResource = data[0];
        return;
      }
      const { fileList } = this.uploadInfo;

      for (let i = 0; i < data.length; i++) {
        if (fileList.length) {
          let current = fileList.findIndex((item) => {
            return item.id === data[i].id;
          });
          if (current > -1) {
            this.uploadInfo.fileList.splice(current, 1);
          }
        }
        this.uploadInfo.fileList.push(data[i]);
      }
    },
    handleDelete() {
      this.$emit('handleDelete', this.typeIndex, this.current);
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-wrap {
  display: flex;
  .upload-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    vertical-align: top;
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
        margin-top: 10px;
      }
    }
  }
  .upload-list--btn {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    vertical-align: top;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    outline: 0;
    margin: 0 8px 8px 0;
    flex-shrink: 0;
    color: #8c939d;
    > i {
      font-size: 28px;
      color: #8c939d;
    }
    &:hover {
      border-color: #409eff;
      color: #409eff;
    }
  }
  .el-icon-delete {
    font-size: 24px;
    margin-left: 30px;
  }
}
</style>
