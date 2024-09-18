document.getElementById('translateBtn').addEventListener('click', async function () {
  // Obtenha o texto selecionado da aba ativa
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: getSelectedText
    },
    async (result) => {
      if (result[0].result) {
        const translatedText = await translateText(result[0].result);
        document.getElementById('translatedText').textContent = translatedText;
      } else {
        document.getElementById('translatedText').textContent = "No text selected.";
      }
    }
  );
});

function getSelectedText() {
  return window.getSelection().toString();
}

async function translateText(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0][0][0]; // Retorna o texto traduzido
}
