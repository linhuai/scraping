#scraping 刮刮乐

## html 使用方法 


	<script src="../libs/scraping.js"></script>
	<script>
		var scraping = new Scraping({
			canvasWrapId: '#canvas-wrap',
			canvasId: '#canvas',
			canvasImg: '',
			canvasColor: '#000',
			percent: 50,
			callback: function () {

			}
		})
	</script>

## vue 使用方法

	import {Scraping} from '@/libs/scraping.js'

	...
	mounted () {
		this.scraping = new Scraping({
			canvasWrapId: '#canvas-wrap',
			canvasId: '#canvas',
			canvasImg: '',
			canvasColor: '#000',
			percent: 50,
			callback: function () {

			}
		})
	}
	...