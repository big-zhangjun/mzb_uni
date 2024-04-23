<template>
    <view class="proup">
        <template v-for="item in filterData" :key="item.title">
            <view class="label">
                {{ item.title }}
            </view>
            <view class="list">
                <view class="item" :class="{active: item.checkList.includes(_item.id)}" @click="handleCheck(item, _item)" v-for="_item in item.children" :key="_item.id">{{
                    _item.label }}</view>
            </view>
        </template>
        <view class="btns">
            <view class="confirm" @click="handleConfirm">确定</view>
            <view class="reset" @click="handleReset">重置</view>
        </view>
    </view>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
const props = defineProps({
    filterData: Array
})
const emit = defineEmits(['handleConfirm','handleReset'])
const handleCheck = (data, value) => {
    // 单选
    if(data.single) {
        // 多选
        let index = data.checkList.findIndex(item=> item == value.id)

        if(index != -1) {
            data.checkList = []
        } else {
            data.checkList = [value.id]
        }
        console.log(data,'ss');
    } else {
        // 多选
        let index = data.checkList.findIndex(item=> item == value.id)
        if(index != -1) {
            data.checkList.splice(index, 1)
        } else {
            data.checkList.push(value.id)
        }
    }
}
const handleConfirm = () => {
    emit("handleConfirm")
}
const handleReset = () => {
    emit("handleReset")
}
</script>

<style lang="scss" scoped>
.proup {
    width: 75vw;
    box-sizing: border-box;
    padding: 24rpx;

    .label {
        font-weight: bold;
        font-size: 32rpx;
        margin-bottom: 40rpx;
    }

    .list {
        display: flex;
        flex-wrap: wrap;
        gap: 28rpx;
        margin-bottom: 60rpx;

        .item {
            padding: 0 28rpx;
            background-color: rgb(244, 244, 244);

            line-height: 60rpx;
            font-size: 28rpx;
            border-radius: 60rpx;
            color: rgb(112, 104, 104);
            border: solid 1px rgb(244, 244, 244);
        }

        .active {
            border: solid 1px rgb(57, 158, 250);
            color: #12151b;
            font-weight: bold;
        }
    }
    .btns {
        width: 100%;
        height: 128rpx;
        border-top: solid #f0f0f0 1rpx;
        left: 0;
        display: flex;
        align-items: center;
        gap: 24rpx;
        .confirm, .reset {
            padding: 0 65rpx;
            line-height: 80rpx;
            border: solid rgba(180, 182, 188, 1) 1rpx;
            border-radius: 9rpx;
        }
        .confirm {
            background-color: rgb(57, 158, 250);;
            color: #fff;
            border: solid rgb(57, 158, 250) 1rpx;
        }
    }
}
</style>