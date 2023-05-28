import * as React from "react";
import * as ReactDOM from "react-dom";
import CardContainer from "./CardContainer";

interface AccountData {
  accountName: string;
  provider: string;
  code: string;
}

const App: React.FC = () => {
  const [accounts, setAccounts] = React.useState<AccountData[]>([]);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const refresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  React.useEffect(() => {
    chrome.storage.local.get(null, function (items) {
      const allAccounts: AccountData[] = Object.values(items);
      setAccounts(allAccounts);
    });
  }, [refreshKey]); // re-run this effect when refreshKey changes

  return (
    <>
    <h1>Sip</h1>
      {accounts.map((account) => (
        <CardContainer key={account.accountName} data={account} onDelete={refresh} />
      ))}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
