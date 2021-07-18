(function($,ower){
	ower.Api="http://61.155.214.251:8001/HJKQZL/App/";
}(mui,window.coment={}));

	//模板函数
var useTpl = function(data, tpl) {
	return tpl.replace(/\{(\w+)\}/g, function(str, index) {
		var _s = data[index];
		return _s == null ? "-" : _s;
	});
}

//图形
var getOptionNew = function(chartType,xdata,ydata,titleName) {
				var chartOption ={
					grid: {
						x: 35,
						x2: 10,
						y: 30,
						y2: 25
					},
					toolbox: {
						show: false,
						feature: {
							mark: {
								show: true
							},
							dataView: {
								show: true,
								readOnly: false
							},
							magicType: {
								show: true,
								type: ['line', 'bar']
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					calculable: true,
					xAxis: [{
						type: 'category',
						data: xdata,
						axisLabel:{
                         show:true,
                         textStyle:{
                           color:'rgba(255,255,255,1)'
                         }
                       },//坐标设置
                       axisLine:{
                       	show:true,
                         lineStyle:{
                         	color:'white'
                         }
                       },//网格设置
						splitLine: {
							show: true,
                         lineStyle:{
                         	color:'white'
                         }
						}
					}],
					yAxis: [{
						type: 'value',
						splitLine: {
							show: true,
                         lineStyle:{
                         	color:'white'
                         }
						},
						splitArea:{
							show:false,
							areaStyle:{
								color:['white','red','blue','yellow','green']
								}
						},
						axisLabel:{
							show:true,
							textStyle:{
								color:'rgba(255,255,255,1)'
							}
						},
						axisLine:{
							lineStyle:{
								color:'white'
							}
						},
						min:'0',
						max:'400'
					}],
					series: [{
//						name:titleName,
						type: chartType,
						data: ydata,
						markPoint:{
							data:[
							{type:'max',name:'最大值'},
							{type:'min',name:'最小值'}
							]
						}
//						,
//						markLine:{
//							data:[{
//								type:'average',name:'平均值'
//							}]
//						}
					}]
				};
				return chartOption;
			};
			
//排序
function sortByKey(array,key){
	return array.sort(function(a,b){
		var x=a[key];
		var y=b[key];
		return ((x<y)?-1:((x>y)?1:0));
	});
}
