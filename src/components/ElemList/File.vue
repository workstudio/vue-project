<template>
  <div>
    <!--<img :src="row[field].value" alt="" width="150px" height="100px" />-->
    <ul v-if="firstFile" class="upload-list">
      <file-item :fileInfo="firstFile"></file-item>
    </ul>
    <div v-if="fileInfos.length > 1"><span @click="showMoreFile()">更多</span></div>
    <pop-filelist ref="popFilelist"></pop-filelist>
  </div>
</template>

<script>
import {column} from '@/applications/mixins/column';
import FileItem from '@/components/FileView/FileItem';
import PopFilelist from '@/views/common/PopFilelist';

export default {
  mixins: [column],
  components: {
    FileItem,
    PopFilelist
  },
  data() {
    return {}
  },
  computed: {
    firstFile() {
      return this.fileInfos.length > 0 ? this.fileInfos[0] : false;
    },
    fileInfos() {
      return this.row[this.field].value ? this.row[this.field].value : [];
    }
  },
  methods: {
    showMoreFile() {
      this.$refs.popFilelist.handlePopFilelist(this.fileInfos);
    }
  }
}
</script>
