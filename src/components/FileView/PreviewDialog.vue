<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :destroy-on-close="true"
        :before-close="handleClose"
        :append-to-body="true"
    >
        <img
            v-if="previewData.fileType === 'image'"
            width="100%"
            :src="previewData.fileUrl"
            alt=""
        />
        <video
            v-else-if="previewData.fileType === 'video'"
            :id="'player-container-id-' + previewData.fileId"
            class="player-container"
            preload="auto"
            playsinline
            webkit-playsinline
            x5-playsinline
        />
        <aplayer
            v-else-if="previewData.fileType === 'audio'"
            autoplay
            :music="{
                title: previewData.name,
                artist: ' ',
                src: previewData.fileUrl,
                pic: 'https://cn-east-17-aplayer-35525609.oss.dogecdn.com/secretbase.jpg'
            }"
        />
        <a v-else class="preview-href" :href="previewData.fileUrl">{{ previewData.fileUrl }}</a>
    </el-dialog>
</template>

<script>
import Aplayer from 'vue-aplayer';

export default {
    name: 'PreviewDialog',
    components: {
        Aplayer
    },
    data() {
        return {
            dialogVisible: false,
            player: null,
            previewData: ''
        };
    },
    destroyed() {
        this.clear();
    },
    methods: {
        showDialog(data) {
            this.previewData = data;
            this.dialogVisible = true;
            if (data.fileType === 'video') {
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
            }
        },
        handleClose() {
            this.clear();
        },
        clear() {
            this.player && this.player.dispose();
            this.player = '';
            this.dialogVisible = false;
        }
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
