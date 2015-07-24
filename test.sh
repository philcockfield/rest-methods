#!/usr/bin/env bash
#
# Unit test runner.
#
# Usage: ./test.sh <moch_parameters>
#
# Eg: ./test.sh --watch

COMPILERS="js:babel/register"
./node_modules/mocha/bin/mocha --recursive --colors --compilers $COMPILERS $@
