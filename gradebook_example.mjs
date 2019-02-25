// gradebook_example.mjs

import { Assignment, Unit, Gradebook } from './grade_types';

const g = new Gradebook(
    [
	new Unit(
	    .20,
	    [
		new Assignment("Quiz 1", true, 10, 10),
		new Assignment("Quiz 2", true, 8, 10)
	    ]
	),
	new Unit(
	    .80,
	    [
		new Assignment("Test", true, 30, 100)
	    ]
	)
    ]
);

g.calculate_score();
g.log();
