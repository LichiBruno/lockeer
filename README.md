# lockeer 2FA Generator Chrome Extension

This is a Chrome extension that serves as a **2FA** code generator. It generates Time-based One-Time Password (**TOTP**) codes for various accounts.


## Installation

Before installing the extension, make sure you have Node.js and npm installed on your system.

  

1. Install [**Node.js**](https://nodejs.org) and [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) from the official website.

  

2. Clone this repository to your local machine.

  

3. Generate a secret key by running the following command in your terminal:

```
node generateSecretKey.js
```  

This will output a secret key that you'll need to add to the ```config.ts``` file.


4. Open the ```config.ts```  file and replace the placeholder value with your secret key.

```
export const config = {
secret_key: "YOUR_SECRET_KEY",
};
```
  

5. Run the following command to build the extension:

```
npm run build
```
  

6. Open Google Chrome and go to chrome://extensions.

- Enable the "Developer mode" toggle in the top right corner.

- Click on the "Load unpacked" button and select the **build** directory of this project.

The extension should now be added to Chrome.

  

## Usage

Once the extension is installed, you can click on the extension icon in the Chrome toolbar to open  lockeer.

- To add a new account, click on the "**Add OTP**" button and fill in the account details.

- To view the generated codes for your accounts, open the extension and they will be displayed on the respective account cards.

 - You can copy a code by clicking on it.

- To delete an account, click on the "Delete" icon button on the account card.
  

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue.


## License

This project is licensed under the MIT License.