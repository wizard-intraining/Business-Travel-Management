/**
 * 将 hh:mm 格式的时间转换为毫秒数
 * '10:24'.hmToMs()
 * @returns {Number} 毫秒数
 */
String.prototype.hmToMs = function () {
  const hour = parseInt(this)
  const minute = parseInt(this.substring(3))
  return (hour * 60 + minute) * 60 * 1000
}