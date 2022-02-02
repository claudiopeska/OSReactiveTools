export var BuildResourcesTree = function (resources) {
    const resourceTypeMapIcon = {
        "WebScreen": "bi-window",
        "WebBlock": "bi-puzzle",
        "ScreenDataSet": "bi-table",
        "DataAction": "bi-box-arrow-left",
    }

    var hierarchy = [];

    Object.entries(resources).forEach(([rkey, rvalue], rindex) => {
        var dataActions = [];
        Object.entries(rvalue.dataActions).forEach(([, davalue], daindex) => {
            dataActions.push({
                id: daindex + (10000 * rindex),
                name: davalue.name,
                icon: resourceTypeMapIcon[davalue.type],
                data: davalue,
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

    return [
        {
            id: -1,
            name: "App",
            icon: "bi-code-square",
            children: hierarchy,
        },
    ];
}