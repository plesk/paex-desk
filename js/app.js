$(() => {
    let pleskApi = require('./js/plesk_api_client.js');

    let editor = CodeMirror.fromTextArea($('#fieldRequest').get(0), {
        mode: "text/html",
    });

    let formHandler = (event) => {
        if (event) {
            event.preventDefault();
        }

        let host = $('#fieldHost').val();
        let login = $('#fieldLogin').val();
        let password = $('#fieldPassword').val();
        let request = editor.getValue();

        let client = new pleskApi.Client(host);
        client.setCredentials(login, password);

        client.request(request, (response) => {
            $('#fieldResponse').text(response);
        });
    };

    editor.addKeyMap({
        "Cmd-Enter": () => {
            formHandler();
        },
        "Ctrl-Enter": () => {
            formHandler();
        }
    });

    $('form').on('submit', formHandler);
});
