(function(){

var now = { row:1, col:1 }, last = { row:0, col:0};
const towards = { up:1, right:2, down:3, left:4};
var isAnimating = false;

s=window.innerHeight/500;
ss=250*(1-s);

$('.wrap').css('-webkit-transform','scale('+s+','+s+') translate(0px,-'+ss+'px)');

document.addEventListener('touchmove',function(event){
	// console.log(event);
	event.preventDefault(); },false);

$(document).swipeUp(function(){
	if (isAnimating) return;
	last.row = now.row;
	last.col = now.col;
	if (last.row != 6) {
		now.row = last.row+1; now.col = 1; pageMove(towards.up);
	}
	if (last.row == 6) { now.row = 1; now.col = 1; pageMove(towards.up);return false;}
})

$(document).swipeDown(function(){
	if (isAnimating) return;
	last.row = now.row;
	last.col = now.col;
	if (last.row!=1) {
		now.row = last.row-1; now.col = 1; pageMove(towards.down);
	}
	if (last.row==1) { /*now.row = 15; now.col = 1; pageMove(towards.down);*/return false;}
})

$(document).swipeLeft(function(){

})

$(document).swipeRight(function(){

})

function pageMove(tw){
	var lastPage = ".page-"+last.row+"-"+last.col,
		nowPage = ".page-"+now.row+"-"+now.col;
	switch(tw) {
		case towards.up:
			outClass = 'pt-page-moveToTop';
			inClass = 'pt-page-moveFromBottom';
			break;
		case towards.right:
			outClass = 'pt-page-moveToRight';
			inClass = 'pt-page-moveFromLeft';
			break;
		case towards.down:
			outClass = 'pt-page-moveToBottom';
			inClass = 'pt-page-moveFromTop';
			break;
		case towards.left:
			outClass = 'pt-page-moveToLeft';
			inClass = 'pt-page-moveFromRight';
			break;
	}
	isAnimating = true;
	// $('.page-4-1').addClass("hide");
	$(lastPage).addClass(outClass);
    $(nowPage).addClass(inClass);
    $(nowPage).addClass('page-current');
    $(nowPage).find('[data-num]').each(function(k, v){
        (new countUp(v, (v.dataset.num/2), v.dataset.num, (v.dataset.fix?v.dataset.fix:2), 1)).start();
    });
	setTimeout(function(){
		$(lastPage).removeClass('page-current');
		$(lastPage).removeClass(outClass);
		// $(lastPage).addClass("hide");
		// $(lastPage).find("img").addClass("hide");

		// $(nowPage).addClass('page-current');
		// $(nowPage).find('[data-num]').each(function(k, v){
		// 	(new countUp(v, (v.dataset.num/2), v.dataset.num, (v.dataset.fix?v.dataset.fix:2), 1)).start();
		// });
		/*$(nowPage).find('[data-mynum]').each(function(k, v){
			(new countUp2(v, (v.dataset.num/2), v.dataset.num, (v.dataset.fix?v.dataset.fix:2), 1)).start();
		});*/

		$(nowPage).removeClass(inClass);

		isAnimating = false;
	},2000);
}


	//loading
	var num = 0,
		imgleng = $("#pages img").length;

	function imgLoader($img){
		var _src = $img.attr("_src");
		$img.attr("src",_src);
		$img.get(0).onload = function(){
			num++;
			if(num < imgleng){
				// $("#loader .loader_img2").css({height:Math.ceil((num)/(imgleng)*100)+"%"});
				$("#loader").html(Math.ceil((num)/(imgleng)*100)+"%");
				imgLoader($("#pages img").eq(num));

			}else{
				// $("#loader .loader_img2").css({height:100+"%"});
				$("#loader").html(100+"%");
				$("#pages").show();
				$("#loader").hide();
				$('.page-1-1').addClass('page-current');
			}
		};
		$img.get(0).onerror =function(){
			$("#pages").show();
			$("#loader").hide();

			$('.page-1-1').addClass('page-current');
			alert("图片未加载完成");
		}
	}

	imgLoader($("#pages img").eq(num));
	$("#share").tap(function(){
		$(".share-img").show();
		$(".mark").show();
	});
	$(".mark").tap(function(){
		$(".share-img").hide();
		$(".mark").hide();
	});

	//自适应屏幕大小rem双倍图
	;(function(win,doc){
		function change(){
			doc.documentElement.fontSize = 20*doc.documentElement.clientWidth/375+'px';
		}
		change();
		win.addEventListener('resize',function(){
			change();
		},false)
	})(window,document)


})();

