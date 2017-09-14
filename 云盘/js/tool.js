//左侧栏渲染
function setLeft(arr,n){
	function showLeft(arr,n){
		var str='';
		for(var i=0;i<arr.length;i++){
			if(arr[i].child.length){
				str+=`<ul style="display:none">
						<li>
							<div class="list" style="padding-left:${n*20}px" path=${arr[i].path}>
								<i class=""></i>
								<b class=""></b>
								<span>${arr[i].name}</span>
							</div>
							${showLeft(arr[i].child,n+1)}
						</li>
					</ul>`;
			}else{
				str+=`<ul style="display:none">
						<li>
							<div style="padding-left:${n*20}px" path=${arr[i].path}>
								<i></i>
								<b></b>
								<span>${arr[i].name}</span>
							</div>
						</li>
					</ul>`;
			}
		}

		return str;
	}
	botLeft.innerHTML=showLeft(arr,1);
//设置最外层显示
	for(var i=0;i<botLeft.children[0].children.length;i++){
		botLeft.children[0].style.display='block';
		botLeft.children[0].children[i].children[0].className='cloud /*focus*/ list';
	}
//左侧导航的点击切换
	var divsLeft=botLeft.getElementsByTagName('div');
	for(var i=0;i<divsLeft.length;i++){
		divsLeft[i].onclick=function(){
			showR(this);
		}
	}
	var is=botLeft.getElementsByTagName('i');
	for(var i=0;i<is.length;i++){
		opens(is[i])
	}
}

//左侧背景色变更
function changeBack(){
	var h=location.hash?location.hash.substr(1):'data/0';
	var divsL=Array.from(botLeft.getElementsByTagName('div'));
	var div=divsL.find(function(a){
		var attr=a.getAttribute('path');
		return attr==h;
	});
	divsL.forEach(function(a){
		a.classList.remove('focus');
	})
	div.classList.add('focus');
}
//左侧重命名
function changeName(obj,arr){
	var path=obj.getAttribute('path');
	var divsL=Array.from(botLeft.getElementsByTagName('div'));
	var div=divsL.find(function(a){
		var attr=a.getAttribute('path');
		return attr==path;
	});
	var span=div.getElementsByTagName('span')[0];
	span.innerHTML=arr.name;
}

//左侧导航的开合设置

function opens(obj){
	var attr=obj.getAttribute('class');
	var next=obj.parentNode.parentNode.children;
	if(next.length>1){
		obj.onclick=function(ev){
			ev=event||window.event;
			ev.cancelBubble=true;
			for(var i=1;i<next.length;i++){
				if(this.className==''){
					next[i].style.display='block';
				}else{
					next[i].style.display='none';
				}
			}
			this.classList.toggle('open');
			this.nextElementSibling.classList.toggle('open');
		}
	}
}



