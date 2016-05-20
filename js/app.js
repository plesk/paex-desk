$(() => {
    let pleskApi = require('./js/plesk_api_client.js');

    let formHandler = (event) => {
        event.preventDefault();

        let host = $('#fieldHost').val();
        let login = $('#fieldLogin').val();
        let password = $('#fieldPassword').val();
        let request = $('#fieldRequest').val();

        let client = new pleskApi.Client(host);
        client.setCredentials(login, password);

        client.request(request, (response) => {
            $('#fieldResponse').text(response);
        });
    };

    $('#fieldRequest').on('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && (13 == event.keyCode)) {
            formHandler(event);
        }

        if (9 == event.keyCode) {
            event.preventDefault();
            let target = event.target;
            let tab = "  ";
            let start = target.selectionStart;
            let end = target.selectionEnd;
            target.value = target.value.slice(0,start).concat(tab).concat(target.value.slice(start,target.value.length));
            if (start == end) {
                target.selectionStart = target.selectionEnd = start + tab.length;
            } else {
                target.selectionStart = start + tab.length;
                target.selectionEnd = end + tab.length;
            }
        }
    });

    $('form').on('submit', formHandler);
});
