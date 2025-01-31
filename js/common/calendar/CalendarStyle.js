import {
  StyleSheet,
  Dimensions
} from 'react-native';
const {scale, width} = Dimensions.get('window');
let iconSize = 22;
let resultFontSize = 24;
let weekTextFontSize = 16;
let slashLength = 80;
if (width < 350) {
  resultFontSize = 20;
  weekTextFontSize = 14;
  iconSize = 20;
  slashLength = 70;
}

export default StyleSheet.create({
  container: {
    flex: 1
  },
  ctrl: {
    flex: 1.5,
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    paddingHorizontal: 15
  },
  result: {
    flex: 2.5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  resultSlash: {
    width: slashLength,
    height: 1 / scale,
    transform: [
      {
        rotateZ: '-45deg'
      }
    ]
  },
  resultPart: {
    flex: 1
  },
  resultText: {
    fontSize: 21,
    fontFamily: 'IRANSansMobileFaNum',
    marginVertical: 4,
    fontWeight: '200'
  },
  clearText: {
    fontSize: 18,
    fontWeight: '400'
  },
  startText: {
    textAlign: 'left'
  },
  endText: {
    textAlign: 'right'
  },
  week: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  weekText: {
    flex: 1,
    fontSize: weekTextFontSize,
    textAlign: 'center'
  },
  scroll: {
    flex: 9,
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  scrollArea: {
    flex: 1
  },
  btn: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmContainer: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    margin: 14,
    flex: 1,
    width: Dimensions.get('window').width / 2,
    borderRadius: 17,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmContainerDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)'
  },
  confirmText: {
    textAlign: 'center',
    fontFamily: 'IRANSansMobileFaNum',
    fontSize: 18,
  },
  confirmTextDisabled: {
    color: 'rgba(255, 255, 255, 0.40)',
    fontFamily: 'IRANSansMobileFaNum',
    fontSize: 18,
  },
  closeIcon: {
    width: iconSize,
    height: iconSize,
  }
});
