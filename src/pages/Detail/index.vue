<template>
    <view class="pages">
        <view class="header">
            <view class="order-title">
                <view class="title">
                    {{ detail.customerName }}
                </view>
                <view class="tag" :class="getColor(detail.level)">P{{ detail.level }}</view>
            </view>
            <view class="info">
                <view class="item">
                    <view class="label">产品名称：</view><text>{{ detail.productName || '--' }}</text>
                </view>
                <view class="item">
                    <view class="label">规格型号：</view><text>{{ detail.model || '--' }}</text>
                </view>
                <!-- <view>预计交付时间：<text>2024-06-12</text></view> -->
            </view>
            <u-tabs :list="list1" @click="click" :current="current"
                :activeStyle="{ color: '#2E313C', fontWeight: 'bold', fontSize: '32rpx' }"
                :inactiveStyle="{ color: '#919399' }"></u-tabs>
        </view>
        <view class="detail" v-show="current == 0">
            <collapse :userList="userList" :detailData="detail" @updateDetail="updateDetail" />
        </view>
        <!-- 流程 -->
        <view v-show="current == 1" class="flow">
            <view class="common-title">电气流程</view>
            <view class="card" v-for="item in flowList" :key="item.id">
                <view class="card-header">
                    <view class="people">{{ item.content }}</view>
                    <view class="date">{{ formatDate(item.createTime) }}</view>
                </view>
                <!-- <u-swipe-action>
                    <u-swipe-action-item :options="options1" @click="handleDel(item)">
                        <view class="swipe-action u-border-top u-border-bottom">
                            <view class="swipe-action__content">
                                <view class="card-header" @click="handleEdit(item)">
                                    <view class="people">{{ item.content }}</view>
                                    <view class="date">{{ formatDate(item.createTime) }}</view>
                                </view>
                            </view>
                        </view>
                    </u-swipe-action-item>
                </u-swipe-action> -->
                <!-- <view class="content">{{ item.content }}</view> -->
            </view>
            <view v-show="!flowList.length" style="margin: 200rpx 0; ">
                <u-empty mode="data"></u-empty>
            </view>
            <!-- <view class="addBtn">
                <view class="add" @click="handleAdd">新增流程</view>
            </view> -->
        </view>
        <up-popup :show="show" mode="bottom" @close="close" @open="open" :round="30">
            <view class="flowForm">
                <view class="flowForm-header">
                    <view class="cancle" @click="show = false">取消</view>
                    <view class="title">{{ folwTitle }}</view>
                    <view class="confirm" @click="handleConfirm">确定</view>
                </view>
                <view class="content">
                    <view class="label">详细信息</view>
                    <!-- <input type="textarea" v-model="content" placeholder="请输入内容"> -->
                    <up-textarea v-model="content" height="676rpx" placeholder="请输入内容"></up-textarea>
                </view>
            </view>
        </up-popup>
        <!-- 提示 -->
        <up-modal showCancelButton @cancel="modal = false" @confirm="confirmDel" :show="modal" title="提示"
            content='确定删除该流程?'></up-modal>
        <!-- 日志 -->
        <view v-show="current == 2" class="work">
            <view class="common-title">工作日志</view>
            <view class="card" v-for="item in blogList" :key="item.id" @click="editWork(item)">
                <view class="work-header">
                    <view class="title">{{ item.customerName }}</view>
                    <view class="level">{{ formatDate(item.blogDate, 1) }}</view>
                </view>
                <view class="work-content">
                    <view class="size">内容：</view>
                    <view class="size-name">{{ item.content }}</view>
                </view>
                <view class="work-footer">
                    <view class="item">
                        <view class="label">地址：</view>
                        <view class="name">{{ item.address }}</view>
                    </view>
                    <!-- <view class="item">
                        <view class="label">产品编号：</view>
                        <view class="name">{{ item.productNumber }}</view>
                    </view> -->
                </view>
            </view>
            <view v-show="!blogList.length" style="margin: 200rpx 0; ">
                <u-empty mode="data"></u-empty>
            </view>
            <view class="add" @click="handleAdd">
                <image class="img" mode="aspectFill" src="../../static/images/add.png" alt=""></image>
            </view>
        </view>
    </view>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import * as $http from '../../request/index'
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app';
import collapse from './components/collapse.vue';
const current = ref(0)
const data = ref(null)
const detail = ref({})
const flowList = ref([])
const blogList = ref([])
const list1 = reactive([
    { name: '详细信息' },
    { name: '电气流程' },
    { name: '工作日志' }
]);
const totalPage = ref(0)
const folwTitle = ref("新增流程")
const modal = ref(false)
const show = ref(false)
const userList = ref([])
const pageIndex = ref(1)
const flow = ref({})
const content = ref("")
onLoad((options) => {
    data.value = options
})
onShow(() => {
    getDetail()
    blogList.value = []
    pageIndex.value = 1
    getBlogList()
})
onReachBottom(() => {
     
    pageIndex.value++
    getBlogList()
})
watch(current, (newV) => {
    if (newV == 1) {
        getFlowList()
    }
    if (newV == 2) {
        blogList.value = []
        pageIndex.value = 1
        getBlogList()
    }
})

