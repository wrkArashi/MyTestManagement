// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
// import jsPDF from 'jspdf'
export default {
	install(Vue, options) {
		Vue.prototype.getPdf = function() {
			var ST = document.documentElement.scrollTop;
			var SL = document.documentElement.scrollLeft;
			document.documentElement.scrollLeft = 0;
			document.documentElement.scrollTop = 0;
			var title = this.showContent.Name
			html2Canvas(document.querySelector('#cpbg'), {
				allowTaint: true,
				dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
				scale: 4 //按比例增加分辨率
			}).then(function(canvas) {
				document.documentElement.scrollTop = ST;
				document.documentElement.scrollLeft = SL;
				var pdf = new jsPDF('p', 'mm', 'a2'); //A4纸，纵向
				var ctx = canvas.getContext('2d')
				// 420×594
				var a2w = 400,
					a2h = 574 
				// var a4w = 190,
				// 	a4h = 277 //A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
				var imgHeight = Math.floor(a2h * canvas.width / a2w) //按A4显示比例换算一页图像的像素高度
				var renderedHeight = 0;
				while (renderedHeight < canvas.height) {
					var ctx = canvas.getContext("2d");
					ctx.font = "100px 微软雅黑";
					ctx.fillStyle = "rgba(81, 90, 110, 0.3)";
					// ctx.fillText('这是你的水印', 430, 600);
					// ctx.fillText('这是你的水印', 430, 1400);
					var page = document.createElement("canvas");
					page.width = canvas.width;
					page.height = Math.min(imgHeight, canvas.height - renderedHeight); //可能内容不足一页
					//用getImageData剪裁指定区域，并画到前面创建的canvas对象中
					page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas
						.height - renderedHeight)), 0, 0);
					pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a2w, Math.min(a2h, a2w * page.height / page.width)); //添加图像到页面，保留10mm边距
					renderedHeight += imgHeight;
					if (renderedHeight < canvas.height) {
						pdf.addPage(); //如果后面还有内容，添加一个空页
					}
				}
				pdf.save(title + '.pdf');
			})
		}
	}
}
