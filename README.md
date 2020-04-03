# h5-audio
移动端audio播放插件
- 控制播放倍速
- 拖动进度
- 加减播放时间

# 使用
`$( "audio" ).audioPlayer();`

# 代码结构
```
<audio preload="auto" controls id="audio">
  <source src="http://antiserver.kuwo.cn/anti.s?format=mp3|aac&rid=3453727&type=convert_url&response=res" />
  <source src="audio.ogg" />
  <source src="audio.wav" />
</audio>
</body>
<script type="text/javascript">
	$( "audio" ).audioPlayer();
</script>
```
> 上下切换还未实现，需要自己实现
