export var BuildResourcesTree = function (appData) {
    
    if(!appData) return;
    
    const resourceTypeMapIcon = {
        "WebScreen": "bi-window",
        "WebBlock": "bi-puzzle",
        "ScreenDataSet": "bi-table",
        "DataAction": "bi-box-arrow-left",
    }
    
    var hierarchy = [];

    Object.entries(appData.resources).forEach(([rkey, rvalue], rindex) => {
        var actions = [];
        //add dataActions
        Object.entries(rvalue.dataActions).forEach(([, davalue], daindex) => {
            actions.push({
                id: daindex + (10000 * rindex),
                name: davalue.name,
                icon: resourceTypeMapIcon[davalue.type],
                data: davalue,
            });
        });
        //add clientActions
        actions.push({
            id: rindex + 1000000,
            name: "Client Actions",
            data: {
                disableNavigate: true,
                clientActions: rvalue.clientActions 
            }
        });
        hierarchy.push(
            {
                id: rindex,
                name: rkey,
                icon: resourceTypeMapIcon[rvalue.type],
                data: {
                    url: rvalue.url,
                    debugLine: 0
                },
                children: actions
            }
        );
    });

    return [
        {
            id: -1,
            name: "App",
            icon: "bi-code-square",
            data: {
                disableNavigate: true,
                localStorage: appData.data.localStorage
            },
            children: hierarchy,
        },
    ];
}