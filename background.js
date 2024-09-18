chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate",
    title: "Translate Selected Text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translate") {
    const selectedText = info.selectionText;
    const translatedText = await translateText(selectedText);
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => alert(text),
      args: [translatedText]
    });
  }
});

async function translateText(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0][0][0];
}
