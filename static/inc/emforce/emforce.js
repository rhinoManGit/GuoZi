/////////////////////////////////////
//절대수정하지마세요./
//광고주코드
var cm_label = "CM_M_1017907";
//광고타입
var cm_type = "brand";
/////////////////////////////////////

var CM=
function(){
	var b={
		Load:function(d){
			var c=window.onload;
			window.onload=function(){
				if(c){c()}
				d()
			}
		}
	};
	
	function a(e){
		if(document.createElement){
			var c=document.createElement('iframe');
			if(c){
				c.width='1px';
				c.height='1px';
				c.style.display='none';
				c.src=e;
				var d=document.getElementById('cm_div');
				if(d!=null&&d.appendChild){
					d.appendChild(c)
				}
			}
		}
	}
	return{
		Load:function(c){
			document.write("<div id='cm_div' style='display:none;'></div>");
			c+='&l='+cm_label;
			c+='&t='+cm_type;	
			c+='&ref='+encodeURIComponent(document.referrer);	
			c+='&loc='+encodeURIComponent(document.location);
			c+='&r='+Math.floor(Math.random()*99999999999);
			b.Load(function(){a(c.substring(0,2000))})
		}
	}
}
();
CM.Load('//rtb.clickmon.co.kr/RT_GATE/rt_gate.php?');
									