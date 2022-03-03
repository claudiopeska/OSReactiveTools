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

                var moduleName = "";
                if (regexResult.length == 4) {
                    moduleName = regexResult[1] + "$";
                }

                var variableName = regexResult[regexResult.length - 1];
                var isClientVar = regexResult.indexOf(clientVariableIdentifier) >= 0;
                result.push(
                    {
                        key: key,
                        name: moduleName + variableName,
                        isClientVar: isClientVar,
                        value: localStorage.getItem(key)
                    }
                );
            }
        }

    }
    return result;
})();

