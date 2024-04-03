<template>
    <view class="pages">
        <up-form errorType="toast" labelPosition="left" :model="form" ref="uFormRef" :rules="rules">
            <view class="card">
                <up-form-item borderBottom labelWidth="165rpx" label="工单名称：" prop="name" required>
                    <up-input v-model="form.name" border="none" />
                </up-form-item>
                <up-form-item borderBottom labelWidth="165rpx" label="客户名称：" prop="name" required>
                    <up-input v-model="form.name" border="none" />
                </up-form-item>
                <up-form-item borderBottom labelWidth="165rpx" label="创建人：" prop="name" required>
                    <up-input v-model="form.name" border="none" />
                </up-form-item>
            </view>
            <view class="card">
                <up-form-item borderBottom labelWidth="165rpx" label="工单类型" prop="name" required>
                    <template #right>
                        <view class="flex">
                            <view class="lableValue">是否</view>
                            <u-icon name="arrow-right"></u-icon>
                        </view>
                    </template>
                </up-form-item>
                <up-form-item borderBottom labelWidth="165rpx" label="是否加急" prop="name" required>
                    <template #right>
                        <u-icon name="arrow-right"></u-icon>
                    </template>
                </up-form-item>
                <up-form-item borderBottom labelWidth="200rpx" label="预计交付时间" prop="name" required>
                    <template #right>
                        <u-icon name="arrow-right"></u-icon>
                    </template>
                </up-form-item>
            </view>
            <view class="card">
                <up-form-item borderBottom labelWidth="165rpx" label="加急备注：" prop="name" required>
                    <u--textarea v-model="form.name" border="none" placeholder="请输入内容"></u--textarea>
                </up-form-item>
                <up-form-item borderBottom labelWidth="165rpx" label="工单备注：" prop="name" required>
                    <u--textarea v-model="form.name" border="none" placeholder="请输入内容"></u--textarea>
                </up-form-item>
            </view>
        </up-form>
        <up-button @click="submit">提交</up-button>
    </view>
</template>
<script setup>
import { ref } from 'vue';

// 响应式表单数据  
const form = ref({
    name: '',
});

// 校验规则  
const rules = {
    name: [
        {
            required: true,
            message: '请输入姓名',
            trigger: ['blur', 'change'],
        },
    ],
};

// 表单引用  
const uFormRef = ref(null);

// 提交方法  
function submit() {
    uFormRef.value.validate((valid) => {
        if (valid) {
            uni.$u.toast('校验通过')
        } else {
            uni.$u.toast('校验失败')
        }
    }).catch(() => {
        // 处理验证错误  
        uni.$u.toast('校验失败')
    });
}  
</script>
<style scoped lang="less">
.pages {
    background-color: #F2F2F7;
    padding: 30rpx;

    .card {
        background-color: #fff;
        padding: 20rpx 40rpx;
        padding-bottom: 0;
        border-radius: 12rpx;
        margin-bottom: 30rpx;
        .flex {
            display: flex;
            align-items: center;
            .labelValue {
                margin-right: 20rpx;
            }
        }
        &:deep(.u-form-item__body) {
            padding: 40rpx 0;
        }
        &:deep(.u-form-item) {
            &:last-child {
                .u-line  {
                    display: none;
                }
            }
        }
    }
}
</style>