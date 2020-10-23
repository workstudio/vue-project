<template>
    <div
        class="head-bar-wrap clearfix"
        :style="{ 'background-color': variables.menuBg, color: variables.menuText }"
    >
	    <!--<div class="head-title">后台</div>-->
        <div class="head-menu">
            <el-menu
                class="_layout-header"
                :default-active="modulePath"
                :background-color="variables.menuBg"
                :text-color="variables.menuText"
                :active-text-color="variables.menuActiveText"
                mode="horizontal"
            >
                <head-bar-item
                    v-for="route in permission_routes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </div>
        <div v-if="device !== 'mobile'" class="right-menu">
            <template>
                <screenfull id="screenfull" class="right-menu-item hover-effect" />
                <span class="name">{{ name || '匿名用户' }}</span>
            </template>
            <el-dropdown class="avatar-container" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar" />
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu class="user-dropdown">
                    <router-link to="/">
                        <el-dropdown-item>
                            首页
                        </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided @click.native="logout">
                        <span style="display: block;">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HeadBarItem from './HeadBarItem';
import variables from '@/styles/variables.scss';
import Screenfull from '@/components/Screenfull';

export default {
    components: { HeadBarItem, Screenfull },
    computed: {
        ...mapGetters(['permission_routes', 'sidebar', 'avatar', 'device', 'name']),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        variables() {
            return variables;
        },
        modulePath() {
            return this.$route.matched.length === 0
                ? this.$route.path
                : this.$route.matched[0].path || '/';
        }
    },
    methods: {
        async logout() {
            await this.$store.dispatch('user/logout');
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        }
    }
};
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.head-bar-wrap {
    .head-title {
        float: left;
        height: 60px;
        line-height: 60px;
        width: $sideBarWidth;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
    }
    .head-menu {
        float: left;
    }
    .right-menu {
        float: right;
        height: 60px;
        display: flex;
        align-items: center;
        color: white;
        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;
            margin-left: 15px;
            .avatar-wrapper {
                position: relative;
                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                    color: white;
                }
            }
        }
    }
}
</style>
