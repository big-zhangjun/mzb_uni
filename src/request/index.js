import md5 from "js-md5";
// const config_url = "http://192.168.3.175:8012";
const  config_url= "http://192.168.2.48:8012";
let user = uni.getStorageSync("user")
let id = "2-0";
let ts = Date.now()
let sig = md5(`2-0testkey${ts}`)
const request = (url, data = {}, method = 'GET') => {
	return new Promise((resolve, reject) => {
		if(user) {
			sig = md5('2-'+user.id +'testkey'+ ts)
			id = `2-${user.id}`
		}
		uni.request({
			url: config_url + url,
			data: data,
			method: method,
			header: {
				'X-Requested-With': 'XMLHttpRequest',
				"Accept": "application/json",
				"Content-Type": 'application/json',
				"app-id": id,
				"app-ts": ts,
				"app-sig": sig,
			},
			dataType: 'json',
			success: (res) => {
				const responseData = interceptor(res.data);
				if (responseData.status.code === 'ok' || responseData.status.
					retcode === 0 || responseData.status.retCode === 0) {
					resolve(responseData);
				} else {
					reject(responseData);
				}
			},
			fail: function (err) {
				reject(err)
			}
		})
	});
};

// GET 请求封装
const get = (url, data) => {
	return request(url, data, 'GET');
};

// POST 请求封装
const post = (url, data) => {
	return request(url, data, 'POST');
};
// PUT 请求封装
const put = (url, data) => {
	return request(url, data, 'PUT');
};

// DELETE 请求封装
const del = (url, data) => {
	return request(url, data, 'DELETE');
};

// 请求拦截
function interceptor(response) {

	if ( response.status.retcode == 1001) {
		uni.showToast({
			title: '登录过期，请重新登录',
			icon: 'none',
			duration: 2000,
			complete: () => {
				uni.reLaunch({
					url: '/pages/Login/index',
				});
			},
		});
		return response;
	}
	return response;
}

// 处理错误
function throwErr(res) {
	if (res.code == 500) {
		uni.showToast({
			title: res.msg,
		})
	}
}

export {
	get,
	post,
	put,
	del
}