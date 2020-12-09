import React, {useState, useEffect} from 'react';
import {View, Image, Animated, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';

export default function (props) {
  // const [scaleAnimate, setScaleAnimate] = useState(new Animated.Value(0));
  //
  // useEffect(() => {
  //   const {index} = props;
  //   const delay = parseInt(index / 4) * 100;
  //   Animated.spring(scaleAnimate, {
  //     toValue: 1,
  //     velocity: 2, //初始速度
  //     friction: 8, //摩擦力值
  //     duration: 1500,
  //     useNativeDriver: true,
  //     delay: delay,
  //   }).start();
  // }, [props, scaleAnimate]);

  function toTopPage() {
    props.navigation.navigate('TopPage', {
      name: props.item.name,
      author: props.item.name,
    });
  }

  return (
    <TouchableOpacity onPress={toTopPage}>
      <View
        style={{
          width: 80,
          height: 80,
          marginHorizontal: 10,
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{width: 50, height: 50, borderRadius: 25}}
          source={{
            uri: `${props.item.picUrl}?param=100y100`,
          }}
        />
        <Text style={{textAlign: 'center'}}>{props.item.name}</Text>
      </View>
    </TouchableOpacity>
  );
}
