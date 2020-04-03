var playSpeed = 1;//设置播放速度
;(function( $, window, document, undefined )
{
	var isTouch		  = 'ontouchstart' in window,
		eStart		  = isTouch ? 'touchstart'	: 'mousedown',
		eMove		  = isTouch ? 'touchmove'	: 'mousemove',
		eEnd		  = isTouch ? 'touchend'	: 'mouseup',
		eCancel		  = isTouch ? 'touchcancel'	: 'mouseup',
		secondsToTime = function( secs )
		{
			var hoursDiv = secs / 3600, hours = Math.floor( hoursDiv ), minutesDiv = secs % 3600 / 60, minutes = Math.floor( minutesDiv ), seconds = Math.ceil( secs % 3600 % 60 );
			if( seconds > 59 ) { seconds = 0; minutes = Math.ceil( minutesDiv ); }
			if( minutes > 59 ) { minutes = 0; hours = Math.ceil( hoursDiv ); }
			return ( hours == 0 ? '' : hours > 0 && hours.toString().length < 2 ? '0'+hours+':' : hours+':' ) + ( minutes.toString().length < 2 ? '0'+minutes : minutes ) + ':' + ( seconds.toString().length < 2 ? '0'+seconds : seconds );
		},
		canPlayType	  = function( file )
		{
			var audioElement = document.createElement( 'audio' );
			return !!( audioElement.canPlayType && audioElement.canPlayType( 'audio/' + file.split( '.' ).pop().toLowerCase() + ';' ).replace( /no/, '' ) );
		};

	$.fn.audioPlayer = function( params )
	{
		//参数合并
		var params		= $.extend( { classPrefix: 'audioplayer', strPlay: 'Play', strPause: 'Pause', strVolume: 'Volume' }, params );

		this.each( function()
		{
			if( $( this ).prop( 'tagName' ).toLowerCase() != 'audio' )
				return false;

			// 对象赋值
			var $this	   = $( this ),
				audioFile  = $this.attr( 'src' ),
				isAutoPlay = $this.get( 0 ).getAttribute( 'autoplay' ), isAutoPlay = isAutoPlay === '' || isAutoPlay === 'autoplay' ? true : false,
				isLoop	   = $this.get( 0 ).getAttribute( 'loop' ),		isLoop	   = isLoop		=== '' || isLoop	 === 'loop'		? true : false,
				isSupport  = false;

			if( typeof audioFile === 'undefined' )
			{
				$this.find( 'source' ).each( function()
				{
					audioFile = $( this ).attr( 'src' );
					if( typeof audioFile !== 'undefined' && canPlayType( audioFile ) )
					{
						isSupport = true;
						return false;
					}
				});
			}

			var theAudio = $( 'audio' )[0];
			
			$( 'audio' ).css( { 'width': 0, 'height': 0, 'visibility': 'hidden' } );
			var html = `
				<div id="audio-wrapper">
					<div class="audio-view-wrapper">
						<p class="audio-start-time">00:00</p>
						<div class="auduo-progress-wrapper">
							<p class="auduo-progress-speed"></p>
							<div class="auduo-progress-button"><p></p></div>
						</div>
						<p class="audio-end-time">00:00</p>
						<p class="audio-playspeed" onclick="listenPlaySpeed('show')">倍速</p>
					</div>
					<div class="audio-controls-wrapper">
						<div class="audio-calc-wrapper"><i class="change-time iconfont icon-calc" data-time = -10></i></div>
						<div class="audio-operator-wrapper">
							<i class="iconfont icon-prev"></i>
							<i class="audio-play iconfont icon-play"></i>
							<i class="iconfont icon-next"></i>
						</div>
						<div class="audio-calc-wrapper"><i class="change-time iconfont icon-calc" data-time = 10></i></div>
					</div>
					<div class="audio-model">
						<div class="audio-model-wrapper">
							<div class="radio-wrapper">
								<input type='radio' id='play-speed1' name='play-speed'>
								<label for='play-speed1' onclick="listenPlaySpeed(0.5)">0.5 X</label>
							</div>
							<div class="radio-wrapper">
								<input type='radio' id='play-speed2' name='play-speed'>
								<label for='play-speed2' onclick="listenPlaySpeed(0.75)">0.75 X</label>
							</div>
							<div class="radio-wrapper">
								<input type='radio' id='play-speed3' checked name='play-speed'>
								<label for='play-speed3' onclick="listenPlaySpeed(1)">1.0 X</label>
							</div>
							<div class="radio-wrapper">
								<input type='radio' id='play-speed4' name='play-speed'>
								<label for='play-speed4' onclick="listenPlaySpeed(1.25)">1.25 X</label>
							</div>
							<div class="radio-wrapper">
								<input type='radio' id='play-speed5' name='play-speed'>
								<label for='play-speed5' onclick="listenPlaySpeed(1.5)">1.5 X</label>
							</div>
							<div class="radio-wrapper">
								<input type='radio' id='play-speed6' name='play-speed'>
								<label for='play-speed6' onclick="listenPlaySpeed(1.75)">1.75 X</label>
							</div>
							<div class="radio-wrapper">
								<input type='radio' id='play-speed7' name='play-speed'>
								<label for='play-speed7' onclick="listenPlaySpeed(2)">2 X</label>
							</div>
							<button onclick="listenPlaySpeed('hide')">取消</button>
						</div>
					</div>
				</div>
			`;
			$("body").append(html);
			var theBar 			= $(".auduo-progress-wrapper");
			var timeCurrent	 	= $(".audio-start-time");
			var barPlayed 		= $(".auduo-progress-speed");
			var barPlayedButton = $(".auduo-progress-button");

			var adjustCurrentTime = function( e ){
					//修改进度
					theRealEvent		 = isTouch ? e.originalEvent.touches[ 0 ] : e;
					theAudio.currentTime = Math.round( ( theAudio.duration * ( theRealEvent.pageX - theBar.offset().left ) ) / theBar.width() );
				},
				adjustVolume = function( e ){
					theRealEvent	= isTouch ? e.originalEvent.touches[ 0 ] : e;
					theAudio.volume = Math.abs( ( theRealEvent.pageY - ( volumeAdjuster.offset().top + volumeAdjuster.height() ) ) / volumeAdjuster.height() );
				},
				updateLoadBar = function(){
					
				};

			var volumeTestDefault = theAudio.volume, volumeTestValue = theAudio.volume = 0.111;
			if( Math.round( theAudio.volume * 1000 ) / 1000 == volumeTestValue ) theAudio.volume = volumeTestDefault;

			// timeDuration.html( '&hellip;' );
			// timeCurrent.html( secondsToTime( 0 ) );
			$(".audio-start-time").html('00:00' );
			theAudio.addEventListener( 'loadeddata', function()
			{
				updateLoadBar();
				$(".audio-end-time").html( $.isNumeric( theAudio.duration ) ? secondsToTime( theAudio.duration ) : '00:00' );
			});

			theAudio.addEventListener( 'timeupdate', function()
			{
				//设置播放速度
				theAudio.playbackRate =playSpeed;
				//设置播放进度
				timeCurrent.html( secondsToTime( theAudio.currentTime ) );
				barPlayed.width( ( theAudio.currentTime / theAudio.duration ) * 100 + '%' );
				barPlayedButton.css("left",( theAudio.currentTime / theAudio.duration ) * 100 + '%' );
			});

			theAudio.addEventListener( 'ended', function()
			{

			});

			theBar.on( eStart, function( e )
			{
				adjustCurrentTime( e );
				theBar.on( eMove, function( e ) { adjustCurrentTime( e ); } );
			})
			.on( eCancel, function()
			{
				theBar.unbind( eMove );
			});

			$(".audio-play").on( 'click', function()
			{
				//判断当前播放状态
				if(theAudio.paused)
				{
					$(this).addClass("icon-pause").removeClass("icon-play");
					isSupport ? theAudio.play() : theAudio.Play();
				}
				else
				{
					$(this).addClass("icon-play").removeClass("icon-pause");
					isSupport ? theAudio.pause() : theAudio.Stop();
				}
				return false;
			});

			$(".change-time").on( 'click', function()
			{
				//获取元素身上绑定的值
				var time = $(this).data("time");
				theAudio.currentTime = theAudio.currentTime + time;
				return false;
			});
		});
		return this;
	};
})( jQuery, window, document );

//更改播放速度
function listenPlaySpeed(flag){
	if(flag == 'show'){
		$(".audio-model").fadeIn();
	}else if(flag == 'hide'){
		$(".audio-model").fadeOut();
	}else{
		playSpeed = flag;
		$(".audio-playspeed").text(`${playSpeed}X`);
		$(".audio-model").fadeOut();
	}
}