<h1 align="center">
   my Continental Frontend
</h1>
<p align="center">
  <a href="#about">About</a> •
  <a href="#installation">Installation</a> •
  <a href="#application flow">Application Flow</a> •
</p>

## About
 This repository contains my Continental Frontend. The web application contains several routes for: settings, login, change password, news, etc.

 ## Installation
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Cordova Setup](#cordovaSetup)
  - [Execution](#execution)   

#### Prerequisites
* Node.js (last version)
* [click for install instructions](https://nodejs.dev/learn/how-to-install-nodejs)   


#### Setup
Install the following commands from terminal:
```
 npm install --silent
```
```
npm install react-scripts --silent
```
```
npm install @reduxjs/toolkit react-redux
```
```
npm install react-awesome-calendar
```
```
npm install @material-ui/core
```
```
npm install @material-ui/lab
```
```
npm install @material-ui/data-grid
```
```
npm install @material-ui/icons
```   
```
npm install moment --save
```
```
npm install mqtt
```
```
npm install react-dropzone
```
```
npm install jsqr-es6 --save
```

#### Execution
To start the application, run ``` npm start ``` in your terminal.

#### Cordova setup
- First, you have to install cordova:
```
npm install -g cordova
```
- Then, create another project for the cordova app with the following command: ```cordova create [your project name]``` and navigate in the new created folder (```cd [your project name]```). 
- Now, from the <i> myContinentalFrontend\package.json </i> copy the “scripts”, “dependencies” and “browserList” keys to <i> [your project name]\package.json </i>.
- You also need to copy the <i> myContinentalFrontend\src </i> and  <i> myContinentalFrontend\public </i> folders to <i> [your project name] </i> folder.
- You have to set some environment variables:
  - ```ANDROID_HOME``` - set it to your <i> C:/Users/[username]/AppData/Local/Android/Sdk </i> folder
  - ```ANDROID_SDK_ROOT``` - set it to your <i> C:/Users/[username]/AppData/Local/Android/Sdk </i> folder
  - ```CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL``` - set it to your gradle zip file e.g. ```.../gradle-6.9.1-bin.zip```
  - ```GRADLE_HOME``` - set it to your gradle bin folder e.g. ```.../gradle-6.9.1/bin```
  - ```PATH```
    - add %GRADLE_HOME%
    - add <i> C:/Users/[username]/AppData/Local/Android/Sdk/Tools/bin </i>
    - add <i> C:/Users/[username]/AppData/Local/Android/Sdk/platform-tools </i>
    - add <i> C:/Users/[username]/AppData/Local/Android/Sdk/emulator </i>
    - add <i> C:/Users/[username]/AppData/Local/Android/Sdk/tools </i>
- Add the following `<meta>` tags in the `<head>` of <i> [your cordova project]/public/index.html </i>: 
``` 
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
<meta name="format-detection" content="telephone=no">
<meta name="msapplication-tap-highlight" content="no">
<meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover"> 
```
- Add the following script tag just before `</body>` in <i> [your cordova project]/public/index.html </i>:
```
<script src="cordova.js" type="text/javascript"></script>
```
- Since <i> [your cordova project]/scr/index.js </i> file is the entry point we need to tweak it a bit so that the react dom loads after the “deviceready” event has been fired by cordova.
```
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const renderReactDom = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};

if (window.cordova) {
  document.addEventListener('deviceready', () => {
    renderReactDom();
  }, false);
} else {
  renderReactDom();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
```
- The index.html file within the build folder has absolute paths for loading the assets (js, css files). Since the HTML file is going to run directly in webview rather than being hosted on a server the assets need to be accessed using a relative path. For e.g. we want ```<script src=”./foo/bar.js”></script>``` instead of ```<script src="/foo/bar.js></script>```. The solution for this is to add a “homepage” property in package.json as metioned below. Adding this would make sure that the assets are fetched using a relative path in the index.html file. 
```"homepage": "./"```
- In the config.xml  of your cordova project, add the following text under ```<widget> ```
```
<hook type="before_prepare" src="scripts/prebuild.js" />
```
- Now, add a folder ```scripts``` in <i> [your cordova project] </i> folder, and in <i> scripts/ </i> create a ```prebuild.js``` file.
  - React-scripts generates the build output to the ```build/```folder and cordova uses ```www/``` as its input directory. So once the react build is completed we need to rename ```build/``` to ```www/```.
- For the prebuild.js file to work, you need to install a new module: ```npm i rimraf --save```
- The content of the prebuild.js file:
```
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');

function renameOutputFolder(buildFolderPath, outputFolderPath) {
    return new Promise((resolve, reject) => {
        fs.rename(buildFolderPath, outputFolderPath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve('Successfully built!');
            }
        });
    });
}

function execPostReactBuild(buildFolderPath, outputFolderPath) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(buildFolderPath)) {
            if (fs.existsSync(outputFolderPath)) {
                rimraf(outputFolderPath, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    renameOutputFolder(buildFolderPath, outputFolderPath)
                        .then(val => resolve(val))
                        .catch(e => reject(e));
                });
            } else {
                renameOutputFolder(buildFolderPath, outputFolderPath)
                    .then(val => resolve(val))
                    .catch(e => reject(e));
            }
        } else {
            reject(new Error('build folder does not exist'));
        }
    });
}

module.exports = () => {
    const projectPath = path.resolve(process.cwd(), './node_modules/.bin/react-scripts');
    return new Promise((resolve, reject) => {
        exec(`${projectPath} build`,
            (error) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }
                execPostReactBuild(path.resolve(__dirname, '../build/'), path.join(__dirname, '../www/'))
                    .then((s) => {
                        console.log(s);
                        resolve(s);
                    })
                    .catch((e) => {
                        console.error(e);
                        reject(e);
                    });
            });
    });
};
```
- Now execute the following commands in your cordova project terminal
  - ```cordova platform add android```
  - ```cordova run android``` or if you only need the .apk file: ```cordova build android```

- For more details, go <a href="https://medium.com/@pshubham/using-react-with-cordova-f235de698cc3">here</a>
## Application Flow

Every user can login in the app. If the user forgot his password he can change it, but he has to confirm his email to complete the action. If the user did not confirm his account on registration, the content page will not be shown. An admin has the right to update/delete and add an item from the inventory (alongside the standard user opperations). A standard user can only see the items in his custody, take and declare broken items.
