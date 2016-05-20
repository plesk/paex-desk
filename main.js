const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

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
    let height = ('darwin' === process.platform) ? 590 : 625;
    mainWindow = new BrowserWindow({ width: 1020, height: height });
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', () => mainWindow = null);
};

let setupMenu = () => {
    let menuTemplate = [{
        label: 'Edit',
        submenu: [
            { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
            { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
            { type: 'separator' },
            { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
            { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
            { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
            { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
        ]}
    ];

    if ('darwin' === process.platform) {
        let name = 'Plesk API Explorer';
        menuTemplate.unshift({
            label: name,
            submenu: [
                { label: 'About ' + name, role: 'about' },
                { type: 'separator' },
                { label: 'Services', role: 'services', submenu: [] },
                { type: 'separator' },
                { label: 'Hide ' + name, accelerator: 'Command+H', role: 'hide' },
                { label: 'Hide Others', accelerator: 'Command+Alt+H', role: 'hideothers' },
                { label: 'Show All', role: 'unhide' },
                { type: 'separator' },
                { label: 'Quit', accelerator: 'Command+Q', click: app.quit }
            ]
        });
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
};

app.on('ready', () => {
    createWindow();
    setupMenu();
});

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
