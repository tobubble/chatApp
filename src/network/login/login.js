import request from '../request'

export function login(config) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username: config.username,
      password: config.password
    }
  })
}

export function register(config) {
  return request({
    url: '/register',
    method: 'post',
    data: {
      username: config.username,
      password: config.password,
      nick: config.nick,
    }
  })
}