<template>
    <view class="card">
        <up-collapse @change="change" @close="close" @open="open">
            <up-collapse-item title="电气柜" name="Docs guide">
                <view class="item" @click="chooseManage('ec')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/menage.svg"
                            alt=""></image>
                        电气柜负责人
                    </view>
                    <view class="value">
                        {{ detailData.ecRepName || '请选择' }}
                    </view>
                </view>
                <view class="item">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/qindan.svg"
                            alt=""></image>
                        电气柜清单
                    </view>
                    <view class="value">请选择</view>
                </view>
                <view class="item" @click="handleDate('ecStartDate', detailData.ecStartDate, 'ec')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/start.svg"
                            alt=""></image>
                        电气柜开始日期
                    </view>
                    <view class="value">{{ detailData.ecStartDate ==  '1000-01-01' ? '请选择' :detailData.ecStartDate || '请选择' }}</view>
                </view>
                <view class="item" @click="handleDate('ecEndDate', detailData.ecEndDate, 'ec')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/end.svg"
                            alt=""></image>
                        电气柜结束日期
                    </view>
                    <view class="value">{{ detailData.ecEndDate ==  '1000-01-01' ? '请选择' :  detailData.ecEndDate  || '请选择' }}</view>
                </view>
                <view class="item" @click="handlePicker('ec')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/statu.svg"
                            alt=""></image>
                        电气柜安装状态
                    </view>
                    <view class="value">{{ getEsStatus(detailData.ecStatus) }}</view>
                </view>
            </up-collapse-item>
            <up-collapse-item title="安装" name="Variety components">
                <view class="item" @click="chooseManage('si')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/menage.svg"
                            alt=""></image>
                        安装负责人
                    </view>
                    <view class="value">
                        {{ detailData.siRepName || '请选择' }}
                    </view>
                </view>
                <view class="item" @click="handleDate('siStartTime', detailData.siStartTime, 'si')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/start.svg"
                            alt=""></image>
                        安装开始日期
                    </view>
                    <view class="value">{{ detailData.siStartTime  ==  '1000-01-01' ? '请选择' :detailData.siStartTime || '请选择' }}</view>
                </view>
                <view class="item" @click="handleDate('siEndTime', detailData.siEndTime, 'si')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/end.svg"
                            alt=""></image>
                        安装结束日期
                    </view>
                    <view class="value">{{ detailData.siEndTime ==  '1000-01-01' ? '请选择' :detailData.siEndTime || '请选择' }}</view>
                </view>
                <view class="item" @click="handlePicker('si')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/statu.svg"
                            alt=""></image>
                        安装状态
                    </view>
                    <view class="value">{{ getEsStatus(detailData.siStatus) }}</view>
                </view>
            </up-collapse-item>
            <up-collapse-item title="售后" name="Numerous tools">
                <view class="item" @click="chooseManage('as')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/menage.svg"
                            alt=""></image>
                        售后负责人
                    </view>
                    <view class="value">
                        {{ detailData.asRepName || '请选择' }}
                    </view>
                </view>
                <view class="item" @click="handleDate('asStartTime', detailData.asStartTime, 'as')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/start.svg"
                            alt=""></image>
                        售后开始日期
                    </view>
                    <view class="value">{{ detailData.asStartTime  ==  '1000-01-01' ? '请选择' :detailData.asStartTime|| '请选择' }}</view>
                </view>
                <view class="item" @click="handleDate('asEndTime', detailData.asEndTime, 'as')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/end.svg"
                            alt=""></image>
                        售后结束日期
                    </view>
                    <view class="value">{{ detailData.asEndTime ==  '1000-01-01' ? '请选择' :detailData.asEndTime || '请选择' }}</view>
                </view>
                <view class="item" @click="handlePicker('as')">
                    <view class="label">
                        <image class="icon" width="10" height="10" mode="aspectFit" src="../../static/images/statu.svg"
                            alt=""></image>
                        售后状态
                    </view>
                    <view class="value">{{ getEsStatus(detailData.asStatus) }}</view>
                </view>
            </up-collapse-item>
        </up-collapse>
        <up-picker :defaultIndex="defaultIndex" :show="rpStatus" ref="uPickerRef" :columns="columns"
            @confirm="handleChangeEpStatus" keyName="label" @cancel="rpStatus = false"></up-picker>
        <up-calendar :show="dateStatus" :defaultDate="defaultDate" @close="dateStatus = false"
            @confirm="handleDateConfirm"></up-calendar>
        <up-popup :show="userModel" @close="handleClose" @open="open">
            <view>
                <checkUser v-if="userModel" :projectID="projectId" :number="number" :type="cType"/>
            </view>
        </up-popup>
    </view>
