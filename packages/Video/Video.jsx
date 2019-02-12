import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import fscreen from 'fscreen'
import YouTube from 'react-youtube'

import Spinner from '@tds/core-spinner'

import ControlBar from './ControlBar/ControlBar'

import safeRest from '../../shared/utils/safeRest'

/**
 * @version ./package.json
 */

class Video extends React.Component {
  constructor() {
    super()
    this.refVideoPlayer = React.createRef()
    this.refVideoPlayerContainer = React.createRef()
    this.refYoutubePlayer = React.createRef()

    this.playerOptions = {
      mouseTimeout: 2000, //defined in ms
      keyboardSeekIncrement: 5, //defined in s
      keyboardVolumeIncrement: 0.01, //from 0 to 1
    }

    this.state = {
      videoLength: 0,
      videoCurrentTime: -1,
      videoFramerate: 0,
      videoBufferEnd: 0,
      videoIsBuffering: false,
      videoCurrentVolume: 1,
      videoIsPlaying: false,
      videoIsMuted: false,
      videoIsFullscreen: false,
      mouseInactive: false,
      videoEnded: false,
      isMobile: false,
      videoQuality: 1,
      videoQualityChanged: false,
    }

    this.sources = null
    this.tracks = null
  }

  componentDidMount() {
    // Initializes Settings
    this.refVideoPlayer.current.volume = this.props.defaultVolume
    this.refVideoPlayer.current.muted = this.props.beginMuted

    // Detects mobile browsers
    this.setState({
      isMobile: navigator.userAgent.includes('Mobi'),
    })

    // Sets initial quality depending on isMobile
    this.setState({
      videoQuality: this.props.isMobile
        ? this.props.defaultMobileQuality
        : this.props.defaultDesktopQuality,
    })

    // Hides tracks from the start
    if (this.props.youtubeId === undefined) {
      for (var i = 0; i < this.refVideoPlayer.current.textTracks.length; i++) {
        this.refVideoPlayer.current.textTracks[i].mode = 'hidden'
      }

      this.refreshMedia()

      //********* Begin Video Event Handlers *********

      // Reports when the video has completed loading metadata (used for seeking after quality switch)
      this.refVideoPlayer.current.onloadedmetadata = () => {
        if (this.state.videoCurrentTime > -1) {
          this.setSeek(this.state.videoCurrentTime)
        }
      }

      // Reports the current video timestamp
      this.refVideoPlayer.current.ontimeupdate = () => {
        this.setState({
          videoCurrentTime: this.refVideoPlayer.current.currentTime,
        })
      }

      // Reports the video's duration when the video player is ready to play
      this.refVideoPlayer.current.oncanplay = () => {
        this.setState({
          videoLength: this.refVideoPlayer.current.duration,
          videoFramerate: this.refVideoPlayer.current
            .captureStream()
            .getVideoTracks()[0]
            .getSettings().frameRate,
          videoBufferEnd:
            this.refVideoPlayer.current.buffered.length === 0
              ? 0
              : this.refVideoPlayer.current.buffered.end(
                  this.refVideoPlayer.current.buffered.length - 1
                ),
          videoUnplayed: this.refVideoPlayer.current.played.length === 0,
        })
      }

      // Reports when the video has paused due to buffering
      this.refVideoPlayer.current.onwaiting = () => {
        console.log('Waiting...')
        this.setState({ videoIsPlaying: false, videoIsBuffering: true })
        this.setPlaying(false)
      }

      // Reports when the video has recovered from buffering
      this.refVideoPlayer.current.oncanplaythrough = () => {
        console.log(
          'Can play through...',
          `isPlaying: ${this.state.videoIsPlaying} isBuffering: ${this.state.videoIsBuffering}`
        )
        if (
          this.state.videoIsBuffering &&
          this.state.videoCurrentTime !== -1 &&
          !this.state.videoQualityChanged
        ) {
          console.log('...Did play through')
          this.setPlaying(true)
          this.setState({ videoIsBuffering: false })
        }
      }

      // Reports when the video is playing and disables the buffer spinner (even if buffering is still needed)
      this.refVideoPlayer.current.onplay = () => {
        console.log('Play')
        this.inactivityTimer = setTimeout(() => {
          this.setState({ mouseInactive: true })
        }, this.playerOptions.mouseTimeout)
        this.setState({
          videoIsPlaying: true,
          videoIsBuffering: false,
          videoEnded: false,
          videoUnplayed: false,
          videoQualityChanged: false,
        })
      }

      // Reports when the video has been paused
      this.refVideoPlayer.current.onpause = () => {
        clearTimeout(this.inactivityTimer)
        this.setState({ videoIsPlaying: false })
      }

      // Reports when the video has been seeked
      this.refVideoPlayer.current.onseeked = () => {
        console.log('Seeked.')
        this.resetInactivityTimer()
        this.setState({ videoEnded: false })
      }

      // Reports when the video has ended
      this.refVideoPlayer.current.onended = () => {
        this.setState({ videoIsPlaying: false, videoEnded: true, mouseInactive: false })
        clearTimeout(this.inactivityTimer)
      }

      // Reports the video's latest buffering progress if video player is properly initialized
      this.refVideoPlayer.current.onprogress = () => {
        if (this.refVideoPlayer.current && this.refVideoPlayer.current.readyState >= 2) {
          console.log('Ready state on progress')
          this.setState({
            videoBufferEnd: this.refVideoPlayer.current.buffered.end(
              this.refVideoPlayer.current.buffered.length - 1
            ),
          })
        } else if (
          this.state.videoCurrentTime !== -1 &&
          !this.state.videoQualityChanged &&
          !this.refVideoPlayer.current
        ) {
          console.log('Current time on progress')
          this.setState({ videoIsPlaying: false, videoIsBuffering: true })
        }
      }

      // Reports when the video's volume has been changed, or if the video has been muted
      this.refVideoPlayer.current.onvolumechange = () => {
        this.resetInactivityTimer()
        this.setState({
          videoCurrentVolume: this.refVideoPlayer.current.volume,
          videoIsMuted: this.refVideoPlayer.current.muted,
        })
      }

      //********* End Video Event Handlers *********
    }
  }

