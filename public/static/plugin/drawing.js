 function drowRect(cxt,x,y,width,height,borderWidth,borderColor,fillColor){
	 	cxt.beginPath();
//	 	cxt.moveTo(x,x);
//	 	cxt.lineTo(x+width,x);
//	 	cxt.lineTo(x+width,x+width);
//	 	cxt.lineTo(x,x+height);
        cxt.rect(x,y,width,height);
	 	cxt.closePath();
	 	cxt.lineWidth=borderWidth;
	 	cxt.fillStyle=fillColor;
	 	cxt.strokeStyle=borderColor;
	 	
	 	cxt.fill();
	 	cxt.stroke();
	 }
	 
	  function drowRect2(cxt,x,y,width,height,borderWidth,borderColor,fillColor){
	 	cxt.lineWidth=borderWidth;
	 	cxt.fillStyle=fillColor;
	 	cxt.strokeStyle=borderColor;
	 	cxt.fillRect(x,y,width,height);//填充矩形
        cxt.strokeRect(x,y,width,height);//带边框矩形
	 }
	  
	  //创建背景画布图片
	  function createBackgroudCanvas(){
	  	var backCanvas=document.createElement('canvas');
	  	backCanvas.width=100;
	  	backCanvas.height=100;
	  	var backCanvasContext=backCanvas.getContext('2d');
	  	drawStar(backCanvasContext,4,50,50,0);
	  	return backCanvas;
	  }
	  //五角星
	  function drawStar(cxt,R,x,y,rot)
	  {
//	  	cxt.beginPath();
//		for(var i=0;i<5;i++)
//		{
//			cxt.lineTo(Math.cos((18+i*72-rot)/180*Math.PI)*R+x,
//			-Math.sin((18+i*72-rot)/180*Math.PI)*R+y);
//			cxt.lineTo(Math.cos((54+i*72-rot)/180*Math.PI)*r+x,
//			-Math.sin((54+i*72-rot)/180*Math.PI)*r+y);
//		}
//		cxt.closePath(); 
        cxt.save();
        //图形变换函数begin
		cxt.translate(x,y);//位移
		cxt.rotate(rot/180*Math.PI);//旋转
		cxt.scale(R,R);//缩放
		//图形变换函数end
		 starPath(cxt,R);
		cxt.fillStyle="yellow";
//		cxt.lineJoin="round";
//		cxt.lineWidth=2;
		cxt.fill();
//		cxt.stroke();

        cxt.restore();
	  }
	  
    function starPath(cxt,r){
    	cxt.beginPath();
		for(var i=0;i<5;i++)
		{
			cxt.lineTo(Math.cos((18+i*72)/180*Math.PI)*r,
			-Math.sin((18+i*72)/180*Math.PI)*r);
			cxt.lineTo(Math.cos((54+i*72)/180*Math.PI)*0.5*r,
			-Math.sin((54+i*72)/180*Math.PI)*0.5*r);
		}
		cxt.closePath();
    }
    
    //绘制圆角矩阵
    function drawRoundRect(cxt,x,y,width,height,radius){
    	cxt.save();
    	cxt.translate(x,y);
    	pathRoundRect(cxt,width,height,radius);
    	cxt.strokeStyle="black";
    	cxt.stroke();
    	cxt.restore();
    }
    function pathRoundRect(cxt,width,height,radius){
    	cxt.beginPath();
    	cxt.arc(width-radius,height-radius,radius,0,Math.PI/2);
    	cxt.lineTo(radius,height);
    	cxt.arc(radius,height-radius,radius,Math.PI/2,Math.PI);
    	cxt.lineTo(0,radius);
    	context.arc(radius,radius,radius,Math.PI,Math.PI*3/2);
    	cxt.lineTo(width-radius,0);
    	cxt.arc(width-radius,radius,radius,Math.PI*3/2,Math.PI*2)
    	cxt.closePath();
    }

    function fillRoundRect(cxt,x,y,width,height,radius,fillColor)
    {
    	if(2*radius>width||2*radius>height)
           return;
        cxt.save();
        cxt.translate(x,y);
        pathRoundRect(cxt,width,height,radius);
        cxt.fillStyle=fillColor||"blue";
        cxt.fill();
        cxt.restore();
    }
    
    
    function strokeRoundRect(cxt,x,y,width,height,radius,borderwith,strokeColor)
    {
    	if(2*radius>width||2*radius>height)
           return;
        cxt.save();
        cxt.translate(x,y);
        pathRoundRect(cxt,width,height,radius);
        cxt.lineWidth=borderwith||1;
        cxt.strokeStyle=strokeColor||"blue";
        cxt.stroke();
        cxt.restore();
    }
    
    //绘制弧度
    function acrTofun(cxt,x0,y0,x1,y1,x2,y2,r,borderWith,borderColor)
    {
    	cxt.save();
    	cxt.moveTo(x0,y0);
    	cxt.arcTo(x1,y1,x2,y2,r);
    	cxt.lineWidth=borderWith||1;
    	cxt.strokeStyle=borderColor||"blue";
    	cxt.stroke();
    	cxt.restore();
    	
    	//绘制边框
    	cxt.beginPath();
    	cxt.moveTo(x0,y0);
    	cxt.lineTo(x1,y1);
    	cxt.lineTo(x2,y2);
    	cxt.lineWidth=2;
    	cxt.strokeStyle="black";
    	cxt.stroke();
    	
    }
    //d为机动点
    function fillMoon(cxt,d,x,y,r,rot,fillColor)
    {
    	cxt.save();
    	cxt.translate(x,y);
    	cxt.rotate(rot*Math.PI/180);//旋转
    	cxt.scale(r,r);
    	pathMoon(cxt,d);
    	cxt.fillStyle=fillColor||"#fb5";
    	cxt.fill();
    	cxt.restore();
    }
    //arcto
    function pathMoon(cxt,d)
    {
    	cxt.beginPath();
    	cxt.arc(0,0,1,0.5*Math.PI,1.5*Math.PI,true);
    	cxt.moveTo(0,-1);
    	//arcto
//  	cxt.arcTo(d,0,0,1,dis(0,-1,d,0)*1/d);
        //二次贝赛尔曲线
        BSEMoon(cxt);
    	cxt.closePath();
    }
    //连点间距离
    function dis(x1,y1,x2,y2)
    {
    	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    }
    //二次贝赛尔曲线
     function BSEMoon(cxt)
    {
    	cxt.beginPath();
    	cxt.arc(0,0,1,0.5*Math.PI,1.5*Math.PI,true);
    	cxt.moveTo(0,-1);
//  	cxt.arcTo(d,0,0,1,dis(0,-1,d,0)*1/d);
        cxt.quadraticCurveTo(1.2,0,0,1);
    	cxt.closePath();
    }
    
    //绘制绿地 三次贝赛尔曲线
    function drawLand(cxt,x0,y0,x1,y1,x2,y2,x3,y3)
    {
    	cxt.save();
    	cxt.beginPath(); 
    	cxt.moveTo(x0,y0);
    	cxt.bezierCurveTo(x1,y1,x2,y2,x3,y3);
//      cxt.moveTo(0,600);
//      cxt.bezierCurveTo(540,400,600,800,1800,600);
    	cxt.lineTo(1200,800);
    	cxt.lineTo(0,800);
    	cxt.closePath(); 
    	//渐变设置
    	
    	var landStyle=cxt.createLinearGradient(0,800,0,0);
    	landStyle.addColorStop(0.0,'#030');
    	landStyle.addColorStop(1.0,'#580');
    	cxt.fillStyle=landStyle;
    	cxt.fill();
    	
    	cxt.restore();
    }
