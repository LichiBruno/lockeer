import * as React from "react";
import * as ReactDOM from "react-dom";
import CardContainer from "./CardContainer";
import { Button, Pane, Text, ThemeProvider, defaultTheme } from "evergreen-ui";
import AddOtpModal from "./AddOtpModal";
import "./global.css";
import AccountData from "./Account";

const App: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<string>("");
  const handleClick = () => {
    setCurrentView("addOtp");
  };
  const [accounts, setAccounts] = React.useState<AccountData[]>([]);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const refresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  React.useEffect(() => {
    chrome.storage.local.get(null, function (items) {
      const allAccounts: AccountData[] = Object.values(items);
      setAccounts(allAccounts);
      refresh();
    });
  }, [refreshKey]);

  const myTheme = {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
    },
  };

  return (
    <ThemeProvider value={myTheme}>
      <div style={{ height: "50rem", width: "24rem" }}>
        <Button onClick={handleClick}>Add OTP</Button>
        <Text>OTP</Text>
        <Pane
          alignContent="center"
          display="flex"
          flexDirection="column"
          flexWrap="wrap"
        >
          {accounts.map((account) => (
            <CardContainer
              key={account.accountName}
              data={account}
              onDelete={refresh}
            />
          ))}
        </Pane>

        {currentView === "addOtp" && (
          <AddOtpModal setCurrentView={setCurrentView} />
        )}
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
