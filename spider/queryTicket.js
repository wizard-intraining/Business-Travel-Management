// 一些工具函数
const Rare = {
  stationDictionary: {
    "北京": "BJP",
    "南京": "NJH",
  },
  querying: false,
  from: '',
  to: '',
  trainDate: '',
  queryBeginTime: new Date(),
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
   * @param {String} trainDate 出发日 yyyy-mm-dd
   */
  queryTicket: function (from, to, trainDate) {
    // 请求实际使用的
    if (this.querying) {
      console.error('当前查询尚未完成，请勿再次调用')
      return
    }
    console.log('start query')
    this.querying = true
    this.from = from
    this.to = to
    this.trainDate = trainDate
    this.queryBeginTime = new Date()
    this.inputFill('fromStation', this.stationDictionary[from]) // 出发地
    this.inputFill('toStation', this.stationDictionary[to]) // 到达地
    // 界面展示的（不影响实际请求）
    this.inputFill('fromStationText', from)
    this.inputFill('toStationText', to)
    this.inputFill('train_date', trainDate) // 乘车日期
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
    console.log('parse result')
    const qlt = document.getElementById('queryLeftTable')
    const ticketCount = qlt.childElementCount / 2
    const trainList = []
    const loop = (i) => {
      if (i >= ticketCount) return
      const ticketRow = qlt.children[i * 2]
      const priceRow = qlt.children[i * 2 + 1]
      ticketRow.querySelector('div.train > span').click() // 显示票价
      new MutationObserver((mutationsList, observer) => {
        if (priceRow.style.display !== 'none') {
          observer.disconnect()
          const train = {
            no: ticketRow.querySelector('div.train > div > a').innerText,
            startStation: ticketRow.querySelector('div.cdz > strong:nth-child(1)').innerText,
            endStation: ticketRow.querySelector('div.cdz > strong:nth-child(2)').innerText,
            startTime: ticketRow.querySelector('div.cds > strong:nth-child(1)').innerText,
            // endTime: ticketRow.querySelector('div.cds > strong:nth-child(2)').innerText,
            duration: ticketRow.querySelector('div.ls > strong:nth-child(1)').innerText,
            price: Math.min.apply(Math, [
              priceRow.querySelector('td:nth-child(4)'), // 二等座
              priceRow.querySelector('td:nth-child(8)'), // 硬卧
            ].map((e) => e.innerText.length > 1 ?
              parseFloat(e.innerText.substring(1)) : Infinity)),
          }
          trainList.push(train)
          if (trainList.length >= ticketCount) {
            this.saveResult(trainList)
          } else {
            console.log('push')
            setTimeout(() => loop(i + 1), 5000)     // 请求票价太快会被限制
          }
        }
      }).observe(priceRow, { attributes: true })
    }
    loop(0)
  },
  /**
   * 搜索车票
   * @param {Array} trainList 车次信息数组
   */
  saveResult: function (trainList) {
    console.log('finish !!!')
    this.querying = false
    console.save({
      from: this.from,
      to: this.to,
      trainDate: this.trainDate,
      timestamp: this.queryBeginTime.getTime(),
      trainList: trainList
    }, '12306ticket.json')
  },
}

// 打开页面 https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc
// 设置始发站