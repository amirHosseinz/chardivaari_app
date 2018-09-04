import React, {Component} from 'react';
import {
  Dimensions,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Splash from './Splash';
import Login from './Login';
import LoginVerify from './LoginVerify';
import LoginGetName from './LoginGetName';
import HostScreen from './HostScreen';
import GuestScreen from './GuestScreen';
// import AddListing from './AddListing';
import RequestStatus from './RequestStatus';
import RequestBookScreen from './RequestBookScreen';
import ConversationScreen from './ConversationScreen';
// import EditHouse from './EditHouse';
import ReserveStatusScreen from './ReserveStatusScreen';
import TripStatusScreen from './TripStatusScreen';
import HouseDetail from './HouseDetail';
import EcotourismDetail from './EcotourismDetail';
import Wallet from './Wallet';
import Transactions from './Transactions';
import InviteFriend from './InviteFriend';
import PaymentPopup from './PaymentPopup';

const Routes = ({
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
  // searchResults: {
  //   screen: SearchResultsTabView,
  //   navigationOptions: {
  //     title: 'نتایج جست‌جو',
  //     // headerLeft: <Icon size={30} color={'#ff0000'} name={'chevron-left'} style={{marginLeft: 20}}/>,
  //     headerTintColor: "#000000",
  //     headerTitleStyle: {
  //       alignSelf: 'flex-end',
  //       // color: '#ff0000',
  //     },
  //     headerStyle: {
  //       alignContent: 'center',
  //       backgroundColor: '#F8F8F8',
  //       justifyContent: 'center',
  //       height: 70,
  //       shadowColor: '#000',
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.2,
  //     }
  //   }
  // },
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
  conversationScreen: {
    screen: ConversationScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  paymentdialog:{
    screen: PaymentPopup,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  requestStatus: {
    screen: RequestStatus,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
  requestBookScreen: {
    screen: RequestBookScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
  reserveStatusScreen: {
    screen: ReserveStatusScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    }
  },
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
      header: null
    }
  },
  ecotourismDetail: {
    screen: EcotourismDetail,
    navigationOptions: {
      header: null
      // headerStyle: {
      //   position: 'absolute',
      //   backgroundColor: 'transparent',
      //   zIndex: 100,
      //   top: 0,
      //   left: 0,
      //   right: 0
      // }
    }
  },
  wallet: {
    screen: Wallet,
    navigationOptions: {
      header: null
    }
  },
  transactions: {
    screen: Transactions,
    navigationOptions: {
      header: null
    }
  },
  inviteFriend: {
    screen: InviteFriend,
    navigationOptions: {
      header: null
    }
  },
});

export default Routes;
