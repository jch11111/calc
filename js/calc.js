var wikki = (function () {

    var init = function () {
        $(function () {
            setEventHandlers();
        })
    };

    function setEventHandlers() {
        $('a').click(function (event) {
            handleButtonClick(event.target.id);
        });
    }

    function handleButtonClick(buttonValueOrOperation) {
        $('#results').text(buttonValueOrOperation);
    }

    return {
        init: init
    };
}());

wikki.init();