</template>
<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import checkUser from '../checkUser.vue';
import * as $http from '../../../request/index'
const emit = defineEmits(['updateDetail'])
const open = () => {
    console.log('ss');
}
const rpStatus = ref(false)
const statusType = ref("")
const props = defineProps({
    userList: Array,
    detailData: Object
})
const projectId = ref(0)
const number = ref('')
const cType = ref('')
const userModel = ref(false)
const defaultIndex = ref([0])
const columns = ref([
    [
        {
            label: "未开始",
            id: 1
        },
        {
            label: "进行中",
            id: 2
        },
        {
            label: "缺料中",
            id: 3
        },
        {
            label: "已完成",
            id: 4
        }
    ]
])
const dateType = ref("")
const defaultDate = ref(Date.now())
const dateStatus = ref(false)
const chooseManage = (type) => {
    projectId.value = props.detailData.id
    number.value = props.detailData.number
    cType.value = type
    statusType.value = type
    // uni.navigateTo({
    //     url: `/pages/Detail/checkUser?id=${props.detailData.id}&numbr=${props.detailData.number}&type=${type}`
    // })
    userModel.value  = true
}
const ecParams = ref({
    "startDate": "",
    "endDate": "",
    "status": "",
    "statusCN": ""
})
const siParams = ref({
    "startDate": "",
    "endDate": "",
    "status": "",
    "statusCN": ""
})
const asParams = ref({
    "startDate": "",
    "endDate": "",
    "status": "",
    "statusCN": ""
})
onMounted(() => {
    ecParams.value = {
        "startDate": props.detailData.ecStartDate,
        "endDate": props.detailData.ecEndDate,
        "status": props.detailData.ecStatus,
        "statusCN": getEsStatus(props.detailData.ecStatus)
    }
    siParams.value = {
        "startDate": props.detailData.siStartTime,
        "endDate": props.detailData.siEndTime,
        "status": props.detailData.siStatus,
        "statusCN": getEsStatus(props.detailData.siStatus)
    }
    asParams.value = {
        "startDate": props.detailData.siStartTime,
        "endDate": props.detailData.siEndTime,
        "status": props.detailData.siStatus,
        "statusCN": getEsStatus(props.detailData.siStatus)
    }
})
const handleClose = () => {
    userModel.value=false
    console.log('ssaaaaaa');
    updateDetail()
}

const handlePicker = (type) => {
    statusType.value = type
    let status = ""
    switch (type) {
        case "ec":
            status = props.detailData.ecStatus
            break
        case "si":
            status = props.detailData.siStatus
            break
        case "as":
            status = props.detailData.asStatus
            break
    }
    rpStatus.value = true
    let index = columns.value[0].findIndex(item => item.id == status)
    if (index != -1) {
        defaultIndex.value = [index]
    }
}
// 修改电气柜安装状态
const handleChangeEpStatus = (v) => {
    rpStatus.value = false
    switch (statusType.value) {
        case "ec":
            ecParams.value.status = v.value[0].id
            ecParams.value.statusCN = v.value[0].label
            break
        case "si":
            siParams.value.status = v.value[0].id
            siParams.value.statusCN = v.value[0].label
            break
        case "as":
            asParams.value.status = v.value[0].id
            asParams.value.statusCN = v.value[0].label
            break
    }
    updateDetail();
}
const handleDate = (v, key, type) => {
    statusType.value = type
    dateStatus.value = true
    defaultDate.value = key
    dateType.value = v

}
// 获取电气柜安装状态
const getEsStatus = (v) => {
    let res = columns.value[0].find(item => item.id == v)
    if (res) {
        return res.label
    } else {
        return '未开始'
    }
}
const handleDateConfirm = (v) => {
    switch (dateType.value) {
        case "ecStartDate":
            ecParams.value.startDate = v[0];
            break
        case "ecEndDate":
            ecParams.value.endDate = v[0];
            break
        case "siStartTime":
            siParams.value.startDate = v[0];
            break
        case "siEndTime":
            siParams.value.endDate = v[0];
            break
        case "asStartTime":
            asParams.value.startDate = v[0];
            break
        case "asEndTime":
            asParams.value.endDate = v[0];
            break
    }
    dateStatus.value = false
    updateDetail()
}
// 修改电柜信息
const updateDetail = async () => {
    switch (statusType.value) {
        case "ec":
            upEcDetail()
            break
        case "si":
            upSiDetail()
            break
        case "as":
            upAsDetail()
            break

    }
}
const upEcDetail = async () => {
    const { startDate, endDate, status, statusCN } = ecParams.value
    const params = {
        "id": +props.detailData.id,
        startDate,
        endDate,
        status,
        statusCN
    }
    let res = await $http.post("/project/update_ec_info", params)
    if (res.status.retCode === 0) {
        emit("updateDetail")
    }
}
// 修改安装信息
const upSiDetail = async () => {
    const { startDate, endDate, status, statusCN } = siParams.value
    const params = {
        "id": +props.detailData.id,
        startDate,
        endDate,
        status,
        statusCN
    }
    let res = await $http.post("/project/update_si_info", params)
    if (res.status.retCode === 0) {
        emit("updateDetail")
    }
}
// 修改售后信息
const upAsDetail = async () => {
    const { startDate, endDate, status, statusCN } = asParams.value
    const params = {
        "id": +props.detailData.id,
        startDate,
        endDate,
        status,
        statusCN
    }
    let res = await $http.post("/project/update_as_info", params)
    if (res.status.retCode === 0) {
        emit("updateDetail")
    }
}
</script>
<style lang="scss" scoped>
.card {
    margin: 30rpx 0;
    background-color: #fff;
    border-radius: 12rpx;
    overflow: hidden;

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4rpx 0;
        border-bottom: solid #eee 1px;

        &:last-child {
            border: none;
        }

        &:deep(.u-collapse) {
            padding: 0 30rpx;
        }

        .label {
            font-size: 28rpx;
            color: #222;
            display: flex;
            align-items: center;
            gap: 20rpx;
        }

        .icon {
            width: 44rpx;
            height: 44px;
        }

        .value {
            flex: 1;
            text-align: right;
            color: #B4B6BC;
            font-size: 26rpx;

            .list {
                display: flex;
                text-align: right;
            }
        }
    }
}
</style>