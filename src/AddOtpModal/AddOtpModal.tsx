import * as React from "react";
import * as CryptoJS from "crypto-js";
import {
  Button,
  Card,
  Dialog,
  Pane,
  TextInputField,
} from "evergreen-ui";
import { config } from "../config";
import { darken } from 'polished'

interface IAddOtpModalProps {
  setCurrentView: React.Dispatch<string>;
}

const AddOtpModal = ({ setCurrentView }: IAddOtpModalProps) => {
  const [accountName, setAccountName] = React.useState("");
  const [provider, setProvider] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const secretKey = config.secret_key;

  const getBrandColor = (provider: string) => {
    const brandColors: { [key: string]: string } = {
      google: "rgb(219, 68, 55)",
      microsoft: "rgb(0, 120, 215)",
      apple: "rgb(0, 0, 0)",
      facebook: "rgb(24, 119, 242)",
      twitter: "rgb(29, 161, 242)",
      instagram: "rgb(228, 64, 95)",
      whatsapp: "rgb(37, 211, 102)",
      linkedin: "rgb(0, 119, 181)",
      amazon: "rgb(255, 153, 0)",
      dropbox: "rgb(0, 97, 255)",
      slack: "rgb(74, 21, 75)",
      github: "rgb(24, 23, 23)",
      netflix: "rgb(229, 9, 20)",
      spotify: "rgb(30, 215, 96)",
      pinterest: "rgb(189, 8, 28)",
      tiktok: "rgb(105, 201, 208)",
      snapchat: "rgb(255, 252, 0)",
      zoom: "rgb(45, 140, 255)",
      trello: "rgb(0, 121, 191)",
      lastpass: "rgb(211, 45, 39)",
      authy: "rgb(28, 30, 35)",
      dashlane: "rgb(34, 138, 230)",
      bitwarden: "rgb(23, 93, 220)",
    };

    const formattedCompanyName = provider.toLowerCase().trim();

    if (brandColors.hasOwnProperty(formattedCompanyName)) {
      const brandColor = brandColors[formattedCompanyName];
      const darkerBrandColor = darken(0.3, brandColor);
      const gradient = `linear-gradient(337deg, ${darkerBrandColor}, ${brandColor} 85%)`;
      return gradient;
    }

    return null;
  };

  const handleSubmit = (close: () => void) => {
    const brandColor = getBrandColor(provider);

    // encrypt the secret
    const ciphertext = CryptoJS.AES.encrypt(secret, secretKey).toString();

    // create the account data object
    const accountData = {
      accountName,
      provider,
      color: brandColor,
      code: ciphertext,
    };

    // save the account data to Chrome's local storage
    chrome.storage.local.set({ [accountName]: accountData }, function () {
      console.log("Account data saved", brandColor);
    });

    // clear the form
    setAccountName("");
    setProvider("");
    setSecret("");

    onClose();
  };

  const onClose = () => {
    setCurrentView("");
  };

  return (
    <Dialog
      isShown
      width={"30rem"}
      hasHeader={false}
      hasFooter={false}
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{ paddingTop: "2rem", marginBottom: "-2rem" }}
      >
        <TextInputField
          label="Account Name"
          placeholder="e.g. username"
          value={accountName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAccountName(e.target.value)
          }
          required
          width={"100%"}
        />
        <Card elevation={1} padding={16} marginBottom={16}>
          sad
        </Card>
        <TextInputField
          label="Provider"
          placeholder="e.g. google"
          value={provider}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProvider(e.target.value)
          }
          required
          width={"100%"}
        />
        <TextInputField
          label="Secret"
          placeholder="e.g. JBSWY3DPEHPK3PXP"
          value={secret}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSecret(e.target.value)
          }
          required
          width={"100%"}
        />
      </form>
      <Pane>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "2.4rem 0" }}>
          <Button appearance="minimal" onClick={onClose}>Cancel</Button>
          <Button intent="success" onClick={handleSubmit}>Add account</Button>
        </div>
      </Pane>
    </Dialog>
  );
};

export default AddOtpModal;
