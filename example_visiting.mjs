// example_visiting.mjs

import { Quiz, Unit } from './grade_types';
import { Visitor } from './node_visitor';

//const gts = require('./grade_types');
const v = new Visitor();

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

g.accept(v);
console.log(v.table);
