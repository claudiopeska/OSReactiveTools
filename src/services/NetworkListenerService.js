import { addResourceResponse } from '@/store/store.js';

const acceptRequestTypes = ["xhr"];
//regex to identify resource and action from request url
const requestUrlRegex = /(\w+\/\w+\/\w+)\/(\w+)$/g;

class NetworkListenerService {

    networkListenerBound = null;

    addNetworkListener() {
        this.networkListenerBound = this.networkListenerCallback.bind(this);
        chrome.devtools.network.onRequestFinished.addListener(
            this.networkListenerBound
        );
        chrome.devtools.inspectedWindow.reload();
    }

    removeNetworkListener() {
        chrome.devtools.network.onRequestFinished.removeListener(
            this.networkListenerBound
        );
        this.networkListenerBound = null;
    }

    networkListenerCallback(request) {
        if (acceptRequestTypes.indexOf(request._resourceType) >= 0) {
            //reset regex
            requestUrlRegex.lastIndex = 0;

            var regexResult = requestUrlRegex.exec(request.request.url);
            if (!regexResult || regexResult.length == 0) {
                return;
            }
            
            regexResult[1] = regexResult[1].replaceAll("/", ".");

            request.getContent((content) => {
                addResourceResponse({
                    resourceName: regexResult[1],
                    dataActionName: regexResult[2],
                    requestData: {
                        inputParameters: JSON.parse(request.request.postData.text).inputParameters,
                        variables: JSON.parse(request.request.postData.text).screenData?.variables,
                        response: JSON.parse(content).data,
                        contentLength: request.request.headers.find(header => header.name.toLowerCase() == "content-length")?.value
                    }
                });

                //this.$emit("resourceResponse", {
                //    resourceName: regexResult[1],
                //    dataActionName: regexResult[2],
                //    requestData: {
                //        inputParameters: JSON.parse(request.request.postData.text).inputParameters,
                //        variables: JSON.parse(request.request.postData.text).screenData?.variables,
                //        response: JSON.parse(content).data,
                //        contentLength: request.request.headers.find(header => header.name.toLowerCase() == "content-length")?.value
                //    }
                //});
            });
        }
    }

}

export default new NetworkListenerService();