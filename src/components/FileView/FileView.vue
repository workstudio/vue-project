<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :destroy-on-close="true"
    :before-close="handleClose"
    :append-to-body="true"
    width="90%"
  >
    <img
      v-if="fileType === 'image'"
      width="100%"
      :src="fileInfo.filepath"
      alt=""
    />
    <!--<video
      v-else-if="previewData.fileType === 'video'"
      :id="'player-container-id-' + previewData.fileId"
      class="player-container"
      preload="auto"
      playsinline
      webkit-playsinline
      x5-playsinline
      />-->
    <video-player v-else-if="fileType === 'video'" class="player-item"  :fileInfo="fileInfo"></video-player>
    <aplayer
      v-else-if="fileType === 'audio'"
      autoplay
      :music="{
        title: fileInfo.name,
        artist: ' ',
        src: fileInfo.filepath,
        pic: 'http://ossfile.canliang.wang/common/07377b8a-0d0e-40f4-83a1-01b5b8146143.jpg'
      }"
    />
    <iframe v-else-if="fileType === 'pdf'" :src="fileInfo.filepath" class="pdf-box">
      您的浏览器不支持预览pdf文件，请下载并查看 <a :href="fileInfo.filepath">Download PDF</a>
    </iframe>
    <iframe v-else-if="fileType === 'txt'" :src="fileInfo.filepath" class="pdf-box">
    </iframe>
    <a v-else class="preview-href" :href="fileInfo.filepath">{{ fileInfo.filepath }}</a>
  </el-dialog>
</template>

<script>
import Aplayer from 'vue-aplayer';
import VideoPlayer from "./VideoPlayer"; // 导入视频播放组件

export default {
  name: 'PreviewDialog',
  components: {
    Aplayer,
    VideoPlayer,
  },
  props:{                     
    appendToBody: {type: Boolean, default: false}
  },
  data() {
    return {
      dialogVisible: false,
      player: null,
      fileInfo: {},
      fileType: '',
    };
  },
  mounted() {
    // 绑定键盘事件
    //window.addEventListener("keyup", this.anyKeyClose, false);
  },
  destroyed() {
    this.clear();
  },
  methods: {
    anyKeyClose(e) {
        console.log(e, 'eeeeeee');
      if (e == "close") {
        this.dialogVisible = false;
        return;
      }

      if (e.keyCode === 27) {
        this.dialogVisible = false;
      }
    },
    showDialog(fileInfo) {
      this.dialogVisible = true;
      this.fileType = this.baseMethod.getFileType(fileInfo.extension);
      this.fileInfo = fileInfo;
      /*if (data.fileType === 'video') {
        const options = {
          fileID: data.fileId,
          appID: '1254153797',
          poster: data.coverImg,
          plugins: {
            ContinuePlay: {
              auto: false,
              text: '上次看到',
              btnText: '恢复播放'
            }
          }
        };
        this.$nextTick(() => {
          // eslint-disable-next-line
          this.player = TCPlayer(`player-container-id-${data.fileId}`, options);
        });
      }*/
      //let previewType = this.fileTypeItem(row, 'type');
      //previewType = 'image';
      //previewType = 'audio';
      //previewType = 'video';
      //previewType = 'xlsx';

      //this.previewType = previewType;
      //row.url = 'http://xsjy-1254153797.cos.ap-shanghai.myqcloud.com/smartpen/courseware/pc/2020/10/22/%E5%BF%85-%E8%A6%81%E7%82%B9.png';
      //row.url = 'https://xsjy-1254153797.cos.ap-shanghai.myqcloud.com/smartpen/courseware/pc/2020/10/27/%E4%BA%8C%E5%AD%97%E9%80%89%E6%8B%A9%E9%A2%98%E8%AF%AD%E9%9F%B3.mp3';
      //row.url = 'http://1254153797.vod2.myqcloud.com/41f91735vodsh1254153797/11bbe9245285890808875998543/BPgvrA4wHkkA.mp4';
      //row.url = 'https://xsjy-1254153797.cos.ap-shanghai.myqcloud.com/smartpen/courseware/pc/2020/09/17/%E7%AB%A0%E8%8A%82.xlsx';
      /*switch (previewType) {
        case 'video':
          this.previewOptions = {sources: [{type: "video/mp4", src: row.filepath}]};
          break;
        default :
          this.previewOptions = {url: row.filepath};
      }*/

      //this.showPreview();
      //this.$emit("preview", row, this.showPreview());
    },
    handleClose() {
      this.clear();
    },
    clear() {
      this.player && this.player.dispose();
      this.player = '';
      this.dialogVisible = false;
    },
  },
  beforeDestroy() {
    // 卸载键盘事件
    //window.removeEventListener("keyup", this.anyKeyClose, false);
  }
};
</script>
<style scoped>
.player-container {
  width: 100%;
  height: 500px;
  overflow: hidden;
}
video,
img {
  position: relative;
  width: 100%;
  height: 100%;
}
.preview-href {
  text-decoration: underline;
  color: #409eff;
}
</style>
