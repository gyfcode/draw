function palette(canvas,cobj,copy){
	if(canvas==undefined){
		console.error("参数传入有误");
        return false;
	}
	this.canvas=canvas;
	this.copy=copy;
	this.cobj=cobj;
	this.type="line";
	this.style="stroke";
	this.historyArr=[];
	this.fillStyle="#000";
	this.strokeStyle="#000";
	this.lineWidth=1;
	this.bianNum=5;
	this.jiaoNum=5;
	this.xpw=20;
	this.xph=20;
	this.xpflag=true;//橡皮

}
palette.prototype={
	reset:function(){
		this.cobj.fillStyle=this.fillStyle;
		this.cobj.strokeStyle=this.strokeStyle;
		this.cobj.lineWidth=this.lineWidth;
	},
	draw:function(){
		var that=this;
		this.copy.onmousedown=function(e){
			var dx=e.offsetX;
			var dy=e.offsetY;		
			that.reset();	
			that.copy.onmousemove=function(e){
				var mx=e.offsetX;
				var my=e.offsetY;
				that.cobj.clearRect(0,0,830,610);
				if(that.historyArr.length>0){
					that.cobj.putImageData(that.historyArr[that.historyArr.length-1],0,0)
				}
				that[that.type](dx,dy,mx,my);
			}
			that.copy.onmouseup=function(){				
				that.copy.onmousemove=null;
				document.onmouseup=null;
				that.historyArr.push(that.cobj.getImageData(0,0,830,610));
			}
		}
	},
	rect:function(x1,y1,x2,y2){//矩形
		this.cobj.beginPath();
		this.cobj.rect(x1,y1,x2-x1,y2-y1);
		this.cobj.closePath();
		this.cobj[this.style]();
	},
	line:function(x1,y1,x2,y2){//直线
		this.cobj.beginPath();
		this.cobj.moveTo(x1,y1);
		this.cobj.lineTo(x2,y2);
		this.cobj.closePath();
		this.cobj[this.style]();
	},
	pencil:function(){//笔
		var that=this;
		this.copy.onmousedown=function(e){
			var dx=e.offsetX;
			var dy=e.offsetY;
			that.cobj.beginPath();
			that.reset();	
			that.copy.onmousemove=function(e){
				var mx=e.offsetX;
				var my=e.offsetY;
				that.cobj.lineTo(mx,my);
				that.cobj.stroke();
			}
			that.copy.onmouseup=function(){				
				that.cobj.closePath();
				that.copy.onmousemove=null;
				document.onmouseup=null;
				that.historyArr.push(that.cobj.getImageData(0,0,830,610));
			}
		}
	},
	arc:function(x1,y1,x2,y2){//圆
		var r=this._r(x1,y1,x2,y2);
		this.cobj.beginPath();
		this.cobj.arc(x1,y1,r,0,2*Math.PI,false);
		this.cobj.closePath();

		this.cobj[this.style]();
	},
	bian:function(x1,y1,x2,y2){//多边形
		var r=this._r(x1,y1,x2,y2);
		var angle=360/this.bianNum;
		this.cobj.beginPath();
		for(var i=0;i<this.bianNum;i++){
			this.cobj.lineTo(x1+r*Math.cos(angle*i*Math.PI/180),y1+r*Math.sin(angle*i*Math.PI/180));
		}
		this.cobj.closePath();

		this.cobj[this.style]();
	},
	jiao:function(x1,y1,x2,y2){//多角星
		var r=this._r(x1,y1,x2,y2);
		var r2=r/3;
		var angle=360/(this.jiaoNum*2);
		this.cobj.beginPath();
		for(var i=0;i<this.jiaoNum*2;i++){
			if(i%2==0){
				this.cobj.lineTo(x1+r*Math.cos(angle*i*Math.PI/180),y1+r*Math.sin(angle*i*Math.PI/180));
			}else{
				this.cobj.lineTo(x1+r2*Math.cos(angle*i*Math.PI/180),y1+r2*Math.sin(angle*i*Math.PI/180));
			}
			
		}
		this.cobj.closePath();

		this.cobj[this.style]();
	},
	_r:function(x1,y1,x2,y2){//半径
		return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	},
	xp:function(ele){

		var that=this;
		this.copy.onmousemove=function(e){
			
			var ox=e.offsetX;
			var oy=e.offsetY;
			var x=ox-that.xpw/2;
			var y=oy-that.xph/2;
			if(x>$(that.copy).width()-that.xpw){
				x=$(that.copy).width()-that.xpw;
				
			}
			if(x<0){
				x=0;
				
			}
			if(y>$(that.copy).height()-that.xph){
				y=$(that.copy).height()-that.xh;
				
			}
			if(y<0){
				y=0;
				
			}
			if(that.xpflag){
				ele.css({display:'block',left:x,top:y,width:that.xpw,height:that.xph});
			}
			

		}
		that.copy.onmousedown=function(){

			that.copy.onmousemove=function(e){
				var ox=e.offsetX;
				var oy=e.offsetY;
				var x=ox-that.xpw/2;
				var y=oy-that.xph/2;
				if(x>$(that.copy).width()-that.xpw){
					x=$(that.copy).width()-that.xpw;
					
				}
				if(x<0){
					x=0;
					
				}
				if(y>$(that.copy).height()-that.xph){
					y=$(that.copy).height()-that.xh;
					
				}
				if(y<0){
					y=0;
					
				}
				that.cobj.clearRect(x,y,that.xpw,that.xph)
				ele.css({display:'block',left:x,top:y,width:that.xpw,height:that.xph});
				}
			that.copy.onmouseup=function(){
				that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.historyArr.push(that.cobj.getImageData(0,0,830,610))
                if(that.xpflag){
                	that.xp(ele)
                }
                
			}

			
		}
		this.copy.onmouseout=function(e){
			ele.css({display:'none'})
		}



	}
}