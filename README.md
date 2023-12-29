# FFBE Data Exporter v2

This Chrome/Firefox extension is for exporting your data from FFBE.

### Building

1. First, decide whether you are targetting Chrome or Firefox. For Chrome, skip to step 2. For Firefox, the `manifest.json` file needs to be modified: replace

   ```
   "background": {
     "service_worker": "./static/js/background.js"
   },
   ```

   with

   ```
   "background": {
     "scripts": ["./static/js/background.js"]
   },
   ```

2. Install NodeJS
3. Run `npm install` and `npm build`. The build will create a new directory called `build` which will contain all the files needed to install the extension

### Installing the extension

Chrome:

- Go to `chrome://extensions` and check "Developer mode" on the top right of the screen
- Click `Load unpacked"
- Navigate to and select the `build` directory

Firefox:

- Pack the contents of the `build` directory into a .zip file
- Sign the extension
  - This is a fairly complicated step that is beyond the scope of this README. See https://extensionworkshop.com/documentation/publish/ for more information
- Go to `about:addons`
- Click `Extensions` on the left side of the screen
- Click on the settings icon on the same line as the `Manage Your Extensions` header
- Click `Install add-on from file`
- Navigate to and select the .cri file downlaoded from the Firefox addons portal

### Creating an OAuth credential for Google

When the extension is installed, it will log a redirect URL in the browser console. Take note of this URL, as it will be used later.

- Navigate to `https://console.cloud.google.com/apis/`
- Create a new project if needed
- Click on `Credentials` on the left side of the screen
- Click `CREATE CREDENTIALS` and select `OAuth client ID`
- Select `Web application`
- Click `Create`
- Add the redirect URL under `Authorized redirect URIs`
- Copy the Client ID and replace `client_id` in `src/background/index.ts` with the copied value
