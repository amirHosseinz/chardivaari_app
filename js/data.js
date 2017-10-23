
export type Listing = {
  id: number,
  address: string,
  capacity: number,
  price: number,
};

export const productionURL = 'https://www.trypinn.com';
// export const productionURL = 'http://192.168.12.101:8000';
export const testURL = 'http://192.168.12.100:8000';

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
