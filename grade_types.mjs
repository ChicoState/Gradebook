// grade_types.mjs

class Grade {
    constructor(earned, possible) {
        this.earned = earned;
        this.possible = possible;
    }
}

export class Assignment extends Grade {
    constructor(title, taken, earned, possible) {
	super(earned, possible);
	this.title = title;
	this.taken = taken;
    }
}
	
export class Unit extends Grade {
    constructor(percent, assignments) {
        super(0, 0);
	this.percent = percent;
        this.assignments = assignments;
        this.future = 0;
    }

    calculate_score() {
        for (const assignment of this.assignments) {
	    if (assignment.taken) {
		this.earned += assignment.earned;
		this.possible += assignment.possible;
	    } else {
		this.future += assignment.possible;
	    }
	}
    }

    log() {
	console.log("  Unit   (" + (this.earned).toString() + "/" + (this.possible).toString() + ")");    
	for (const assignment of this.assignments) {
	    console.log("    " + assignment.title + " (" + (assignment.earned).toString() + "/" + (assignment.possible).toString() + ")");
	}
    }
}

export class Gradebook extends Grade {
    constructor(units) {
	super(0, 0)
	this.units = units;
    }

    calculate_score() {
	for (const unit of this.units) {
	    unit.calculate_score();
	    this.earned += unit.percent * (unit.earned / unit.possible);
	    this.possible += unit.percent * (unit.earned / (unit.possible + unit.future));
	}
    }

    log() {
	console.log("Gradebook   " + (this.earned).toString());    
	for (const unit of this.units) {
	    unit.log();
	}
    }
}
	    
