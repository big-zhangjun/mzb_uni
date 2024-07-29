<template>
    <view class="tabs">
        <up-tabs @change="change" :current="current" :list="list4" lineWidth="20" lineHeight="7"
            :lineColor="`url(${lineBg}) 100% 100%`" :activeStyle="{
                color: '#303133',
                fontWeight: 'bold',
                transform: 'scale(1.05)'
            }" :inactiveStyle="{
            color: '#606266',
            transform: 'scale(1)'
        }" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;">
        </up-tabs>
    </view>
    <projectInfo :projectInfo="detail" v-if="current === 0" />
    <electricalIno :queryParams="queryParams" v-if="current === 1" />
    <memorandums :queryParams="queryParams" :key="key" v-if="current === 2" />
    <logList :queryParams="queryParams" :key="key" v-if="current === 3" />

</template>

<script setup>
import { reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import * as $http from '../../../request/index'
const lineBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII=";
import electricalIno from './components/electricalIno.vue';
import projectInfo from './components/projectInfo.vue';
import logList from './components/logList.vue';
import memorandums from './components/memorandums.vue';
// 响应式数据  
const list4 = reactive([
    { name: '项目信息' },
    { name: '电气信息' },
    { name: '备忘录' },
    { name: '日志' },
]);

const current = ref(0)
const detail = ref("")
const queryParams = ref("")
function decodeAndParseQueryString(encodedString) {
    // 由于这里的encodedString实际上已经是"解码"的（或者说，它是被错误理解的），
    // 我们只需要简单地以"="为分隔符分割字符串。
    // 但为了演示，我们假设它原本应该是编码后的，并先对其进行"解码"（尽管这里只是去除%3D）
    // 注意：这个函数假设输入总是有效的，并且不包含额外的编码字符（除了%3D）
    const decodedString = encodedString.replace(/%3D/g, '='); // 将%3D替换为=
    const [key, value] = decodedString.split('='); // 分割键和值
    return { [key]: value }; // 返回一个包含键值对的对象
}
onLoad((options) => {
    queryParams.value = decodeAndParseQueryString(options.scene)
    getDetail()
})
const change = (v) => {
    current.value = v.index
}
// 获取详情
const getDetail = async () => {
    let params = {
        id: +queryParams.value.id,
    }
    const res = await $http.post("/project/get_project_info", params)
    detail.value = res.data
}
</script>

<style lang="scss" scoped>
.tabs {
    padding: 24rpx 0;
    background-color: #fff;
    box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, .05);
    position: sticky;
    top: 0;
    z-index: 10;
}
</style>