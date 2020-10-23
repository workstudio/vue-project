<template>
    <div v-if="!item.hidden" style="display: inline-block;">
        <template>
            <app-link v-if="item.meta" :to="item.path">
                <el-menu-item :index="item.path">
                    <span>{{ item.meta.title }}</span>
                </el-menu-item>
            </app-link>
        </template>
    </div>
</template>

<script>
import AppLink from './Link';

export default {
    name: 'HeadBarItem',
    components: { AppLink },
    props: {
        item: {
            type: Object,
            required: true
        }
    }
};
</script>
