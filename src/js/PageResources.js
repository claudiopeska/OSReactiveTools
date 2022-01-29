import { bTreeView } from 'bootstrap-vue-treeview'

export default {
    components: {
        bTreeView
    },
    data() {
        return {
            resources: null,
            treeData: null,
            searchKeyword: null
        }
    },
    mounted() {
        PageResources((resultResources) => {
            if (resultResources) {
                this.resources = resultResources;
                this.treeData = this.buildTreeData(resultResources);
            }
        });
    },
    methods: {
        searchTree: function () {
            var lowerSearchKeyword = this.searchKeyword.trim().toLowerCase();
            if(lowerSearchKeyword.length == 0){
                this.treeData = this.buildTreeData(this.resources); 
                return; 
            }

            var searchResult = {};

            Object.entries(this.resources).forEach( ([rkey, rvalue]) => {
                if (rkey.toLowerCase().indexOf(lowerSearchKeyword) != -1) {
                    searchResult[rkey] = rvalue;
                    return;
                }

                var dataActionsResult = {};
                Object.entries(rvalue.dataActions).forEach( ([dakey, davalue]) => {
                    if (dakey.toLowerCase().indexOf(lowerSearchKeyword) != -1) {
                        dataActionsResult[dakey] = davalue;
                    }
                });
                
                if (Object.keys(dataActionsResult).length) {
                    searchResult[rkey] = {...rvalue};
                    searchResult[rkey].dataActions = dataActionsResult;
                }
            });
            this.treeData = this.buildTreeData(searchResult);
        },
        buildTreeData: function (resources) {
            return [{ id: -1, name: "App", icon: "bi-code-square", children: createResourcesHierarchy(resources) }];
        }
    }
};

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
    //    "<widget-path-name>":{
    //        "name": "<widget-path-name>",
    //        "url": "<file-url>",
    //        "type": "WebScreen|WebBlock"
    //        "dataActions":{
    //            "<action name>": {
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
                        dataActionName.lineNumber = index;
                        dataActionName.debugLine = index + 3
                        linesResult[dataActionName.name] = dataActionName;
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
            processCallback(Object.keys(widgetResources).length ? widgetResources : null);
        }, 100);
    }

    loadResources();
    return {
        "loadResources": loadResources,
        "getResources": () => { return widgetResources; }
    };
};


function createResourcesHierarchy(resources) {
    var resourceTypeMapIcon = {
        "WebScreen": "bi-window",
        "WebBlock": "bi-puzzle",
        "DataAction": "bi-table",
        "ScreenData": "bi-box-arrow-left",
    }
    var hierarchy = [];
    Object.entries(resources).forEach(([rkey, rvalue], rindex) => {
        var dataActions = [];
        Object.entries(rvalue.dataActions).forEach(([dakey, davalue], daindex) => {
            dataActions.push({
                id: daindex + (10000 * rindex),
                name: dakey,
                icon: resourceTypeMapIcon[davalue.type],
            });
        });
        hierarchy.push(
            {
                id: rindex,
                name: rkey,
                icon: resourceTypeMapIcon[rvalue.type],
                children: dataActions
            }
        );
    });

    return hierarchy;
}