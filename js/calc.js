var calc = (function () {

    var total = 0,
        currentEntry,
        operationStack = [];

    var init = function () {
        $(function () {
            setEventHandlers();
            initializeCurrentEntry();
            displayCurrentEntry();
        })
    };

    function setEventHandlers() {
        $('a').click(function (event) {
            handleButtonClick(event.target.id);
        });
    }

    function initializeCurrentEntry() {
        currentEntry = {
            wholeAmount: 0,
            decimalAmount: 0,
            powerOfTen: null,
            decimalMode: false
        };
    }

    function displayCurrentEntry() {
        $('#results').text(currentEntry.wholeAmount + currentEntry.decimalAmount);
    }

    function handleButtonClick(buttonValueOrOperation) {
        if (!isNaN(buttonValueOrOperation)) {
            updateCurrentEntry(Number(buttonValueOrOperation));
            displayCurrentEntry();
        } else {
            performOperation(buttonValueOrOperation);
        }
    }

    function updateCurrentEntry(digit) {
        if (currentEntry.decimalMode) {
            currentEntry.decimalAmount += digit * Math.pow(10, currentEntry.powerOfTen--);
        } else {
            currentEntry.wholeAmount = (currentEntry.wholeAmount * 10) + digit;
        }
    }

    function performOperation(operation) {
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
                operationStack.push(currentEntry.wholeAmount + currentEntry.decimalAmount);
                operationStack.push(operation);
                initializeCurrentEntry();
                break;
            case "equals":
                setCurrentEntry(calculateStack());
                operationStack = [];
                displayCurrentEntry();
                break;
        };
    }

    function calculateStack() {
        var runningTotal = operationStack[0];

        for (var stackItem = 1; stackItem < operationStack.length - 1; stackItem += 2) {
            runningTotal = mathOperation(operationStack[stackItem], runningTotal, operationStack[stackItem + 1]);
        }

        return mathOperation(operationStack[operationStack.length - 1], runningTotal, currentEntry.wholeAmount + currentEntry.decimalAmount);
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
