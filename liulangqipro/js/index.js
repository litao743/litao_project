function quaryUserMenu(){
			$.ajax({
			type:"get",
			url:'http://127.0.0.1:8500/syview/topda',
			dataType:'json',
			success:function(data){
				console.log(data);
				$.each(data,function(index,value){
					var childobj=$("<div></div>");
					childobj.addClass("threesell");
					var imaobj=$("<img></img>");
					imaobj.addClass("imgview")
					var texobj=$("<div></div>");
					texobj.addClass("textview")
					imaobj.attr({"src":value["topimag"]});
					texobj.text(value["topname"]);
					childobj.append(imaobj);
					childobj.append(texobj)
					$(".topthree").append(childobj);
				})
			}
		})
		};
		
function quaryjhNews(){
			$.ajax({
			type:"get",
			url:'http://127.0.0.1:8500/syview/juhenews',
			async:false,
			dataType:'json',
			success:function(data){
				console.log(data.result.data);
				var jsondata=data.result.data;
				var newsdata=jsondata.slice(10,20);
				$.each(newsdata,function(index,value){
					var newsdiv=$("<div></div>");
					newsdiv.addClass("newview");
				
					var imagdiv=$("<div></div>");
					imagdiv.addClass("imaview");
					// var image=$("<img></img>");
					// image.addClass("img2view");
					// image.attr({"src":value["thumbnail_pic_s"]});
					var swiperdiv=$("<div></div>");
					swiperdiv.addClass("swiper-container");
					
					var swiwrapper=$("<div></div>");
					swiwrapper.addClass("swiper-wrapper");
					
					var slide1=$("<div></div>");
					slide1.addClass("swiper-slide");
					var imag1=$("<img></img>");
					imag1.addClass("img2view");
					imag1.attr({"src":value["thumbnail_pic_s"]});
					
					var slide2=$("<div></div>");
					slide2.addClass("swiper-slide");
					var imag2=$("<img></img>");
					imag2.addClass("img2view");
					imag2.attr({"src":value["thumbnail_pic_s02"]});
					
					var slide3=$("<div></div>");
					slide3.addClass("swiper-slide");
					var imag3=$("<img></img>");
					imag3.addClass("img2view");
					imag3.attr({"src":value["thumbnail_pic_s03"]});
					
					var newstidiv=$("<div></div>");
					newstidiv.addClass("newstit");
					newstidiv.text(value["title"]);
					// imagdiv.append(image);
					slide1.append(imag1);
					slide2.append(imag2);
					slide3.append(imag3);
					swiwrapper.append(slide1);
					swiwrapper.append(slide2);
					swiwrapper.append(slide3);
					swiperdiv.append(swiwrapper);
					imagdiv.append(swiperdiv);
					newsdiv.append(imagdiv);
					newsdiv.append(newstidiv);
					
					$(".cent1").append(newsdiv);
				})
				},
			})
		};
		
		function quaryimag(){
			$.ajax({
				type:"get",
				url:"http://127.0.0.1:8400/text/shouytext.json",
				dataType:"json",
				async:false,
				success:function(datas){
					console.log(datas);
					console.log(datas[1]["轮播"]);
					$(".toptwo").text(datas[0]["title"]);
					var iamdata=datas[1]["轮播"];
					$.each(iamdata,function(index,value){
						console.log(value["ima"]);
						var slide=$("<div></div>");
						slide.addClass("swiper-slide");
						var imagdiv=$("<img></img>");
						imagdiv.addClass("img2view");
						imagdiv.attr({"src":"http://127.0.0.1:8400/images/"+value["ima"]});
						slide.append(imagdiv);
						$(".swiper-wrapper").append(slide)
					})
					
				}
			})
		};
		
		quaryimag()
		quaryUserMenu()
		quaryjhNews()
		var swiper = new Swiper('.swiper-container', {
					parallax: true,
					speed: 600, // 速度
					autoplay: 900, //可选选项，自动滑动
					delay: 3000,
		
				});
		