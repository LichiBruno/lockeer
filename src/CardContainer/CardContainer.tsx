import * as React from "react";
import * as Styled from "./CardContainerStyles";
import { AccountData } from "./CardContainerTypes";
import * as OTPAuth from "otpauth";
import * as CryptoJS from "crypto-js";
import DeleteAccountModal from "../DeleteAccountModal";
import { config } from "../config";
import { Card, Heading, Paragraph, toaster, Text, Pane } from "evergreen-ui";
import { useTheme } from "evergreen-ui";

interface AccountProps {
  data: AccountData;
  onDelete: () => void;
}

const Account: React.FC<AccountProps> = ({ data, onDelete }) => {
  const [code, setCode] = React.useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const theme = useTheme();
  const colors = theme.colors;
  const secretKey = config.secret_key;
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);

    // Delete the account from Chrome's local storage
    chrome.storage.local.remove(data.accountName, function () {
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
      const formattedOtp = otp.slice(0, 3) + " " + otp.slice(3);
      setCode(formattedOtp);
    };

    // Refresh OTP immediately and then every 30 seconds
    refreshOTP();
    const intervalId = setInterval(refreshOTP, 30000); // 30000 milliseconds = 30 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [data]);

  const copyToClipboard = async (code: string) => {
    try {
      const codeWithoutSpaces = code.replace(/\s/g, "");
      await navigator.clipboard.writeText(codeWithoutSpaces);
      toaster.success("OTP copied", {
        duration: 2,
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Styled.StyledCard
      elevation={2}
      padding={16}
      marginBottom={20}
      background={data.color}
      borderRadius={10}
      width={"20rem"}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textTransform: "capitalize",
        }}
      >
        <Heading color={colors.tint2}>{data.provider}</Heading>
        <Text color={colors.gray200}>{data.accountName}</Text>
        <Heading
          size={900}
          cursor="pointer"
          color={colors.tint1}
          onClick={() => copyToClipboard(code)}
        >
          {code}
        </Heading>
        <button onClick={handleDelete}>Delete Account</button>
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </Styled.StyledCard>
  );
};

export default Account;
