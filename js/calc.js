var calc = (function () {

    var total = 0,
        currentEntry = {
            wholeAmount: 0,
            decimalAmount: 0,
            powerOfTen: null,
            decimalMode: false,
            isOperationsOnly: false
        };
        operationStack = [],
        operatorSymbols = {
            add: '+',
            subtract: '-',
            multiply: '×',
            divide: '÷'
        },
        inifinitySymbol = '\u221E';

    var init = function () {
        $(function () {
            setEventHandlers();
            initializeCurrentEntry();
            Object.defineProperty(currentEntry, 'amount', {
                'get': function () {
                    var currentEntry = this;
                    if (!isNaN(currentEntry.wholeAmount) && !isNaN(currentEntry.decimalAmount)) {
                        return currentEntry.wholeAmount + currentEntry.decimalAmount;
                    } else {
                        return NaN;
                    }
                }
            });
            displayCurrentEntry();
        })
    };

    function setEventHandlers() {
        $('a').click(function (event) {
            handleButtonClick(event.target.id);
        });
    }

    function initializeCurrentEntry() {
        currentEntry.wholeAmount = 0;
        currentEntry.decimalAmount = 0;
        currentEntry.powerOfTen = null;
        currentEntry.decimalMode = false;
        currentEntry.isOperationsOnly = false;
    }

    function displayCurrentEntry() {
        if (isNaN(currentEntry.amount)) {
            display(inifinitySymbol);
        } else {
            display(currentEntry.amount);
        }
    }

    function display(valueToDisplay) {
        $('#results').text(valueToDisplay);
    }

    function handleButtonClick(buttonValueOrOperation) {
        var isOPeration = isNaN(buttonValueOrOperation);
        var isNumericAndAllowed = !isOPeration && !currentEntry.isOperationsOnly;

        if (isNumericAndAllowed) {
            updateCurrentEntry(Number(buttonValueOrOperation));
            displayCurrentEntry();
        }
        if (isOPeration) {
            performOrCacheOperation(buttonValueOrOperation);
        }
    }

    function updateCurrentEntry(digit) {
        if (currentEntry.decimalMode) {
            currentEntry.decimalAmount += digit * Math.pow(10, currentEntry.powerOfTen--);
        } else {
            currentEntry.wholeAmount = (currentEntry.wholeAmount * 10) + digit;
        }
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
                break;
            case "clearentry":
                initializeCurrentEntry();
                displayCurrentEntry();
                break;
            case "add":
            case "subtract":
            case "multiply":
            case "divide":
                operationStack.push(currentEntry.amount);
                operationStack.push(operation);
                initializeCurrentEntry();
                displayOperator(operation);
                break;
            case "equals":
                setCurrentEntry(calculateStack());
                operationStack = [];
                displayCurrentEntry();
                currentEntry.isOperationsOnly = true;
                break;
        };
    }

    function displayOperator(operator) {
        display(operatorSymbols[operator]);
    }

    function calculateStack() {
        var runningTotal = operationStack[0];

        for (var stackItem = 1; stackItem < operationStack.length - 1; stackItem += 2) {
            runningTotal = mathOperation(operationStack[stackItem], runningTotal, operationStack[stackItem + 1]);
        }

        return mathOperation(operationStack[operationStack.length - 1], runningTotal, currentEntry.amount);
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

    function setCurrentEntry(amount) {
        currentEntry.wholeAmount = parseInt(amount, 10);
        currentEntry.decimalAmount = amount - currentEntry.wholeAmount;
        currentEntry.powerOfTen = null;
        currentEntry.decimalMode = false;
    }

    return {
        init: init
    };
}());

calc.init();
