var checkIsIn = function (result, name) {
    for (var i = 0; i < result.length; i++) {
        if (result[i].name === name) {
            return (true);
        }
    }
    return (false);
};