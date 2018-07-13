/**

 * 请求工具类

 */

var requestUtil = (function(jq){

	  // 没有提示的ajax请求标志,没返回之前不准发第二次请求

	var request_flag = false,

	   // 有提示的ajax请求标志,没返回之前不准发第二次请求

		layer_request_flag = false,

		layer_html1 = '<div id="post_layer" style="width:100%;height:100%;background:#ffffff;opacity:0;margin:0;padding:0;position:fixed;left:0;top:0;z-index:999;"></div>'

					+ '<div id="post_loading" style="width:32%;padding-top:5%;left:34%;top:32%;position:fixed;z-index:1000;opacity:0.8;background:black;border-radius:6px;text-align:center;color:#ffffff;">'

					+ '<img src="images/loading.gif" style="width:26%;max-width:100%;display:inline;">'

					+ '<p style="text-align:center;width:100%;font-size:24px;padding-top:6%;padding-bottom:8%;">',

		layer_html2 = '</p></div>',

		post_layer,post_loading;

	var setLayerFlag = function(flag){

		layer_request_flag = flag;

	};

	var showLayer = function(content){

		if(post_layer && post_loading && !content){

			post_layer.show();

			post_loading.show();

		} else {

			if(post_layer){

				post_layer.remove();

			};

			if(post_loading){

				post_loading.remove();

			};

			content = content || '正在加载';

			jq('body').append(layer_html1 + content + layer_html2);		

			post_layer = jq('#post_layer');

			post_loading = jq('#post_loading');

		}

	};

	var hideLayer = function(){

		if(post_layer && post_loading){

			post_layer.hide();

			post_loading.hide();

		}

	};

	var countDown = function(count_fun, end_fun) {

		var that = this;

		var auto = setInterval(function() {

			that.count--;

			if (that.count <= 0) {

				end_fun && end_fun.call(that);

				clearInterval(auto);

			};

			count_fun && count_fun.call(that);

		}, 1000);

	};

	var tools = {

		count: 2,

		phone_reg: /^1[3|4|5|7|8]\d{9}$/,

		tip: jq('#tip'),

		checkPhone: function(number) {

			return this.phone_reg.test(number);

		},

		alertTip: function(content) {

			// 这里面3秒后自动消失的tips

			this.tip.text(content)

			this.tip.show();

			countDown.call(this, undefined, function() {

				this.tip.hide();

				this.count = 2;

			});

		},

		// 密码加密

		 encryptByDES:  function (message, key) {
		    var keyHex = CryptoJS.enc.Utf8.parse(key);
		    	try{

				var encrypted = CryptoJS.DES.encrypt(String(message), keyHex, {

		        mode: CryptoJS.mode.ECB,

		        padding: CryptoJS.pad.Pkcs7

		    });
		    	}catch(e){
		    	}
		    
		   
		    return encrypted.toString();

		},

		// 解密方法

		decryptByDES:function(ciphertext, key) {

			//console.log(ciphertext)

			 var keyHex = CryptoJS.enc.Utf8.parse(key);

                // direct decrypt ciphertext

                var decrypted = CryptoJS.DES.decrypt({

                    ciphertext: CryptoJS.enc.Base64.parse(ciphertext)

                }, keyHex, {

                    mode: CryptoJS.mode.ECB,

                    padding: CryptoJS.pad.Pkcs7

                });

                return decrypted.toString(CryptoJS.enc.Utf8);

		},

		// 因为url参数做了双重加密，因此这里获得值都要解密一下

		GetQueryStringfnDES:function(name)

		{

		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

		     var r = window.location.search.substr(1).match(reg);

		     if(r!=null){

		     	return  this.decryptByDES(decodeURI(unescape(r[2])),public.DESkey); 

		     }else{

		     	return null;

		     }

		},

		// url 不解密的情况

		GetQueryStringfn:function(name)

		{

		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

		     var r = window.location.search.substr(1).match(reg);

		     if(r!=null){

		     	return  unescape(r[2]);

		     }else{

		     	return null;

		     }

		},

		// 注册成功之后，注册页面上的登录按钮，判断参数跳转不同的登录

		deviceopplogin:function(ele){

			//判断设备只有app才有值,在本设备弹出登录注册框，其他的都调接口

			var registeropp=ele||'';

            var device_token=this.GetQueryStringfnDES('device_token');

            var platform=this.GetQueryStringfnDES('platform')||4;

            var openid=this.GetQueryStringfnDES('openid');//判断wap,微信

            jq('.page_register').hide();

            jq('.page_login_cont').hide();

            if(platform==1||platform==2){

                if(registeropp){

				    jq('.page_register').show();

	            }else{

	              	jq('.page_login_cont').show();

	            }

	                jq('.opomask').show();

	        }else if(platform==3){

	        	if(registeropp){

	        	  jq('.page_register').show();

				  jq('.opomask').show();

	        	}else if(openid&&openid!='null'){

	        	 	window.location.href=public.gowechatloginpath+"?openId="+openid;

	        	}

	        }else if(platform==4){

	        	if(registeropp){

	        	  jq('.page_register').show();

				  jq('.opomask').show();

	        	}else{

	        		window.location.href=public.gowraploginpath;

	        	}

	        }

		},

		// 获取浏览器所有参数

		getparameter:function(){

			var arr=location.search.substr(1).split('&');

			var obj={};

			for(var i=0;i<arr.length;i++){

	             var data=arr[i].split('=');

	             obj[data[0]]=data[1];

			}

			return obj;

		},
		// 进入页面，或者本页面登录成功之后需要知道互动阶段
		askactivenum:function(actCodenum){
			console.log(actCodenum)
             //根据请求抽奖次数返回异常，再发第二次请求根据异常判断活动阶段
            var that=this;

		    var parameters=jq('input[name="uid"]').data();

			    parameters.platform=this.GetQueryStringfnDES('platform')||4;

			    parameters.device_token=this.GetQueryStringfnDES('device_token')||'';

			    parameters.actCode=actCodenum;

			    $.ajax({  
			        url : public.pageinteractionpath+"/act07/v1/01",  
			        type : "POST",  
			        dataType : "json",  
			        data: parameters,
			        success : function(res){
//				    	 alert('/act07/v1/01==='+JSON.stringify(res) +'-----flag=' + flag)
//alert(res.code+"页面返回值")
			        	 if(res.code=="0000"){

			        		jq('input[name="uid"]').data({

			        			'lottery_token':res.data.lottery_token,

			        			'lottery_times':res.data.lottery_times

			        		});
			        		if (!res.data || !res.data.lottery_times){
			        			$('.times label').html(0);
			        		}else{
			        			$('.times label').html(res.data.lottery_times);
			        		}
			        		console.log(public)
                            //alert(public.activenum+"===num")
                            // 开启第几个阶段提示信息做相应的改变
			        	    if(public.activenum==2){
                               jq('.page_register .tit_txt').add(jq('.page_login_cont .tit_txt')).html('集齐龙家族<br>赢迪士尼乐园游!');
                               jq('.win_content_list .bt').html('中奖记录');
                               jq('.btn_disable_long').hide();
                               jq('#collectlong').css('display','block');
			        		}else if(public.activenum==3){
			        		   jq('.page_register .tit_txt').add(jq('.page_login_cont .tit_txt')).html('冲榜单<br>赢2万现金');
			        		   jq('.win_content_list .bt').html('中奖记录');
			        		   jq('.btn_disable_long').html('已结束');
			        		   jq('.btn_disable_rush_list').hide();
                               jq('#rush_list').css('display','block');
			        		}

			        	  }else if(res.code=="2026"){
			        	  	//alert(res.code)
                               public.activenum=Number(public.activenum)+1;
                               // that.askactivenum(public.actCode2);
			        	  }

					}
			    });

		},
		// 收集小龙人情况
        collectlongstyle:function(){
        	   var that=this;
        	   var parameters=jq('input[name="uid"]').data();

				   parameters.platform=this.GetQueryStringfnDES('platform')||4;

				   parameters.device_token=this.GetQueryStringfnDES('device_token')||'';
				   parameters.actCode=public.actCode2;

               $.post(public.pageinteractionpath+"/act09/material/query",parameters,function(res){
                       if(res.code=="0000"){
                       	 jq.each(public.longlistarr,function(i,ele){

                       	 	for(var j=0;j<res.data.length;j++){
 
                       	 		 if(ele==res.data[j]){

                                    jq('.long_list span').eq(i).addClass('active')
                               } 
                       	 	}
                              
                       	 })

                       }
               });
        }

	};

	return {

		tools:tools,

		GetQueryStringfn:function(name)

		{

		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

		     var r = window.location.search.substr(1).match(reg);

		     if(r!=null){

		     	//return  tools.decryptByDES(decodeURI(unescape(r[2])),public.DESkey); 

		     	return  unescape(r[2]); 

		     }else{

		     	return null;

		     }

		},

		post : function(url,data,success_fun){



			if(request_flag){

				return false;

			} else {

				request_flag = true;

			}

			var that = this;

			jq.post(url,data,success_fun,'json').error(function(jqXHR, textStatus, errorThrown){

				

			if (textStatus == 'timeout') {

			alert('网络不给力，请稍后再试');

			}}).complete(function(){

					that.setFlag(false);

				});

			},

		setFlag : function(flag){

			request_flag = flag;

		},

		setLayerFlag : function(flag){

			layer_request_flag = flag;

		},

		hide : function(){

			hideLayer();

		},

		postLayer : function(url,data,success_fun,content){

			if(layer_request_flag){

				return false;

			} else {

				setLayerFlag(true);

			}

			showLayer(content);

			var that = this;

			jq.post(url,data,success_fun,'json').error(function(jqXHR, textStatus, errorThrown){

				if (textStatus == 'timeout') {

				alert('网络不给力，请稍后再试');

				}}).complete(function(){

					setLayerFlag(false);

					hideLayer();

				});

		}
	}

}($));