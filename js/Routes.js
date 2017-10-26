import React, {Component} from 'react';
import {
  Dimensions,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MainScreen from './MainScreen';
// import LoginSignupTabView from './LoginSignupTabView';
import Splash from './Splash';
import Login from './Login';
import SearchRoom from './SearchRoom';
// import VerificationScreen from './LoginVerificationScreen';
import LoginVerify from './LoginVerify';
import LoginGetName from './LoginGetName';
import SearchResultsTabView from './SearchResultsTabView';
import RoomView from './RoomView';
import HostScreen from './HostScreen';
import GuestScreen from './GuestScreen';

// import AddListing from './AddListing';
// import AddListingSecondStep from './AddListingSecondStep';
// import AddListingThirdStep from './AddListingThirdStep';
// import AddListingForthStep from './AddListingForthStep';
// import AddListingFifthStep from './AddListingFifthStep';
// import AddListingSixthStep from './AddListingSixthStep';
// import AddListingSeventhStep from './AddListingSeventhStep';
// import AddListingEighthStep from './AddListingEighthStep';
// import AddListingNinthStep from './AddListingNinthStep';
// import AddListingTenthStep from './AddListingTenthStep';
// import AddListingEleventhStep from './AddListingEleventhStep';
// import AddListingTwelvethStep from './AddListingTwelvethStep';
// import AddListingThirteenthStep from './AddListingThirteenthStep';
// import AddListingFourteenthStep from './AddListingFourteenthStep';
// import AddListingFifteenthStep from './AddListingFifteenthStep';

// import RequestScreen from './RequestScreen';
import RequestStatus from './RequestStatus';
import RequestBook from './RequestBook';
import RequestBookScreen from './RequestBookScreen';

import ConversationScreen from './ConversationScreen';
// import EditListingScreen from './EditListingScreen';
import EditHouse from './EditHouse';
// import BookedRequestScreen from './BookedRequestScreen';
import ReserveStatusScreen from './ReserveStatusScreen';
// import TripDetailScreen from './TripDetailScreen';
import TripStatusScreen from './TripStatusScreen';

import HouseDetail from './HouseDetail';

const Routes = ({
  // loginSignupTabView: {
  //   screen: LoginSignupTabView,
  //   navigationOptions: {
  //     header: null,
  //     gesturesEnabled: false,
  //   },
  // },
  splash: {
    screen: Splash,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  login: {
    screen: Login,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  loginGetName: {
    screen: LoginGetName,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  loginVerify: {
    screen: LoginVerify,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
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
  // verification: {
  //   screen: VerificationScreen,
  //   navigationOptions: {
  //     title: 'تایید عضویت',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
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
      // headerLeft: <Icon size={30} color={'#ff0000'} name={'chevron-left'} style={{marginLeft: 20}}/>,
      headerTintColor: "#000000",
      headerTitleStyle: {
        alignSelf: 'flex-end',
        // color: '#ff0000',
      },
      headerStyle: {
        alignContent: 'center',
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
      header: null,
      gesturesEnabled: false,
    }
  },
  guestScreen: {
    screen: GuestScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  // addListing: {
  //   screen: AddListing,
  //   navigationOptions: {
  //     title: 'افزودن خانه',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingSecondStep: {
  //   screen: AddListingSecondStep,
  //   navigationOptions: {
  //     title: 'امکانات خانه',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingThirdStep: {
  //   screen: AddListingThirdStep,
  //   navigationOptions: {
  //     title: 'امکانات خانه-ادامه',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingForthStep: {
  //   screen: AddListingForthStep,
  //   navigationOptions: {
  //     title: 'آدرس',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingFifthStep: {
  //   screen: AddListingFifthStep,
  //   navigationOptions: {
  //     title: 'امکانات',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingSixthStep: {
  //   screen: AddListingSixthStep,
  //   navigationOptions: {
  //     title: 'فضاها',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingSeventhStep: {
  //   screen: AddListingSeventhStep,
  //   navigationOptions: {
  //     title: 'قوانین خانه',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingEighthStep: {
  //   screen: AddListingEighthStep,
  //   navigationOptions: {
  //     title: 'افزودن عکس',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingNinthStep: {
  //   screen: AddListingNinthStep,
  //   navigationOptions: {
  //     title: 'انتخاب عنوان',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingTenthStep: {
  //   screen: AddListingTenthStep,
  //   navigationOptions: {
  //     title: 'توضیحات',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingEleventhStep: {
  //   screen: AddListingEleventhStep,
  //   navigationOptions: {
  //     title: 'زمانبندی',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingTwelvethStep: {
  //   screen: AddListingTwelvethStep,
  //   navigationOptions: {
  //     title: 'روزهای خارج از دسترس',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingThirteenthStep: {
  //   screen: AddListingThirteenthStep,
  //   navigationOptions: {
  //     title: 'قیمت روزانه',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingFourteenthStep: {
  //   screen: AddListingFourteenthStep,
  //   navigationOptions: {
  //     title: 'تخفیفات',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  // addListingFifteenthStep: {
  //   screen: AddListingFifteenthStep,
  //   navigationOptions: {
  //     title: 'اتمام',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  conversationScreen: {
    screen: ConversationScreen,
  },
  // requestScreen: {
  //   screen: RequestScreen,
  //   navigationOptions: {
  //     title: 'درخواست',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  requestStatus: {
    screen: RequestStatus,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
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
  requestBookScreen: {
    screen: RequestBookScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  // editListingScreen: {
  //   screen: EditListingScreen,
  //   navigationOptions: {
  //     title: 'ویرایش اطلاعات خانه',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  editHouse: {
    screen: EditHouse,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  // bookedRequestScreen: {
  //   screen: BookedRequestScreen,
  //   navigationOptions: {
  //     title: 'رزرو نهایی',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  reserveStatusScreen: {
    screen: ReserveStatusScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  // tripDetailScreen: {
  //   screen: TripDetailScreen,
  //   navigationOptions: {
  //     title: 'سفر نهایی',
  //     headerTintColor: "#000000",
  //     headerStyle: {
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
  tripStatusScreen: {
    screen: TripStatusScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  houseDetail: {
    screen: HouseDetail,
    navigationOptions: {
      headerStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0
      }
    }
  },
  houseDetailFromChat: {
    screen: HouseDetail,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
});

export default Routes;
