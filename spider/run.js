{
  // content_script 订阅 popup_script 发出的消息
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      switch (request.id) {
        case 'uploadStationLookup':
          console.log(request.data)
          break
        default:
          break
      }
    })
  window.onload = () => {

  }
  // 获取所有车站的名称与代码
  const fetchAllStation = () => {
    const stationDictionary = {}
    query12306.initPage()
    new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type == 'attributes' &&
          mutation.target.style.display == 'block') {
          observer.disconnect()
          parseCapList()
          return
        }
      }
    }).observe(
      document.querySelector('#form_cities2'),
      { attributes: true })
    // 分析城市列表
    const parseCapList = () => {
      const capList = document.querySelector('#abc').children
      const loop = (i) => {
        const ul = document.querySelector(`#ul_list${i + 1}`)
        new MutationObserver((mutationsList, observer) => {
          for (const pcl of ul.children) {
            for (const li of pcl.children) {
              if (li.getAttribute('title') == li.innerText)
                stationDictionary[li.getAttribute('title')] =
                  li.getAttribute('data')
            }
          }
          const nextPageDiv = document.querySelector('#flip_cities2')
          if (nextPageDiv.childElementCount == 1 &&
            nextPageDiv.children[0].innerText.endsWith('上一页')) {
            observer.disconnect()
            if (i + 1 < capList.length)
              setTimeout(() => { loop(i + 1) }, 1000)
            else
              console.save(stationDictionary, 'stationDictionary.json')
          } else {
            const nextPageA = nextPageDiv.children[nextPageDiv.childElementCount - 1]
            setTimeout(() => { nextPageA.click() }, 500)
          }
        }).observe(ul, { childList: true })
        capList[i].click()
      }
      loop(1) // 跳过第一个【热门城市】的标签
    }
    console.log('click the fromStationText input!')
  }
}