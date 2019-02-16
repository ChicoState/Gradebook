// node_visitor.mjs

import { types } from './grade_types';

export class Visitor {
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
                    if (cmp.type == types.UNIT) {
                        grd.earned += cmp.earned;
                        grd.possible += cmp.possible;
                    }
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

