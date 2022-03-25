<template>
    <div></div>
</template>

<script>
//resource regex to identify files
const resourceRegex = /(\w+(?:\.\w+){2})\.mvc.js/g;

//new line regex to split resource files
const newLineRegex = /\r\n|\r|\n/g;

//identify if resource is screen or webblock
const resourceTypeRegex = /OSView\.BaseView\.Base(\w+)/g;

//actions regex to identify exposed actions
const dataActionRegex   = /controller\.callDataAction\("DataAction(\w+)"/g;
const aggrActionRegex   = /controller\.callAggregateWithStartIndexAndClientVars\("ScreenDataSet(\w+)/g;
const clientActionRegex = /Controller\.prototype\._(\w+)\$Action/g;

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

export default {
    mounted(){
        //initial load of resources
        chrome.devtools.inspectedWindow.getResources((resources) => {
            resources.forEach(this.onResourceAdded);
        });

        //when new resources appears e.g. on navigate
        chrome.devtools.inspectedWindow.onResourceAdded.addListener(this.onResourceAdded);
        },
    methods:{
        onResourceAdded(resource){
            //reset regex index
            resourceRegex.lastIndex = 0;

            //validate if resource is a valid widget resource
            var regexResult = resourceRegex.exec(resource.url);

            if (!regexResult) {
                return;
            }
            
            //create object with the resource data
            var resourceObject = {
                name: regexResult[1],
                url: resource.url
            };

            resource.getContent((content) => {
                var lines = content.split(newLineRegex);

                resourceObject.clientActions = [];
                resourceObject.serverActions = {};
                resourceObject.dataActions = lines.reduce((linesResult, line, index) => {
                    //validate if line has data action
                    var dataActionName = this.getDataActionRegex(line);
                    if (dataActionName) {
                        Object.assign(dataActionName.value, {
                            url: resource.url,
                            lineNumber: index,
                            debugLine: index + 3
                        });
                        linesResult[dataActionName.key] = dataActionName.value;
                    }
                    else {
                        //once we find the resource type we don't need to search again
                        if(!resourceObject.type){
                            //reset regex index
                            resourceTypeRegex.lastIndex = 0;
                            //validate if line has the type of the resource
                            var resourceTypeResult = resourceTypeRegex.exec(line);
                            if (resourceTypeResult && resourceTypeResult.length > 1) {
                                resourceObject.type = resourceTypeResult[1];
                            }
                        }
                        //load client actions
                        var clientActionName = this.getScreenActionRegex(line);
                        if(clientActionName){
                            resourceObject.clientActions.push({
                                actionName: clientActionName,
                                url: resource.url,
                                debugLine: index
                            });
                        }
                    }

                    return linesResult;
                }, {});
                this.$emit("newResource", resourceObject);
            });
        },
        getDataActionRegex(value) {
            var currRegex;
            for (var i = 0; i < fetchsRegex.length; i++) {
                currRegex = fetchsRegex[i];

                //reset regex index
                currRegex.regexExp.lastIndex = 0;

                var regexResult = currRegex.regexExp.exec(value);
                if (regexResult && regexResult.length > 1) {
                    return {
                        key: currRegex.type + regexResult[1],
                        value: {
                            name: regexResult[1],
                            type: currRegex.type
                        }
                    };
                }
            }
            return null;
        },
        getScreenActionRegex(value){
            //reset regex index
            clientActionRegex.lastIndex = 0;

            var regexResult = clientActionRegex.exec(value);
            if(regexResult && regexResult.length > 1){
                //return client action name
                return regexResult[1];
            }
            return null;
        }
    }
}
</script>