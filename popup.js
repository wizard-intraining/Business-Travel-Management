document.getElementById('executeQueryButton').onclick = (e) => {
  const startI = parseInt(document.getElementById('startI').value)
  const startJ = parseInt(document.getElementById('startJ').value)
  const trainDate = document.getElementById('trainDate').value
  const fileInput = document.getElementById('uploadStationLookup')
  if (isNaN(startI) || isNaN(startJ)) {
    alert('需要指定遍历开始位置')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        id: fileInput.id,
        data: reader.result,
        startI: startI,
        startJ: startJ,
        trainDate: trainDate,
      }, undefined)
    })
  }
  for (const file of fileInput.files) {
    reader.readAsText(file)
  }
}