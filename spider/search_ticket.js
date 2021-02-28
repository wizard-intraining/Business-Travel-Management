// 一些工具函数
const Rare = {
  stationDictionary: {
    "北京": {
      "stationName": "北京",
      "stationCode": "BJP"
    },
    "南京": {
      "stationName": "南京",
      "stationCode": "NJH"
    }
  },
  /**
   * 点击指定的元素
   * @param {String} id Element id
   */
  elementClick: function (id) {
    const e = document.getElementById(id)
    if (e instanceof HTMLElement) e.click()
  },
  /**
   * 填写指定输入框
   * @param {String} id Element id
   * @param {String} value 要填写的内容
   */
  inputFill: function (id, value) {
    const input = document.getElementById(id)
    if (input instanceof HTMLInputElement) input.value = value
  },
  /**
   * 打开 12306 页面执行的操作
   */
  initPage: function () {
    this.elementClick('qd_closeDefaultWarningWindowDialog_id') // 关闭温馨提示
    this.elementClick('avail_ticket') // 显示全部可预订车次
    document.getElementById('train_date').removeAttribute('readonly') // 移除出发日只能选不能填的限制
  },
  /**
   * 搜索车票
   * @param {String} from 始发地名称
   * @param {String} to 目的地名称
   * @param {String} date 出发日 yyyy-mm-dd
   */
  searchTicket: function (from, to, date) {
    // 请求实际使用的
    this.inputFill('fromStation', this.stationDictionary[from].stationCode) // 出发地
    this.inputFill('toStation', this.stationDictionary[to].stationCode) // 到达地
    // 界面展示的（不影响实际请求）
    this.inputFill('fromStationText', this.stationDictionary[from].stationName)
    this.inputFill('toStationText', this.stationDictionary[to].stationName)
    this.inputFill('train_date', date) // 乘车日期
    this.elementClick('query_ticket') // 点击查询
    const cover = document.querySelector("body > div.dhx_modal_cover")
    const check = setInterval(() => {
      if (cover.style.display === 'none') {
        clearInterval(check)
        this.parseResult()
      }
    }, 200)
  },
  /**
   * 解析页面中的车票信息
   */
  parseResult: function () {
    const qlt = document.getElementById('queryLeftTable')
    const ticketCount = qlt.childElementCount / 2
    const trainList = []
    const loop = (i) => {
      if (i >= ticketCount) return
      const ticketRow = qlt.children[i * 2]
      const priceRow = qlt.children[i * 2 + 1]
      const train = {
        no: ticketRow.querySelector('div.train > div > a').innerText,
        startStation: ticketRow.querySelector('div.cdz > strong:nth-child(1)').innerText,
        endStation: ticketRow.querySelector('div.cdz > strong:nth-child(2)').innerText,
        startTime: ticketRow.querySelector('div.cds > strong:nth-child(1)').innerText,
        endTime: ticketRow.querySelector('div.cds > strong:nth-child(2)').innerText,
      }
      ticketRow.querySelector('div.train > span').click() // 显示票价
      new MutationObserver((mutationsList, observer) => {
        if (priceRow.style.display !== 'none') {
          observer.disconnect()
          train.price =
            Math.max(Array.from(priceRow.getElementsByClassName('p-num'))
              .map((e) => e.innerText.length > 1 ?
                parseFloat(e.innerText.substring(1)) : 0))
          trainList.push(train)
          if (trainList.length >= ticketCount) {
            console.log('finish !!!')
            // TODO: 把 trainList 保存为 json
          } else {
            console.log('push')
            // 请求票价太快会被限制
            setTimeout(() => loop(i + 1), 10000);
          }
        }
      }).observe(priceRow, { attributes: true })
    }
    loop(0)
  }
}

// 打开页面 https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc
// 设置始发站