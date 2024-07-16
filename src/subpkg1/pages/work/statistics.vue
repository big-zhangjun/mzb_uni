<template>
    <view class="statistics">
        <view class="calendar">
            <view class="calendar-header">
                <view class="calendar-date">{{ nowYear + "年" + nowMonth + "月" }}</view>
                <view class="right-wrap">
                    <view class="header-icon-wrap" @tap="handleClickPrevMonth">
                        <up-icon name="arrow-left" color="#12151b" size="20"></up-icon>
                    </view>
                    <view class="header-icon-wrap" @tap="handleClickNextMonth">
                        <up-icon name="arrow-right" color="#12151b" size="20"></up-icon>
                    </view>
                </view>
                <!-- <view class="calendar-tip">22</view> -->
            </view>
            <!-- 星期展示 -->
            <view class="calendar-grid calendar-week">
                <view v-for="(value, index) in weekDay" :key="index" class="calendar-grid-item calendar-week-item">
                    <view class="calendar-grid-item-text"> {{ value }}</view>
                </view>
            </view>
            <!-- 日期内容 -->
            <view class="calendar-grid calendar-day">
                <view v-for="(item, index) in totalDayList" :key="index" class="calendar-grid-item calendar-day-item"
                    @click="handleCheck(item, index)">
                    <view :class="{
                        'calendar-grid-item-text': true,
                        'calendar-prev-month-day': item.prevMonth,
                        'calendar-next-month-day': item.nextMonth,
                        'calendar-check': item.check,
                        'calendar-today': item.today,
                    }">
                        {{ item.day }}
                    </view>
                    <view v-if="item.warnning" class="calendar-day-mark">
                        <view class="warnging-round"></view>
                    </view>
                    <view v-if="item.success" class="calendar-day-mark">
                        <view class="success-round"></view>
                    </view>
                </view>
            </view>
        </view>
        <view class="content">
            <view class="header">
                共 <text>{{ worlList.length }}</text> 条日志
            </view>
            <view class="list" v-if="worlList.length">
                <view class="card" v-for="item in worlList" :key="item.id">
                    <view class="avawer">
                        <image class="user" v-if="item.avatar" width="100" height="10" mode="aspectFill" src="../../static/images/user.png" alt="">
                        </image>
                        <image class="user" v-else width="100" height="10" mode="aspectFill" src="../../static/images/user.png" alt="">
                        </image>
                    </view>
                    <view class="detail">
                        <view class="name">{{ item.realName }}</view>
                        <view class="cus">{{ item.customerName }}</view>
                        <view class="address">{{ item.address }}</view>
                    </view>
                    <view class="right">
                        <view class="model">{{ item.model }}</view>
                        <view class="date">{{ item.blogDate }}</view>
                    </view>
                </view>
            </view>
            <view class="no-data" v-else>
                <u-empty mode="data">
                </u-empty>
            </view>
        </view>
    </view>
</template>

