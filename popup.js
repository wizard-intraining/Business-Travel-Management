document.getElementById('uploadStationLookup').onchange = (e) => {
  const reader = new FileReader()
  reader.onload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        id: e.target.id,
        data: reader.result,
      }, undefined)
    })
  }
  for (const file of e.target.files) {
    reader.readAsText(file)
  }
}