//获取子数组
function getPath(obj){
	var path=obj?obj.getAttribute('path').split('/'):location.hash.split('/');
	var arr=[];
	var str='';
	for(var i=1;i<path.length;i++){
		str+= i%2==0?('.'+path[i]):('['+Number(path[i])+']');
	}
	str='data'+str+'.child';
	arr=eval(str);
	return arr;
}
//获取对象的path
function objPath(arr){
	var str='data';
	for(var i=1;i<arr.length;i++){
		str+= i%2==0?('.'+arr[i]):('['+Number(arr[i])+']');
	}
	var val=eval(str);
	return val;
}
//右侧下部内容的生成
function showRight(obj){
	details.innerHTML='';
	var arr=getPath(obj)?getPath(obj):[];
	var divs=[];
	for(var i=0;i<arr.length;i++){
		var div=createEle(arr[i]);
		divs.push(div);
	}
	return divs;
}
//生成单个右侧元素
function createEle(obj){
	var div=document.createElement('div');
	div.setAttribute('path',obj.path);
	div.check=false;
	var a=document.createElement('a');
	a.href='javascript:;';
	a.className='choose';
	a.check=false;
	if(mode){
		div.className='list';
		var p=document.createElement('p');
		p.className='names';
		p.innerHTML=obj.name;
		var span=document.createElement('span');
		for(var j=0;j<5;j++){
			var strong=document.createElement('strong');
			span.appendChild(strong);
	//为每个标签后的小图标添加点击事件
			switch(j){
			//重命名
				case 3:strong.onclick=function(){
					rename(div);
				}
					break;
			//删除
				case 4:strong.onclick=function(){
					removeFile(div);
				}
					break;
			}
		}
		var time=document.createElement('time');
		time.innerHTML='2017-06-18 12:10';
		div.appendChild(a);
		div.appendChild(p);
		div.appendChild(span);
		div.appendChild(time);
		div.onmouseenter=function(){
			if(!this.check){
				this.classList.add('purple');
			}
		}
		div.onmouseleave=function(){
			if(!this.check){
				this.classList.remove('purple');
			}
		}
	}else{
		div.className='imgs';
		div.innerHTML='<p>'+obj.name+'</p>';
		div.appendChild(a);
		div.onmouseenter=function(){
			if(!this.check){
				this.classList.add('blue');
				a.style.display='block';
			}
		}
		div.onmouseleave=function(){
			if(!this.check){
				this.classList.remove('blue');
				a.style.display='';
			}
		}
	}

//单击选框
	a.onclick=function(){
		a.check=!a.check;
		div.check=!div.check;
		if(a.check){
			this.style.display='block';
			this.style.background='#fff url(images/choose.png) no-repeat center';
			if(!mode){
				div.classList.add('blue');
			}else{
				div.classList.add('purple');
			}
		}else{
			this.style.background='';
		}
		allCheck();
		move();
	}
//取消默认事件
a.onmousedown=function(ev){
	ev.cancelBubble=true;
}
//取消div上的鼠标按下的冒泡事件
div.onmousedown=function(ev){
	ev.cancelBubble=true;
}
//取消选框的双击进入子文件夹
	a.ondblclick=function(ev){
		ev.cancelBubble=true;
	}
//双击进入子文件夹
	div.ondblclick=function(){
		showR(this);
	}
	return div;
}
//右侧上部内容生成
function showCatalogo(obj){
	catalogo.innerHTML='';
	var path=obj?obj.getAttribute('path').split('/'):location.hash.split('/');
	var a=document.createElement('a');
	a.href='javascript:;';
	a.id='allCheck';
	var s='data';
	var arr=[];
	arr.push(a);
	for(var i=1;i<path.length;i++){
		s+=(i%2==0?('.'+path[i]):('['+Number(path[i])+']'));
		if(i%2==0){
			continue;
		}
		var keyname=eval(s);
		var div=document.createElement('div');
		div.setAttribute('path',keyname.path);
		var span=document.createElement('span');
		span.innerHTML=keyname.name;
		div.appendChild(span);
		div.onclick=function(){
			showR(this);
		}
		arr.push(div);
	}
	return arr;
}
//渲染
function showR(obj){
	location.hash=obj?obj.getAttribute('path'):location.hash;
	var arr=showRight(obj);
	for(var i=0;i<arr.length;i++){
		details.appendChild(arr[i]);
	}
	var arr1=showCatalogo(obj);
	for(var i=0;i<arr1.length;i++){
		catalogo.appendChild(arr1[i]);
	}
	allCheck();
	changeBack();
}
//判断全选
function allCheck(){
	var all=document.getElementById('allCheck');
	all.check=false;
	var divs=details.children;
	var m=0;
	for(var i=0;i<divs.length;i++){
		if(divs[i].check){
			m++;
		}
	}
	if(divs.length&&m==divs.length){
		all.check=true;
		all.style.background='#fff url(images/choose.png) no-repeat center';
	}else{
		all.check=false;
		all.style.background='';
	}
//点击全选按钮
	all.onclick=function(){
		var divs=Array.from(details.children);
		all.check=!all.check;
		if(all.check){
			divs.forEach(function(m){
				tab(m);
			});
			allCheck();
		}else{
			divs.forEach(function(m){
				tab1(m)
			})
			allCheck();
		}
	}
}
//切换选中状态
function tab(div){
	var a=div.getElementsByTagName('a')[0];
	div.check=true;
	a.check=true;
	a.style.display='block';
	a.style.background='#fff url(images/choose.png) no-repeat center';
	if(!mode){
		div.classList.add('blue');
	}else{
		div.classList.add('purple');
	}
}
function tab1(div){
	var a=div.getElementsByTagName('a')[0];
	div.check=false;
	a.check=false;
	a.style.display='';
	a.style.background='';
	if(!mode){
		div.classList.remove('blue');
	}else{
		div.classList.remove('purple');
	}
}


