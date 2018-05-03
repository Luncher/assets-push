const path = require('path')

module.exports.app = {
  genders: {
    'male': '男',
    'female': '女'
  },
  platforms: {
    Android: '安卓',
    IOS: '苹果'
  },
  qiniu: {
    downloadDir: path.resolve(__dirname, '../tmp'),
    scope: 'newbee-weex',
    publicHost: '',
    AccessKey: '-',
    SecretKey: '-'
  },
  redirectUrls: {
    signin: '/signin',
    projects: '/projects'
  },
  patchStatisStatus: {
    BEGIN: 'BEGIN',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR'
  },
  isoChannel: 12,
  channelURL: 'https://ytxapp.baidao.com:21010/market/appId/com.sina.ggt',
  ERROR_CODES: {
    ERR_OK: 0,
    ERR_FAILURE: 8000,
    ERR_INVALID_LOGIN: 8001,
    ERR_INVALID_PASSWORD: 8002,
    ERR_SIGNUP: 8003,
    ERR_INVALID_ORIGIN_PASSWORD: 8004,
    ERR_PASSWORD_TOO_SHORT: 8005,
    ERR_NEED_LOGIN: 8006,
    ERR_USER_NOT_EXISTS: 8007,
    ERR_INVALID_PARAMS: 8008,
    ERR_PERMISSION_DENIED: 8009,
    ERR_NEED_PASSWORD: 8010,
    ERR_NOT_FOUND_APP_VERSION: 8011,
    ERR_INVALID_PATCH_VERSION: 8012,
    ERR_NOT_FOUND_VALID_PATCH: 8013,
    ERR_NOT_FOUND: 8014
  },
  ERROR_PAYLOADS: {
    0: {
      name: 'ERR_OK',
      message: '请求成功',
      status: 200
    },
    8000: {
      name: 'ERR_FAILURE',
      message: '请求失败',
      status: 200
    },
    8001: {
      name: 'ERR_INVALID_LOGIN',
      message: '无效的账号或密码',
      status: 400
    },
    8002: {
      name: 'ERR_INVALID_PASSWORD',      
      message: '密码错误',
      status: 400
    },
    8003: {
      name: 'ERR_SIGNUP',
      message: '注册失败',
      status: 401
    },
    8004: {
      name: 'ERR_INVALID_ORIGIN_PASSWORD',
      message: '原始密码错误',
      status: 400
    },
    8005: {
      name: 'ERR_PASSWORD_TOO_SHORT',
      message: '密码太短',
      status: 400, 
    },
    8006: {
      name: 'ERR_NEED_LOGIN',
      message: '需要登录才能继续操作',
      status: 403, 
    },
    8007: {
      name: 'ERR_USER_NOT_EXISTS',
      message: '用户不存在',
      status: 403, 
    },
    8008: {
      name: 'ERR_INVALID_PARAMS',
      message: '无效的参数',
      status: 400, 
    },
    8009: {
      name: 'ERR_PERMISSION_DENIED',
      message: '没有权限',
      status: 403, 
    },
    8010: {
      name: 'ERR_NEED_PASSWORD',
      message: '请输入当前密码',
      status: 400
    },
    8011: {
      name: 'ERR_NOT_FOUND_APP_VERSION',
      message: 'APP版本不存在',
      status: 400
    },
    8012: {
      name: 'ERR_INVALID_PATCH_VERSION',
      message: '无效的补丁版本',
      status: 400
    },
    8013: {
      name: 'ERR_NOT_FOUND_VALID_PATCH',
      message: '没有找到有效的补丁',
      status: 200
    },
    8014: {
      name: 'ERR_NOT_FOUND',
      message: '操作对象不存在',
      status: 404
    }
  }
}
