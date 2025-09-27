function Bond(el1, el2, level) {
    this.atoms = [ el1, el2 ];
    this.level = level;
    var self = this;

    this.getOtherAtom = function(atom) {
        if(atom == self.atoms[0])
            return self.atoms[1];
        else
            return self.atoms[0];
    }
}

function Atom(element) {
    var self = this;
    this.element = element;
    this.bonds = [];

    this.addBond = function(atom, level) {
        var bond = new Bond(self, atom, level)
        self.bonds.push(bond);
        atom.bonds.push(bond);
        return self;
    }

    this.bondElectrons = function() {
        var n=0;
        for(var i=0;i<self.bonds.length;i++)
        {
            n+=self.bonds[i].level;
        }
        return n;
    }
}
function multiplierToCount(token) {
    switch (token) {
        case 'di':
        case 'bis':
            return 2;
        case 'tri':
        case 'tris':
            return 3;
        case 'tetrakis':
            return 4;
        default:
            return 1;
    }
}

function expandPrefix(prefix, inheritedPositions, multiplier) {
    if (!prefix) {
        return [];
    }

    var count = multiplierToCount(prefix.num);
    var totalMultiplier = (multiplier || 1) * count;

    var basePositions = (inheritedPositions && inheritedPositions.length)
        ? inheritedPositions.slice()
        : (prefix.numberList ? prefix.numberList.slice() : []);

    if (!basePositions.length) {
        basePositions = [1];
    }

    if (Array.isArray(prefix.name)) {
        var collected = [];
        for (var i = 0; i < prefix.name.length; i++) {
            collected = collected.concat(expandPrefix(prefix.name[i], basePositions, totalMultiplier));
        }
        return collected;
    }

    if (totalMultiplier > basePositions.length) {
        var last = basePositions[basePositions.length - 1];
        while (basePositions.length < totalMultiplier) {
            basePositions.push(last);
        }
    } else if (totalMultiplier < basePositions.length) {
        basePositions = basePositions.slice(0, totalMultiplier);
    }

    return [{
        name: prefix.name,
        positions: basePositions,
        modifier: prefix.num
    }];
}

function normalizePrefixes(prefixes) {
    var result = [];
    if (!prefixes || !prefixes.length) {
        return result;
    }
    for (var i = 0; i < prefixes.length; i++) {
        result = result.concat(expandPrefix(prefixes[i], prefixes[i].numberList || [], 1));
    }
    return result;
}

function createMethylGroup() {
    var carbon = new Atom('C');
    carbon.addBond(new Atom('H'), 1);
    carbon.addBond(new Atom('H'), 1);
    carbon.addBond(new Atom('H'), 1);
    return carbon;
}

function createEthylGroup() {
    var first = new Atom('C');
    first.addBond(new Atom('H'), 1);
    first.addBond(new Atom('H'), 1);

    var second = new Atom('C');
    second.addBond(new Atom('H'), 1);
    second.addBond(new Atom('H'), 1);
    second.addBond(new Atom('H'), 1);

    first.addBond(second, 1);
    return first;
}

function createLinearPropylGroup() {
    var first = new Atom('C');
    first.addBond(new Atom('H'), 1);
    first.addBond(new Atom('H'), 1);

    var second = new Atom('C');
    second.addBond(new Atom('H'), 1);
    second.addBond(new Atom('H'), 1);

    var third = new Atom('C');
    third.addBond(new Atom('H'), 1);
    third.addBond(new Atom('H'), 1);
    third.addBond(new Atom('H'), 1);

    first.addBond(second, 1);
    second.addBond(third, 1);

    return first;
}

function createIsopropylGroup() {
    var central = new Atom('C');
    central.addBond(new Atom('H'), 1);

    var branchA = new Atom('C');
    branchA.addBond(new Atom('H'), 1);
    branchA.addBond(new Atom('H'), 1);
    branchA.addBond(new Atom('H'), 1);

    var branchB = new Atom('C');
    branchB.addBond(new Atom('H'), 1);
    branchB.addBond(new Atom('H'), 1);
    branchB.addBond(new Atom('H'), 1);

    central.addBond(branchA, 1);
    central.addBond(branchB, 1);

    return central;
}

function createPropylGroup(modifier) {
    if (modifier === 'iso') {
        return createIsopropylGroup();
    }
    return createLinearPropylGroup();
}

function createButylGroup() {
    var first = new Atom('C');
    first.addBond(new Atom('H'), 1);
    first.addBond(new Atom('H'), 1);

    var second = new Atom('C');
    second.addBond(new Atom('H'), 1);
    second.addBond(new Atom('H'), 1);

    var third = new Atom('C');
    third.addBond(new Atom('H'), 1);
    third.addBond(new Atom('H'), 1);

    var fourth = new Atom('C');
    fourth.addBond(new Atom('H'), 1);
    fourth.addBond(new Atom('H'), 1);
    fourth.addBond(new Atom('H'), 1);

    first.addBond(second, 1);
    second.addBond(third, 1);
    third.addBond(fourth, 1);

    return first;
}

function createSubstituentFactory(name, modifier) {
    switch (name) {
        case 'metyyli':
            return function () { return createMethylGroup(); };
        case 'etyyli':
            return function () { return createEthylGroup(); };
        case 'propyyli':
            return function () { return createPropylGroup(modifier); };
        case 'butyyli':
            return function () { return createButylGroup(); };
        default:
            return null;
    }
}



