var $NS = $NS || {};
$NS.createNS = function (namespace) {
    var nsparts = namespace.split(".");
    var parent = $NS;
    if (nsparts[0] === "$NS") {
        nsparts = nsparts.slice(1);
    }
    for (var i = 0; i < nsparts.length; i++) {
        var partname = nsparts[i];
        if (typeof parent[partname] === "undefined") {
            parent[partname] = {};
        }
        parent = parent[partname];
    }
    return parent;
};