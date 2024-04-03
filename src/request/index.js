const  config_url= "http://192.168.2.48:8012";
const request = (url, data = {}, method = 'GET') => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config_url + url,
			data: data,
			method: method,
			header: {
				'X-Requested-With': 'XMLHttpRequest',
				"Accept": "application/json",
				"Content-Type": 'application/json',
				"app-id": "0-0",
				"app-ts": "1711765157",
				"app-sig": "ab3b67e0fd340490d072b8a2788bc4e5",
			},
			dataType: 'json',
			success: (res) => {
				const responseData = interceptor(res.data);
				if (responseData.status.code === 'ok' || responseData.code === 500 ||responseData
					.code === 4025) {
					resolve(responseData);
				} else {
					// throwErr(res)
					reject(responseData);
				}
			},
			fail: function(err) {
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
    console.log(response);
	if (response.code === -2) {
		uni.showToast({
			title: response.msg,
			icon: 'none',
			duration: 2000,
			complete: () => {
				uni.reLaunch({
					url: '/pages/Login/index',
				});
			},
		});
		return false;
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