function organicNameToMolecule(parsedMolecule) {
    var carbonNum = parsedMolecule.rootword;

    primaryChain = [];
    var prevAtom = null;
    var doubleBondLocations = [];

    if (parsedMolecule.primarysuffix && parsedMolecule.primarysuffix.type == 'eeni') {
        if (parsedMolecule.primarysuffix.numberlist) {
            doubleBondLocations = parsedMolecule.primarysuffix.numberlist.slice();
        } else {
            doubleBondLocations.push(1);
        }
    }

    for (var i = 0; i < carbonNum; i++) {
        var atom = new Atom('C');
        atom.primaryChain = true;
        primaryChain.push(atom);

        if (prevAtom) {
            var bondLevel = doubleBondLocations.indexOf(i) !== -1 ? 2 : 1;
            atom.addBond(prevAtom, bondLevel);
        }

        prevAtom = atom;
    }

    if (parsedMolecule.infix == 'cyclo' && primaryChain.length > 1) {
        prevAtom.addBond(primaryChain[0], 1);
    }

    if (parsedMolecule.secondarysuffix && parsedMolecule.secondarysuffix.name == 'oli') {
        var oliPositions = (parsedMolecule.secondarysuffix.numberlist && parsedMolecule.secondarysuffix.numberlist.length)
            ? parsedMolecule.secondarysuffix.numberlist
            : [1];

        for (var s = 0; s < oliPositions.length; s++) {
            var oliIndex = oliPositions[s] - 1;
            if (oliIndex < 0 || oliIndex >= primaryChain.length) {
                oliIndex = primaryChain.length - 1;
            }

            var oxygen = new Atom('O');
            oxygen.addBond(new Atom('H'), 1);
            primaryChain[oliIndex].addBond(oxygen, 1);
        }
    }

    var normalizedPrefixes = normalizePrefixes(parsedMolecule.prefix);

    for (var p = 0; p < normalizedPrefixes.length; p++) {
        var prefix = normalizedPrefixes[p];
        var factory = createSubstituentFactory(prefix.name, prefix.modifier);
        if (!factory) {
            continue;
        }

        var positions = prefix.positions;
        for (var n = 0; n < positions.length; n++) {
            var index = positions[n] - 1;
            if (index < 0 || index >= primaryChain.length) {
                continue;
            }

            primaryChain[index].addBond(factory());
        }
    }

    addMissingHydrogens(primaryChain);

    return primaryChain[0];
}

function addMissingHydrogens(primaryChain) {
    // Add missing hydrogens from the primary carbon chain
    for (i = 0 ; i < primaryChain.length; i++) {
        var atom = primaryChain[i];
        var missingH = 4 - atom.bondElectrons(); //atom.bonds.length;
        for (var h = 0; h < missingH; h++) {
            atom.addBond(new Atom('H'), 1);
        }
    }
}

function countConnectedAtoms(atom, notThis) {
    var c = 0;
    var b;
    for (b = 0; b < atom.bonds.length; b++) {
        var otherAtom = atom.bonds[b].getOtherAtom(atom);
        if (otherAtom != notThis) {
            c += countConnectedAtoms(otherAtom, atom);
        }
    }
    return c + 1;
}

function renderAtom(atom, paper, x, y, xdir, ydir) {
    console.log('renderAtom ' + x + ' ' + y + ' ' + atom.bonds.length);
    atom.visited = true;
    // Creates circle at x = 50, y = 40, with radius 10
    var circle = paper.circle(x, y, 10);
    // Sets the fill attribute of the circle to red (#f00)
    //circle.attr("fill", "#f00");

    var b;
    for (b = 0; b < atom.bonds.length; b++) {
        var nextAtom = atom.bonds[b].getOtherAtom(atom);
        if (!nextAtom.visited) {
            paper.path("M " + (x+10) + " " + y + " l 20 0");
            renderAtom(nextAtom, paper, x + 40, y);
        }
    }

    // Sets the stroke attribute of the circle to white
    //            circle.attr("stroke", "#000");

}

var slots = [];
var bonds = [];

function findSlot(x, y) {
    var i;
    for (i = 0; i < slots.length; i++) {
        if (slots[i].x == x && slots[i].y == y) {
            return slots[i];
        }
    }
    return null;
}

function compareForCarbon(atom) {
    return atom.element == 'C';
}

function calculateBranchSize(list, atom, comp) {
    list.push(atom);

    var n = comp(atom) ? 1 : 0;
    for (b = 0; b < atom.bonds.length; b++) {
        var nextAtom = atom.bonds[b].getOtherAtom(atom);
        if (list.indexOf(nextAtom) == -1) {
            n += calculateBranchSize(list, nextAtom, comp);
        }
    }
    return n;
}

function calculateHexCoordinates(atom, x, y, xdir, ydir) {
    atom.visited = true;

    var mySlot = { atom: atom, x: x, y: y };
    slots.push(mySlot);

    var b;

    atom.bonds.sort(function (a, b) {
        var aAtom = a.getOtherAtom(atom);
        var bAtom = b.getOtherAtom(atom);
        return
        calculateBranchSize([], bAtom, compareForCarbon) -
        calculateBranchSize([], aAtom, compareForCarbon);
    });

    for (b = 0; b < atom.bonds.length; b++) {
        
        var nextAtom = atom.bonds[b].getOtherAtom(atom);
        if (!nextAtom.visited) {
            paper.path("M " + (x + 10) + " " + y + " l 20 0");
            renderAtom(nextAtom, paper, x + 40, y);
        }
    }
}
