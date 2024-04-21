const express = require('express')
const router = express.Router()
const infor_handler = require('../router_handler/userInfor')

// 获取合伙人时间表
router.get('/api/getListByPartner', infor_handler.getListByPartner)
// 合伙人和创业者今天是否预约过
router.get('/api/checkInterviewToday', infor_handler.checkInterviewToday)


// 获取可预约的列表
router.post('/api/getAppointmentList', infor_handler.getAppointmentList)

// 获取所有合伙人
router.get('/api/getAllPartner', infor_handler.getAllPartner)

// 更新合伙人的状态 
router.post('/api/updatePartnerStatus', infor_handler.updatePartnerStatus)

// 预约合伙人面试
router.post('/api/toHaveAppointment', infor_handler.toHaveAppointment)
 
// 向外共享路由对象
module.exports = router