//新建文件夹
function newFile(){
	var paths=location.hash.substr(1);
	var arrPath=location.hash.substr(1).split('/');
	var arr=objPath(arrPath).child;
	var obj={};
	obj.child=[];
//控制重名
	str='新建文件夹';
	var n=0;
	function fn(){
		var m=0;
		for(var i=0;i<arr.length;i++){
			if(arr[i].name==(str+(n?'('+n+')':''))){
				n++;
				m++;
				fn();
			}
		}
		if(!m){
			return n;
		}
	}
	
	fn();
	obj.name=n?str+'('+n+')':str;
	arr.unshift(obj);
	var div=createEle(arr[0]);
	details.insertBefore(div,details.children[0]);
	changePath(objPath(arrPath));
	showR();
	allCheck();
	setLeft(data,1);
	rename(details.children[0]);
	return div;
}
//重命名
function rename(obj){
	var p=obj.getElementsByTagName('p')[0];
	var div=document.getElementsByClassName('rename')[0];
	var input=div.getElementsByTagName('input')[0];
	input.value=p.innerHTML?p.innerHTML:'新建文件夹';
	var em=document.getElementsByTagName('em');
	div.style.display='block';
	div.style.left=p.getBoundingClientRect().left+'px';
	div.style.top=155+p.parentNode.offsetHeight+p.parentNode.offsetTop-details.scrollTop+'px';
	if(mode){
		div.style.left=30+p.getBoundingClientRect().left+'px';
		div.style.top=140+p.parentNode.offsetHeight+p.parentNode.offsetTop-details.scrollTop+'px';
	}
	var path=p.parentNode.getAttribute('path').split('/');
	var arr=objPath(path);
	input.setSelectionRange(0,20)
	input.focus();
//确定新命名
	em[0].onclick=function(){
		div.style.cssText='';
		arr.name=input.value;
		dblNames(arr);
		showR();
		changeName(obj,arr);
	}
//取消命名
	em[1].onclick=function(){
		div.style.cssText='';
		dblNames(arr);
//		setLeft(data,1);
	}
}

//删除文件夹
function removeFile(obj){
	var paths=obj.getAttribute('path');
	var parent=obj.parentNode;
	var parentPath=obj.getAttribute('path').split('/').slice(0,-2);
	var target=objPath(parentPath).child;
//删除节点
	parent.removeChild(obj);
//删除数据
	var choose=target.find(function(a){
		return a.path==paths;
	})
	target.splice(target.indexOf(choose),1);
	target.forEach(function(a,b){
		a.path=a.path.slice(0,-1)+b;
		parent.children[b].setAttribute('path',a.path);
	});
	setLeft(data,1);
	allCheck();
}

//判断重名
function dblNames(obj){
	var arr=getPath(obj.parentNode);
	var n=0;
	var str=obj.name;
	fn();
	function fn(){
		var m=0;
		for(var i=0;i<arr.length;i++){
			if(arr[i].name==(str+(n?'('+n+')':''))&&arr[i]!=obj){
				n++;
				m++;
				fn();
			}
		}
		if(!m){
			obj.name=n?str+'('+n+')':str;
			return obj.name;
		}
	}
}

