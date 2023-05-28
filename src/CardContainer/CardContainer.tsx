import * as React from "react";
import { AccountData } from "./CardContainerTypes";
import * as OTPAuth from "otpauth";
import * as CryptoJS from "crypto-js";
import DeleteAccountModal from "../DeleteAccountModal";

interface AccountProps {
  data: AccountData;
  onDelete: () => void;
}

const Account: React.FC<AccountProps> = ({ data, onDelete }) => {
  const [code, setCode] = React.useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const secretKey = process.env.SECRET_KEY
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
  
    // Delete the account from Chrome's local storage
    chrome.storage.local.remove(data.accountName, function() {
      console.log('Account deleted');
  
      // Trigger a re-render of the parent component
      onDelete();
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  React.useEffect(() => {
    // Decrypt the secret
    const bytes = CryptoJS.AES.decrypt(data.code, secretKey);
    const decryptedSecret = bytes.toString(CryptoJS.enc.Utf8);

    // Generate a new OTP
    const totp = new OTPAuth.TOTP({
      secret: decryptedSecret,
      digits: 6,
      period: 30,
      algorithm: "SHA1",
    });

    // Function to refresh OTP
    const refreshOTP = () => {
      const otp = totp.generate();
      setCode(otp);
    };

    // Refresh OTP immediately and then every 30 seconds
    refreshOTP();
    const intervalId = setInterval(refreshOTP, 30000); // 30000 milliseconds = 30 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [data]);

  return (
    <div className="account">
      <h2>{data.accountName}</h2>
      <p>Provider: {data.provider}</p>
      <p>Code: {code}</p>
      <button onClick={handleDelete}>Delete Account</button>
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Account;
