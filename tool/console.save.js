/**
 * 将控制台中的 js 对象保存为 json 文件
 * 使用示例：console.save(o, 'o.json')
 * @param {Object} data 包含可读属性的 object 
 * @param {String} filename 文件名
 */
console.save = function (data, filename) {
  if (typeof (data) != 'object') {
    console.error('data must be object')
    return
  }
  if (typeof (filename) != 'string' || filename.length == 0) {
    console.error('filename is invalid')
    return
  }
  const jsonString = JSON.stringify(data, undefined, 2)
  const a = document.createElement('a')
  a.download = filename
  a.href = window.URL.createObjectURL(
    new Blob([jsonString], { type: 'text/json' }))
  a.click()
}