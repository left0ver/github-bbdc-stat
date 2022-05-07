const express = require('express');
const { get } = require('axios');
const baseURL = require('../baseURL')
const COLORS = require('../theme')
const { Error404 } = require('../error_pages')
const bbdcRouter = express.Router();

function handleTheme(COLORS, theme) {
    // 没有主题或者主题不存在
    if (theme === undefined || COLORS[theme] === undefined) {
        return 'default'
    }
}

function render(theme, data) {
    return `
    <svg 
    version="1.1"
    baseProfile="full"
    width="382" height="210"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 382 210"
    >
 <rect width="364" height="192" fill="${COLORS[theme].BACKGROUND}"  rx="10" ry="10" transform="matrix(1, 0, 0, 1, 0, 0)"/>
 <text x="97"  y="44"  fill="${COLORS[theme].TITLE}" font-size="19" font-family="SegoeUI, Segoe UI">${data.nickname}'s  bbdc  Stats</text>
 <text x="10"  y="90"  fill="${COLORS[theme].TEXT}"  font-size="15" font-family="SegoeUI, Segoe UI">Learn num</text>
 <text x="19"  y="130" fill="${COLORS[theme].TEXT}"  font-size="13" font-family="SegoeUI, Segoe UI">${data.totalLearn} words</text>
 <text x="120" y="90"  fill="${COLORS[theme].TEXT}"  font-size="15" font-family="SegoeUI, Segoe UI">Review num</text>
 <text x="135" y="130" fill="${COLORS[theme].TEXT}"  font-size="13" font-family="SegoeUI, Segoe UI">${data.totalReview} words</text>
 <text x="235" y="90"  fill="${COLORS[theme].TEXT}"  font-size="15" font-family="SegoeUI, Segoe UI">Duration time</text>
 <text x="260" y="130" fill="${COLORS[theme].TEXT}"  font-size="13" font-family="SegoeUI, Segoe UI">${data.totalDuration} mins</text>
</svg>
`
}

bbdcRouter.get('/bbdc',async (req, res) => {
    const { userId, theme, nickname } = req.query
    // 如果没有userId，返回404
    if (userId === undefined) {
        return res.status(404).send(new Error404('没有userId').render())
    }
    let totalDuration = 0
    let totalLearn = 0
    let totalReview = 0
    const { data } = await get(`profile/search`, {
        baseURL,
        params: { userId }
    })
    // 不正确的userId
    if (data.result_code === 20000) {
        return res.status(404).send(new Error404('userId不正确').render())
    }
    const { learnList, durationList } = data.data_body
    for (let i = 0, len = learnList.length; i < len; i++) {
        totalDuration += durationList[i].duration
        totalLearn += learnList[i].learnNum
        totalReview += learnList[i].reviewNum
    }
    res.header("Content-Type", "image/svg+xml",)
    res.send(render(handleTheme(COLORS, theme), { totalDuration, totalLearn, totalReview, nickname: nickname === undefined ? 'leftover' : nickname }))
}) 
module.exports=bbdcRouter