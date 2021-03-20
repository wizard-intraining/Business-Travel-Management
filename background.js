const noDirectList = [] // 无直达的车票
{
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      switch (request.id) {
        case 'saveNoDirect':
          noDirectList.push(request.data)
          break
        default:
          break
      }
    })
}