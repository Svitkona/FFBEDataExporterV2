# FFBE Data Exporter v2

This Chrome/Firefox extension is for exporting your data from FFBE.

### Building

Install NodeJS. Run `npm install` and `npm build`. The build will create a new directory called `build` which will contain all the files needed to install the extension

### Installing the extension

Chrome:

- Go to `chrome://extensions` and check "Developer mode" on the top right of the screen
- Click `Load unpacked"
- Navigate to and select the `build` directory

Firefox:

- Pack the contents of the `build` directory into a .zip file
- Go to `about:addons`
- Click `Extensions` on the left side of the screen
- Click on the settings icon on the same line as the `Manage Your Extensions` header
- Click `Install add-on from file`
- Navigate to and select the packed .zip file