<script>
import * as $http from '../../../request/index'
export default {
    props: {
        values: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            dataSoruce: [],
            worlList: [],
            weekDay: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            nowYear: new Date().getFullYear(),
            nowMonth: new Date().getMonth() + 1,
            nowDay: new Date().getDate(),
            maxDayList: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            totalDay: [],
        };
    },
    computed: {
        totalDayList() {
            let arr = this.dataSoruce.map(item => item.blogDate)
            let list = this.totalDay.map((item, idx) => {
                let value = this.formatDate(item.year, item.month, item.day)
                return {
                    warnning: !arr.includes(value) && this.compareDate(value),
                    success: arr.includes(value),
                    ...item,
                }
            })
            return list
        }
    },
    onLoad() {
        this.getData()

    },
    methods: {
        compareDate(dateString) {
            // 将传入的日期字符串转换为Date对象  
            const inputDate = new Date(dateString);

            // 获取当前日期和时间  
            const today = new Date();

            // 为了仅比较日期部分，我们将时间设置为00:00:00  
            today.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);

            // 比较两个日期  
            if (inputDate < today) {
                return true;
            } else if (inputDate > today) {
                return false;
            } else {
                return true;
            }
        }
        ,
        formatDate(year, month, day) {
            // 使用模板字符串确保月份和日期始终是两位数  
            // 如果月份或日期小于10，前面会添加一个0  
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        },
        async getData() {
            let user = uni.getStorageSync("user")
            let params = {
                "userID":  user.id,
                "startDate": "",
                "endDate": ""
            }
            let res = await $http.post("/blog/get_blog_list2", params)
            this.dataSoruce = res.data
        },
        async getCurrentData(startDate, endDate) {

            let user = uni.getStorageSync("user")
            let params = {
                "userID":  user.id,
                "startDate": startDate,
                "endDate": endDate
            }
            let res = await $http.post("/blog/get_blog_list2", params)
            this.worlList = res.data
        },
        initCalendar() {
            const maxDayList = [...this.maxDayList];
            const year = this.nowYear;
            const month = this.nowMonth;

            //计算当前年是不是闰年，规则：能被4整除且不被100整除，或者能被400整除的年份
            maxDayList[1] =
                (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;

            this.maxDayList = maxDayList;

            // 累计当天天数
            let days = [];
            for (let index = 1; index <= maxDayList[month - 1]; index++) {
                let { check, value } = this.getCheckState(year, month, index);
                days.push({
                    year,
                    month,
                    day: index,
                    today: this.isToDay(index),
                    check,
                    value,
                });
            }

            //当前月的1号是星期几,0是星期天
            let firstDayWeek = new Date(year + "/" + month + "/1").getDay();

            //需要补的前置天数，需要处理是否是本年的月份
            let beforeDays = [];
            let nowYear = this.nowYear;
            let previousMonth = month - 1;
            let previousMonthIndex = month - 2;
            if (previousMonthIndex < 0) {
                previousMonthIndex = 11;
                nowYear = nowYear - 1;
                previousMonth = 12;
            }
            for (let index = 0; index < firstDayWeek; index++) {
                let day = maxDayList[previousMonthIndex] - index;
                let { check, value } = this.getCheckState(
                    nowYear,
                    previousMonthIndex + 1,
                    day
                );
                beforeDays.push({
                    year,
                    month: previousMonth,
                    day,
                    prevMonth: true,
                    check,
                    value,
                });
            }
            //当前月最后一天是星期几
            let endDayWeek = new Date(
                year + "/" + month + "/" + maxDayList[month - 1]
            ).getDay();

            let newxMonth = month + 1;
            if (month === 12) {
                newxMonth = 1;
            }
            //需要补的后置天数
            let afterDays = [];
            for (let index = 1; index < 7 - endDayWeek; index++) {
                let { check, value } = this.getCheckState(nowYear, newxMonth, index);
                afterDays.push({
                    year,
                    month: newxMonth,
                    day: index,
                    nextMonth: true,
                    check,
                    value,
                });
            }

            this.totalDay = [...beforeDays.reverse(), ...days, ...afterDays];
            let startDate = this.formatDate(days[0].year, days[0].month, days[0].day)
            let endtDate = this.formatDate(days[days.length - 1].year, days[days.length - 1].month, days[days.length - 1].day)
            this.getCurrentData(startDate, endtDate)

        },

        getCheckState(year, month, day) {
            let currentMonth = month > 9 ? month : "0" + month;
            let currentDay = day > 9 ? day : "0" + day;
            let curentDate = `${year}${currentMonth}${currentDay}`;
            let item = this.values?.find((item) => item.date === curentDate);
            if (item) return { check: true, value: item.xbCount };
            return {};
        },

        isToDay(day) {
            let currentYear = new Date().getFullYear();
            let currentMonth = new Date().getMonth() + 1;
            let currentDay = new Date().getDate();
            if (
                currentDay === day &&
                this.nowYear === currentYear &&
                this.nowMonth === currentMonth
            )
                return true;
            return false;
        },

        handleClickPrevMonth() {
            if (this.nowMonth === 1) {
                this.nowMonth = 12;
                this.nowYear = this.nowYear - 1;
            } else {
                this.nowMonth = this.nowMonth - 1;
            }

            this.initCalendar();
        },

        handleClickNextMonth() {
            if (this.nowMonth === 12) {
                this.nowMonth = 1;
                this.nowYear = this.nowYear + 1;
            } else {
                this.nowMonth = this.nowMonth + 1;
            }

            this.initCalendar();
        },

        handleCheck(item, idx) {
            this.totalDay.forEach((item, index) => {
                if (idx === index) {
                    item.check = true
                } else {
                    item.check = false
                }

            })
            let date = this.formatDate(item.year, item.month, item.day)
            this.getCurrentData(date, date)
        },
    },
    mounted() {
        this.initCalendar();
    },
};
</script>

