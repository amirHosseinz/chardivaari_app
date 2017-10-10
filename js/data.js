
export type Listing = {
  id: number,
  address: string,
  capacity: number,
  price: number,
};

export const users = [
  {
    'firstName': 'آق',
    'lastName': 'غلام',
    'profilePictureUri': 'https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg',
  },
];

export const unreadMessagesCount = 3;

export const productionURL = 'https://www.trypinn.com';
// export const productionURL = 'http://192.168.12.102:8000';
export const testURL = 'http://192.168.12.100:8000';

export const messageListData = [
  {
    'message': {
      id: 0,
      'title': 'اجاره‌ی موقت خانه',
      'status': 'read',
      'partyName': 'علی احمدی',
    },
  },
  {
    'message': {
      id: 1,
      'title': 'اجاره‌ی بلند مدت خانه',
      'status': 'unread',
      'partyName': 'علی محسن',
    },
  },
  {
    'message': {
      id: 2,
      'title': 'چه خبر؟',
      'status': 'read',
      'partyName': 'داوود احمدی',
    },
  },
  {
    'message': {
      id: 3,
      'title': 'اجاره‌ی موقت خانه',
      'status': 'read',
      'partyName': 'علی احمدی',
    },
  },
  {
    'message': {
      id: 4,
      'title': 'اجاره‌ی موقت خانه',
      'status': 'read',
      'partyName': 'علی احمدیز',
    },
  },
];

export const guestProfileRowsData = [
  {
    'data': {
      'text': 'تغییر به وجه میزبان',
      'action': 'hostScreen',
      'icon': {
        'name': 'swap-calls',
        'color': 'black',
        'size': 30,
      },
    },
  },
  {
    'data': {
      'text': 'ثبت اقامت‌گاه',
      'action': 'addListing',
      'icon': {
        'name': 'home',
        'color': 'black',
        'size': 30,
      },
    },
  },
  {
    'data': {
      'text': 'تنظیمات',
      'action': 'settings',
      'icon': {
        'name': 'settings',
        'color': 'black',
        'size': 30,
      },
    },
  },
  {
    'data': {
      'text': 'تماس با ما',
      'action': 'call-us',
      'icon': {
        'name': 'call',
        'color': 'black',
        'size': 30,
      },
    },
  },
  {
    'data': {
      'text': 'خروج',
      'action': 'logout',
      'icon': {
        'name': 'zoom-out-map',
        'color': 'black',
        'size': 30,
      },
    },
  },
];

export const hostProfileRowsData = [
  {
    'data': {
      'text': 'تغییر به وجه مهمان',
      'action': 'guestScreen',
      'icon': {
        'name': 'swap-calls',
        'color': 'black',
        'size': 30,
      },
    },
  },
  {
    'data': {
      'text': 'ثبت اقامت‌گاه',
      'action': 'addListing',
      'icon': {
        'name': 'home',
        'color': 'black',
        'size': 30,
      },
    },
  },
  {
    'data': {
      'text': 'تنظیمات',
      'action': 'settings',
      'icon': {
        'name': 'settings',
        'color': 'black',
        'size': 30,
      },
    },
  },
  {
    'data': {
      'text': 'تماس با ما',
      'action': 'call-us',
      'icon': {
        'name': 'call',
        'color': 'black',
        'size': 30,
      },
    },
  },
  {
    'data': {
      'text': 'خروج',
      'action': 'logout',
      'icon': {
        'name': 'zoom-out-map',
        'color': 'black',
        'size': 30,
      },
    },
  },
];

export const resultsToShow = [
  {
    'id': 1,
    'title': 'My lovely Room and great balcony and to test more on scrollability!',
    'address': 'طهران',
    'district': 'طرشت',
    'capacity': 3,
    'bedRooms': 2,
    'toilets': 1.5,
    'rooms': 2,
    'rating': 4.5,
    'checkIn': '2:00 PM',
    'checkOut': '12:00 PM',
    'price': 45000,
    'latitude': 35.74,
    'longitude': 51.404343,
    'description': 'خواندن کی بود مانند رزرو کردن؟',
    'preview': 'http://www.quotezone.co.uk/assets/images/showcase/product-home.png',
  },
  {
    'id': 2,
    'title': 'My lovely Room',
    'address': 'کرج',
    'capacity': 5,
    'bedRooms': 2,
    'toilets': 2,
    'rooms': 2,
    'rating': 2,
    'checkIn': '2:00 PM',
    'checkOut': '12:00 PM',
    'district': 'جهان‌شهر',
    'price': 150000,
    'latitude': 35.2,
    'longitude': 51.304343,
    'description': 'این خانه بسیار خانه‌ی خوبی است.',
    'preview': 'http://www.quotezone.co.uk/assets/images/showcase/product-home.png',
  },
  {
    'id': 3,
    'title': 'My lovely Room',
    'address': 'تهران',
    'district': 'شهرک غرب',
    'capacity': 7,
    'bedRooms': 2,
    'toilets': 1,
    'rooms': 2,
    'rating': 3,
    'checkIn': '2:00 PM',
    'checkOut': '12:00 PM',
    'price': 20000,
    'latitude': 35.6,
    'longitude': 51.454343,
    'description': 'توضیحات در باب این خانه در کلام نمی‌گنجد.',
    'preview': 'http://www.quotezone.co.uk/assets/images/showcase/product-home.png',
  }
];