  componentWillUnmount() {
    clearTimeout(this.inactivityTimer)
  }

  //********* Begin Initialization Functions *********

  generateSources = quality => {
    return this.props.sources.map((source, key) => {
      if (source.qualityRank === this.state.videoQuality) {
        return React.createElement('source', {
          src: source.source,
          type: source.mediaType,
          key,
        })
      }
    })
  }

  generateTracks = () => {
    return this.props.tracks.map((track, key) => {
      return React.createElement('track', {
        label: track.label,
        kind: track.kind,
        srcLang: track.language,
        src: track.source,
        default: track.isDefault,
        key,
      })
    })
  }

  refreshMedia = () => {
    this.sources = this.generateSources(this.state.videoQuality)
    this.tracks = this.generateTracks()
  }

  initializeYoutubePlayer = () => {
    this.refVideoPlayer.current.internalPlayer.setVolume(this.props.defaultVolume * 100)
    this.props.beginMuted && this.refVideoPlayer.current.internalPlayer.mute()
  }

  //********* End Initialization Functions *********

  //********* Begin Helper Functions *********

  resetInactivityTimer = () => {
    if (!this.refVideoPlayer.current.paused) {
      this.setState({ mouseInactive: false })
      clearTimeout(this.inactivityTimer)

      if (!this.state.videoEnded && !this.state.videoQualityChanged) {
        this.inactivityTimer = setTimeout(() => {
          this.setState({ mouseInactive: true })
        }, this.playerOptions.mouseTimeout)
      }
    }
  }

  // ********** Play/Pausing **********
  togglePlayPause = () => {
    this.state.videoIsPlaying ? this.setPlaying(false) : this.setPlaying(true)
  }

  setPlaying = isPlaying => {
    isPlaying ? this.refVideoPlayer.current.play() : this.refVideoPlayer.current.pause()
  }

  // ********** Video Seeking **********
  setSeek = seconds => {
    this.refVideoPlayer.current.currentTime = seconds
  }

  incrementSeek = seconds => {
    this.refVideoPlayer.current.currentTime += seconds
  }

  // ********** Sound Control **********
  incrementVolume = amount => {
    this.refVideoPlayer.current.volume += amount
  }

  setVolume = amount => {
    this.refVideoPlayer.current.volume = amount
  }

  toggleMute = () => {
    this.refVideoPlayer.current.muted = !this.refVideoPlayer.current.muted
  }

  // ********** CC Control **********
  toggleTextTracks = () => {
    this.refVideoPlayer.current.textTracks[0].mode =
      this.refVideoPlayer.current.textTracks[0].mode === 'hidden'
        ? (this.refVideoPlayer.current.textTracks[0].mode = 'showing')
        : (this.refVideoPlayer.current.textTracks[0].mode = 'hidden')
  }

  // ********** Video Display Control **********
  toggleFullscreen = () => {
    if (fscreen.fullscreenEnabled) {
      fscreen.fullscreenElement === null
        ? fscreen.requestFullscreen(this.refVideoPlayerContainer.current)
        : fscreen.exitFullscreen()
      this.setState({
        videoIsFullscreen: !this.state.videoIsFullscreen,
      })
    }
  }

