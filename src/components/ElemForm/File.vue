<template>
  <el-form-item :label="elem.options.name" prop="field">
    <div>
      <el-button type="primary" @click="handleSelectFile()">选择文件</el-button>
      <el-button type="primary" @click="handleUploadFile()">上传文件</el-button>
    </div>
    <div class="upload-wrap">
      <div v-if="elem.maxnum==1" >
      <el-radio-group v-model="input" size="mini">
        <ul v-if="uploadInfo.length" class="upload-list">
          <file-item
            v-for="(item, index) in uploadInfo"
            :key="index"
            :currentIndex="index"
            :fileInfo="item"
            :type="item.type"
            @handleRemove="handleRemove"
          >
          </file-item>
        </ul>
      </el-radio-group>
      </div>
      <div v-else>
      <el-checkbox-group v-model="input" size="mini">
        <ul v-if="uploadInfo.length" class="upload-list">
          <file-item
            v-for="(item, index) in uploadInfo"
            :key="index"
            :currentIndex="index"
            :fileInfo="item"
            :type="item.type"
            @handleRemove="handleRemove"
          >
          </file-item>
        </ul>
      </el-checkbox-group>
      </div>
    </div>
    <pop-table ref="popTable" :appendToBody="appendToBody"></pop-table>
    <!--<pop-form ref="popForm" :appendToBody="appendToBody"></pop-form>-->
    <pop-upload ref="popUpload" :appendToBody="appendToBody" @uploadSuccess="uploadSuccess"></pop-upload>
  </el-form-item>
</template>
<script>
import {form} from '@/applications/mixins/form';

import PopTable from '@/views/common/PopTable';
//import PopForm from '@/views/common/PopForm';
import PopUpload from '@/views/common/PopUpload';
import FileItem from '@/components/FileView/FileItem';

export default {
  mixins: [form],
  components: {
    PopTable,
    PopUpload,
    FileItem
  },
  data() {
    return {
      input: this.inputInfos[this.field] ? this.inputInfos[this.field] + '' : null,
      appendToBody: true,
      uploadInfo: [
          {extension: 'jpg', filepath: 'http://xsjy-1254153797.cos.ap-shanghai.myqcloud.com/smartpen/courseware/pc/2020/10/22/%E5%BF%85-%E8%A6%81%E7%82%B9.png'},
          {extension: 'mp3', filepath: 'https://xsjy-1254153797.cos.ap-shanghai.myqcloud.com/smartpen/courseware/pc/2020/10/27/%E4%BA%8C%E5%AD%97%E9%80%89%E6%8B%A9%E9%A2%98%E8%AF%AD%E9%9F%B3.mp3'},
          {extension: 'mp4', filepath: 'http://1254153797.vod2.myqcloud.com/41f91735vodsh1254153797/11bbe9245285890808875998543/BPgvrA4wHkkA.mp4'},
      //row.url = 'https://xsjy-1254153797.cos.ap-shanghai.myqcloud.com/smartpen/courseware/pc/2020/09/17/%E7%AB%A0%E8%8A%82.xlsx';
      ],
    };
  },
  created() {},
  methods: {
    handleSelectFile() {
      let params = {row: {}, operation: {app: 'passport', resource: 'attachment', params:{point_scene: 'pop'}}};
      this.$refs.popTable.handlePopTable(params);
    },
    handleUploadFile() {
      let params = {row: {}, operation: {app: 'passport', resource: 'attachment', params:{}}, relate: {model: this.model, field: this.field}};
      this.$refs.popUpload.handlePopUpload(params);
    },
    uploadSuccess() {
    },
    handleRemove(index) {
      this.uploadInfo.splice(index, 1);
    },
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
