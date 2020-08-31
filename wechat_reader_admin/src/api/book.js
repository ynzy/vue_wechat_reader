import request from '@/utils/request'

/**
 * 创建图书
 */
export function createBook({ ...data }) {
  return request({
    url: '/book/create',
    method: 'post',
    data
  })
}
/**
 * 编辑图书
 */
export function updateBook({ ...data }) {
  return request({
    url: '/book/update',
    method: 'post',
    data
  })
}

/**
 * 获取图书详情
 */
export function getBook({ ...params }) {
  return request({
    url: '/book/get',
    method: 'get',
    params
  })
}