<style lang="less" scoped>
.calendar {
    width: 100%;
    height: 100%;
    padding: 0 20rpx;
    box-sizing: border-box;

    .calendar-header {
        padding: 0 16rpx;
        margin: 36rpx 0 12rpx;
        height: 48rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .right-wrap {
            width: 140rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .header-icon-wrap {
            padding: 0 16rpx;
        }

        .calendar-date {
            font-size: 38rpx;
            font-weight: 500;
            color: #07132b;
            padding: 0 16rpx;
            font-weight: bold;
        }

        .calendar-tip {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            background: #fff5c6;
            border-radius: 26rpx 0px 0px 26rpx;
            padding: 0 16rpx 0 20rpx;
            line-height: 48rpx;
            font-size: 24rpx;
            font-weight: 400;
            color: #eccc66;
        }
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 14.28%);

        .calendar-week-item {
            .calendar-grid-item-text {
                font-size: 24rpx;
                color: rgb(173, 173, 173);
            }
        }

        .calendar-day-item {
            .calendar-grid-item-text {
                font-size: 28rpx;
                color: #12151b;
            }
        }

        .calendar-grid-item {
            height: 84rpx;
            text-align: center;
            font-size: 28rpx;
            position: relative;
            font-weight: 500;
            color: #07132b;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: column;
            margin-top: 12rpx;

            .calendar-grid-item-text {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 62rpx;
                height: 62rpx;
                //   color: #12151b;
            }
        }
    }

    .calendar-day {
        .calendar-day-item {

            .calendar-prev-month-day,
            .calendar-next-month-day {
                color: #a6b1bf;
            }

            .calendar-check {
                background: rgba(64, 135, 241, 0.2);
                border-radius: 50%;
                // border-radius: 50%;
                color: rgb(64, 135, 241);
                // color: rgb(64, 135, 241);
            }

            .calendar-warnning-day {
                color: red;
            }

            .calendar-today {
                background: rgb(64, 135, 241);
                border-radius: 50%;
                color: #ffffff;
            }

            .calendar-day-mark {

                // height: 26rpx;
                // font-size: 20rpx;
                // font-weight: 400;
                // color: #eccc66;
                // display: flex;
                // align-items: center;
                .warnging-round {
                    width: 12rpx;
                    height: 12rpx;
                    background-color: rgb(255, 183, 100);
                    border-radius: 50%;
                    position: absolute;
                    bottom: 2rpx;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .success-round {
                    width: 12rpx;
                    height: 12rpx;
                    background-color: rgb(64, 135, 241);
                    border-radius: 50%;
                    position: absolute;
                    bottom: 2rpx;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }
}

.content {
    margin-top: 30rpx;
    font-size: 32rpx;
    box-shadow: 4rpx -4rpx 20rpx 4rpx rgba(0, 0, 0, .05);
    padding: 30rpx;
    width: 100%;
    box-sizing: border-box;
    padding-top: 80rpx;
    background-color: #fff;

    .header {
        font-weight: bold;

        text {
            color: rgba(255, 39, 39, 0.904);
            font-weight: normal;
        }
    }

    .list {
        margin-top: 30rpx;

        .card {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding: 30rpx 20rpx;
            padding-bottom: 30rpx;
            border-bottom: 1rpx solid #e6e6e6;
            &:last-child {
                padding-bottom: 50rpx;
                border: none;
            }

            .avawer {
                width: 100rpx;
                height: 100rpx;
                border-radius: 50%;
                background-color: #cacaca;
                .user {
                    width: 100rpx;
                    height: 100rpx;
                }
            }

            .detail {
                font-size: 26rpx;
                padding-left: 30rpx;
                flex: 1;
                margin-right: 20rpx;

                .name {
                    font-size: 24rpx;
                }

                .cus {
                    margin-top: 12rpx;
                    margin-bottom: 12rpx;
                    font-size: 28rpx;
                    font-weight: bold;
                }

                .address {
                    color: #aaaaaa;
                }
            }

            .right {
                position: relative;

                .model {
                    color: rgb(255, 181, 43);
                    align-items: center;
                    border-radius: 4rpx;
                    font-size: 24rpx;
                }

                .date {
                    color: #aaaaaa;
                    font-size: 22rpx;
                    margin-top: 80rpx;
                }
            }
        }
    }

    .no-data {
        margin-top: 50rpx;
        padding-bottom: 50px;
    }
}
</style>