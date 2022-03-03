(function () {
    const clientVariableIdentifier = "ClientVars";
    const acceptLocalStorageKey = "$OS_Users";
    const regexSplit = /[^\$]+/g;

    var result = [];
    for (var key in localStorage) {
        //only return local variables that starts with $OS_Users
        if (!key.startsWith(acceptLocalStorageKey)) continue;

        if (localStorage.hasOwnProperty(key)) {

            var regexResult = key.match(regexSplit);
            if (regexResult && regexResult.length) {

                var moduleName = null;
                if (regexResult.length == 4) {
                    moduleName = regexResult[1] + "$";
                }

                var variableName = regexResult[regexResult.length - 1];
                var isClientVar = moduleName && regexResult.indexOf(clientVariableIdentifier) >= 0;
                result.push(
                    {
                        key: key,
                        name: (moduleName ? moduleName : "") + variableName,
                        value: localStorage.getItem(key),
                        isManMade: isClientVar
                    }
                );
            }
        }

    }
    return result;
})();

