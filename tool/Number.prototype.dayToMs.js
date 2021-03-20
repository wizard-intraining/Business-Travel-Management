/**
 * 将天数转换为毫秒数
 * 标识符自动装箱 n.dayToMs()
 * 字面量需要手动装箱 Number(1).dayToMs()
 * @returns {Number} 毫秒数
 */
Number.prototype.dayToMs = function () {
  return this * 24 * 60 * 60 * 1000
}