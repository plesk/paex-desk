const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

// allow to work with invalid SSL certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let handleSquirrelEvent = () => {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = (command, args) => {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
        } catch (e) {}

        return spawnedProcess;
    };

    const spawnUpdate = (args) => {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            app.quit();
            return true;
    }
};

if (handleSquirrelEvent()) {
    return;
}

let createWindow = () => {
    let height = ('darwin' === process.platform) ? 590 : 610;
    mainWindow = new BrowserWindow({ width: 1020, height: height });
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
