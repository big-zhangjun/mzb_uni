<template>
    <view class="pages">
        <u--form labelPosition="left" :model="form" ref="uFormRef" :rules="rules">
            <view class="card">
                <up-form-item borderBottom labelWidth="165rpx" label="项目编号：" prop="number" required>
                    <up-input v-model="form.number" border="none" placeholder="请输入" />
                </up-form-item>
                <up-form-item borderBottom labelWidth="165rpx" label="产品编号：" prop="productNumber" required>
                    <up-input v-model="form.productNumber" border="none" placeholder="请输入" />
                </up-form-item>
                <up-form-item borderBottom labelWidth="165rpx" label="客户名称：" prop="customerName" required>
                    <up-input v-model="form.customerName" border="none" placeholder="请输入" />
                </up-form-item>
                <up-form-item borderBottom labelWidth="165rpx" label="产品名称：" prop="productName" required>
                    <up-input v-model="form.productName" border="none" placeholder="请输入" />
                </up-form-item>
                <up-form-item borderBottom labelWidth="165rpx" label="级别：" prop="level" required>
                    <up-input v-model="form.level" border="none" placeholder="请输入" />
                </up-form-item>
                <up-form-item borderBottom labelWidth="165rpx" label="规格型号：" prop="Model" required>
                    <up-input v-model="form.Model" border="none" placeholder="请输入" />
                </up-form-item>
            </view>
        </u--form>
        <up-button @click="submit">提交</up-button>
    </view>
</template>
<script setup>
import { onLoad } from '@dcloudio/uni-app';
import * as $http from '../../request/index'
import { ref } from 'vue';
const type = ref("")
// 响应式表单数据  
const form = ref({
    number: '',
});
const number = ref("")
const data = ref("")
onLoad((options) => {
    console.log(options);
    type.value = options.type
    data.value = options.id
    number.value = options.number
    if (type.value == 'add') {
        uni.setNavigationBarTitle({
            title: '新建项目'
        })
    } else {
        uni.setNavigationBarTitle({
            title: "编辑项目"
        })
        getData(+options.id, options.number)
    }
})
// 校验规则  
const rules = {
    number: [
        {
            required: true,
            message: '请输入项目编号：',
            trigger: ['blur', 'change'],
        },
    ],
    productNumber: [
        {
            required: true,
            message: '请输入产品编号：',
            trigger: ['blur', 'change'],
        },
    ],
    customerName: [
        {
            required: true,
            message: '请输入客户名称：',
            trigger: ['blur', 'change'],
        },
    ],
    productName: [
        {
            required: true,
            message: '请输入产品名称：',
            trigger: ['blur', 'change'],
        },
    ],
    Model: [
        {
            required: true,
            message: '请输入规格型号：',
            trigger: ['blur', 'change'],
        },
    ],
    level: [
        {
            required: true,
            message: '请输入级别',
            trigger: ['blur', 'change'],
        },
    ]
};

// 表单引用  
const uFormRef = ref(null);
const editFormFun = (params) => {
    params.id = data.value
    $http.post("/project/update_project_info", params).then(res => {
        if (res.status.retCode == 0) {
            uni.$u.toast('操作成功')
            setTimeout(() => {
                uni.navigateBack()
            }, 2000);
        }
    })

}
// 获取数据
const getData = (id, number) => {
    let params = {
        id,
        number
    }
    $http.post("/project/get_project_info", params).then(res => {
        let keys = [
            'number',
            "productNumber",
            "customerName",
            "productName",
            "level"
        ]
        keys.forEach(item=> {
            form.value[item] = res.data[item]
        })
        form.value.Model = res.data.model
    })

}
// 提交方法  
function submit() {
    uFormRef.value.validate().then(valid => {
        if (valid) {
            let params = {
                ...form.value,
                level: Number(form.value.level)
            }
            if (type.value == 'add') {

                $http.post("/project/add_project_info", params).then(res => {
                    if (res.status.retCode == 0) {
                        uni.$u.toast('操作成功')
                        setTimeout(() => {
                            uni.navigateBack()
                        }, 2000);
                    }

                }).catch(err => {
                    uni.$u.toast(err.status.msg)
                })
            } else {
                editFormFun(params)
            }
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
    min-height: 100vh;
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
                .u-line {
                    display: none;
                }
            }
        }
    }
}
</style>