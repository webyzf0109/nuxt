import request from "../plugins/api";
const preUrl = "/ocs_cmcc_promotion";

//获取验证码
export function loadConfig(query) {
  return request({
    url: preUrl + "/cmcc270/api/v/loadConfig",
    method: "get",
    params: query
  });
}

//获取轮播图数据
export function findListSwagger(query) {
  return request({
    url: preUrl + "/cmccAssist/findListSwagger",
    method: "get",
    params: query
  });
}

//选号
export function numberSelectLock(query) {
  return request({
    url: preUrl + "/cmcc270/api/v/numberSelectLock",
    method: "post",
    data: query
  });
}

//锁号
export function lockNumber(query) {
  return request({
    url: preUrl + "/cmcc270/api/v/lockNumber",
    method: "post",
    data: query
  });
}

//获取套餐说明
export function getCmccConfigRemark(query) {
  return request({
    url: preUrl + "/cmcc270/api/v/getCmccConfigRemark",
    method: "post",
    params: query
  });
}

//发送短信
export function sendSMS(query) {
  return request({
    url: preUrl + "/cmcc270/api/v/sendSMS",
    method: "post",
    params: query
  });
}

//下单
export function tradeOrder(query) {
  return request({
    url: preUrl + "/cmcc270/api/v/tradeOrder",
    method: "post",
    params: query
  });
}
