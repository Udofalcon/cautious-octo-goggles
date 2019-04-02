var keys = [ "input", "buffer", "output" ];
var queue = [];
var moves = [
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

var end = null;

while(!end) {
    end = next();
}

console.log(end);

function next() {
    var current = queue.shift();
    var neighbors = [];

	if (!current) {
        throw new Error(":(");
    }

    var output = idify(current.output);

    if (output === expect) {
        return current;
    }

    // Calculate neighbors
    moves.forEach(function (m) {
        move(current, m[0], m[1]);
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

function move(current, from, to) {
    var id = getId(current);

    current[from].forEach(function (f, fIndex) {
        var neighbor = copy(current);
        var nId;
        var cost = costSoFar[id] + 0.05;

        if (neighbor[from][fIndex].count !== null) {
            neighbor[from][fIndex].count--;
        }

        if (neighbor[from][fIndex].count === 0) {
            neighbor[from].splice(fIndex, 1);
        }

        var exists = neighbor[to].find(function (t) {
            return t.name === f.name;
        });

        if (exists) {
            var tIndex = neighbor[to].indexOf(exists);

            neighbor[to][tIndex].count++;
        } else {
            neighbor[to].push({
                name: f.name,
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
}
