var calc = (function () {

    var total = 0,
        currentEntry = {
            wholeAmount: 0,
            decimalAmount: 0,
            powerOfTen: null,
            decimalMode: false,
            isOperationsOnly: false,
            numberOfTrailingDecimalZeros: 0,
            toString: function () {
                var amt = this.amount,
                    output;
                if (this.numberOfDecimalDigits > 10) {
                    amt = Math.round10(amt, -10);
                }

                output = amt.toString();

                if (this.numberOfTrailingDecimalZeros && output.indexOf('.') === -1) {
                    output += '.';
                }
                return output + '0'.repeat(this.numberOfTrailingDecimalZeros);
            }
        },
        operationStack = [],
        operatorSymbols = {
            add: '+',
            subtract: '-',
            multiply: '×',
            divide: '÷'
        },
        inifinitySymbol = '\u221E',
        MAX_DIGITS = 14;

    function calculateStack() {
        var runningTotal = operationStack[0];

        for (var stackItem = 1; stackItem < operationStack.length; stackItem += 2) {
            runningTotal = mathOperation(operationStack[stackItem], runningTotal, operationStack[stackItem + 1]);
        }

        //return mathOperation(operationStack[operationStack.length - 1], runningTotal, currentEntry.amount);
        return runningTotal;
    }

    function createCurrentEntrySettersGetters() {
        if (!currentEntry) {
            throw ('currentEntry does not exist');
            return;
        }
        Object.defineProperty(currentEntry, 'amount', {
            'get': function () {
                var currentEntry = this;
                if (!isNaN(currentEntry.wholeAmount) && !isNaN(currentEntry.decimalAmount)) {
                    return currentEntry.wholeAmount + currentEntry.decimalAmount;
                } else {
                    return NaN;
                }
            },
            'set': function (value) {
                var currentEntry = this;
                currentEntry.wholeAmount = parseInt(value, 10);
                currentEntry.decimalAmount = value - currentEntry.wholeAmount;
            }
        });
        Object.defineProperty(currentEntry, 'numberOfDecimalDigits', {
            'get': function () {
                var currentEntry = this,
                    decimalDigits = 0;

                if (currentEntry.decimalAmount) {
                    decimalDigits = currentEntry.decimalAmount.toString().length - 2;
                }

                return decimalDigits + currentEntry.numberOfTrailingDecimalZeros;
            }
        });
        Object.defineProperty(currentEntry, 'numberOfDigits', {
            'get': function () {
                var currentEntry = this,
                    wholeDigits,
                    decimalDigits;

                if (!currentEntry.amount) {
                    return 0;
                }

                wholeDigits = Math.floor(Math.log10(currentEntry.wholeAmount)) + 1;
                decimalDigits = currentEntry.numberOfDecimalDigits;


                return wholeDigits + decimalDigits;
            }
        });
    }

    function display(valueToDisplay) {
        $('#results').text(valueToDisplay);
    }

    function displayCurrentEntry() {
        if (isNaN(currentEntry.amount)) {
            display(inifinitySymbol);
        } else {
            display(currentEntry.toString());
        }
    }

    function displayOperationStack() {
        var operationStackString = operationStack.reduce(function (a, b) {
            return (operatorSymbols[a] || a.toString()) + (operatorSymbols[b] || b.toString());
        });
        $('#mathProblem').text(operationStackString);
    }

    function displayOperator(operator) {
        display(operatorSymbols[operator]);
    }

    function handleButtonClick(buttonValueOrOperation) {
        var isOPeration = isNaN(buttonValueOrOperation);
        var isNumericAndAllowed = !isOPeration && !currentEntry.isOperationsOnly && currentEntry.numberOfDigits <= MAX_DIGITS;

        if (isNumericAndAllowed) {
            updateCurrentEntry(Number(buttonValueOrOperation));
            displayCurrentEntry();
        }
        if (isOPeration) {
            performOrCacheOperation(buttonValueOrOperation);
        }
    }

    function init() {
        $(function () {
            setEventHandlers();
            initializeCurrentEntry();
            createCurrentEntrySettersGetters();
            displayCurrentEntry();
        })
    };

    function initializeCurrentEntry() {
        currentEntry.wholeAmount = 0;
        currentEntry.decimalAmount = 0;
        currentEntry.powerOfTen = null;
        currentEntry.decimalMode = false;
        currentEntry.isOperationsOnly = false;
        currentEntry.numberOfTrailingDecimalZeros = 0;
    }

    function mathOperation(operation, x, y) {
        switch (operation) {
            case "add":
                return x + y;
                break;
            case "subtract":
                return x - y;
                break;
            case "multiply":
                return x * y;
                break;
            case "divide":
                return x / y;
                break;
        };
    }

    function performOrCacheOperation(operation) {
        switch (operation) {
            case "dot":
                currentEntry.decimalMode = true;
                if (currentEntry.powerOfTen === null) {
                    currentEntry.powerOfTen = -1;
                }
                break;
            case "allclear":
                initializeCurrentEntry();
                displayCurrentEntry();
                operationStack = [];
                $('#mathProblem').text('');
                break;
            case "clearentry":
                if (!currentEntry.isOperationsOnly) {
                    initializeCurrentEntry();
                    displayCurrentEntry();
                }
                break;
            case "add":
            case "subtract":
            case "multiply":
            case "divide":
                operationStack.push(currentEntry.amount);
                operationStack.push(operation);
                initializeCurrentEntry();
                displayOperator(operation);
                displayOperationStack();
                break;
            case "equals":
                if (!currentEntry.isOperationsOnly) {
                    operationStack.push(currentEntry.amount);
                    setCurrentEntry(calculateStack());
                    operationStack.push('=');
                    operationStack.push(currentEntry.amount);
                    displayOperationStack();
                    operationStack = [];
                    displayCurrentEntry();
                    currentEntry.isOperationsOnly = true;
                }
                break;
        };
    }

    function setCurrentEntry(amount) {
        currentEntry.amount = amount;
        currentEntry.powerOfTen = null;
        currentEntry.decimalMode = false;
    }

    function setEventHandlers() {
        $('a').click(function (event) {
            handleButtonClick(event.target.id);
        });
    }

    function updateCurrentEntry(digit) {
        if (currentEntry.decimalMode) {
            currentEntry.decimalAmount += digit * Math.pow(10, currentEntry.powerOfTen);
            currentEntry.decimalAmount = Math.round10(currentEntry.decimalAmount, currentEntry.powerOfTen);
            //currentEntry.decimalAmount = currentEntry.decimalAmount.toFixed(Math.abs(currentEntry.powerOfTen));
            currentEntry.powerOfTen--;
            if (0 === digit) {
                currentEntry.numberOfTrailingDecimalZeros++;
            } else {
                currentEntry.numberOfTrailingDecimalZeros = 0;
            }
        } else {
            currentEntry.wholeAmount = (currentEntry.wholeAmount * 10) + digit;
        }
    }

    return {
        init: init
    };
}());

calc.init();
