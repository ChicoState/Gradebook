// grade_types.js

const types = {
    QUIZ: 1,
    UNIT: 2
}

class Grade {
    constructor(type) {
	this.type = type;
    }
}

class Quiz extends Grade {
    constructor(earned, possible) {
	super(types.QUIZ);
	this.earned = earned;
	this.possible = possible;
    }

    accept(visitor) {
	visitor.visit(this);
    }
}

class Unit extends Grade {
    constructor(list) {
	super(types.UNIT);
	this.list = list;
    }

    accept(visitor) {
	visitor.visit(this);
    }
}

class Visitor {
    constructor() {
	this.table = "";
    }

    visit(grd) {
	switch (grd.type) {
	case types.QUIZ:
	    this.table += " QUIZ (" + grd.earned.toString() + " / " + grd.possible.toString() + ")\n";
	    break;
	case types.UNIT:
	    let total_earned = 0;
	    let total_possible = 0;
	    this.table += "UNIT ----------\n";
	    for (const cmp of grd.list) {
		cmp.accept(this);
		total_earned += cmp.earned;
		total_possible += cmp.possible;
	    }
	    this.table += "      (" + total_earned.toString() + " / " + total_possible.toString() + ")\n";
	    this.table += "---------------\n";
	    break;
	}
    }
}
	
const g = new Unit(
    [
	new Quiz(28, 30),
	new Quiz(30, 30),
	new Quiz(29, 30)
    ]
);
const v = new Visitor();
g.accept(v);
console.log(v.table);


