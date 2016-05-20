/*--------------------
作者：X-DA
当前版本：V1.0.1
更新时间：2015/11/05/14:27
规范：
	1、变量小写下划线写法
	2、方法首字母大写驼峰写法
--------------------*/

/* ----- [freeUI JS] ----- */
(function(freeui) {
	/*支持模块化加载*/
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], freeui);
	} else if (typeof exports === 'object') {
		freeui(require('jquery'));
	} else {
		freeui($, window, document);
	}
}(function($, window, document, undefined) {

	var F = {};
	var namespace = $("script").eq(-1).attr('fu-var') || 'F';

	/*
	变量
	*/
	F.version='V1.0.0';
	F.ua = navigator.userAgent;
	F.is_ios = Boolean(F.ua.indexOf('Mac OS') > -1);
	F.is_android = Boolean(F.ua.indexOf('Android') > -1);
	F.is_mobile = Boolean(F.ua.match(/(iPhone|iPod|Android|ios|iPad)/i));
	F.let_ie9 = !-[1, ];
	F.let_ie8 = $('<b style="*top:0"></b>').css('top') == '0px';
	F.dpr = window.devicePixelRatio || 1;

	/*
	方法名：LowIE
	作用：低于IE8浏览器不允许访问
	*/
	F['LowIE'] = function() {
		if (!F.let_ie8) {
			return 0;
		}
		var _html = '<div class="M-FU_lowIE">' +
			'    	<div class="fu_tips">' +
			'        	您的浏览器版本太低，本站已不提供支持<br />' +
			'            跪下来求您升级以下浏览器（提升安全性，提升网页浏览速度！）<br />' +
			'            注意：点普通下载！' +
			'        </div>' +
			'        <div class="fu_browser">' +
			'        	<a href="http://rj.baidu.com/soft/detail/14744.html?freeui" target="_blank">' +
			'            	<img src="http://img5sw.baidu.com/soft/9d/14744/d2098e0631c41d0f35d78add5b80877d.png" />' +
			'                谷歌浏览器 <span>(推荐)</span>' +
			'            </a>' +
			'            <a href="http://rj.baidu.com/soft/detail/11843.html?freeui" target="_blank">' +
			'            	<img src="http://img5sw.baidu.com/soft/51/11843/17e97c7565eb8ec763a74b0e9c653da1.png" />' +
			'                火狐浏览器' +
			'            </a>' +
			'            <a href="http://rj.baidu.com/soft/detail/14917.html?freeui" target="_blank">' +
			'            	<img src="http://img5sw.baidu.com/soft/9e/14917/917483255202ac43cff687bb8023ecc9.png" />' +
			'                IE10' +
			'            </a>' +
			'        </div>' +
			'    </div>';
		$('body *').hide();
		$('html').css('background', '#e4e5e9');
		$('body').append(_html);
		$('.M-FU_lowIE').hide().fadeIn('slow');
	};


	/*
	方法名：Rd
	作用：生成一个随机数
	*/
	F['Rd'] = function(num) {
		var num = num || 255;
		return parseInt(num * Math.random());
	};
	/*
	方法名：F['Space']
	作用：处理空格
	*/
	F['Space'] = function(str, v) {
		var v = v || ' ';
		return str.replace(/\s+/g, v);
	};


	/*
	方法名：F['UrlVars']
	作用：获得URL参数
	*/
	F['UrlVars'] = function() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
			vars[key] = value;
		});
		return vars;
	};


	/*
	方法名：F['Rem']
	作用：获得rem最佳显示字体
	*/
	F['Rem'] = function(w, _min, _max) {
		var win_w = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
		var full_w = Number(w) || 640;
		var size = ((win_w - full_w) / full_w) * 100 + 100;
		var html = document.getElementsByTagName('html')[0];
		var _min = Number(_min) || 50;
		var _max = Number(_max) || 100;
		size = size >= _max ? _max : size;
		size = size <= _min ? _min : size;
		html.style.fontSize = size + 'px';
	};


	/*
	方法名：SupportCss3
	作用：判断浏览器是否支持某一个CSS3属性
	使用：F.SupportCss3('CSS属性名')
	使用示例：F.SupportCss3('anmi');
	版本更新：v1.0.0
	*/
	F['SupportCss3'] = function(style) {
		var prefix = ['webkit', 'Moz', 'ms', 'o'],
			i,
			humpString = [],
			htmlStyle = document.documentElement.style,
			_toHumb = function(string) {
				return string.replace(/-(\w)/g, function($0, $1) {
					return $1.toUpperCase();
				});
			};
		for (i in prefix)
			humpString.push(_toHumb(prefix[i] + '-' + style));
		humpString.push(_toHumb(style));
		for (i in humpString)
			if (humpString[i] in htmlStyle) return true;

		return false;
	};



	/*
	方法名：Css3Anmi
	作用：执行CSS3动画
	使用：F['Css3Anmi'](Jquery对象,动画值，动画结束回调)
	使用示例：F['Css3Anmi']($(this),'zoomOut .2s ease .1s  both',function(){alert('动画结束')})
	版本更新：v1.0.1
	*/
	F['anmi'] = F['SupportCss3']('animation'); //是否开启动画
	F['Css3Anmi'] = function(t, css, callback) {
		var callback = callback || function() {};
		var css = F['Space'](String(css));
		if (!Boolean(css) || t.length < 1) {
			return callback();
		}
		var css_arr = css.split(' ');
		var anmi_name = css_arr[0];
		var anmi_time = F['Css3Anmi']['cache'][anmi_name] || 0;

		//动画所需时间
		if (anmi_time == 0) {
			for (var i = 1; i < css_arr.length; i++) {
				//获得总时间
				if (css_arr[i].indexOf('s') > -1) {
					var time = Number(css_arr[i].replace(/s/i, '')) || 0;
					anmi_time += time;
				};
			};
			anmi_time *= 1000;
			F['Css3Anmi']['cache'][anmi_name] = anmi_time;
		}
		//执行动画	
		if (F['anmi']) {
			t.css('animation', css);
			setTimeout(function() {
				t.css('animation', '');
				callback();
			}, anmi_time);
		} else {
			callback();
		};
	};
	F['Css3Anmi']['cache'] = {};
	/*
	方法名：Share
	作用：返回分享链接
	使用：F['Share']()
	版本更新：v1.0.0
	*/
	F['Share'] = function(type, opt) {
		var set = $.extend({}, F['Share']['conf'], opt);
		F['Share']['type'][type] = F['Share']['type'][type] || function(opt) {
			return '#';
		};
		return F['Share']['type'][type](set);
	}
	F['Share']['type'] = {
		'qzone': function(opt) {
			return 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + opt.link + '&title=' + opt.title + '&summary=' + opt.desc + '&pics=' + opt.imgs;
		},
		'weibo': function(opt) {
			return 'http://service.weibo.com/share/share.php?title=' + opt.desc + '&url=' + opt.link + '&pic=' + opt.imgs;
		},
		'tweibo': function(opt) {
			return 'http://share.v.t.qq.com/index.php?c=share&a=index&title=' + opt.desc + '&url=' + opt.link + '&pic=' + opt.imgs;
		}
	}
	F['Share']['conf'] = {
		title: document.title, //分享标题
		desc: $('meta[name="description"]').attr('content') || '', //分享内容
		imgs: '', //分享图片
		link: window.location.origin + window.location.pathname //分享地址
	}

	/*
	方法名：LoadImg
	作用：预加载图片
	使用：F['LoadImg']('图片路径',成功回调，失败回调)
	版本更新：v1.0.0
	*/
	F['LoadImg'] = function(src, ok, err) {
		if (!src) {
			return false;
		}
		var ok = ok || function() {};
		var err = err || function() {};
		var img = new Image();
		img.src = src;
		img.onload = ok;
		img.onerror = err;
	}

	F['Qn'] = function(src, opt, mode) {
		var src = src || '';
		var mode = mode || 1;
		var defaults = {
			w: false,
			h: false,
			format: false,
			interlace: 1,
			q: false,
			original: false
		}
		var original = src.split('?imageView2/')[0];
		if (!Boolean(opt)) {
			return original;
		}
		var set = $.extend({}, defaults, opt);
		var backSrc = original + '?imageView2/' + mode;
		for (var i in set) {
			if (set[i]) {
				backSrc += '/' + i + '/' + set[i];
			}
		}
		return backSrc;
	}

	/*
	方法名：LazyImg
	作用：惰性加载图片
	使用：F['LazyImg']()
	版本更新：v1.0.0
	*/
	F['LazyImg'] = function(opt) {
			var defaults = F['LazyImg']['conf'];
			var set = $.extend({}, defaults, opt);
			var $img_arr = {};
			//遍历图片
			$(set.wrap).find('img[' + set.attr + ']').each(function(index, element) {
				var $this = $(this);
				if ($this.is('.' + set.loading)) {
					return false;
				};
				$img_arr[index] = $this;
				$this.addClass(set.loading);
			});

			//滚动事件
			function _scroll() {
				var size = 0;
				for (var i in $img_arr) {
					var $this = $img_arr[i];
					var offtop = $this.offset().top - $(set.wrap).offset().top;
					var offleft = $this.offset().left - $(set.wrap).offset().left;
					if (set.wrap == 'body' || set.wrap == 'html') {
						offtop -= set.scrollTop();
						offleft -= set.scrollLeft();
					}
					if (set.innerHeight() >= (offtop - set.offsetT) && set.innerWidth() >= (offleft - set.offsetL)) {
						delete $img_arr[i];
						_load_img($this, set);
					}
					size++
				}
				if (size == 0) {
					set.eventdom.off(set.event, _scroll);
				}
			}
			//绑定事件
			if (set.event) {
				set.eventdom.on(set.event, _scroll);
			}
			_scroll();
			F['LazyImg']['refresh'] = _scroll;
			//替换图片
			function _load_img($this, set) {
				var attr = set.attr;
				var df_src = $this.attr('src');
				var src = $this.attr(attr);
				//计算最佳宽
				var $parent = $this.parent();
				var PixelRatio = window.devicePixelRatio || 1; //设备像素比
				var win_w = window.screen.width; //窗口实际宽度
				var pcss_w = $parent[0].style.width;
				var css_w = $this[0].style.width;
				var attr_w = $this.attr('width');
				//如果父元素有设置宽高
				if (pcss_w) {
					w = pcss_w.split('px')[0];
				} else {
					w = win_w;
				}
				//如果图片有设置宽高，则使用设置的宽高
				//属性内的宽高
				if (attr_w) {
					w = attr_w;
				}
				//CSS内的宽高
				if (css_w) {
					w = css_w.split('px')[0];
				}
				//类名优先级最高
				var $qn_width = $this.parents(set.qnClass).first();
				if ($qn_width.length > 0) {
					w = $qn_width.innerWidth()
				}
				w = Math.round(w * PixelRatio);
				//计算结束
				var img = new Image();
				if (set.qn) {
					var qn = {};
					$.extend({}, qn, set.qn);
					qn.w = set.qn.w || w;
					img.src = F['Qn'](src, qn);
				} else {
					img.src = src;
				}
				//加载成功
				img.onload = function() {
						$this.attr('src', img.src).removeAttr(attr).removeClass(set.loading);
						$this.addClass(set.loaded);
						set.load($this);
					}
					//加载失败
				img.onerror = function() {
					$this.addClass(set.loaderr).removeClass(set.loading);
					$this.attr('src', df_src);
					set.error($this);
				}
			} //_load_img



		} //LazyImg

	//配置项
	F['LazyImg']['conf'] = {
		attr: 'data-src',
		wrap: 'body', //容器
		scrollTop: function() {
			return $(window).scrollTop()
		}, //容器顶部
		scrollLeft: function() {
			return $(window).scrollLeft()
		}, //
		innerWidth: function() {
			return $(window).innerWidth()
		},
		innerHeight: function() {
			return $(window).innerHeight()
		}, //滚动容器高度
		eventdom: $(window),
		event: 'scroll',
		offsetL: 0,
		offsetT: 0,
		load: $.noop,
		error: $.noop,
		loading: 'z-loading',
		loaded: 'z-loaded',
		loaderr: 'z-loaderr',
		qn: {}, //使用七牛
		qnClass: '.j-qn_width'
	};

	/*
	方法名：Verify
	作用：数据验证
	使用：F['Verify']('数据类型','数据值');
	版本更新：v1.0.0
	*/


	F['Verify'] = function(type, val) {
		var _back = {
			err: false,
			ct: '正确'
		};
		var type = type || '';
		var val = String(val) || '';
		F['Verify']['rule'][type] = F['Verify']['rule'][type] || [];
		//循环验证
		for (var i = 0; i < F['Verify']['rule'][type].length; i++) {
			if (F['Verify']['rule'][type][i](val)) {
				_back.err = true;
				_back.ct = F['Verify']['tips'][type][i];
			}
		}
		return _back;

	};
	//规则
	F['Verify']['rule'] = {
		//手机号码
		'phone': [
			function(val) {
				return (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(val)));
			},
			function(val) {
				return (val.length != 11);
			}
		],
		//电子邮箱
		'email': [
			function(val) {
				return (!(/\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/.test(val)));
			},
			function(val) {
				return (val.length < 6);
			},
			function(val) {
				return (val.length > 320);
			}
		],
		//中文名
		'cn_name': [
			function(val) {
				return (!(/^[\u4e00-\u9fa5]+$/.test(val)));
			},
			function(val) {
				return (val.length < 2);
			},
			function(val) {
				return (val.length > 32);
			}
		],
		//身份证
		'idcard': [
			function(val) {
				return (!(/\d{17}[\d|x]|\d{15}/.test(val)));
			}
		],
		//4位数验证码
		'code_4': [
			function(val) {
				return (val.length != 4);
			}
		],
		//6位数验证码
		'code_6': [
			function(val) {
				return (val.length != 6);
			}
		],
		//用户名
		'username': [
			function(val) {
				return (!(/^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(val)));
			},
			function(val) {
				return (val.length < 2);
			},
			function(val) {
				return (val.length > 8);
			}
		],
		//密码
		'password': [
			function(val) {
				return (!(/^[A-Za-z0-9_-]+$/.test(val)));
			},
			function(val) {
				return (val.length < 6);
			},
			function(val) {
				return (val.length > 32);
			}
		]
	};

	//提示语
	F['Verify']['tips'] = {
		'phone': ['请输入有效手机', '请输入11位手机'],
		'email': ['邮箱格式有误', '邮箱过短', '邮箱过长'],
		'cn_name': ['请输入中文名', '名字过短', '名字过长'],
		'idcard': ['身份证有误'],
		'code_4': ['验证码有误'],
		'code_6': ['验证码有误'],
		'username': ['用户名含非法字符', '用户名过短', '用户名过长'],
		'password': ['请使用英文密码', '密码过短', '密码过长']
	};



	/*
	方法名：Page
	作用：分页功能
	使用：F['Page']({'total':10,'size':20,'page':10,'cur':2});
	版本更新：v1.0.1
	*/
	F['Page'] = function(obj) {
		//总条数
		var total = Number(obj.total);
		//每页显示的条数
		var size = Number(obj.size);
		//显示的页码个数
		var page = Number(obj.page);
		//总页码数
		var last = Math.ceil(total / size);
		//当前页码
		var cur = Number(obj.cur);
		//正常情况下
		var offset = Math.floor(page * 0.5);
		var from = cur - offset;
		var to = cur + offset;
		if (cur < 1) {
			cur = 1
		};
		if (cur > last) {
			cur = last
		};
		if (cur <= offset) {
			from = 1;
			to = page;
		}
		if (to >= last) {
			from = last - page - -1;
			to = last;
		}
		if (page >= last) {
			from = 1;
			to = last;
		}

		/*
		from 输出开始页
		to 输出结束页
		cur 当前页
		last 末页
		size 每页数量
		total 文章总数
		*/
		return {
			'from': from,
			'to': to,
			'cur': cur,
			'last': last,
			'size': size,
			'total': total
		};
	};


	/*
	方法名字：Modal
	作用：弹层
	版本更新：v1.0.0
	*/
	F['Modal'] = function(act, opt) {
		var $this = this;
		if ($this.length < 1) {
			return false
		};
		var defaults = F['Modal']['conf'];
		var set = $.extend({}, defaults, opt);
		$(set['shade']).off('click', shade).on('click', shade);
		var selector = set['selector'];
		var body_scrollTop = $(window).scrollTop();


		//定义方法
		var method = {};
		method[act] = method[act] || function() {};
		method['show'] = function() {
			popshow($this, set.showback);
		}
		method['hide'] = function() {
			popclose($this, set.hideback);
		}
		method['toggle'] = function() {
			popclose();
			popshow($this, set.callback);
		}
		method[act]();

		function pop_size($pop, pct) {
			var win_h = $(window).innerHeight();
			var pop_h = $pop.outerHeight();
			var $ct = $pop.children(set['ctdom']);
			var out_h = 0;
			var pct = pct || 0.8;
			$ct.siblings().each(function(index, element) {
				var $this = $(this);
				var position = $this.css('position');
				if (position == 'static' || position == 'relative') {
					out_h += $this.outerHeight();
				}
			});
			$pop.css('top', '50%');
			$ct.css('max-height', (win_h * pct - out_h) + 'px');
		};

		function shade() {
			if (!$(selector + ':visible').is('.z-lock')) {
				popclose();
			}
		} //shade

		function popclose($a, callback) {
			var $this = $(this);
			var $a = $a || $(selector + ':visible');
			var callback = callback || $.noop;
			//$('body').css('overflow','');
			if ($(selector + ':visible').length <= 1) {
				$(set['shade']).fadeOut('fast');
			}
			F['Css3Anmi']($a, set['hideanmi'], function() {
				$a.hide();
				callback();
			});
			//$(window).scrollTop(body_scrollTop);
		}

		function popshow($pop, callback) {
			var win_h = $(window).innerHeight();
			var pop_h = $pop.outerHeight();
			var callback = callback || function() {};

			//初始化处理
			//$('body').css('overflow','hidden');	
			//$(set['shade']).off('click',shade);
			body_scrollTop = $(window).scrollTop();
			//如果弹层超过屏幕高度80%
			if (pop_h > win_h * 0.8) {
				pop_size($pop, 0.8);
			}
			//如果需要垂直居中处理
			if ($pop.is('.s-mid')) {
				$pop.css('margin-top', (set['contain'].offset().top - $pop.outerHeight()) * 0.5 + 'px');
			}
			$pop.css('margin-left', (set['contain'].offset().left - $pop.outerWidth()) * 0.5 + 'px');
			//如果是有输入框情况
			if ($pop.is('.s-input') && F.is_ios) {
				$pop.css('position', 'absolute');
				$pop.css('top', (win_h * 0.45 + body_scrollTop));
			}
			//阴影出来
			$(set['shade']).fadeIn('fast');

			//是否有滚动条
			var $ct = $pop.children(set['ctdom']);
			if ($ct.length > 0) {
				var is_scroll = $ct[0].scrollHeight > $ct.css('max-height').replace('px', '');
				if (is_scroll && app.ua.indexOf('Android') > -1) {
					$ct.css('opacity', '0');
				}
			};
			$pop.show();
			//CSS3动画出来
			F['Css3Anmi']($pop, set['showanmi'], function() {
				if (is_scroll && app.ua.indexOf('Android') > -1) {
					$ct.css('opacity', '1');
				}
				callback();
			});
		}
		$this.find('.j-close').each(function(index, element) {
			var $close = $(this);
			$close.off('click.close').on('click.close', function() {
				popclose($this);
			});
		});

		//防止内滚动影响外部滚动条
		$this.children('.ct').off('touchmove.ct').on('touchmove.ct', function(event) {
			var $ct = $(this);
			//$(window).scrollTop(body_scrollTop);
			if ($ct[0].scrollHeight != $ct[0].clientHeight) {
				event.stopPropagation();
			}
		});
		$('body').off('touchmove.modal').on('touchmove.modal', function(event) {
			if ($(selector).is(':visible')) {
				event.preventDefault();
			}
		});
		return $this;

	};

	//弹窗show方法
	F['Modal']['show'] = function($dom, set) {

	};

	//配置项
	F['Modal']['conf'] = {
		selector: '.m-FU_modal' || '', //需要弹窗出来的节点
		shade: '#U-FU_shade', //阴影节点
		ctdom: '.ct', //内容节点，用于做滚动
		anmi: true, //是否开启动画
		showanmi: 'FU_modalIn .3s ease  both', //弹窗显示时动画
		hideanmi: 'FU_modalOut .3s ease  both', //弹窗关闭时动画
		showback: $.noop(), //出来后回调
		hideback: $.noop(), //关闭后回调
		contain: $('html'), //容器
		scrolllock: false //是否锁住滚动条
	};

	(function() {
		//初始化遮罩
		if ($('#U-FU_shade').length < 1) {
			$('body').append('<div id="U-FU_shade"></div>');
		};
		//记录滚动条情况
		F['Modal']['html_overflow'] = $('body').css('overflow');
		F['Modal']['body_overflow'] = $('body').css('overflow');

	})();

	/*
	方法名字：Hint
	作用：提示
	版本更新：v1.0.0
	*/
	F['Hint'] = function(opt) {
			var defaults = F['Hint']['conf'];
			var set = $.extend({}, defaults, opt);
			var font = set['font'][set.type] || '';

			var hint_html = '<div class="' + set['cls'] + ' s-' + set['type'] + '">' +
				'<div class="ico i-FU_icon">' + font + '</div>' +
				'<div class="ct"><div>' + set['ct'] + '</div></div>' +
				'</div>';
			$('body').append(hint_html);
			var $hint = $('body').children('.' + set['cls'] + ':last');
			//居中处理
			$hint.css('margin-top', (set['contain'].offset().top - $hint.outerHeight()) * 0.5 + 'px');
			$hint.css('margin-left', (set['contain'].offset().left - $hint.outerWidth()) * 0.5 + 'px');
			$hint.show();
			F['Css3Anmi']($hint, set['showanmi'], function() {
				set.startback();
				var hide = setTimeout(function() {
					F['Css3Anmi']($hint, set['hideanmi'], function() {
						$hint.remove();
						set.endback();
					})
				}, set.time)
			});

		} //Hint
		//配置项
	F['Hint']['conf'] = {
		cls: 'm-FU_hint',
		ct: '出错',
		type: 0,
		time: 1000,
		startback: $.noop,
		endback: $.noop,
		showanmi: 'FU_hintIn .3s ease  both',
		hideanmi: 'FU_hintOut .3s ease  both',
		font: ['&#xe600;', '&#xe602;', '&#xe601;'],
		contain: $('html')
	};



	/*
	一般用于提交数据前后的回调处理
	*/
	F['beforeCall'] = F['beforeCall'] || {};
	F['afterCall'] = F['afterCall'] || {};


	/*
	方法名：Form
	作用：数据提交功能
	使用：F['Form']({'total':10,'size':20,'page':10,'cur':2});
	版本更新：v1.0.0
	*/
	F['Form'] = function(opt) {
		var $this = $(this);
		var selector = $this.selector;
		$this.each(function() {
			var $this = $(this);
			if ($this.length < 1) {
				return false
			};
			var set = $.extend({}, F['Form']['conf'], opt);

			$this.conf = set;

			/*
			//是否实时检查数据是否正确
			if(set['check']){
				//监听值改变和DOM改变
				$this.find('*[fu-verify]').each(function(){
					var $verify=$(this);
					var $form=$verify.parents(selector).first();
					//值改变
					$verify.off('change.FU input.FU').on('change.FU input.FU',function(){
						var verify_arr = fn_check($form,$verify);
						if(verify_arr){
							var $submit=$form.find(set['submit']);
							set['onVerify']({'errs':verify_arr,'form':$form,'submit':$submit,'trig':$verify});
						};
					});
				});
			};
		
			//验证函数
			function fn_check($form,$trig){
					var err=false;
					$form.find('*[fu-verify]').each(function(){
						var $verify=$(this);
						var name=$verify.attr('name');
						var verify=$verify.F('Verify');
						if(verify){
							err=err || [];
							err.push(verify);
							return true;
						};
					});
					return err;
			};
			*/
			//表单submit事件
			$this.off('submit.FU').on('submit.FU', function(event) {
				//阻止默认事件
				event.preventDefault();
				var $form = $(this);
				if ($form.is('.z-ing')) {
					return false;
				}
				//console.log($form[namespace]('Form')['conf']);
				//变量
				var call = $form.attr('fu-call');
				var action = $form.attr('action');
				var method = $form.attr('method');
				var postData = {};
				//执行前
				(F['beforeCall'][call] || $.noop)($form);

				//数据遍历
				$form.find('[name],[fu-name]').each(function(index, element) {
					var $this = $(this);
					var name = $this.attr('name') || $this.attr('fu-name');
					var val = $this.val() || $this.attr('fu-val') || $this.text();
					//单选复选框处理
					if ($this.is(':radio') || $this.is(':checkbox')) {
						if (Boolean(postData[name])) {
							return true;
						}
						postData[name] = $form.find('input[name="' + name + '"]:checked').map(function() {
							return $(this).val();
						}).get().join(",");
						return true;
					};

					postData[name] = val;
				});
				//额外提交数据
				postData = $.extend({}, postData, set['data']);


				//提交数据前
				$form.addClass('z-ing');
				var $submits = $form.find(set['submit']);
				$submits.addClass('z-loading');

				//AJAX提交数据
				var ajax_arg = {
					url: action,
					type: method,
					dataType: 'json',
					timeout: 30000,
					data: postData,
					success: function(data) {
						if (data.status >= 1) {
							(F['afterCall'][call] || $.noop)($form, data);
						} else {
							F['Hint']({
								ct: data.info,
								type: 2
							});
						}
						$form.removeClass('z-ing');
						$submits.removeClass('z-loading');
					},
					error: function(xmlHttpRequest, error) {
						F['Hint']({
							ct: '连接超时',
							type: 2
						});
						$form.removeClass('z-ing');
						$submits.removeClass('z-loading');
					}

				};

				ajax_arg = $.extend({}, ajax_arg, set['ajax']);
				$('input,textarea').blur();
				$.ajax(ajax_arg);

			});

			//表单输入框的按键事件
			$this.find('input[name],textarea[name],select[name]').on('keydown.FU', function(event) {
				var $this = $(this);
				var $form = $this.parents(selector).first();
				var key = event.keyCode;
				if (key == 13 && $this.is('input')) {
					$form.trigger("submit.FU");
				};
				if (event.ctrlKey && key == 13 && ($this.is('textarea') || $this.is('select'))) {
					$form.trigger("submit.FU");
				};
			});

			//表单下的按钮事件
			$this.find(set['submit']).on('click.FU', function(event) {
				var $this = $(this);
				var $form = $this.parents(selector).first();
				if ($this.is('.z-loading') || $this.is('.z-lock')) {
					return false;
				}
				$form.trigger("submit.FU");
			});
		});
		return $this;
	};



	//数据验证错误处理
	F['Form']['verify'] = function(opt) {
		var opt = opt || {};
		opt['submit'].addClass('z-lock')
			//F['Hint']({ct:err[0].ct,type:2});
	};


	//配置项
	F['Form']['conf'] = {
		"submit": '.j-submit', //提交按钮
		"data": {}, //额外数据
		"onVerify": F['Form']['verify'], //数据验证处理函数
		"ajax": null, //ajax参数
		"check": true //实时验证
			//"success":''
			//"error":''
	};



	F['test'] = function() {
		return $(this);
	}

	/* ----- [UI控件JS] ----- */
	F['Ui'] = function(type, opt) {
		var $this = $(this);
		(F['Ui']['widget'][type] || $.noop)($this, opt);
		return $this;
	};

	F['Ui']['widget'] = {
		//数字输入框
		'number': function($this) {
			var selector = $this.selector;
			$this.each(function() {
				var $this = $(this);
				$this.find('*[fu-fn]').off('click.FU').on('click.FU', function() {
					var $this = $(this);
					var $number = $this.parents(selector).first();
					var _min = Number($number.attr('fu-min') || 0);
					var _max = Number($number.attr('fu-max') || 100);
					var _step = Number($number.attr('fu-step') || 1);
					var _point = Number($number.attr('fu-point') || String(_step).indexOf('.') > -1 ? String(_step).split('.').pop().length : 0);
					var $input = $number.find('input');
					var val = Number($input.val());
					var _fn = $this.attr('fu-fn');
					//加
					if (_fn == 'add') {
						var result = (val + _step).toFixed(_point);
						if (result > _max) {
							result = _max
						}
						$input.val(result);
					};
					//减
					if (_fn == 'sub') {
						var result = (val - _step).toFixed(_point);
						if (result < _min) {
							result = _min
						}
						$input.val(result);
					};
					//min
					if (_fn == 'min') {
						$input.val(_min);
					};
					//max
					if (_fn == 'max') {
						$input.val(_max);
					};
					$input.trigger('change');
				});
			}); //each
		},
		//单选复选框
		'check': function($this) {
			var selector = $this.selector;
			$this.each(function() {
				var $this = $(this);
				var $input = $this.children('input[name]');
				var name = $input.attr('name');
				$input.is(':checked') ? $this.addClass('z-checked') : $this.removeClass('z-checked');
				$input.is(':disabled') ? $this.addClass('z-disabled') : $this.removeClass('z-disabled');
				$this.off('click.FU').on('click.FU', function() {
					if ($input.is(':disabled')) {
						return 0
					};
					if ($input.is(':radio')) {
						var $form = $this.parents('form').first();
						$form = $form.length > 0 ? $form : $(document);
						var $bro = $form.find(selector + '.s-radio input[name="' + name + '"]');
						$bro.removeAttr('checked').prop('checked', false);
						$bro.parents(selector).removeClass('z-checked');
					}
					if ($input.is(':checkbox') && $input.is(':checked')) {
						$input.removeAttr('checked').prop('checked', false);
						$this.removeClass('z-checked');
						return 0;
					};
					$input.attr('checked', 'checked').prop('checked', true);
					$this.addClass('z-checked');
				});
			}); //each
		},
		//下拉框框
		'select': function($this, opt) {
			var selector = $this.selector;
			var set = $.extend({}, F['Ui']['conf']['select'], opt);
			$this.attr('fu-obj', 'select');

			$this.each(function() {
				var $this = $(this);
				var $opts = $this.children('.fu_opts');
				var $opt = $opts.children();
				var $input = $this.children('input:hidden');
				var $selected = $this.children('.fu_cur');

				//初始化值
				var $curOpt = $opts.find('*[fu-val="' + $input.val() + '"]');
				if ($curOpt.length > 0) {
					$curOpt.addClass('z-cur');
					$selected.text($curOpt.text());
				};

				$this.off('click.FU').on('click.FU', function(event) {
					var $this = $(this);
					if ($this.is('.z-open')) {
						F['Css3Anmi']($opts, set['outAnim'], function() {
							$this.removeClass('z-open');
						});
					} else {
						$('[fu-obj="select"].z-open').removeClass('z-open');
						$this.addClass('z-open');
						F['Css3Anmi']($opts, set['inAnim']);
					};
					event.stopPropagation();
				});

				$opt.off('click.FU').on('click.FU', function(event) {
					var $select = $this;
					var $opt = $(this);
					var txt = $opt.text();
					var val = $opt.attr('fu-val');
					$opt.siblings('.z-cur').removeClass('z-cur');
					$opt.addClass('z-cur');
					$selected.text(txt);
					$input.val(val);
				});
			}); //each

			$(document).on('click.FU_select', function() {
				$('[fu-obj="select"].z-open').removeClass('z-open');
			});

		},
		//textarea长文本
		'textarea': function($this) {
			var selector = $this.selector;
			$this.each(function() {

			});
		},
		//loading	
		'loading': function($this) {
			var selector = $this.selector;
			$this.each(function() {

			});
		},
		//下一个UI组件	
		'test': function($this) {
			var selector = $this.selector;
			$this.each(function() {

			});
		}
	};

	/*配置项*/
	F['Ui']['conf'] = {

		//下拉框
		'select': {
			inAnim: 'FU_fadeInBot .1s linear',
			outAnim: 'FU_fadeOutBot .1s linear'
		}

	};

	F['Ui']['init'] = function() {
		//数字输入框
		$('.u-FU_number')[namespace]('Ui', 'number');
		//单选复选框
		$('.u-FU_check')[namespace]('Ui', 'check');
		//下拉框
		$('.u-FU_select')[namespace]('Ui', 'select');
		//长文本输入
		$('.u-FU_textarea')[namespace]('Ui', 'textarea');
		//loading
		$('.u-FU_loading')[namespace]('Ui', 'loading');
	};



	/*--- 将框架全局化 ---*/

	$.fn[namespace] = function() {
		var arg = arguments;
		var method = arguments[0];
		if (F[method]) {
			method = F[method];
			arg = Array.prototype.slice.call(arg, 1);
		} else if (typeof(method) == 'object' || !method) {
			for (var name in method) {
				F = $.extend(F, method);
				method = F[name];
				break;
			}
		} else {
			$.error('方法 ' + method + ' 未定义');
			return this;
		}
		return method.apply(this, arg);
	};
	window[namespace] = F;

	$(document).ready(function(e) {
		//-低版本IE不允许访问
		F['LowIE']();
		//-文档准备就绪初始化UI组件
		window[namespace]['Ui']['init']();

	});

	return $.widget;
}));
/* ----- [freeUI JS] ----- */