//配置HOST
// var HOST_URL = 'http://192.168.2.202:5000'
// var LOGIN_URL = 'http://192.168.2.106:8001'
// var HOST_URL = 'http://192.168.2.108:8001'
//var HOST_URL = 'http://192.168.118.173:5000'
var HOST_URL = 'http://192.168.2.202:5000'


// var LOGIN_URL = 'http://192.168.2.90:9095'

// var USER_CENTER_FRONT = 'http://192.168.2.90:9095';
// var USER_CENTER_SERVER = 'http://192.168.2.90:9095/user_auth_center'

var USER_CENTER_FRONT = 'http://192.168.2.106:8001';
var USER_CENTER_SERVER = 'http://192.168.2.106:8001/user_auth_center'

var USER_CENTER_LOGIN = USER_CENTER_FRONT + "/login.html";
var USER_CENTER_INDEX_DO_URL = USER_CENTER_SERVER + "/index.do";


/**
 * 获取翻页按钮组件
 * @param {Number} 当前页码
 * @param {Number} 总页数
 * @param {Function} 列表加载函数
 * */
function pagenation(pageNum, pageSize, loadlistFunc) {
	var $ul = $('<ul class="pagination" style="display:inline-flex"></ul>');
	var maxShowLength = 9;
	var pageArr = [];
	for (var i = 1; i <= pageSize; i++) {
		pageArr.push({
			num: i,
			active: (pageNum == i)
		});
	}
	var $li = $('<li class="page-item"><a class="page-link">&laquo;</a></li>');
	$li.click(function () {
		loadlistFunc(1)
	})
	$ul.append($li);
	if (pageArr.length <= maxShowLength) {
		pageArr.map(function (o) {
			var $li = $('<li class="page-item ' + (o.active ? 'active' : '') + '" ><a class="page-link">' + o.num + '</a></li>');
			$li.click(function () {
				loadlistFunc(Number($(this).text()))
			});
			$ul.append($li);
		})
	} else {
		var startnum = 1;
		if ((pageNum - 4) >= 1 && (pageNum + 4) <= pageSize) {
			startnum = pageNum - 4
		} else if ((pageNum - 4) < 1) {
			startnum = 1
		} else if ((pageNum + 4) > pageSize) {
			startnum = pageSize - maxShowLength + 1;
		}
		var showPageArr = pageArr.splice(startnum - 1, maxShowLength);
		showPageArr.map(function (o) {
			var $li = $('<li class="page-item ' + (o.active ? 'active' : '') + '" ><a class="page-link">' + o.num + '</a></li>');
			$li.click(function () {
				loadlistFunc(Number($(this).text()))
			});
			$ul.append($li);
		})
	}
	var $li = $('<li class="page-item"><a class="page-link">&raquo;</a></li>');
	$li.click(function () {
		loadlistFunc(pageSize)
	})
	$ul.append($li);
	return $ul;
}


var Tips = {
	success: function (text) {
		var newOptions = Tips.options;
		newOptions.text = text;
		newOptions.bgColor = '#17b84a';
		newOptions.loaderBg = '#17b84a';
		if ($.toast) {
			$.toast(newOptions)
		}
	},
	warn: function (text) {
		var newOptions = Tips.options;
		newOptions.text = text;
		newOptions.bgColor = '#e98a0e';
		newOptions.loaderBg = '#e98a0e';
		if ($.toast) {
			$.toast(newOptions)
		}
	},
	options: {
		position: 'top-right',
		textColor: '#ffffff'
	}
}


var realAjax = $.ajax;
$.ajax = function (options) {


	var defaultOptions = {
		contentType: 'application/json',
		// headers: {
		// 	AUTHORIZATION: $.cookie('token')
		// }
		// ,
		// error : function(){
		// 	Tips.warn('资源请求错误，请联系管理员！');
		// }
	}
	for (var i in options) {
		defaultOptions[i] = options[i]
	}
	var realSuccess = defaultOptions.success;
	var errorCallback = defaultOptions.error;
	defaultOptions.success = function (res) {
		if (res && res.data) {
			if (res.errorCode !== 1000) {
				if (res.errorCode == 1001) {
					// logout()
					// location.href = "login.html";
				} else {
					if (res.errorMessage) {
						Tips.warn(res.errorMessage)
						if (errorCallback) { 
							errorCallback(res) 
						};
					} else {
						Tips.warn('资源请求错误，请联系管理员！');
					}
				}
			} else {
				realSuccess(res);
			}
			//realSuccess(res);
		} else {
			Tips.warn('请求失败，错误未知！');
		}
	}
	realAjax(defaultOptions)
}



function logout() {
	$.ajax({
		type: "POST",
		url: HOST_URL + "/usercenter/logout",
		headers: {
			'contentType': 'application/json',
			'AUTHORIZATION': $.cookie('token')
		},
		success: function (res) {
			$.cookie('token', '');
			// location.href="login.html";
			// location.href = 'http://192.168.2.90:9095/login.html';
			location.href = USER_CENTER_LOGIN;
		}
	});

}
