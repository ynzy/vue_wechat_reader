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

/**
 * 获取图书列表
 */
export function listBook({ ...params }) {
  return request({
    url: '/book/list',
    method: 'get',
    params
  })
}

/**
 * 删除图书
 * @param String fileName
 */
export function deleteBook({ ...params }) {
  return request({
    url: '/book/delete',
    method: 'get',
    params
  })
}
/**
 * 获取分类
 */
export function getCategory() {
  return request({
    url: '/book/category',
    method: 'get'
  })
}
