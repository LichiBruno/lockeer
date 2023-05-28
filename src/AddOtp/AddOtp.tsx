import * as React from "react";
import * as CryptoJS from "crypto-js";
import AccountData from "../Account";

const AddOtp: React.FC = () => {
  const [accountName, setAccountName] = React.useState("");
  const [provider, setProvider] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const secretKey = process.env.SECRET_KEY;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Encrypt the secret
    const ciphertext = CryptoJS.AES.encrypt(secret, secretKey).toString();

    // Create the account data object
    const accountData: AccountData = {
      accountName,
      provider, 
      code: ciphertext, // Save the encrypted secret as the code
    };

    // Save the account data to Chrome's local storage
    chrome.storage.local.set({ [accountName]: accountData }, function () {
      console.log("Account data saved");
    });

    // Clear the form
    setAccountName("");
    setProvider("");
    setSecret("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Account Name:
        <input
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
        />
      </label>
      <label>
        Provider:
        <input
          type="text"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          required
        />
      </label>
      <label>
        Secret:
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Account</button>
    </form>
  );
};

export default AddOtp;