// 定义方法  
function click(item) {
    current.value = item.index
}
// 处理日期格式
const formatDate = (timestamp, flag) => {
    const date = flag ? new Date(timestamp) : new Date(timestamp); // 注意时间戳要乘以1000，因为JavaScript中的时间戳是以毫秒为单位的
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，所以需要加1
    const day = date.getDate();
    return `${year}-${String(month).padStart(2, 0)}-${String(day).padStart(2, 0)}`;
}
// 获取详情
const getDetail = async () => {
    let params = {
        id: +data.value.id,
        number: data.value.number
    }
    const res = await $http.post("/project/get_ep_info", params)
    detail.value = res.data
}
// 更新详情
const updateDetail = () => {
    getDetail()
}
// 获取颜色class
const getColor = (v) => {
    let classNames = ['red', 'orange', 'green', 'cyan', 'blue']
    return classNames[v - 1]
}
const getBlogList = async () => {
    let params = {
        "content": "",
        "pageSize": 10,
        "pageIndex": pageIndex.value,
        "startDay": "",
        "endDay": "",
        projectID: +data.value.id
    }
    const res = await $http.post("/blog/get_blog_list", params)
    totalPage.value = res.data.totalPage
    blogList.value = [...blogList.value, ...res.data.records]

}
const editWork = (data) => {
    uni.navigateTo({
        url: `/pages/Detail/workLog?type=edit&id=${data.id}`
    })
    uni.setStorageSync("detail", data)
}
const handleAdd = () => {
    uni.navigateTo({
        url: `/pages/Detail/workLog?type=add`
    })
}

// 查询工作流程
const getFlowList = async (v) => {
    let params = {
        hostID: detail.value.id,
        pageIndex: 1,
        pageSize: 1000
    }
    const res = await $http.post("/flow/get_flow_list", params)
    flowList.value = res.data.records
    console.log(res, 'afdsad');
}
// // 新增工作流程
// const handleAdd = () => {
//     show.value = true
// }
// 确定新增
const handleConfirm = async () => {
    let params = {
        projectID: detail.value.id,
        userID: uni.getStorageSync("user").id,
        content: content.value
    }
    folwTitle.value == "编辑流程" ? handleEditConfirm(params) : handleAddConfirm(params)

}
const handleAddConfirm = async (params) => {
    const res = await $http.post("/flow/add_flow_info", params)
    if (res.status.retCode === 0) {
        uni.showToast({
            title: "操作成功",
            icon: "none"
        })
        show.value = false
        getFlowList()
    }
}
const handleEditConfirm = async (params) => {
    const res = await $http.post("/flow/update_flow_info", { ...params, id: flow.value.id })
    if (res.status.retCode === 0) {
        uni.showToast({
            title: "操作成功",
            icon: "none"
        })
        show.value = false
        getFlowList()
    }
}
const handleDel = (v) => {
    modal.value = true
    folwTitle.value = "新增流程"
    flow.value = v
}
const handleEdit = (v) => {
    show.value = true
    folwTitle.value = '编辑流程'
    flow.value = v
    content.value = v.content
}
const close = () => {
    show.value = false
}
const confirmDel = async () => {
    let params = {
        id: flow.value.id
    }
    const res = await $http.post("/flow/del_flow_info", params)
    if (res.status.retCode === 0) {
        uni.showToast({
            title: "操作成功",
            icon: "none"
        })
        modal.value = false
        getFlowList()
    }
}
// 修改日期
const handleDateConfirm = (type, value) => {
    console.log(type, value)
}
</script>

<style lang="less" scoped>
.header {
    width: 100vw;
    background: #fff;
    box-sizing: border-box;

    .order-title {
        padding: 30rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30rpx;
        padding-bottom: 0;

        .title {
            color: #2E313C;
            font-size: 32rpx;
            font-weight: bold;
        }

        .tag {
            padding: 0 20rpx;
            line-height: 40rpx;
            font-size: 22rpx;
            border-radius: 4rpx;
            border-radius: 8rpx;
            color: rgb(236, 26, 26);
            background-color: rgba(236, 26, 26, 0.1);
        }
        .red {
            color: rgba(245, 114, 80, 1);
            background-color: rgba(245, 114, 80, .1);
        }
        .orange {
            color: rgba(245, 172, 55, 1);
            background-color: rgba(245, 172, 55, .1);
        }
        .green {
            color: rgba(105, 198, 110, 1);
            background-color: rgba(105, 198, 110, .1);
        }
        .cyan {
            color: rgba(84, 112, 198, 1);
            background-color: rgba(84, 112, 198, .1);
        }
        .blue {
            color: rgba(80, 129, 194, 1);
            background-color: rgba(80, 129, 194, .1);
        }
    }

    .info {
        padding: 0 30rpx;
        font-size: 26rpx;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .item {
            display: flex;
            margin-bottom: 20rpx;
            width: 50%;

            .label {
                color: #B4B6BC;
            }

            text {
                color: #2E313C;
            }
        }

        .b0 {
            margin-bottom: 23rpx;
        }
    }

    &:deep(.u-tabs) {
        margin-left: 10rpx;
    }
}

