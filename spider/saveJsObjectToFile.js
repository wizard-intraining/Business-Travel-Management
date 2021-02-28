/**
 * 将控制台中的 js 对象保存为 json 文件
 * 使用示例：console.save(o, 'o.json')
 * @param {Object} data 包含可读属性的 object 
 * @param {String} filename 文件名
 */
console.save = function (data, filename) {
  if (!data) {
    console.error('Console.save: No data')
    return;
  }
  if (!filename) filename = 'console.json'
  if (typeof data === "object") {
    data = JSON.stringify(data, undefined, 2)
  }
  var blob = new Blob([data], { type: 'text/json' }),
    e = document.createEvent('MouseEvents'),
    a = document.createElement('a')
  a.download = filename
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  a.dispatchEvent(e)
}