  setVideoQuality = async quality => {
    const currentTime = this.state.videoCurrentTime
    const wasPlaying = this.state.videoIsPlaying
    this.setPlaying(false)
    await this.setState({
      videoLength: 0,
      videoFramerate: 0,
      videoBufferEnd: 0,
      mouseInactive: false,
      videoQuality: quality,
      videoQualityChanged: true,
    })
    await this.refreshMedia()
    await this.refVideoPlayer.current.load()
    clearTimeout(this.inactivityTimer)
    this.resetInactivityTimer()
    this.setSeek(currentTime)
    this.setPlaying(wasPlaying)
  }

  //********* End Helper Functions *********

  handleKeyboard = event => {
    const key = event.key || event.keyCode

    //**** Begin Seek & Play Control ****
    if (key === ' ' || key === 32 || key === 'k' || key === 75) {
      this.resetInactivityTimer()

      this.togglePlayPause()
    }

    if (key === 'ArrowRight' || key === 39) {
      this.resetInactivityTimer()

      this.incrementSeek(this.playerOptions.keyboardSeekIncrement)
    }

    if (key === 'ArrowLeft' || key === 37) {
      this.resetInactivityTimer()

      this.incrementSeek(-this.playerOptions.keyboardSeekIncrement)
    }

    if (key === ',' || key === 188) {
      this.resetInactivityTimer()

      this.incrementSeek(-(this.state.videoFramerate / 1000))
    }

    if (key === '.' || key === 190) {
      this.resetInactivityTimer()

      this.incrementSeek(this.state.videoFramerate / 1000)
    }

    if (key === '0' || key === 48 || key === 'numpad 0' || key === 96) {
      this.setSeek(0)
    }

    if (key === '1' || key === 49 || key === 'numpad 1' || key === 97) {
      this.setSeek(this.state.videoLength * 0.1)
    }

    if (key === '2' || key === 50 || key === 'numpad 2' || key === 98) {
      this.setSeek(this.state.videoLength * 0.2)
    }

    if (key === '3' || key === 51 || key === 'numpad 3' || key === 99) {
      this.setSeek(this.state.videoLength * 0.3)
    }

    if (key === '4' || key === 52 || key === 'numpad 4' || key === 100) {
      this.setSeek(this.state.videoLength * 0.4)
    }

    if (key === '5' || key === 53 || key === 'numpad 5' || key === 101) {
      this.setSeek(this.state.videoLength * 0.5)
    }

    if (key === '6' || key === 54 || key === 'numpad 6' || key === 102) {
      this.setSeek(this.state.videoLength * 0.6)
    }

    if (key === '7' || key === 55 || key === 'numpad 7' || key === 103) {
      this.setSeek(this.state.videoLength * 0.7)
    }

    if (key === '8' || key === 56 || key === 'numpad 8' || key === 104) {
      this.setSeek(this.state.videoLength * 0.8)
    }

    if (key === '9' || key === 57 || key === 'numpad 9' || key === 105) {
      this.setSeek(this.state.videoLength * 0.9)
    }

    // **** End Seek & Play Control ****

    // **** Begin Volume Control ****

    if (key === 'ArrowUp' || key === 38) {
      this.resetInactivityTimer()

      if (this.state.videoCurrentVolume + this.playerOptions.keyboardVolumeIncrement < 1) {
        this.incrementVolume(this.playerOptions.keyboardVolumeIncrement)
      } else {
        this.setVolume(1)
      }
    }

    if (key === 'ArrowDown' || key === 40) {
      this.resetInactivityTimer()

      if (this.state.videoCurrentVolume - this.playerOptions.keyboardVolumeIncrement > 0) {
        this.incrementVolume(-this.playerOptions.keyboardVolumeIncrement)
      } else {
        this.setVolume(0)
      }
    }

    if (key === 'm' || key === 77) {
      this.resetInactivityTimer()

      this.toggleMute()
    }

    // **** End Volume Control ****

    // **** Begin Accessibility Controls ****

    if (key === 'c' || key === 67) {
      this.resetInactivityTimer()

      this.toggleTextTracks()
    }

    if (key === 'f' || key === 70) {
      this.resetInactivityTimer()

      this.toggleFullscreen()
    }

    // **** End Accessibility Controls ****
  }