//事件处理函数对象
var handler={
	addEvent:function(element,type,fn){
		if(element.addEventListener){
			element.addEventListener(type,fn,false);
		}else if(element.attachEvent){
			element.attachEvent('on'+type,fn)
		}else{
			element['on'+type]=fn;
		}
	},
	removeEvent:function(element,type,fn){
		if(element.removeEventListener){
			element.removeEventListener(type,fn,false);
		}else if(element.detachEvent){
			element.detachEvent('on'+type,fn)
		}else{
			element['on'+type]=null;
		}
	},
	getEvent:function(event){
		return event?event:window.event;
	},
	getTarget:function(event){
		return event.target?event.target:window.event.target;
	},
	//取消默认事件
	preventDefault:function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	},
	//阻止冒泡事件
	stopPropagation:function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble=true;
		}
	}
}
//检测碰撞
function collasp(obj1,obj2){
	var pos1=obj1.getBoundingClientRect();
	var pos2=obj2.getBoundingClientRect();
	if(pos1.right<pos2.left||pos1.left>pos2.right||pos1.bottom<pos2.top||pos1.top>pos2.bottom){
		return false;
	}else{
		return true;
	}
}

//浮动转定位
function pos(obj){
	obj.style.left=obj.offsetLeft+'px';
	obj.style.top=obj.offsetTop+'px';
	obj.style.width=obj.clientWidth+'px';
	setTimeout(function(){
		obj.style.position='absolute';
		obj.style.margin=0;
	},0);
}
//
//多个移动
//拖拽移动
function move(){
	var divs=Array.from(details.children);
	var arrs=divs.filter(function(a){
		return a.check==true;
	});
	var path=location.hash.substr(1).split('/');
	//记录父数据
	var parent=objPath(path);
	//记录选中的数据
	var childrens=[];
	for(var i=0;i<arrs.length;i++){
		var ps=arrs[i].getAttribute('path').split('/');
		childrens.push(objPath(ps));
	}
	//记录未选中的div
	var arr1=[];
	for(var i=0;i<divs.length;i++){
		if(!arrs.includes(divs[i])){
			arr1.push(divs[i]);
		}
	}

	divs.forEach(function(obj){
		obj.onmousedown=function(ev){
			ev.cancelBubble=true;
			ev.preventDefault();
			if(arrs.includes(obj)){
				var ex=ev.clientX;
				var ey=ev.clientY;
				arrs.forEach(function(a){
					a.l=ex-a.offsetLeft;
					a.t=ey-a.offsetTop;
				})
				divs.forEach(function(a){
						pos(a);
					})
				document.onmousemove=function(ev){
					
					var ex=ev.clientX;
					var ey=ev.clientY;
					arrs.forEach(function(a){
						a.style.zIndex=100;
						a.style.left=ex-a.l+'px';
						a.style.top=ey-a.t+'px';
					});
				}
				document.onmouseup=function(ev){
					var ex=ev.clientX;
					var ey=ev.clientY;
					for(var i=0;i<arr1.length;i++){
						var pos=arr1[i].getBoundingClientRect();
						if(ex<pos.left||ex>pos.right||ey>pos.bottom||ey<pos.top){
							divs.forEach(function(a){
								a.style.cssText='';
							})
						}else{
							var target=objPath(arr1[i].getAttribute('path').split('/'));
							for(var j=0;j<childrens.length;j++){
								target.child.push(childrens[j]);
							}
							for(var j=0;j<childrens.length;j++){
								parent.child.splice(parent.child.indexOf(childrens[j]),1);
							}
							changePath(parent);
						}
					}
					showR();
					setLeft(data,1);
					document.onmousemove=null;
					document.onmouseup=null;
				}
			}
		}
	});
	details.addEventListener('mousedown',function(){
		divs.forEach(function(a){
			a.style.cssText='';
		})
		allCheck()
	})
}
//修改路径
function changePath(obj){
	if(!obj.child.length){
		return;
	}
	obj.child.forEach(function(a,b){
		a.path=obj.path+'/child/'+b;
		changePath(a);
	})
}

