<template>
  <div class="app-container">
    <el-dialog :visible.sync="popFilelistVisible" title="file list" :append-to-body="appendToBody" width="90%">
      <div class="upload-wrap">
        <span v-if="fileInfos.length" class="upload-list">
          <file-item
            v-for="(item, index) in fileInfos"
            :key="index"
            :currentIndex="index"
            :fileInfo="item"
          >
          </file-item>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import FileItem from '@/components/FileView/FileItem';

export default {
  name: 'PopFilelist',
  components: {
    FileItem
  },
  data() {
    return {
      popFilelistVisible: false,
      appendToBody: true,
      fileInfos: [],
    }
  },
  methods: {
    handlePopFilelist(fileInfos) {
      this.popFilelistVisible = true;
      this.fileInfos = fileInfos;
    },
  }
}
</script>
