var keys = [ "input", "buffer", "output" ];
var queue = [];
var move = [
    [ "input", "buffer" ],
    [ "buffer", "output" ]
];
var cameFrom = {};
// var heuristic = {};
var costSoFar = {};
var start = {
    input: [{
        name: "Cobblestone",
        count: null
    }],
    buffer: [],
    output: [], /** @TODO: heuristic(x => y) State changes? 3x3 crafting costs 9? Sticks cost 2? Elapsed time in machine? Each craft cost 1/20? **/
};
var expect = idify([{
    name: "Cobblestone",
    count: 3
}]);
var done = false;

cameFrom[getId(start)] = null;
costSoFar[getId(start)] = 0;
queue.push(start);

function next() {
    var current = queue.shift();
    var id;
    var neighbors = [];

	if (!current) {
        throw new Error(":(");
    }

    // var input = idify(current.input);
    // var buffer = idify(current.buffer);
    var output = idify(current.output);

    if (output === expect) {
        return current;
    }

    id = getId(current);

    // Calculate neighbors
    current.input.forEach(function (i, iIndex) {
        var neighbor = copy(current);
        var nId;
        var cost = costSoFar[id] + 0.05;

        if (neighbor.input[iIndex].count !== null) {
            neighbor.input[iIndex].count--;
        }

        if (neighbor.input[iIndex].count === 0) {
            neighbor.input.splice(iIndex, 1);
        }

        var exists = neighbor.buffer.find(function (b) {
            return b.name === i.name;
        });

        if (exists) {
            var bIndex = neighbor.buffer.indexOf(exists);

            neighbor.buffer[bIndex].count++;
        } else {
            neighbor.buffer.push({
                name: i.name,
                count: 1
            });
        }

        nId = getId(neighbor);

        if (!costSoFar[nId] || cost < costSoFar[nId]) {
            costSoFar[nId] = cost;
            queue.push(neighbor);
            cameFrom[nId] = id;
        }
    });

    current.buffer.forEach(function (b, bIndex) {
        var neighbor = copy(current);
        var nId;
        var cost = costSoFar[id] + 0.05;

        if (neighbor.buffer[bIndex].count !== null) {
            neighbor.buffer[bIndex].count--;
        }

        if (neighbor.buffer[bIndex].count === 0) {
            neighbor.buffer.splice(bIndex, 1);
        }

        var exists = neighbor.output.find(function (o) {
            return o.name === b.name;
        });

        if (exists) {
            var oIndex = neighbor.output.indexOf(exists);

            neighbor.output[oIndex].count++;
        } else {
            neighbor.output.push({
                name: b.name,
                count: 1
            });
        }

        nId = getId(neighbor);

        if (!costSoFar[nId] || cost < costSoFar[nId]) {
            costSoFar[nId] = cost;
            queue.push(neighbor);
            cameFrom[nId] = id;
        }
    });

    queue.sort(function (a, b) {
        return costSoFar[getId(a)] > costSoFar[getId(b)];
    });
}

function copy(i) {
    return JSON.parse(JSON.stringify(i));
}

function getId(item) {
    var id = "";

    keys.forEach(function (key, index) {
        id += (index ? "|" : "") + idify(item[key]);
    });

    return id;
}

function idify(arr) {
    var id = "";

    arr.forEach(function (res) {
        id += res.name;
        id += res.count === null ? "*" : res.count.toString();
    });

    return id;
}
