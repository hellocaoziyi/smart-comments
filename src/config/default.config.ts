const defaultConfig = {
    format: {
      startWith: '/**',
      middleWith: '*',
      endWith: '*/',
      headerPrefix: '@',
    },
    header: {
      'author': 'Your name',
      'createTime': {
        type: 'createTime',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      'modifiedBy': {
        type: 'modifier',
        value: 'Your name',
      },
      'modifiedTime': {
        type: 'modifyTime',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      'description': '',
    },
  };
  
  export default defaultConfig;