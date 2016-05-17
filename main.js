const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

// allow to work with invalid SSL certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let createWindow = () => {
    mainWindow = new BrowserWindow({width: 1000, height: 590});
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', () => mainWindow = null);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
