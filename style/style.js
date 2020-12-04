import {StyleSheet} from 'react-native';
import {Colors} from 'react-native-paper';

const playerStyle = StyleSheet.create({
  miniPlayer: {
    height: 53,
    fontSize: 20,
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
  typeList: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingVertical: 10,
  },
  typeBox: {
    backgroundColor: '#FFF',
    width: '30%',
    height: 80,
    elevation: 4,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {playerStyle};