  render() {
    const { ...rest } = this.props

    const videoPlayerContainer = {
      width: '100%',
      cursor: this.state.mouseInactive ? 'none' : undefined,
      outline: 'none',
    }

    const videoElementContainer = {
      outline: 'none',
      height: this.state.videoIsFullscreen ? '100%' : undefined,
    }

    const videoPlayer = {
      width: '100%',
      height: this.state.videoIsFullscreen ? '100%' : undefined,
    }

    const aspectRatios = {
      '16:9': { paddingTop: '56.25%' },
      '4:3': { paddingTop: '75%' },
      '1:1': { paddingTop: '100%' },
    }

    const aspectLimiter = { ...aspectRatios[this.props.youtubeAspectRatio], position: 'relative' }

    const youtubePlayer = {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    }

    return (
      <div css={videoPlayerContainer} {...safeRest(rest)}>
        {this.props.youtubeId === undefined ? (
          <div ref={this.refVideoPlayerContainer} onMouseMove={this.resetInactivityTimer}>
            <div css={videoElementContainer} onKeyDown={this.handleKeyboard} tabIndex="0">
              <video
                css={videoPlayer}
                ref={this.refVideoPlayer}
                controls={this.state.isMobile}
                poster={this.props.posterSrc}
                onClick={this.togglePlayPause}
                playsinline
              >
                {this.sources}
                {this.tracks}
                Your browser does not support the video tag.
              </video>
            </div>
            <ControlBar
              videoPlayer={this.refVideoPlayer}
              videoPlayerContainer={this.refVideoPlayerContainer}
              videoLength={this.state.videoLength}
              videoBufferEnd={this.state.videoBufferEnd}
              videoCurrentTime={this.state.videoCurrentTime}
              videoPlaying={
                this.refVideoPlayer.current !== null ? !this.refVideoPlayer.current.paused : false
              }
              videoDefaultVolume={this.props.defaultVolume}
              videoCurrentVolume={this.state.videoCurrentVolume}
              videoIsMuted={this.state.videoIsMuted}
              setVolume={this.setVolume}
              hidden={this.state.mouseInactive}
              isMobile={this.state.isMobile}
              tracksAvailable={this.props.tracks !== undefined}
              togglePlayPause={this.togglePlayPause}
              setSeek={this.setSeek}
              toggleMute={this.toggleMute}
              toggleFullscreen={this.toggleFullscreen}
              videoIsFullscreen={this.state.videoIsFullscreen}
              toggleTextTracks={this.toggleTextTracks}
              resetInactivityTimer={this.resetInactivityTimer}
              setVideoQuality={this.setVideoQuality}
            />
            <div
              css={{
                position: 'absolute',
                bottom: 700,
                backgroundColor: 'rgba(255,255,255,0.8)',
              }}
            >
              <p>videoLength: {this.state.videoLength.toString()}</p>
              <p>videoFramerate: {this.state.videoFramerate.toString()}</p>
              <p>videoCurrentTime: {this.state.videoCurrentTime.toString()}</p>
              <p>videoBufferEnd: {this.state.videoBufferEnd.toString()}</p>
              <p>videoIsBuffering: {this.state.videoIsBuffering.toString()}</p>
              <p>videoCurrentVolume: {this.state.videoCurrentVolume.toString()}</p>
              <p>videoIsPlaying: {this.state.videoIsPlaying.toString()}</p>
              <p>videoIsMuted: {this.state.videoIsMuted.toString()}</p>
              <p>videoIsFullscreen: {this.state.videoIsFullscreen.toString()}</p>
              <p>mouseInactive: {this.state.mouseInactive.toString()}</p>
              <p>videoEnded: {this.state.videoEnded.toString()}</p>
              <p>isMobile: {this.state.isMobile.toString()}</p>
              <p>videoQuality: {this.state.videoQuality.toString()}</p>
              <p>videoQualityChanged: {this.state.videoQualityChanged.toString()}</p>
            </div>
            {this.state.videoUnplayed && (
              <Button
                onClick={() => {
                  this.togglePlayPause()
                }}
              >
                PLAY
              </Button>
            )}
            {this.state.videoEnded && (
              <Button
                onClick={async () => {
                  await this.setSeek(0)
                  await this.togglePlayPause()
                }}
              >
                REPLAY
              </Button>
            )}
            {this.state.videoIsBuffering && !this.state.isMobile && (
              <Spinner spinning tip="Buffering..." />
            )}
          </div>
        ) : (
          <div css={videoPlayerContainer} ref={this.refVideoPlayerContainer}>
            <div css={aspectLimiter}>
              <YouTube
                videoId={this.props.youtubeId}
                opts={{
                  width: '100%',
                  height: '100%',
                  modestbranding: 1,
                  playsinline: 1,
                  rel: 0,
                }}
                onReady={this.initializeYoutubePlayer}
                ref={this.refVideoPlayer}
                css={youtubePlayer}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

Video.propTypes = {
  sources: PropTypes.array,
  youtubeId: PropTypes.string,
  posterSrc: PropTypes.string,
  youtubeAspectRatio: PropTypes.oneOf(['16:9', '4:3', '1:1']),
  tracks: PropTypes.array,
  defaultVolume: PropTypes.number,
  beginMuted: PropTypes.bool,
}

Video.defaultProps = {
  sources: undefined,
  youtubeId: undefined,
  posterSrc: undefined,
  youtubeAspectRatio: '16:9',
  tracks: undefined,
  defaultVolume: 1,
  beginMuted: false,
}

export default Video
