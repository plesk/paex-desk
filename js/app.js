$(() => {
    let pleskApi = require('./js/plesk_api_client.js');

    $('form').on('submit', (event) => {
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
    });
});