.detail,
.flow,
.work {
    .common-title {
        font-size: 28rpx;
        color: #2E313C;
        margin: 20rpx 0;
        padding-left: 56rpx;
        position: relative;

        &::before {
            content: "";
            display: block;
            width: 6rpx;
            height: 26rpx;
            background-color: rgba(84, 112, 198, 1);
            position: absolute;
            left: 30rpx;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}

.detail {


    .detail-card {
        width: calc(100% - 60rpx);
        box-sizing: border-box;
        background-color: #fff;
        margin: 0 auto;
        box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(70, 66, 61, 0.09);
        border-radius: 8rpx;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 26rpx;
        padding: 30rpx;

        .item {
            display: flex;
            margin-bottom: 20rpx;
            width: 50%;

            .label {
                color: #B4B6BC;
            }

            text {
                color: #2E313C;
            }
        }

    }
}

.flow {
    .card {
        width: calc(100% - 60rpx);
        margin: 0 auto;
        background-color: #fff;
        border-radius: 18rpx;
        overflow: hidden;
        box-sizing: border-box;
        margin-bottom: 30rpx;
        &:deep(.u-border-bottom) {
            border: none;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            padding: 30rpx 20rpx;
            gap: 12rpx;

            .status {
                line-height: 36rpx;
                padding: 0 12rpx;
                font-size: 22rpx;
                border-radius: 8rpx;
                margin-right: 20rpx;
            }

            .green {
                color: green;
                border: solid 1rpx rgb(114, 190, 0);
            }

            .people {
                font-size: 32rpx;
                color: #2E313C;
                font-weight: bold;
                margin-right: auto;
                flex: 1;
            }

            .date {
                font-size: 26rpx;
                color: #919399;
            }
        }

        .content {
            font-size: 28rpx;
            color: #919399;
            margin-top: 30rpx;
        }
    }

    .addBtn {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 148rpx;
        background-color: #fff;
        border-top: solid rgb(228, 228, 228) 1px;
    }

    .add {
        width: calc(100% - 60rpx);
        line-height: 98rpx;
        background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
        border-radius: 12rpx;
        color: #fff;
        font-size: 28rpx;
        text-align: center;
        position: fixed;
        bottom: 25rpx;
        left: 50%;
        transform: translateX(-50%);

        &:active {
            background: rgb(80, 167, 253);
        }
    }
}

.pages {
    background-color: #F5F5F7;
    min-height: 100vh;
}

.flowForm {
    background-color: #F5F5F7;
    padding: 30rpx;

    .flowForm-header {
        display: flex;
        justify-content: space-between;
        padding: 30rpx 20;

        .cancle {
            font-size: 32rpx;
            color: #666666;
        }

        .title {
            font-size: 36rpx;
            color: #333;
            font-weight: bold;
        }

        .confirm {
            color: #12151b;
            font-size: 32rpx;
        }
    }

    .content {
        width: 100%;
        background-color: #fff;
        margin-top: 30rpx;
        border-radius: 12rpx;
        height: 853rpx;
        overflow: hidden;
        box-sizing: border-box;
        padding: 30rpx;

        .label {
            font-size: 32rpx;
            font-weight: bold;
            margin: 30rpx 0;
            margin-top: 0;
        }

        &:deep(.u-textarea) {
            background-color: #F1F0F5;
        }
    }
}

.work {
    padding-bottom: 30rpx;

    .card {
        width: calc(100% - 60rpx);
        margin: 0 auto;
        margin-top: 30rpx;
        // height: 100rpx;
        box-shadow: 0rpx 6rpx 18rpx 0rpx rgba(70, 66, 61, 0.1);
        background-color: #fff;
        padding: 30rpx;
        box-sizing: border-box;
        border-radius: 12rpx;

        .work-header {
            font-size: 32rpx;
            color: #2E313C;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
                max-width: 470rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .level {
                font-size: 24rpx;
                color: #5470c6;
                font-weight: normal;
            }
        }

        .work-content {
            display: flex;
            margin-top: 20rpx;
            color: #12151b;
            font-size: 28rpx;
            align-items: center;

            .size {
                width: 100rpx;
            }

            .size-name {
                color: #919399;
                flex: 1;
            }
        }

        .work-footer {
            margin-top: 30rpx;
            width: 100%;
            box-sizing: border-box;
            border-top: solid 1rpx #EFEFEF;
            padding-top: 30rpx;
            font-size: 26rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #12151b;

            .item {
                display: flex;
                align-items: center;

                .label {
                    width: 100rpx;
                }
            }

            .name {
                border-radius: 6rpx;
                color: #919399;
                flex: 1;
            }
        }
    }
}

.add {
    position: fixed;
    width: 100rpx;
    height: 100rpx;
    background: linear-gradient(160deg, rgb(62, 161, 253) 0%, rgb(55, 133, 250) 100%);
    box-shadow: 0rpx 4rpx 12rpx 0rpx rgba(72, 105, 175, 0.45);
    right: 30rpx;
    bottom: 137rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100rpx;

    .img {
        width: 50rpx;
        height: 50rpx;
    }
}
</style>