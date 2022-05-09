function isHexColor(input) {
    var hexPattern = /#?([A-F]|[a-f]|\d){6}|#?([A-F]|[a-f]|\d){3}$/;
    return hexPattern.test(input)
}
module.exports = isHexColor