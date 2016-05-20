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
    });

    $('form').on('submit', formHandler);
});
