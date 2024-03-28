pragma circom  2.1.8;

include "../node_modules/circomlib/circuits/comparators.circom";

template AgeCheck() {

    // Declaration of signals.
    signal input age;
    signal input ageLimit;
    signal output isAboveAgeLimit;

    component gt = GreaterEqThan(7); // 7 is the number of bits you work with

    gt.in[0] <== age;
    gt.in[1] <== ageLimit;
    isAboveAgeLimit <== gt.out;
}

component main {public [ageLimit]} = AgeCheck();
