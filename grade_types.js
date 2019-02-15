// grade_types.js

const types = {
    QUIZ: 1,
    UNIT: 2
}

class Grade {
    constructor(type, taken, earned, possible) {
	this.type = type;
	this.taken = taken;
	this.earned = earned;
	this.possible = possible;
    }
}

class Quiz extends Grade {
    constructor(taken, earned, possible) {
	super(types.QUIZ, taken, earned, possible);
    }

    accept(visitor) {
	visitor.visit(this);
    }
}

class Unit extends Grade {
    constructor(list) {
	super(types.UNIT, false, 0, 0);
	this.list = list;
	this.future = 0;
    }

    accept(visitor) {
	visitor.visit(this);
    }
}

class Visitor {
    constructor() {
	this.table = "";
	this.indent = "";
    }

    visit(grd) {
	switch (grd.type) {
	case types.QUIZ:
	    if (grd.taken) {
		this.table += " QUIZ (" + grd.earned.toString() + " / " + grd.possible.toString() + ")\n";
	    } else {
		this.table += " PENDING QUIZ " + grd.possible.toString() + "\n";
	    }
	    break;
	case types.UNIT:
	    let future_possible = 0;
	    this.table += "\n" + this.indent + "UNIT ----------\n";
	    let tmp = this.indent;
	    this.indent += " ";
	    for (const cmp of grd.list) {
		cmp.accept(this);
		if (cmp.taken) {
		    grd.earned += cmp.earned;
		    grd.possible += cmp.possible;
		} else {
		    grd.future += cmp.possible;
		    if (cmp.type == types.UNIT)
			grd.future += grd.future;
		}
	    }
	    this.indent = tmp;
	    this.table += this.indent + "---------------\n";
	    this.table += this.indent + "Running: (" + grd.earned.toString() + " / " + grd.possible.toString() + ")\n";
	    this.table += this.indent + "Current: (" + grd.earned.toString() + " / " + (grd.possible + grd.future).toString() + ")\n";
	    this.table += this.indent + "----------- END\n\n";
	    break;
	}
    }
}
	
const g = new Unit(
    [
	new Quiz(true, 28, 30),
	new Quiz(true, 30, 30),
	new Unit(
	    [
		new Quiz(true, 9, 10),
		new Quiz(false, 0, 10)
	    ]
	),
	new Quiz(true, 29, 30),
	new Quiz(false, 0, 30)
    ]
);
const v = new Visitor();
g.accept(v);
console.log(v.table);


