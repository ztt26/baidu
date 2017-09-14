//获取元素
//菜单栏
var menu=document.getElementById('menu');
//菜单栏左侧按钮
var menuLeft=menu.children[0].children;
//菜单栏右侧按钮
var menuRight=menu.children[1].children;
//底部元素
var bot=document.getElementById('bottom');
//底部左侧
var botLeft=bot.children[0];
//底部右侧
var botRight=bot.children[1];
//右侧下方的大内容
var details=document.getElementsByClassName('details')[0];
//右侧上方的目录
var catalogo=document.getElementsByClassName('catalogo')[0];
var cName=document.getElementsByClassName('rename')[0];
//显示模式    1:列表模式   0：缩略图模式
var mode=1;
//渲染左侧页面
setLeft(data,1);
//初始化渲染右侧页面
if(!location.hash){
	location.hash='data/0';
}
showR();
//hash改变
window.onhashchange=function(){
	var h=location.hash?location.hash.substr(1):'data/0';
	var divsL=Array.from(botLeft.getElementsByTagName('div'));
	var div=divsL.find(function(a){
		var attr=a.getAttribute('path');
		return attr==h;
	});
	if(div){
		showR();
	}
	
}
//切换
var menuRight=document.getElementsByClassName('right')[0]
var switchsDiv=menuRight.children[1];
var switcheUl=switchsDiv.children[1];
var switchLis=switcheUl.children;
switchsDiv.onmouseenter=function(){
	this.children[0].className="over";
	switcheUl.style.display="block";
}
switchsDiv.onmouseleave=function(){
	this.children[0].className="";
	switcheUl.style.display="";
}
switchLis[2].onclick=function(){
	mode=mode?0:1;
	this.innerHTML=mode?'显示缩略图':'显示列表';
	cName.style.display='';
	showR();
}
//新建文件夹
var menuLeft=document.getElementsByClassName('left')[0];
var menuLis=menuLeft.children;
//新建文件
menuLis[5].onclick=function(){
	var event=event?event:window.event;
	event.stopPropagation();
	event.cancelBubble=true;
	newFile();
}
//重命名
menuLis[3].onclick=function(){
	var divs=Array.from(details.getElementsByTagName('div'));
	var m=0;
	divs.forEach(function(a){
		if(a.check){
			m++;
		}
	});
	if(m==1){
		var tar=divs.find(function(a){
			return a.check==true;
		})
		rename(tar);
	}
}
//删除
menuLis[4].onclick=function(){
	cName.style.display='';
	var divs=details.getElementsByTagName('div');
	for(var i=0;i<divs.length;i++){
		if(divs[i].check){
			removeFile(divs[i]);
			i--;
		}
	}
}

//右键点击
var contextmenu=document.getElementById('contextmenu');
var contLis=contextmenu.children;
var blankmenu=document.getElementById('blankmenu');
var blankLis=blankmenu.children;
//右侧下房右键菜单
handler.addEvent(details,'mouseenter',function(event){
	var divs=Array.from(details.children);
	handler.addEvent(details,'contextmenu',function(event){
		cName.style.display='';	
		var event=handler.getEvent(event);
		var target=handler.getTarget(event);
		handler.preventDefault(event);
		blankmenu.style.display='block';
		blankmenu.style.top=event.pageY+'px'
		blankmenu.style.left=event.clientX+'px';
		blankLis[0].onclick=function(){
			newFile();
			contextmenu.style.display='none';
		}
		blankLis[1].onclick=function(){
			details.innerHTML='';
			setTimeout(showR,10);
			contextmenu.style.display='none';
		}
		blankLis[2].onclick=function(){
			mode=mode?0:1;
			switchLis[2].innerHTML=mode?'显示缩略图':'显示列表';
			showR();
			contextmenu.style.display='none';
		}
	});
//文件夹右键菜单
	for(var i=0;i<divs.length;i++){
		handler.addEvent(divs[i],'contextmenu',function(event){
			blankmenu.style.display='';
			for(var i=0;i<divs.length;i++){
				tab1(divs[i])
			}
			var event=handler.getEvent(event);
			var target=handler.getTarget(event);
			tab(target);
			handler.stopPropagation(event);
			handler.preventDefault(event);
			contextmenu.style.display='block';
			contextmenu.style.top=event.pageY+'px'
			contextmenu.style.left=event.clientX+'px';
			contLis[3].onclick=function(){
				rename(target);
			}
			contLis[4].onclick=function(){
				removeFile(target);
			}
			allCheck();
		})
	}
});
//空白处点击菜单消失
document.addEventListener('click',function(){
	contextmenu.style.display='';
	blankmenu.style.display='';
},false);
//document.addEventListener('contextmenu',function(){
//	contextmenu.style.display='';
//},false);

//框选
details.onmousedown=function(ev){
	ev.cancelBubble=true;
	ev.preventDefault();
	var divs=Array.from(details.children);
	var boxChoose=document.getElementsByClassName('boxChoose')[0];
	var x=ev.pageX;
	var y=ev.pageY;
	document.onmousemove=function(ev){
		boxChoose.style.display='block';
		var nx=ev.pageX;
		var ny=ev.pageY;
		boxChoose.style.width=Math.abs(nx-x)+'px';
		boxChoose.style.height=Math.abs(ny-y)+'px';
		boxChoose.style.left=(x<nx?x:nx)+'px';
		boxChoose.style.top=(y<ny?y:ny)+'px';
		for(var i=0;i<divs.length;i++){
			if(collasp(boxChoose,divs[i])){
				tab(divs[i]);
				allCheck();
			}else{
				tab1(divs[i]);
				allCheck();
			}
		}
	}
	document.onmouseup=function(){
		boxChoose.style.cssText='';
		document.onmousemove=null;
		document.onmouseup=null;
		var pan=divs.filter(function(a){
			return a.check==true;
		})
		if(pan.length){
			move();
		}
	}
}

