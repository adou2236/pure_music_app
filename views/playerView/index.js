import React, {Component} from 'react';
import {
  View,
  findNodeHandle,
  Easing,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import Slider from 'react-native-slider-t';
import {playerStyle} from '../../style/style';
import {
  ProgressBar,
  Colors,
  IconButton,
  Portal,
  Modal,
  Text,
} from 'react-native-paper';
import {VibrancyView, BlurView} from 'react-native-blur';
import Video from 'react-native-video';
import MusicList from '../MusicList';
import {getRealUrl, throttle, debounce} from '../../unit/fn';
import MusicControl, {Command} from 'react-native-music-control';
import {addPlayTimes} from '../../http/api';
import Toast from 'react-native-easy-toast';
import noCover from '../../public/image/noCover.png';

export default class playerView extends Component {
  constructor(props) {
    super(props);
    console.log('传入的参数', props);
    this.rotation = false;
    this.player = null;
    this.backgroundImage = noCover;
    // this.valueChange = debounce(this.valueChange);
    this.state = {
      viewRef: null,
      playMode: 'repeat',
      playModeList: [
        {id: 'repeat', name: '循环播放'},
        {id: 'repeat-once', name: '单曲循环'},
        {id: 'repeat-off', name: '关闭循环'},
        {id: 'shuffle', name: '随机播放'},
      ],
      currentTime: 0,
      duration: 1,
      isPause: true,
      spinValue: new Animated.Value(0),
      musicSide: false,
      currentUrl: '',
      position: 'bottom',
    };
    this.spinAnimated = Animated.timing(this.state.spinValue, {
      toValue: 1,
      duration: 20000,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.linear),
    });
  }
  componentDidMount() {
    // this.spin();
    // MusicControl.resetNowPlaying();
    MusicControl.setNowPlaying({
      title: this.props.currentPlaying.element.song_name,
      artwork: this.props.currentPlaying.element.pic_url, // URL or RN's image require()
      artist: this.props.currentPlaying.element.author,
      color: 0xffffff, // Android Only - Notification Color
      colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
      isLiveStream: true, // iOS Only (Boolean), Show or hide Live Indicator instead of seekbar on lock screen for live streams. Default value is false.
    });
    MusicControl.enableBackgroundMode(true);
    MusicControl.enableControl('closeNotification', true, {when: 'paused'});
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', true);
    MusicControl.on('play', () => {
      this.pauseControl();
    });
    MusicControl.on(Command.pause, () => {
      this.pauseControl();
    });
    MusicControl.on(Command.nextTrack, () => {
      this.nextSong();
    });
    MusicControl.on(Command.previousTrack, () => {
      this.preSong();
    });
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    //切歌
    if (prevProps.currentPlaying !== this.props.currentPlaying) {
      MusicControl.setNowPlaying({
        title: this.props.currentPlaying.element.song_name,
        artwork: this.props.currentPlaying.element.pic_url, // URL or RN's image require()
        artist: this.props.currentPlaying.element.author,
      });
      this.setState(
        {
          viewRef: null,
          currentTime: 0,
          currentUrl: '',
        },
        () => {
          getRealUrl(this.props.currentPlaying.element.music_id)
            .then((res) => {
              this.setState({
                viewRef: findNodeHandle(this.backgroundImage),
                currentUrl: res,
              });
            })
            .catch((err) => {
              this.nextSong();
              // this.setState({
              //   currentUrl: '',
              // });
              this.refs.toast.show('解析失败', 300);
            });
        },
      );
    }
  }

  spining() {
    if (this.rotation) {
      this.state.spinValue.setValue(0);
      this.spinAnimated.start(() => {
        this.spining();
      });
    }
  }

  spin() {
    this.rotation = !this.state.isPause;
    if (this.rotation) {
      this.spinAnimated.start(() => {
        this.spinAnimated = Animated.timing(this.state.spinValue, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.linear),
        });
        this.spining();
      });
    } else {
      this.state.spinValue.stopAnimation((oneTimeRotate) => {
        console.log(oneTimeRotate);
        this.spinAnimated = Animated.timing(this.state.spinValue, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.linear),
        });
      });
    }
  }

  formatMediaTime(duration) {
    let min = Math.floor(duration / 60);
    let second = duration - min * 60;
    min = min >= 10 ? min : '0' + min;
    second = second >= 10 ? second : '0' + second;
    return min + ':' + second;
  }

  toTopPage = () => {
    this.props.hideModal();
    this.props.navigation.navigate('TopPage', {
      name: this.props.currentPlaying.element.author,
      author: this.props.currentPlaying.element.author,
    });
  };

  getUrl = (music_id) => {
    getRealUrl(music_id)
      .then((res) => {
        this.setState({
          isPause: false,
        });
        return res;
      })
      .catch((err) => {
        console.log('解析失败');
      });
  };

  //播放与暂停的切换，当参数为true时，只切换到播放
  pauseControl = (play = false, callback) => {
    // this.spin();
    // console.log(this.props.playList[0].music_id)
    this.setState(
      {
        isPause: !play && !this.state.isPause,
      },
      () => {
        callback && callback();
        if (!this.state.isPause) {
          MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
          });
          getRealUrl(this.props.currentPlaying.element.music_id)
            .then((res) => {
              this.setState({
                currentUrl: res,
              });
            })
            .catch((err) => {
              this.setState({
                currentUrl: '',
              });
              console.log('解析失败', err);
            });
        } else {
          MusicControl.updatePlayback({
            state: MusicControl.STATE_PAUSED, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
          });
        }
      },
    );
  };
  imageLoaded = () => {
    this.setState({viewRef: findNodeHandle(this.backgroundImage)});
  };

  setDuration = (v) => {
    this.setState({
      duration: parseInt(v.duration),
    });
    addPlayTimes(this.props.currentPlaying.element.music_id);
  };
  setTime = ({currentTime}) => {
    //当repeat为true时安卓端不会触发onEnd需要手动执行一次
    if (currentTime < this.state.currentTime) {
      this.onEnd();
    }
    this.setState({
      currentTime: parseInt(currentTime),
    });
  };

  //充满疑问？？？？？？？？？？
  valueChange = (v) => {
    if (this.player) {
      this.setTime = () => {
        this.setState({
          currentTime: parseInt(v),
        });
      };
      this.setState({currentTime: v});
    }
  };

  slidingComplete = (value) => {
    if (this.player) {
      this.player.seek(value);
    }
  };
  seekDone = () => {
    this.setTime = ({currentTime}) => {
      if (currentTime < this.state.currentTime) {
        this.onEnd();
      }
      this.setState({
        currentTime: parseInt(currentTime),
      });
    };
  };
  videoError = () => {
    alert('资源错误');
  };
  onTimedMetadata = () => {};
  onBuffer = () => {};
  //播放结束后的循环操作
  onEnd = () => {
    const {playMode} = this.state;
    const {currentPlaying} = this.props;
    switch (playMode) {
      case 'repeat':
        this.nextSong();
        break;
      case 'repeat-off':
        if (currentPlaying === this.props.playList.getTail()) {
          this.pauseControl();
        } else {
          this.nextSong();
        }
        break;
      case 'shuffle':
        this.nextSong(Math.floor(Math.random() * this.props.playList.size()));
        break;
      default:
        return;
    }
  };
  LoadStart() {}
  preSong = () => {
    this.props.preSong();
  };
  nextSong = (number = 1) => {
    this.props.nextSong(number);
  };
  playMode = (v) => {
    let index = this.state.playModeList.map((item) => item.id).indexOf(v);
    index = (index + 1) % 4;
    this.setState({
      playMode: this.state.playModeList[index].id,
    });
    this.refs.toast.show(this.state.playModeList[index].name, 300);
  };
  hideSide = () => {
    this.setState({musicSide: false});
  };
  render() {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: 'transparent',
      },
      bgContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
      },
      bgContainer2: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
      },
      navBarStyle: {
        display: 'flex',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        width: '100%',
        height: 64,
        borderBottomWidth: 1,
        borderColor: 'white',
      },
      navBarContent: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
      },
      title: {
        color: 'white',
        fontSize: 14,
      },
      subTitle: {
        color: 'white',
        fontSize: 11,
        marginTop: 5,
      },
      djCard: {
        width: 270,
        height: 270,
        position: 'absolute',
        borderColor: 'gray',
        borderWidth: 10,
        // borderRadius: 190,
        alignSelf: 'center',
        opacity: 0.2,
      },
      playerStyle: {
        position: 'absolute',
        width: '100%',
      },
      progressStyle: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginTop: 15,
        alignItems: 'center',
      },
      slider: {
        flex: 1,
        marginHorizontal: 5,
      },
      toolBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 30,
      },
      cdStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      },
      absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
    });

    let {
      duration,
      currentTime,
      isPause,
      playMode,
      musicSide,
      currentUrl,
    } = this.state;
    let {playList, currentPlaying, isOpen, isClose, withBlur} = this.props;
    const miniPlayer = (
      <View style={playerStyle.miniPlayer}>
        <View
          style={{
            width: '100%',
            height: 50,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={playerStyle.miniCover}>
            <Image
              source={
                currentPlaying.element.pic_url.indexOf('http') > -1
                  ? {uri: currentPlaying.element.pic_url}
                  : noCover
              }
              style={{position: 'absolute', height: '100%', width: '100%'}}
            />
            <IconButton
              style={playerStyle.button}
              color={'white'}
              icon={isPause ? 'play-circle-outline' : 'pause-circle-outline'}
              onPress={() => this.pauseControl()}
            />
          </View>
          <TouchableOpacity
            style={playerStyle.musicMessage}
            onPress={() => {
              this.props.showModal();
            }}>
            <View>
              <Text style={{fontSize: 15}}>
                {currentPlaying.element.song_name}
              </Text>
              <Text style={{fontSize: 10}}>
                {currentPlaying.element.author}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifySelf: 'center',
            }}>
            <IconButton
              onPress={() => this.setState({musicSide: true})}
              icon="playlist-music-outline"
            />
            <IconButton icon="skip-next" onPress={() => this.nextSong()} />
          </View>
        </View>
        <ProgressBar
          progress={currentTime / duration}
          color={Colors.blue200}
          style={playerStyle.miniProgress}
        />
      </View>
    );
    const wholePlayer = (
      <>
        <Animated.View
          style={{
            ...playerStyle.wholePlayer,
            transform: [
              {
                //缩放效果
                scale: this.props.scaleAnimate.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.8, 1.2, 1],
                }),
              },
              {
                //偏移效果
                translateY: this.props.scaleAnimate.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1000, 0],
                }),
              },
            ],
          }}>
          <Image
            ref={(img) => {
              this.backgroundImage = img;
            }}
            style={styles.bgContainer}
            source={
              currentPlaying.element.pic_url.indexOf('http') > -1
                ? {uri: currentPlaying.element.pic_url}
                : noCover
            }
            resizeMode="cover"
            onLoadEnd={this.imageLoaded.bind(this)}
          />
          <View style={styles.bgContainer}>
            {Platform.OS === 'ios' ? (
              <VibrancyView
                blurType={'dark'}
                blurAmount={20}
                style={styles.container}
              />
            ) : withBlur ? (
              <BlurView
                style={styles.absolute}
                viewRef={this.state.viewRef}
                blurType="dark"
                blurAmount={10}
              />
            ) : null}
          </View>
          <View style={styles.bgContainer2}>
            <View style={styles.navBarStyle}>
              <View style={styles.navBarContent}>
                <IconButton
                  icon="chevron-down"
                  color={'white'}
                  size={20}
                  onPress={() => {
                    this.props.hideModal();
                  }}
                />
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.title}>
                    {currentPlaying.element.song_name}
                  </Text>
                  <Text
                    onPress={() => this.toTopPage()}
                    style={styles.subTitle}>
                    {currentPlaying.element.author}
                  </Text>
                </View>
                <IconButton
                  color={'white'}
                  style={{marginTop: 5}}
                  onPress={() => alert('开发中。。。')}
                  icon="play"
                  size={20}
                />
              </View>
            </View>
            <View
              style={{
                width: 260,
                height: 260,
                alignSelf: 'center',
                borderRadius: 130,
                backgroundColor: 'black',
                borderColor: 'rgba(215,215,215,0.2)',
                borderWidth: 10,
              }}>
              {/*<View style={styles.djCard} />*/}
              <Animated.Image
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: 85,
                  alignSelf: 'center',
                  position: 'absolute',
                  top: 35,
                  transform: [
                    {
                      rotate: this.state.spinValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                }}
                source={
                  currentPlaying.element.pic_url.indexOf('http') > -1
                    ? {uri: currentPlaying.element.pic_url}
                    : noCover
                }
              />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/*<View*/}
              {/*  style={{*/}
              {/*    backgroundColor: 'purple',*/}
              {/*    flexDirection: 'row',*/}
              {/*    alignItems: 'center',*/}
              {/*    marginHorizontal: 50,*/}
              {/*    justifyContent: 'space-between',*/}
              {/*  }}>*/}
              {/*  /!*功能按钮区*!/*/}
              {/*  <IconButton icon="play" size={20} />*/}
              {/*  <IconButton icon="play" size={20} />*/}
              {/*  <IconButton icon="play" size={20} />*/}
              {/*  <IconButton icon="play" size={20} />*/}
              {/*</View>*/}
              <View style={styles.progressStyle}>
                <Text
                  style={{
                    width: 35,
                    fontSize: 11,
                    color: 'white',
                    marginLeft: 5,
                  }}>
                  {this.formatMediaTime(Math.floor(this.state.currentTime))}
                </Text>
                <Slider
                  style={styles.slider}
                  value={this.state.currentTime}
                  maximumValue={this.state.duration}
                  step={1}
                  trackPressable={true}
                  onValueChange={(value) => this.valueChange(value)}
                  onSlidingComplete={(value) => this.slidingComplete(value)}
                />
                <View
                  style={{width: 35, alignItems: 'flex-end', marginRight: 5}}>
                  <Text style={{fontSize: 11, color: 'white'}}>
                    {this.formatMediaTime(Math.floor(this.state.duration))}
                  </Text>
                </View>
              </View>
              <View style={styles.toolBar}>
                <TouchableOpacity
                  style={{width: 50, marginLeft: 5}}
                  onPress={() => this.playMode(playMode)}>
                  <IconButton icon={playMode} color={'white'} size={20} />
                </TouchableOpacity>
                {/*repeat repeat-off repeat-once*/}
                <View style={styles.cdStyle}>
                  <TouchableOpacity onPress={() => this.preSong()}>
                    <IconButton icon="rewind" color={'white'} size={35} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => this.pauseControl()}>
                    <IconButton
                      color="white"
                      icon={isPause ? 'play' : 'pause'}
                      size={35}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.nextSong()}>
                    <IconButton icon="fast-forward" color={'white'} size={35} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => this.setState({musicSide: true})}
                  style={{width: 50, alignItems: 'flex-end', marginRight: 5}}>
                  <IconButton
                    icon="playlist-music-outline"
                    color={'white'}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </>
    );
    return (
      <>
        {isClose ? miniPlayer : null}
        {isOpen ? wholePlayer : null}
        {
          currentUrl !== '' ? (
            <Video
              source={{
                uri: currentUrl,
              }}
              ref={(ref) => {
                this.player = ref;
              }}
              rate={1.0}
              volume={1.0}
              muted={false}
              paused={currentUrl !== '' && isPause}
              repeat={true}
              playInBackground={true}
              ignoreSilentSwitch={'ignore'}
              playWhenInactive={true}
              progressUpdateInterval={1000.0}
              onLoadStart={this.LoadStart}
              onLoad={this.setDuration}
              onProgress={this.setTime}
              onEnd={this.onEnd}
              onSeek={this.seekDone}
              onError={this.videoError}
              onBuffer={this.onBuffer}
              onTimedMetadata={this.onTimedMetadata}
            />
          ) : null
          // <Text style={{color: 'red'}}>加载中。。。。。。。</Text>
        }
        <Portal>
          <Modal
            animationType={'slider'}
            visible={musicSide}
            onDismiss={this.hideSide}
            contentContainerStyle={{
              backgroundColor: 'white',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              padding: 20,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text>{playList.size()}/50</Text>
              <IconButton
                size={25}
                icon={'delete-sweep-outline'}
                onPress={() => this.props.destroyLinklist()}
              />
            </View>
            <MusicList
              mode={'local'}
              musicList={playList.transArr()}
              currentPlaying={currentPlaying}
              listAction={this.props.listAction}
            />
          </Modal>
        </Portal>
        <Toast ref="toast" position={this.state.position} />
      </>
    );
  }
}
