$(function() {
		$('#scan').hide();
		var video = document.getElementById('video');
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');
		// 跟踪脸部
		var tracker = new tracking.ObjectTracker('face');
		tracker.setInitialScale(4);
		tracker.setStepSize(2);
		tracker.setEdgesDensity(0.1);
		tracking.track('#video', tracker, {
			camera : true
		});
		tracker.on('track', function(event) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			event.data.forEach(function(rect) {
				context.strokeStyle = '#ffff00';
				context.strokeRect(rect.x, rect.y, rect.width, rect.height);
				context.font = '16px Helvetica';
				context.fillStyle = "#fff";
				context.fillText('x: ' + rect.x + 'px',
						rect.x + rect.width + 5, rect.y + 11);
				context.fillText('y: ' + rect.y + 'px',
						rect.x + rect.width + 5, rect.y + 22);
				if (waitFor() && flag) {
					takePhoto();
				}
			});
		});
		var gui = new dat.GUI();
		gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
		gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
		gui.add(tracker, 'stepSize', 1, 5).step(0.1);
		
	});

	// 脸部跟踪

	// 调用摄像头
	navigator.getUserMedia = navigator.getUserMedia
			|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	if (navigator.getUserMedia) {
		navigator.getUserMedia({
			audio : true,
			video : {
				width : 640,
				height : 480
			}
		}, function(stream) {
			var video = document.getElementById("video");
			video.src = window.URL.createObjectURL(stream);
			video.onloadedmetadata = function(e) {
				video.play();
			};
		}, function(err) {
			console.log("The following error occurred: " + err.name);
		});
	} else {
		console.log("getUserMedia not supported");
	}

	// 扫描
	function scan() {
		$("#scan").slideDown("slow").slideUp("slow");
	}

	var flag = true;
	// 拍照
	function takePhoto() {
		// 设置
		flag = false;
		$('#picture').attr("disabled", true);
		var context = document.getElementById("canvas2").getContext("2d");
		context.drawImage(video, 0, 0, 416, 312);
		$('#canvas2').show();
		var start = setInterval("scan()", 500);
		takeResult(start);
		$('#scan').hide();
		flag = true;
	}

	// AJAX
	function takeResult(start) {
		var imgData = document.getElementById("canvas2").toDataURL("image/png");
		var data = imgData.substr(22);
		$
				.ajax({
					type : "POST",// 请求类型
					dataType : "json",// 数据类型
					url : "sc",// 请求地址
					data : {// 数据，多个数据用逗号隔开
						sj : data
					},
					error : function(data) {
						layer.msg('请重试');
						$('#scan').hide();
						clearInterval(start);
						$('#picture').attr("disabled", false);
					},
					success : function(data) {
						var obj = data;
						var str = '<div class="layerWindow"><div class="img3"><img src="js/logo.png"></div>';
						str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">年龄：</a><a style="color:red;font-size:20px;">'
								+ Math.round(obj.age) + '岁</a></p>';
						str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">颜值：</a><a style="color:red;font-size:20px;">'
							+ Math.round(obj.beauty * 2) + '分';
						if (obj.gender == 'male') {
							if (obj.beauty < 20) {
								str += '(念天地之幽幽，独怆然而涕下！)';
							} else if (obj.beauty < 35) {
								str += '(还行，能分出五官)';
							} else if (obj.beauty < 50) {
								str += '(如果帅要坐牢～我要把牢底坐穿)';
							} else if (obj.beauty >= 50) {
								str += '(如果帅可以当饭吃，我能养活全世界)';
							}
						} else {
							if (obj.beauty < 20) {
								str += '(妈妈从来不担心我半夜回家)';
							} else if (obj.beauty < 35) {
								str += '(还行，能分出五官)';
							} else if (obj.beauty < 50) {
								str += '(回眸一笑百魅生，六宫粉黛无颜色)';
							} else if (obj.beauty >= 50) {
								str += '(仿佛兮若轻云之蔽月，飘飘兮若流风之回雪)';
							}
						}
						str += '</p>';
						
						str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">表情：</a><a style="color:red;font-size:20px;">';
						if (obj.expression == 0) {
							str += '面无表情' + '</p>';
						} else if (obj.expression == 1) {
							str += '微微一笑' + '</p>';
						} else if (obj.expression == 2) {
							str += '哈哈大笑' + '</p>';
						}
						if (obj.gender === 'male') {
							str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">性别：</a><a style="color:red;font-size:20px;">男'
									+ '</p>';
						} else {
							str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">性别：</a><a style="color:red;font-size:20px;">女'
									+ '</p>';
						}
						// yellow、white、black、arabs
						if (obj.race === 'yellow') {
							str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">种族：</a><a style="color:red;font-size:20px;">黄种人'
									+ '</p>';
						} else if (obj.race === 'write') {
							str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">种族：</a><a style="color:red;font-size:20px;">白种人'
									+ '</p>';
						} else if (obj.race === 'black') {
							str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">种族：</a><a style="color:red;font-size:20px;">黑种人'
									+ '</p>';
						} else {
							str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">种族：</a><a style="color:red;font-size:20px;">火星人'
									+ '</p>';
						}
						// 0-无眼镜，1-普通眼镜，2-墨镜
						if (obj.glasses == 0) {
							str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">眼镜：</a><a style="color:red;font-size:20px;">没戴眼镜'
									+ '</p>';
						} else if (obj.glasses == 1) {
							str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">眼镜：</a><a style="color:red;font-size:20px;">戴眼镜'
									+ '</p>';
						} else {
							str += '<p style="margin:10px;"><a style="color:green;font-size:16px;">眼镜：</a><a style="color:red;font-size:20px;">戴墨镜'
									+ '</p>';
						}
						str += '</div>';
						// 弹窗
						if (str != '') {
							clearInterval(start);
							$('#scan').hide();
							layer.open({
								type : 1,// Page层类型
								area : [ '500px', '300px' ],
								title : '<h4>结果如下</h4>',
								shade : 0.5,// 遮罩透明度,
								anim : 1, // 0-6的动画形式，-1不开启
								content : str,
								time : 5000,
							});
							$('#canvas2').hide();
							$('#picture').attr("disabled", false);
						}
					}
				});
	}
	
	var last = Date.parse(new Date());
	
	function waitFor() {
		var now = Date.parse(new Date());
		var diff = now - last;
//		alert(last + '     ' + now);
		if (diff < 10000) {
			return false;
		} else {
			last = now;
			return true;
		}
	}
	
	
