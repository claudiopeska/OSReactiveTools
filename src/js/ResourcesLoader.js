//processCallback will be called when resources finishes processing
export var ResourcesLoader = function (processCallback) {

    //resource regex to identify files
    const resourceRegex = /(\w+(?:\.\w+){2})\.mvc.js/g;

    //new line regex to split resource files
    const newLineRegex = /\r\n|\r|\n/g;

    //identify if resource is screen or webblock
    const resourceTypeRegex = /OSView\.BaseView\.Base(\w+)/g;

    //actions regex to identify exposed actions
    const dataActionRegex = /controller\.callDataAction\("DataAction(\w+)"/g;
    const aggrActionRegex = /controller\.callAggregateWithStartIndexAndClientVars\("ScreenDataSet(\w+)/g;

    //const actionReturnRegex = /function \(json\)/g;

    const fetchsRegex = [
        {
            regexExp: dataActionRegex,
            type: "DataAction"
        },
        {
            regexExp: aggrActionRegex,
            type: "ScreenDataSet"
        }
    ];

    var widgetResources;
    //widgetResource data example
    //{
    //    "<widget-path-name>":{
    //        "name": "<widget-path-name>",
    //        "url": "<file-url>",
    //        "type": "WebScreen|WebBlock"
    //        "dataActions":{
    //            "<type><action name>": {
    //                "url": <file-url>
    //                "lineNumber": "<action-signature-line>",
    //                "debugLine": "<action-return-line>",
    //                "type": "Fetch|Aggr"
    //                "name": "<action name>"
    //            }
    //        }
    //    }
    //}

    //function to load resources from current page
    function loadResources() {
        chrome.devtools.inspectedWindow.getResources(function (resources) {
            processPageResources(resources);
        });
    }

    //function to process all page resources and extract Widget Resources and Exposed actions
    function processPageResources(pageResources) {

        widgetResources = pageResources.reduce((result, resource) => {
            //reset regex index
            resourceRegex.lastIndex = 0;

            //validate if resource is a valid widget resource
            var regexResult = resourceRegex.exec(resource.url);

            if (!regexResult) {
                return result;
            }

            //create a dictionary object with the resource url
            var resourceObject = {
                name: regexResult[1],
                url: resource.url
            };
            result[regexResult[1]] = resourceObject;

            resource.getContent((content) => {
                var lines = content.split(newLineRegex);
                resourceObject.dataActions = lines.reduce((linesResult, line, index) => {
                    //validate if line has data action
                    var dataActionName = getDataActionRegex(line);
                    if (dataActionName) {
                        dataActionName.value.url = resource.url;
                        dataActionName.value.lineNumber = index;
                        dataActionName.value.debugLine = index + 3
                        linesResult[dataActionName.key] = dataActionName.value;
                    }
                    else {
                        //reset regex index
                        resourceTypeRegex.lastIndex = 0;
                        //validate if line has the type of the resource
                        var resourceTypeResult = resourceTypeRegex.exec(line);
                        if (resourceTypeResult && resourceTypeResult.length > 1) {
                            resourceObject.type = resourceTypeResult[1];
                        }
                    }

                    return linesResult;
                }, {});
            });

            return result;
        }, {});

        triggerClientCallback();
    }

    function getDataActionRegex(value) {

        var currReg;
        for (var i = 0; i < fetchsRegex.length; i++) {
            currReg = fetchsRegex[i];

            //reset regex index
            currReg.regexExp.lastIndex = 0;

            var regexResult = currReg.regexExp.exec(value);
            if (regexResult && regexResult.length > 1) {
                return {
                    key: currReg.type + regexResult[1],
                    value: {
                        name: regexResult[1],
                        type: currReg.type
                    }
                };
            }
        }
        return null;
    }

    function triggerClientCallback() {
        if (!processCallback) { return; }

        //callback inside timeout to make sure any last resource getContent finishes
        setTimeout(() => {
            processCallback(Object.keys(widgetResources).length ? widgetResources : null);
        }, 100);
    }

    loadResources();
    
    return {
        "loadResources": loadResources,
        "getResources": () => { return widgetResources; }
    };
};