import MainScreen from './MainScreen';
import LoginSignupTabView from './LoginSignupTabView';
import SearchRoom from './SearchRoom';
import VerificationScreen from './LoginVerificationScreen';
import SearchResultsTabView from './SearchResultsTabView';
import RoomView from './RoomView';
import HostScreen from './HostScreen';
import GuestScreen from './GuestScreen';

import AddListing from './AddListing';
import AddListingSecondStep from './AddListingSecondStep';
import AddListingThirdStep from './AddListingThirdStep';
import AddListingForthStep from './AddListingForthStep';
import AddListingFifthStep from './AddListingFifthStep';
import AddListingSixthStep from './AddListingSixthStep';
import AddListingSeventhStep from './AddListingSeventhStep';
import AddListingEighthStep from './AddListingEighthStep';
import AddListingNinthStep from './AddListingNinthStep';
import AddListingTenthStep from './AddListingTenthStep';
import AddListingEleventhStep from './AddListingEleventhStep';
import AddListingTwelvethStep from './AddListingTwelvethStep';
import AddListingThirteenthStep from './AddListingThirteenthStep';
import AddListingFourteenthStep from './AddListingFourteenthStep';
import AddListingFifteenthStep from './AddListingFifteenthStep';

import RequestScreen from './RequestScreen';
import RequestBook from './RequestBook';

import ConversationScreen from './ConversationScreen';

const Routes = ({
  loginSignupTabView: {
    screen: LoginSignupTabView,
    navigationOptions: {
      title: "ورود",
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  main: {
    screen: MainScreen,
    navigationOptions: {
      title: 'نقش',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  verification: {
    screen: VerificationScreen,
    navigationOptions: {
      title: 'تایید عضویت',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  searchRoom: {
    screen: SearchRoom,
    navigationOptions: {
      title: 'جستجوی خانه',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  searchResults: {
    screen: SearchResultsTabView,
    navigationOptions: {
      title: 'نتایج جست‌جو',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  roomView: {
    screen: RoomView,
    navigationOptions: {
      title: 'اطلاعات خانه',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  hostScreen: {
    screen: HostScreen,
    navigationOptions: {
      title: 'میزبان',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  guestScreen: {
    screen: GuestScreen,
    navigationOptions: {
      title: 'مهمان',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListing: {
    screen: AddListing,
    navigationOptions: {
      title: 'افزودن خانه',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingSecondStep: {
    screen: AddListingSecondStep,
    navigationOptions: {
      title: 'امکانات خانه',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingThirdStep: {
    screen: AddListingThirdStep,
    navigationOptions: {
      title: 'امکانات خانه-ادامه',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingForthStep: {
    screen: AddListingForthStep,
    navigationOptions: {
      title: 'آدرس',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingFifthStep: {
    screen: AddListingFifthStep,
    navigationOptions: {
      title: 'امکانات',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingSixthStep: {
    screen: AddListingSixthStep,
    navigationOptions: {
      title: 'فضاها',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingSeventhStep: {
    screen: AddListingSeventhStep,
    navigationOptions: {
      title: 'قوانین خانه',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingEighthStep: {
    screen: AddListingEighthStep,
    navigationOptions: {
      title: 'افزودن عکس',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingNinthStep: {
    screen: AddListingNinthStep,
    navigationOptions: {
      title: 'انتخاب عنوان',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingTenthStep: {
    screen: AddListingTenthStep,
    navigationOptions: {
      title: 'توضیحات',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingEleventhStep: {
    screen: AddListingEleventhStep,
    navigationOptions: {
      title: 'زمانبندی',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingTwelvethStep: {
    screen: AddListingTwelvethStep,
    navigationOptions: {
      title: 'روزهای خارج از دسترس',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingThirteenthStep: {
    screen: AddListingThirteenthStep,
    navigationOptions: {
      title: 'قیمت روزانه',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingFourteenthStep: {
    screen: AddListingFourteenthStep,
    navigationOptions: {
      title: 'تخفیفات',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  addListingFifteenthStep: {
    screen: AddListingFifteenthStep,
    navigationOptions: {
      title: 'اتمام',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  conversationScreen: {
    screen: ConversationScreen,
    navigationOptions: {
      title: 'مکالمه',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  requestScreen: {
    screen: RequestScreen,
    navigationOptions: {
      title: 'درخواست',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
  requestBook: {
    screen: RequestBook,
    navigationOptions: {
      title: 'درخواست رزرو',
      headerTintColor: "#000000",
      headerStyle: {
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
      }
    }
  },
});

export default Routes;
