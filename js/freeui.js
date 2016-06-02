/*--------------------
作者：X-DA
当前版本：V1.0.0
更新时间：2015/11/05/14:27
规范：
	1、变量首字母小写，加下划线。
   	2、方法首字母大写，驼峰写法。
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
	var namespaces=F.namespaces = $("script").eq(-1).attr('fu-var').split(',');
	var namespace = F.namespace = namespaces[0]  || 'F';

	/*
	变量
	*/
	F.version='V1.0.0';
	F.ua = navigator.userAgent;
	F.is_ios = Boolean(F.ua.indexOf('Mac OS') > -1);
	F.is_android = Boolean(F.ua.indexOf('Android') > -1);
	F.is_mobile = Boolean(F.ua.match(/(iPhone|iPod|Android|ios|iPad|Windows Phone)/i));
	F.let_ie9 = !-[1, ];
	F.let_ie8 = $('<b style="*top:0"></b>').css('top') == '0px';
	F.dpr = window.devicePixelRatio || 1;
	F.is_touch="ontouchend" in document ? true : false;

	/*点击长按事件*/
	F.tap_time=200;
	F.tap_offset=5;


	/*
	检测滚动条宽度
	*/
	F.scrollbar_width=0;

	/*
	方法名：ParseJSON
	作用：将字符串转成JSON
	*/
	F['ParseJSON']=function(str){
		try {
			return $.parseJSON(str);
		}catch(e){
			try {
				return eval('(' + str + ')');
			} catch (e) {
				return {};
			}
		}
	};

	$.event.special['FU_tap']={
		setup:function(){
			//绑定事件
			var _event={};
			var startX=0;
			var startY=0;
			var endX=0;
			var endY=0;	
			var offsetX=0;
			var offsetY=0;
			if(F['is_touch']){
				//绑定开始触控
				function touch_start(event){
					startX = event['changedTouches'][0]['clientX'];	
					startY = event['changedTouches'][0]['clientY'];	
					_event['timeStar']=event.timeStamp;
					event.stopPropagation();
				};
				this.addEventListener("touchstart",touch_start);
				this.touch_start=touch_start;
				//绑定结束触控
				function touch_end(event){
						endX= event['changedTouches'][0]['clientX'];
						endY= event['changedTouches'][0]['clientY'];
						offsetX=(endX-startX);
						offsetY=(endY-startY);
						_event['timeEnd']=event.timeStamp;
						_event['time']=Math.floor(_event['timeEnd']-_event['timeStar']);
						_event['offsetX']=offsetX;
						_event['offsetY']=offsetY;
						if(_event['time']<= F.tap_time && offsetX <= F.tap_offset && offsetY <= F.tap_offset){
							//点击
							$(this).trigger("FU_tap",_event);	
						};
						event.stopPropagation();
				};
				this.touch_end=touch_end;
				this.addEventListener("touchend",touch_end);
			}
			else{
				$(this).on('click.FU_tap', function(event) {
					$(this).trigger("FU_tap",_event);
					event.stopPropagation();
				});
			};
		},
		teardown:function(){
			//解绑事件
			if(F.is_touch){
				this.removeEventListener("touchstart",this.touch_start);
				this.removeEventListener("touchend",this.touch_end);
			}else{
				$(this).off('click.FU_tap');
			}
		}
	}

	$.fn.extend({
	        FU_tap: function(fn) {
	            return fn ? $(this).on('FU_tap', fn) : $(this).trigger('FU_tap');
	        }
	});
	
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
	作用：生成一个随机整数
	*/
	F['Rd'] = function(num) {
		var num = Number(num || 255);
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
	使用示例：F.SupportCss3('anim');
	版本更新：v1.0.0
	*/
	F['SupportCss3'] = function(style) {
		var prefix = ['webkit', 'moz', 'ms', 'o'],
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
	方法名：Css3Anim
	作用：执行CSS3动画
	使用：F['Css3Anim'](Jquery对象,动画值，动画结束回调)
	使用示例：F['Css3Anim']($(this),'zoomOut .2s ease .1s  both',function(){alert('动画结束')})
	版本更新：v1.0.1
	*/
	F['anim'] = F['SupportCss3']('animation'); //是否开启动画
	F['Css3Anim'] = function(t, css, callback) {
		var callback = callback || function() {};
		var css = F['Space'](String(css));
		if (!Boolean(css) || t.length < 1) {
			return callback();
		}
		var css_arr = css.split(' ');
		var anim_name = css_arr[0];
		var anim_time = 0;
		//var anim_time = F['Css3Anim']['cache'][anim_name] || 0;

		//动画所需时间
		//if (anim_time == 0) {
			for (var i = 1; i < css_arr.length; i++) {
				//获得总时间
				if (css_arr[i].indexOf('s') > -1) {
					var time = Number(css_arr[i].replace(/s/i, '')) || 0;
					anim_time += time;
				};
			};
			anim_time *= 1000;
			//F['Css3Anim']['cache'][anim_name] = anim_time;
		//}
		//执行动画	
		if (F['anim']) {
			t.css('animation', css);
			setTimeout(function() {
				t.css('animation', '');
				callback();
			}, anim_time);
		} else {
			callback();
		};
	};
	//F['Css3Anim']['cache'] = {};
	/*
	方法名：Share
	作用：返回分享链接
	使用：F['Share']()
	版本更新：v1.0.0
	*/
	F['Share'] = function(opt) {
		var $this=$(this);
		var def=F['Share']['conf'];
		var set = $.extend({},def, opt);
		$this.find('*[fu-share]').each(function(index, el) {
			var $link=$(this);
			var type=$link.attr('fu-share');
			$link.attr('href',(F['Share']['type'][type](set) || def['link']));
		});
		return F['Share']['type'] ;
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
		},
		'qfriend':function(opt){
			return 'http://connect.qq.com/widget/shareqq/index.html?url='+opt.link+'&title='+opt.title+'&desc='+opt.desc+'&summary='+opt.desc+'&pics='+opt.imgs+'&showshares=true#jtss-cqq&showcount=0';
		}
	}
	F['Share']['conf'] = {
		title: document.title, //分享标题
		desc: $('meta[name="description"]').attr('content') || '', //分享内容
		imgs: '', //分享图片
		link: location.protocol +'//'+location.host+location.pathname //分享地址
	};

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
	};


	F['Qn'] = function(src,opt) {
		if(!src){return false;}
		var defaults = {
			"mode":"0", 
			"interlace":"1",
			"ignore-error":"1" 
		}
		var original = src.split('?imageView2/')[0];
		if (!Boolean(opt)) {
			return original;
		}
		var set = $.extend({}, defaults, opt);
		var backSrc = original + '?';
		for (var i in set) {
			var par = '/' + i  ;
			if(par == '/mode'){
				par='imageView2';
			}
			if (par) {
				backSrc += par + '/' + set[i];
			};
		};
		return backSrc;
	}

	/*
	方法名：LazyImg
	作用：惰性加载图片
	使用：F['LazyImg']()
	版本更新：v1.0.0
	*/
	F['LazyImg'] = function(opt) {

			var def = F['LazyImg']['conf'];
			var set = $.extend({}, def, opt);
			//z-ready,z-load,z-loaded
			var $img_arr = [];
			//遍历图片
			$(set.wrap).find('*[' + set.attr + ']').each(function(index, element) {
				var $this = $(this);
				if ($this.is('.z-ready,.z-load,.z-loaded')) {
					return false;
				};
				$img_arr[index] = $this;
				$this.addClass('z-ready');
			});

			//滚动事件
			function _scroll() {
				var img_arr=$img_arr;
				for (var i = 0; i < img_arr.length; i++) {
					var $this=img_arr[i];
					var offtop = $this.offset().top - $(set.wrap).offset().top;
					var offleft = $this.offset().left - $(set.wrap).offset().left;
					if (set.wrap == 'body' || set.wrap == 'html') {
						offtop -= set.scrollTop();
						offleft -= set.scrollLeft();
					};
					if (set.innerHeight() >= (offtop - set.offsetT) && set.innerWidth() >= (offleft - set.offsetL)) {
						 img_arr.splice(i, 1);
						_load_img($this, set);
					};
				};
				if(img_arr.length == 0){
					set['eventdom'].off(set.event, _scroll);
				};
			};
			//绑定事件
			if (set.event) {
				set['eventdom'].on(set.event, _scroll);
			}
			_scroll();
			F['LazyImg']['refresh'] = _scroll;


			//替换图片
			function _load_img($this, set) {
				var attr = set.attr;
				var is_img=$this.is('img');
				var df_src = $this.attr('src') || $this.css('background-image');
				var src = $this.attr(attr);
				//计算最佳宽
				var $parent = $this.parent();
				var dpr = F['dpr']; //设备像素比
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
				//DPR计算
				w = Math.round(w * dpr);

				//计算结束开始加载图片
				var img = new Image();
				if (set['qn']) {
					var qn = {};
					$.extend({}, qn, set['qn']);
					qn.w = set.qn.w || w;
					img.src = F['Qn'](src, qn);
				} else {
					img.src = src;
				}
				//加载成功
				img.onload = function() {
					if(is_img){
						$this.attr('src', img.src);
					}else{
						$this.css('background-image','url('+img.src+')');
					};
					$this.removeAttr(attr).removeClass('z-load').addClass(set.loaded);
					img.remove();
					set['load']($this);
				};
				//加载失败
				img.onerror = function() {
					if(is_img){
						$this.attr('src',df_src);
					}else{
						$this.css('background-image',df_src);
					};
					$this.addClass('.z-err').removeClass('z-load').addClass('z-ready');
					set['error']($this);
				};
			}; //_load_img



	}; //LazyImg

	//配置项
	F['LazyImg']['conf'] = {
		attr: 'fu-src',
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
		event: 'scroll.LazyImg',
		offsetL: 0,
		offsetT: 0,
		load: $.noop,
		error: $.noop,
		qn: {}, //使用七牛
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
		var $this = $(this);
		var act=act || 'toggle' ;
		if ($this.length < 1) {
			return false;
		};
		$this.attr('fu-obj','modal');
		//处理配置项
		var set = $.extend(true,{}, F['Modal']['conf'], opt ,F['ParseJSON']($this.attr('fu-conf')));
		//需要用到的变量
		var body_scrollTop = $(window).scrollTop();
		var $shade=$('.U-FU_shade'+set['shadeSkin']);
		var _method={};


		//show方法
		_method['in'] = function () {
			if($this.is(':visible')){return $this};
			//是否锁定滚动条
			if(set['lockScroll']){
				$('html').css({
					'margin-right':(F['Modal']['html_mr']+F.scrollbar_width)+'px',
					'overflow':'hidden'
				});
				//移动端影响body滚动
				$('body,html,window').off('touchmove.modal').on('touchmove.modal', function(event) {
					if ($('*[fu-obj="modal"]').is(':visible')) {
						event.preventDefault();
					}
				});
			};

			_method['position']();
			$shade.addClass('z-lock');
			if ($shade.is(':hidden') && set['shade'] ) {
				$shade.fadeIn('fast');
			}
			$this.show();
			//CSS3动画出来
			F['Css3Anim']($this, set['inAnim'], function() {
				$shade.removeClass('z-lock');
				set['inBack']();
			});
			//存储到关闭队列
			var shadeClose=F['Modal']['shadeClose'];
			var shadeLock=$this.is('.z-lock') || set['lockShade'];
			if(!shadeLock){
				shadeClose.push($this[0]);
			};
			//绑定关闭事件
			$this.find('.j-close').off('FU_tap.modal').on('FU_tap.modal',function(event) {
				$(this).parents('[fu-obj="modal"]')[namespace]('Modal','out');
			});
		};
		//hide方法
		_method['out'] = function (){
			 var shadeClose=F['Modal']['shadeClose'];		
			 shadeClose.splice($.inArray($this[0],shadeClose),1);
			if(shadeClose.length < 1){
				//所有都关完后
				//是否锁定滚动条
				if(set['lockScroll']){
					$('html').css({
						'margin-right':F['Modal']['html_mr']+'px',
					});
					$('html').css('overflow',F['Modal']['html_overflow']);
					//移动端影响body滚动
					$('body,html,window').off('touchmove.modal');
				};					
				$shade.fadeOut('fast');
			}
			$shade.addClass('z-lock');
			//CSS3动画出去
			F['Css3Anim']($this, set['outAnim'], function() {
				$shade.removeClass('z-lock');
				$this.hide();
				set['outBack']();
			});
		};


		//position方法，更正弹层位置
		_method['position']=function(){
			var win_h = $(window).innerHeight();

			//处理滚动条
			var $scroll = $this.children('.j-scroll') ;
			var bro_h=0;
			var pct = 0.8;
			$scroll.siblings().each(function(index, element) {
				var $bro = $(this);
				var position = $bro.css('position');
				if (position == 'static' || position == 'relative') {
					bro_h += $bro.outerHeight();
				}
			});
			$scroll.css('max-height', (win_h * pct - bro_h) + 'px');

			//防止内滚动影响外部滚动条
			$scroll.off('touchmove.modal').on('touchmove.modal', function(event) {
				if ($scroll[0].scrollHeight != $scroll[0].clientHeight) {
					event.stopPropagation();
				};
			});
			

			//垂直居中
			$this.css({
				"left": '50%',
				"top":'50%',
				"margin-left": '-' + $this.outerWidth() * 0.5 + 'px',
				"margin-top": '-' + $this.outerHeight() * 0.5 + 'px'
			});
			
			//浏览器窗口改变后，调整位置
			$(window).off('resize.modal').on('resize.modal',function(event){
				$('*[fu-obj="modal"]').each(function(index, el) {
					$(this)[namespace]('Modal','position');
				});	
			});

		};


		

		(_method[act] || $.noop)();
		return $this;
	};

	//遮罩关闭弹层顺序
	F['Modal']['shadeClose']=[];

	//默认配置项
	F['Modal']['conf'] = {
		shade:true,//是否出现阴影
		shadeSkin: '', //阴影皮肤类名
		inAnim: 'FU_modalIn .3s ease  both', //弹窗显示时动画
		outAnim: 'FU_modalOut .3s ease  both', //弹窗关闭时动画
		inBack: $.noop, //出来后回调
		outBack: $.noop, //关闭后回调
		lockScroll: true, //是否锁住滚动条
		lockShade:false //点击阴影是否可以关闭弹层
	};
	//初始化弹层
	F['Modal']['init']=function() {
		//初始化遮罩
		if ($('.U-FU_shade').length < 1) {
			$('body').append('<div class="U-FU_shade"></div>');
		};
		//记录滚动条情况
		F['Modal']['html_overflow'] = $('html').css('overflow');
		F['Modal']['body_overflow'] = $('body').css('overflow');
		F['Modal']['html_mr']=Number($('html').css('margin-right').replace('px',''));
		//绑定遮罩点击事件
		$('.U-FU_shade').on('FU_tap', function(event) {
			if($(this).is('.z-lock')){return 0;}
			var shadeClose =F['Modal']['shadeClose'];
			$(shadeClose[shadeClose.length - 1 ])[namespace]('Modal','out');
			event.stopPropagation();
		});

		//绑定触发器
		$('*[fu-modalin]').on('FU_tap', function(event) {
			$($(this).attr('fu-modalin')+'*[fu-obj="modal"]')[namespace]('Modal','in',F['ParseJSON']($(this).attr('fu-conf')));
		});
		$('*[fu-modalout]').on('FU_tap', function(event) {
			$($(this).attr('fu-modalout')+'*[fu-obj="modal"]')[namespace]('Modal','out',F['ParseJSON']($(this).attr('fu-conf')));
		});

	};
	


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
			F['Css3Anim']($hint, set['inAnim'], function() {
				set.inBack();
				var hide = setTimeout(function() {
					F['Css3Anim']($hint, set['outAnim'], function() {
						$hint.remove();
						set.outBack();
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
		inBack: $.noop,
		outBack: $.noop,
		inAnim: 'FU_hintIn .3s ease  both',
		outAnim: 'FU_hintOut .3s ease  both',
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

			//表单submit事件
			$this.off('submit.Form').on('submit.Form', function(event) {
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
				var err=false;
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
					//数据验证
					var type=$this.attr('fu-verify');
					var verify=F['Verify'](type,val);
					if(verify.err){
						err=true;
						F['Hint']({ct:verify.ct,type:2});
						return false;
					};
					postData[name] = val;
				});
				if(err){return false};
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
			$this.find('input[name],textarea[name],select[name]').off('keydown.Form').on('keydown.Form', function(event) {
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
			$this.find(set['submit']).off('FU_tap.Form').on('FU_tap.Form', function(event) {
				var $this = $(this);
				var $form = $this.parents(selector).first();
				if ($this.is('.z-loading') || $this.is('.z-lock')) {
					return false;
				}
				$form.trigger("submit.Form");
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
	};




	/* ----- [UI控件JS] ----- */
	F['Ui'] = function(type, opt) {
		var $this = $(this);
		(F['Ui']['widget'][type] || $.noop)($this, opt);
		return $this;
	};

	F['Ui']['widget'] = {
		//数字输入框
		'number': function($this,opt) {
			var selector = $this.selector;
			var set = $.extend({}, F['Ui']['conf']['number'], opt);
			
			$this.each(function() {
				var $number = $(this);
				var $input=$number.find('input');
				$this.attr('fu-obj', 'number');
				//方法
				function _method(type){
					var _$number = $number;
					var _$input = $input;
					var _min = Number(_$number.attr('fu-min') || set['min']);
					var _max = Number(_$number.attr('fu-max') || set['max']);
					var _step = Number(_$number.attr('fu-step') || set['step']);
					var _point = Number(_$number.attr('fu-point') || set['point'] || String(_step).indexOf('.') > -1 ? String(_step).split('.').pop().length : 0);
					var val = Number(_$input.val());
					var _fn=type;
					//输入内容过滤
					if(_fn == 'correct'){
						_$input.val(Number(val));
						if(val < _min){
							_$input.val(_min);
						}
						if(val > _max){
							_$input.val(_max);
						}
						if(isNaN(_$input.val())){
							_$input.val(0);
						}
						return 1;
					};

					//加
					if (_fn == 'add') {
						var result = (val + _step).toFixed(_point);

						if (result > _max) {
							result = _max
						}
						_$input.val(result);
					};
					//减
					if (_fn == 'sub') {
						var result = (val - _step).toFixed(_point);
						if (result < _min) {
							result = _min
						}
						_$input.val(result);
					};
					//min
					if (_fn == 'min') {
						_$input.val(_min);
					};
					//max
					if (_fn == 'max') {
						_$input.val(_max);
					};
					//清空
					if(_fn == 'clear'){
						_$input.val('');
					};
					_$input.trigger('change');
					
				};
				//按钮点击
				$number.find('*[fu-fn]').off('FU_tap.FU_number').on('FU_tap.FU_number', function() {
					var $this = $(this);
					 _method($this.attr('fu-fn'));	
				});
				
				//输入内容过滤
				$input.off('change.FU_number').on('change.FU_number',function(event){
					_method('correct');
				});
				//输入内容过滤
				$input.off('keydown.FU_number').on('keydown.FU_number',function(event){
					var $this=$(this);
					var keyCode = event.keyCode;
					var is_numKey = (keyCode >=95 && keyCode <= 105) || (keyCode >=48 && keyCode <= 57) || keyCode==110 || keyCode == 190 || keyCode== 8 || keyCode == 109 || keyCode == 189 || keyCode == 9 ; 
					if(!is_numKey){
						event.preventDefault();
					}
				});
				//滑轮控制
				$input.off('mousewheel.FU_number').on('mousewheel.FU_number',function(event,delta, deltaX, deltaY){
					if($(this).is(':focus')){
						event.preventDefault();
						if(deltaY == 1){
							_method('add');
						}
						if(deltaY == -1){
							_method('sub');
						}
					}
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
				$this.off('FU_tap.FU').on('FU_tap.FU', function() {
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

				$this.off('FU_tap.FU').on('FU_tap.FU', function(event) {
					var $this = $(this);
					if ($this.is('.z-open')) {
						F['Css3Anim']($opts, set['outAnim'], function() {
							$this.removeClass('z-open');
						});
					} else {
						$('[fu-obj="select"].z-open').removeClass('z-open');
						$this.addClass('z-open');
						F['Css3Anim']($opts, set['inAnim']);
					};
					event.stopPropagation();
				});

				$opt.off('FU_tap.FU').on('FU_tap.FU', function(event) {
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

			$(document).on('FU_tap.FU_select', function() {
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
			var low=!F['SupportCss3']('animation');
			var low_img="data:image/gif;base64,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";
			$this.each(function() {
				var $this=$(this);
				//低级浏览器处理
				if(low){
					$this.addClass('s-low').html('<img src="'+low_img+'"/>').removeClass('s-default');
					return true;
				}
				$this.addClass('s-default');
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
		},
		//输入输入框
		'number':{
			min:0,
			max:100,
			step:1
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
	for (var i=0;i<namespaces.length;i++){
		$.fn[namespaces[i]] = function() {
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
		window[namespaces[i]] = F;
	};


	$(document).ready(function(e) {
		//-低版本IE不允许访问
		F['LowIE']();
		//-文档准备就绪初始化UI组件
		F['Ui']['init']();
		//-滚动条宽度
		if(!F['is_touch']){
			(function(){
				$('body').append('<div class="f-FU_scrollWidth"><div></div></div>');
				var $scrollWidth=$('.f-FU_scrollWidth');
				var no_scroll=$scrollWidth.children().width();
				var is_scroll=$scrollWidth.css('overflow-y','scroll').children().width();
				F.scrollbar_width= (no_scroll - is_scroll) || 0;
				$scrollWidth.remove();
			})();
		}
		//初始化弹层
		F['Modal']['init']();
		//初始化表单提交
		$('.J-FU_form')[namespace]('Form');
		
	});

	return $.widget;
}));
/* ----- [freeUI JS] ----- */