import { bTreeView } from 'bootstrap-vue-treeview'

export default {
    components: {
        bTreeView
    },
    data() {
        return {
            resources: null,
            treeData: [
                {
                    "id": 2, "name": "Venus", "icon": "bi-puzzle",
                    "children": [
                        { "id": 3, "name": "Neptune" },
                        { "id": 4, "name": "Stratus" }
                    ]
                }
            ]
        }
    },
    mounted() {
        PageResources((resultResources) => {
            this.resources = resultResources;
            this.treeData = [{ id: -1, name: "App", icon: "bi-code-square", children: createResourcesHierarchy(resultResources) }];
        });
    }
};
/*
ICONS:
-Screens: bi-window
-Webblock: bi-puzzle
-ScreenData: bi-table
-DataAction: bi-box-arrow-left
*/

//processCallback will be called when resources finishes processing
var PageResources = function (processCallback) {

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
            type: "ScreenData"
        },
        {
            regexExp: aggrActionRegex,
            type: "DataAction"
        }
    ];

    var widgetResources;
    //widgetResource data example
    //{
    //    "<file-url>":{
    //        "name": "<widget-path-name>",
    //        "type": "WebScreen|WebBlock"
    //        "dataActions":{
    //            "<action-return-line>": {
    //                "lineNumber": "<action-signature-line>",
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
            var resourceObject = { name: regexResult[1] };
            result[resource.url] = resourceObject;

            resource.getContent((content) => {
                var lines = content.split(newLineRegex);
                resourceObject.dataActions = lines.reduce((linesResult, line, index) => {
                    //validate if line has data action
                    var dataActionName = getDataActionRegex(line);
                    if (dataActionName) {
                        dataActionName.lineNumber = index;
                        linesResult[index + 3] = dataActionName;
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
                    name: regexResult[1],
                    type: currReg.type
                };
            }
        }
        return null;
    }

    function triggerClientCallback() {
        if (!processCallback) { return; }

        //callback inside timeout to make sure any last resource getContent finishes
        setTimeout(() => {
            processCallback(widgetResources);
        }, 10);
    }

    loadResources();
    return {
        "loadResources": loadResources,
        "getResources": () => { return widgetResources; }
    };
};


function createResourcesHierarchy(resources) {
    var hierarchy = [];
    Object.entries(resources).forEach(([, rvalue], rIndex) => {
        hierarchy.push(
            {
                id: rIndex,
                name: rvalue.name,
                icon: "bi-window"
            }
        );
    });
    
    return hierarchy;
}