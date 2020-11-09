import {StyleSheet} from 'react-native';
var globalStyle = StyleSheet.create({
  miniPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 53,
    fontSize: 20,
    borderTopWidth: 1,
    borderColor: 'red',
  },
  miniCover: {
    zIndex: 5,
    position: 'relative',
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicMessage: {
    flex: 1,
    height: '100%',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
  },
  miniProgress: {
    height: 3,
  },
  wholePlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'gray',
    fontSize: 20,
    height: '100%',
    width: '100%',
  },
});
export default globalStyle;
