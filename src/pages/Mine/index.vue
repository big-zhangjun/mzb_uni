<template>
    <div>
        <button @click="logout">退出登录</button>
    </div>
</template>

<script setup>
const logout = () => {
    uni.clearStorageSync()
    uni.reLaunch({
        url: '/pages/Login/index',
    });
}
</script>

<style lang="scss" scoped></style>