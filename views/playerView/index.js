import React, {Component} from 'react';
import {
  View,
  Text,
  findNodeHandle,
  Easing,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import globalStyle from '../../style/style';
import {
  Button,
  ProgressBar,
  Colors,
  IconButton,
  Portal,
  Modal,
} from 'react-native-paper';
import {VibrancyView, BlurView} from 'react-native-blur';
import Video from 'react-native-video';
import SideMenu from 'react-native-side-menu';
import MusicList from '../MusicList';
import {getRealUrl} from '../../unit/fn';
export default class playerView extends Component {
  constructor(props) {
    super(props);
    console.log('播放列表为', props);
    this.rotation = false;
    this.player = null;
    this.state = {
      viewRef: null,
      currentPlaying: 0,
      isOpen: false,
      isClose: true,
      playMode: 'repeat',
      playModeList: ['repeat', 'repeat-once', 'repeat-off'],
      currentTime: 0,
      duration: 1,
      isPause: true,
      spinValue: new Animated.Value(0),
      scaleAnimate: new Animated.Value(0),
      musicSide: false,
      currentUrl: '',
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
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    if (
      this.props.playList[prevState.currentPlaying].music_id !==
      this.props.playList[this.state.currentPlaying].music_id
    ) {
      this.setState(
        {
          currentTime: 0,
          currentUrl: '',
        },
        () => {
          getRealUrl(this.props.playList[this.state.currentPlaying].music_id)
            .then((res) => {
              this.setState({
                currentUrl: res ,
              });
            })
            .catch((err) => {
              this.setState({
                currentUrl: '',
              });
              console.log('解析失败', err);
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

  getUrl = (music_id) => {
    console.log('开始过去', music_id);
    getRealUrl(music_id)
      .then((res) => {
        console.log('获取成功', '"' + res + '"');
        this.setState({
          isPause: false,
        });
        return res;
      })
      .catch((err) => {
        console.log('解析失败');
      });
  };

  pauseControl = () => {
    // this.spin();
    // console.log(this.props.playList[0].music_id)
    this.setState(
      {
        isPause: !this.state.isPause,
      },
      () => {
        if (!this.state.isPause) {
          console.log(
            '开始解析',
            this.props.playList[this.state.currentPlaying].music_id,
          );
          getRealUrl(this.props.playList[this.state.currentPlaying].music_id)
            .then((res) => {
              console.log('"' + res + '"');
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
  };
  setTime = (v) => {
    this.setState({
      currentTime: parseInt(v.currentTime),
    });
  };
  videoError = () => {
    alert('资源错误');
  };
  onTimedMetadata = () => {};
  onBuffer = () => {};
  onEnd = () => {
    console.log('播放结束');
    const {playMode, currentPlaying} = this.state;
    switch (playMode) {
      case 'repeat':
        this.nextSong(currentPlaying + 1);
        break;
      case 'repeat-off':
        if (currentPlaying + 1 === this.props.playList.length) {
          this.pauseControl();
        } else {
          this.nextSong(currentPlaying + 1);
        }
        break;
    }
  };
  LoadStart() {
    console.log('开始加载+++++++++++++++');
  }
  preSong = (v) => {
    this.setState({
      currentPlaying:
        (this.props.playList.length + v) % this.props.playList.length,
    });
  };
  nextSong = (v) => {
    this.setState({
      currentPlaying: v % this.props.playList.length,
    });
  };
  playMode = (v) => {
    let index = this.state.playModeList.indexOf(v);
    index = (index + 1) % 3;
    this.setState({
      playMode: this.state.playModeList[index],
    });
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
      navBarStyle: {
        position: 'absolute',
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
        marginTop: 185,
        borderColor: 'gray',
        borderWidth: 10,
        borderRadius: 190,
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
        alignItems: 'center',
        position: 'absolute',
        bottom: 80,
      },
      slider: {
        flex: 1,
        marginHorizontal: 5,
      },
      toolBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        position: 'absolute',
        bottom: 0,
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
      isOpen,
      isClose,
      duration,
      currentTime,
      isPause,
      playMode,
      currentPlaying,
      musicSide,
      currentUrl,
    } = this.state;
    let {playList} = this.props;
    const miniPlayer = (
      <View style={globalStyle.miniPlayer}>
        <View
          style={{
            width: '100%',
            height: 50,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={globalStyle.miniCover}>
            <Image
              source={{uri: playList[currentPlaying].cover}}
              style={{position: 'absolute', height: '100%', width: '100%'}}
            />
            <IconButton
              style={globalStyle.button}
              color={'white'}
              icon={isPause ? 'play-circle-outline' : 'pause-circle-outline'}
              onPress={() => this.pauseControl()}
            />
          </View>
          <TouchableOpacity
            style={globalStyle.musicMessage}
            onPress={() => {
              Animated.spring(this.state.scaleAnimate, {
                toValue: 1,
                velocity: 2, //初始速度
                friction: 8, //摩擦力值
                duration: 1500, //
                useNativeDriver: true,
              }).start(() => {
                this.setState({
                  isClose: false,
                });
              });
              this.setState({
                isOpen: true,
              });
            }}>
            <View>
              <Text style={{fontSize: 15}}>
                {playList[currentPlaying].name}
              </Text>
              <Text style={{fontSize: 10}}>
                {playList[currentPlaying].artist}
              </Text>
            </View>
          </TouchableOpacity>

          <IconButton
            style={{justifySelf: 'center'}}
            icon="step-forward"
            onPress={() => console.log('Pressed')}
          />
        </View>
        <ProgressBar
          progress={currentTime / duration}
          color={Colors.blue200}
          style={globalStyle.miniProgress}
        />
        {/*<Button*/}
        {/*  onPress={() => {*/}
        {/*    this.setState({isOpen: true});*/}
        {/*  }}>*/}
        {/*  打开*/}
        {/*</Button>*/}
      </View>
    );
    const wholePlayer = (
      <>
        <Animated.View
          style={{
            ...globalStyle.wholePlayer,
            transform: [
              {
                //缩放效果
                scale: this.state.scaleAnimate.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.8, 1.2, 1],
                }),
              },
              {
                //偏移效果
                translateY: this.state.scaleAnimate.interpolate({
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
            source={{uri: playList[currentPlaying].cover}}
            resizeMode="cover"
            onLoadEnd={() => this.imageLoaded()}
          />
          <View style={styles.bgContainer}>
            {Platform.OS === 'ios' ? (
              <VibrancyView
                blurType={'light'}
                blurAmount={20}
                style={styles.container}
              />
            ) : (
              <BlurView
                style={styles.absolute}
                viewRef={this.state.viewRef}
                blurType="light"
                blurAmount={10}
              />
            )}
          </View>
          <View style={styles.bgContainer}>
            <View style={styles.navBarStyle}>
              <View style={styles.navBarContent}>
                <IconButton
                  icon="chevron-down"
                  color={'white'}
                  size={20}
                  onPress={() => {
                    Animated.spring(this.state.scaleAnimate, {
                      toValue: 0,
                      velocity: 2, //初始速度
                      friction: 8, //摩擦力值
                      duration: 1500, //
                      useNativeDriver: true,
                    }).start(() => {
                      this.setState({
                        isOpen: false,
                      });
                    });
                    this.setState({
                      isClose: true,
                    });
                  }}
                />
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.title}>
                    {playList[currentPlaying].name}
                  </Text>
                  <Text style={styles.subTitle}>
                    {playList[currentPlaying].artist}
                  </Text>
                </View>
                <IconButton
                  style={{marginTop: 5}}
                  onPress={() => alert('分享')}
                  icon="play"
                  size={20}
                />
              </View>
            </View>
            <View style={styles.djCard} />
            <View
              style={{
                width: 260,
                height: 260,
                alignSelf: 'center',
                position: 'absolute',
                borderRadius: 130,
                top: 190,
                backgroundColor: 'black',
              }}
            />
            <Animated.Image
              style={{
                width: 170,
                height: 170,
                borderRadius: 100,
                alignSelf: 'center',
                position: 'absolute',
                top: 235,
                transform: [
                  {
                    rotate: this.state.spinValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}
              source={{uri: playList[currentPlaying].cover}}
            />
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 50,
                  justifyContent: 'space-around',
                  bottom: -60,
                }}>
                {/*功能按钮区*/}
                {/*<IconButton icon="play" size={20} />*/}
                {/*<IconButton icon="play" size={20} />*/}

                {/*<IconButton icon="play" size={20} />*/}

                {/*<IconButton icon="play" size={20} />*/}
              </View>
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
                  onValueChange={(value) => this.setState({currentTime: value})}
                  onSlidingComplete={(value) => this.state.player.seek(value)}
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
                  <TouchableOpacity
                    onPress={() => this.preSong(currentPlaying - 1)}>
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
                  <TouchableOpacity
                    onPress={() => this.nextSong(currentPlaying + 1)}>
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
              borderRadius: 12,
            }}>
            <Text>共{this.props.playList.length}首</Text>
            <MusicList
              mode={'local'}
              musicList={this.props.playList}
              listAction={this.props.listAction}
            />
          </Modal>
        </Portal>
      </>
    );
    return (
      <>
        {isClose ? miniPlayer : null}
        {isOpen ? wholePlayer : null}
        {currentUrl !== '' ? (
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
            playInBackground={false}
            playWhenInactive={false}
            progressUpdateInterval={250.0}
            onLoadStart={this.LoadStart}
            onLoad={this.setDuration}
            onProgress={this.setTime}
            onEnd={this.onEnd}
            onError={this.videoError}
            onBuffer={this.onBuffer}
            onTimedMetadata={this.onTimedMetadata}
          />
        ) : (
          <Text style={{color: 'red'}}>加载中。。。。。。。</Text>
        )}
      </>
    );
  }
}
