var dayDiff = function (d1, d2) {
    d1 = d1.getTime() / 86400000;
    d2 = d2.getTime() / 86400000;
    return new Number(d2 - d1).toFixed(0);
};