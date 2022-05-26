import { addLocalStorage } from '@/store/store.js';

function receiveLocalStorage(response) {
    if (response.length) {
        addLocalStorage(response[0]);
    }
}

class LocalStorageReaderService {
    tabId = chrome.devtools.inspectedWindow.tabId;

    readLocalStorage() {
        //inject local storage reader javascript script
        chrome.tabs.executeScript(
            this.tabId,
            { file: "./js/LocalStorageReader.js" },
            receiveLocalStorage.bind(this)
        );
    }
}

export default new LocalStorageReaderService();