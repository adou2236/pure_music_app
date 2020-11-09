import React, {Component} from 'react';
import {
  View,
  Text,
  AsyncStorage,
  Easing,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Slider,
  Platform,
} from 'react-native';
import globalStyle from '../../style/style';
import {Button, ProgressBar, Colors, IconButton} from 'react-native-paper';
import {VibrancyView, BlurView} from 'react-native-blur';
import Video from 'react-native-video';
export default class playerView extends Component {
  constructor(props) {
    super(props);
    this.rotation = false;
    this.state = {
      isOpen: false,
      isClose: true,
      cover:
        'https://p2.music.126.net/MAPezKykfIK5PGhpJS1t0w==/109951163959563220.jpg',
      defaultMusic: {
        uri:
          'https://hifini.com/get_music.php?key=/EMMQfO3LHC4myJ7kfRf4IAPJU48bsE3wijdlAGRY2Ue/L++NDQxYQvz37o',
        artist: '林俊杰',
        name: '心墙',
      },
      player: null,
      currentTime: 0,
      duration: 1,
      isPause: true,
      spinValue: new Animated.Value(0),
      scaleAnimate: new Animated.Value(0),
    };
    this.spinAnimated = Animated.timing(this.state.spinValue, {
      toValue: 1,
      duration: 20000,
      easing: Easing.inOut(Easing.linear),
    });
  }
  componentDidMount() {
    // this.spin();
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

  pauseControl = () => {
    // this.spin();
    this.setState({
      isPause: !this.state.isPause,
    });
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
  videoError = () => {};
  onTimedMetadata = () => {};
  onBuffer = () => {};
  onEnd = () => {};
  LoadStart() {}
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
        borderColor: 'white'
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
      cover,
      defaultMusic,
      duration,
      currentTime,
      isPause,
    } = this.state;
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
              source={{uri: this.state.cover}}
              style={{position: 'absolute', height: '100%', width: '100%'}}
            />
            <IconButton
              style={globalStyle.button}
              color={'white'}
              icon={isPause ? 'play-circle-outline' : 'pause-circle-outline'}
              onPress={() => {
                this.setState({
                  isPause: !isPause,
                });
              }}
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
              <Text style={{fontSize: 15}}>{defaultMusic.name}</Text>
              <Text style={{fontSize: 10}}>{defaultMusic.artist}</Text>
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
          source={{uri: cover}}
          resizeMode="cover"
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
                size={20}
                onPress={() => {
                  Animated.spring(this.state.scaleAnimate, {
                    toValue: 0,
                    velocity: 2, //初始速度
                    friction: 8, //摩擦力值
                    duration: 1500, //
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
                <Text style={styles.title}>{defaultMusic.name}</Text>
                <Text style={styles.subTitle}>{defaultMusic.artist}</Text>
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
            source={{uri: cover}}
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
              <IconButton icon="play" size={20} />
              <IconButton icon="play" size={20} />

              <IconButton icon="play" size={20} />

              <IconButton icon="play" size={20} />
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
                onSlidingComplete={(value) => this.player.seek(value)}
              />
              <View style={{width: 35, alignItems: 'flex-end', marginRight: 5}}>
                <Text style={{fontSize: 11, color: 'white'}}>
                  {this.formatMediaTime(Math.floor(this.state.duration))}
                </Text>
              </View>
            </View>
            <View style={styles.toolBar}>
              <TouchableOpacity
                style={{width: 50, marginLeft: 5}}
                onPress={() => this.playMode(this.state.playMode)}>
                <IconButton icon="play" size={20} />
              </TouchableOpacity>
              <View style={styles.cdStyle}>
                <TouchableOpacity
                  onPress={() => this.preSong(this.state.currentIndex - 1)}>
                  <IconButton icon="play" size={35} />
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
                  onPress={() => this.nextSong(this.state.currentIndex + 1)}>
                  <IconButton icon="play" size={35} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{width: 50, alignItems: 'flex-end', marginRight: 5}}>
                <IconButton icon="play" size={35} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
    return (
      <>
        {isClose ? miniPlayer : null}
        {isOpen ? wholePlayer : null}
        <Video
          source={{uri: defaultMusic.uri}} // Can be a URL or a local file.
          ref={(ref) => {
            this.state.player = ref;
          }}
          rate={1.0}
          volume={1.0}
          muted={false}
          paused={isPause}
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
      </>
    );
  }
}
