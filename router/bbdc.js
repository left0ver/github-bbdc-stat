const express = require('express');
const { get } = require('axios');
const cloneDeep = require('lodash.clonedeep')
const isHexColor = require('../utils/isHexColor')
const baseURL = require('../baseURL')
const COLORS = require('../theme')
const { Error400 } = require('../error_pages')
const bbdcRouter = express.Router();

function handleTheme(COLORS, theme) {
    // 没有主题或者主题不存在
    if (theme === undefined || COLORS[theme] === undefined) {
        return 'default'
    }
    return theme
}

function render(COLORS, theme, data) {
    function handleColorField(param, field) {
        if (data[param] !== undefined) {
            return isHexColor(data[param]) ? '#' + data[param] : data[param]
        }
        return COLORS[theme][field]
    }
    const renderColor = cloneDeep(COLORS)
    renderColor[theme].BORDER = data.hide_border === 'true' ? 0 : COLORS[theme].BORDER
    renderColor[theme].TITLE = handleColorField('title_color', 'TITLE')
    renderColor[theme].TEXT = handleColorField('text_color', 'TEXT')

    return `
<svg 
version="1.1"
baseProfile="full"
width="382" height="190"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 382 190"
transform="translate(8,6)"
>
<defs>
    <filter id="Card" x="0" y="0" width="382" height="190" filterUnits="userSpaceOnUse">
    <feOffset dy="3" input="SourceAlpha"/>
    <feGaussianBlur stdDeviation="3" result="blur"/>
    <feFlood flood-opacity="0.161"/>
    <feComposite operator="in" in2="blur"/>
    <feComposite in="SourceGraphic"/>
    </filter>
</defs>   
<g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Card)" stroke="${renderColor[theme].BORDER}">
<rect width="364" height="172" fill="${renderColor[theme].BACKGROUND}"  rx="10" ry="10"/>
</g>
 <text x="97"  y="44"  fill="${renderColor[theme].TITLE}" font-size="19" font-weight="600" font-family="SegoeUI, Segoe UI">${data.nickname}'s  bbdc  Stats</text>
 <text x="15"  y="115"  fill="${renderColor[theme].TEXT}"  font-size="15" font-weight="600" font-family="SegoeUI, Segoe UI">Today</text>
 <text x="15"  y="150"  fill="${renderColor[theme].TEXT}"  font-size="15" font-weight="600" font-family="SegoeUI, Segoe UI">Week</text>

 <text x="95"  y="80"  fill="${renderColor[theme].TEXT}"  font-size="15" font-weight="600" font-family="SegoeUI, Segoe UI">Learn</text>
 <text x="85"  y="115" fill="${renderColor[theme].TEXT}"  font-size="13" font-weight="600" font-family="SegoeUI, Segoe UI">${data.todayLearn} words</text>
 <text x="85"  y="150" fill="${renderColor[theme].TEXT}"  font-size="13" font-weight="600" font-family="SegoeUI, Segoe UI">${data.totalLearn} words</text>

 <text x="185" y="80"  fill="${renderColor[theme].TEXT}"  font-size="15" font-weight="600" font-family="SegoeUI, Segoe UI">Review</text>
 <text x="180" y="115" fill="${renderColor[theme].TEXT}"  font-size="13" font-weight="600" font-family="SegoeUI, Segoe UI">${data.todayReview} words</text>
 <text x="180" y="150" fill="${renderColor[theme].TEXT}"  font-size="13" font-weight="600" font-family="SegoeUI, Segoe UI">${data.totalReview} words</text>
 
 <text x="280" y="80"  fill="${renderColor[theme].TEXT}"  font-size="15" font-weight="600" font-family="SegoeUI, Segoe UI">Duration</text>
 <text x="285" y="115" fill="${renderColor[theme].TEXT}"  font-size="13" font-weight="600" font-family="SegoeUI, Segoe UI">${data.msg}</text>
 <text x="285" y="150" fill="${renderColor[theme].TEXT}"  font-size="13" font-weight="600" font-family="SegoeUI, Segoe UI">${data.totalDuration} mins</text>
</svg>
`
}

bbdcRouter.get('/bbdc', async (req, res) => {
    const { userId, theme, nickname, hide_border, title_color, text_color , msg } = req.query
    // 如果没有userId，返回404
    if (userId === undefined) {
        return res.status(400).send(new Error400('没有userId').render())
    }
    let totalDuration = 0
    let totalLearn = 0
    let totalReview = 0
    let todayLearn = 0
    let todayReview = 0
    const { data } = await get(`profile/search`, {
        baseURL,
        params: { userId }
    })
    // 不正确的userId
    if (data.result_code === 20000) {
        return res.status(400).send(new Error400('userId不正确').render())
    }
    const { learnList } = data.data_body
    let len = learnList.length
    totalDuration = data.data_body.total_duration_num //总时长//原时常计算方法大概率失效
    todayLearn = data.data_body.learnList[len-1]["learnNum"]
    todayReview = data.data_body.learnList[len-1]["reviewNum"]
    for (let i = 0; i < len; i++) {
        totalLearn += learnList[i].learnNum //近一周学习数
        totalReview += learnList[i].reviewNum //近一周复习数
    }
    res.header("Content-Type", "image/svg+xml",)
    res.send(render(COLORS, handleTheme(COLORS, theme), { msg : msg === undefined ? '(≧∇≦)ﾉ✧' : msg, todayLearn, todayReview, totalDuration, totalLearn, totalReview, nickname: nickname === undefined ? 'leftover' : nickname, hide_border, title_color, text_color }))
})
module.exports = bbdcRouter
