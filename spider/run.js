{
  // content_script 订阅 popup_script 发出的消息
  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      switch (request.id) {
        case 'uploadStationLookup':
          fetchTicket(JSON.parse(request.data),
            request.startI, request.startJ, request.trainDate)
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
  // 查询所有站点之间的车票
  const fetchTicket = (locationDic, startI, startJ, trainDate) => {
    const keys = Object.keys(locationDic)
    let [i, j] = [startI, startJ] // 遍历起始位置
    let r = false // 是否调换起始位置
    const oldSaveAction = query12306.saveResult
    query12306.saveResult = function (trainList) {
      this.querying = false
      console.log(`${this.from} 至 ${this.to} 完成查询`)
      if (trainList.length > 0) {
        console.save({
          from: this.from,
          to: this.to,
          trainDate: this.trainDate,
          timestamp: this.queryBeginTime.getTime(),
          trainList: trainList
        }, `${this.from}_${this.to}_ticket.json`)
      } else {
        chrome.runtime.sendMessage({
          id: 'saveNoDirect',
          data: {
            from: this.from,
            to: this.to,
          },
        })
      }
      // 尝试查询下两个站点间的
      let nextFrom, nextTo
      r = !r
      if (r) {
        [nextFrom, nextTo] =
          [locationDic[keys[j]], locationDic[keys[i]]]
      } else {
        j += 1
        if (j >= keys.length) {
          i += 1
          j = i + 1
          if (j >= keys.length) {
            console.log('已尝试下载所有车票')
            query12306.saveResult = oldSaveAction
            return
          }
        }
        [nextFrom, nextTo] =
          [locationDic[keys[i]], locationDic[keys[j]]]
      }
      setTimeout(() => {
        query12306.queryTicket(nextFrom, nextTo, trainDate)
      }, 5000)
    }
    // 启动查询
    query12306.initPage()
    query12306.queryTicket(
      locationDic[keys[i]],
      locationDic[keys[j]],
      trainDate)
  }
}