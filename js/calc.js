var wikki = (function () {

    var init = function () {
        $(function () {
            setEventHandlers();
        })
    };

    function setEventHandlers() {
        $('a').click(function (event) {
            $('#results').text(event.target.id);
        });
    }

    return {
        init: init
    };
}());

wikki.init();
