// grade_types.mjs

export const types = {
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

export class Quiz extends Grade {
    constructor(taken, earned, possible) {
        super(types.QUIZ, taken, earned, possible);
    }

    accept(visitor) {
        visitor.visit(this);
    }
}

export class Unit extends Grade {
    constructor(list) {
        super(types.UNIT, false, 0, 0);
        this.list = list;
        this.future = 0;
    }

    accept(visitor) {
        visitor.visit(this);
    }
}

