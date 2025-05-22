document.getElementById('decodeInputButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['pako.min.js']
    }, () => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          function decodeHexGzip(update) {
            // debug string
            console.log("update: ", update);

            const hexToBytes = (hex) => {
              const bytes = [];
              for (let i = 0; i < hex.length; i += 2) {
                bytes.push(parseInt(hex.substr(i, 2), 16));
              }
              return new Uint8Array(bytes);
            };

            const decompressGzip = (data) => {
              const decompressed = pako.inflate(data);
              return new TextDecoder("utf-8").decode(decompressed);
            };


            // Check if the magig number 4834734941 is present
            // It is the first 4 bytes of the gzip header base64 encoded


            if (update.startsWith("0x")) {
              update = update.slice(2);
            }

            const functionSignature = update.slice(0, 8);
            const offset = parseInt(update.slice(8, 72), 16);
            const length = parseInt(update.slice(72, 136), 16);
            const dataHex = update.slice(136, 136 + length * 2);
            
            const magicNumber = "4834734941";
            if (!dataHex.startsWith(magicNumber)) {
                console.log("Not a gzip update");
                return update;
            }

            console.log(dataHex);

            const b64EncodedData = hexToBytes(dataHex);
            console.log(b64EncodedData);

            // Convert Uint8Array to a binary string for atob
            const binaryString = Array.from(b64EncodedData)
              .map((byte) => String.fromCharCode(byte))
              .join('');
            console.log("binaryString: ", binaryString);
            const decodedData = atob(binaryString);

            // Convert the decoded string back to Uint8Array
            const decodedBytes = new Uint8Array(
              Array.from(decodedData).map((char) => char.charCodeAt(0))
            );

            console.log("decodedBytes: ", decodedBytes);

            const decompressedData = decompressGzip(decodedBytes);

            return decompressedData;
          }

          const textarea = document.querySelector('textarea');
          if (textarea) {
            const decodedValue = decodeHexGzip(textarea.value);
            textarea.value = decodedValue;
          } else {
            console.log('No textarea found on the page.');
          }
        }
      });
    });
  });
});

document.getElementById('decodeFunctionNamesButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      world: 'MAIN',
    func: () => {
        console.log("Change function name decoder...");
        const replacements = new Map([
            ['0xa76e7648', 'GenericExec'], // asakusaTemple
            ['0x9f7a7126', 'CheckCookie'], // tokioSkytree
            ['0xa98b06d3', 'iFrameCreate'], // ginzaLuxury
            ['0x1ba79aa2', 'UAOS'], // shibuyaCrossing
            ['0x416f2896', 'UABrowser'], // akihabaraLights
            ['0x167d1c4b', 'AESKey'],
            ['0x4128180a', 'StoreUrls'],
            ['0xda4c3e46', 'State'],
            ['0x67685e3e', 'ClickFixCmd'],
            ['0x4128180a', 'ClickFixHTMLEnc']
            
          ]);
          
          // Assume TextHighlight.contentMap exists and is a Map
          document.querySelectorAll('span').forEach(span => {
            const text = span.textContent.trim();
          
            if (replacements.has(text)) {
                
              const newValue = replacements.get(text);
          
              // Replace span content and data-title
              span.textContent = newValue;
              span.setAttribute('data-title', newValue);
          
              // Update TextHighlight.contentMap key if it exists
              if (TextHighlight.contentMap.hasOwnProperty(text)) {
                const value = TextHighlight.contentMap[text];
                TextHighlight.contentMap[newValue.toLowerCase()] = value;
              }
            }
          });
    }  
    });
  });
});
