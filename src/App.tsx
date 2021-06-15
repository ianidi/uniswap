import React, { useState, useEffect, useContext } from 'react';
import { gql, useQuery, NetworkStatus } from "@apollo/client";
import { getUnixTime } from "date-fns"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { TableComponent } from './Table';
import { Datepicker } from './components/datepicker';
//, timestamp_gte: "10000000000", timestamp_lte: "10000000000"
const SWAPS_QUERY = gql`
  query swaps($sender: String) {
    swaps(orderBy: timestamp, orderDirection: desc, where: { sender: $sender }) {
      id
      transaction { id }
      sender
      timestamp
      sender
      recipient
      origin
      token0 { symbol, name }
      token1 { symbol, name }
      amount0
      amount1
      amountUSD
    }
  }
`;

const AppContext = React.createContext({ sender: '' });

const Swaps = () => {
  const { sender } = useContext(AppContext);

  const { loading, error, data, refetch, networkStatus } = useQuery(SWAPS_QUERY, {
    variables: { sender },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    refetch();
  }, [sender])

  if (loading || networkStatus === NetworkStatus.refetch) {
    return <CircularProgress size={20} />;
  }

  if (error) {
    return <>{error.message}</>;
  }

  return (
    <>
      {data && data.swaps && data.swaps.length > 0 && <TableComponent rows={data.swaps} headCells={headCells} />}
    </>
  )
};

const headCells = [
  { id: "tx", disablePadding: true, label: "TX" },
  { id: "description", disablePadding: false, label: "Description" },
  { id: "date", disablePadding: false, label: "Date" },
  { id: "sender", disablePadding: false, label: "Sender" },
  { id: "recipient", disablePadding: false, label: "Recipient" },
  { id: "amountUSD", disablePadding: false, label: "USD amount" },
];

const App = () => {


  return (
    <div>
      <Form>
        <Swaps />
      </Form>
    </div>
  )
};


function Form({ children }) {
  const [wallet, setWallet] = useState("0xe592427a0aece92de3edee1f18e0157c05861564");
  const [sender, setSender] = useState("");
  const [dateFrom, setDateFrom] = React.useState(new Date('2021-01-01T00:00:00'));
  const [dateTo, setDateTo] = React.useState(new Date('2021-06-01T00:00:00'));

  const update = () => {
    setSender(wallet)
  }

  const handleDateFromChange = (date) => {
    setDateFrom(date);
  };

  const handleDateToChange = (date) => {
    setDateTo(date);
  };

  return (
    <div>
      <AppContext.Provider value={{ sender }}>
        <form noValidate autoComplete="off">
          <TextField label="Wallet address" value={wallet} onChange={e => setWallet(e.target.value)} style={{ minWidth: 400 }} />
        </form>
        <br />

        <Grid container alignItems="flex-start">
          <Datepicker callback={handleDateFromChange} value={dateFrom} placeholder="Date from" />
          <Datepicker callback={handleDateToChange} value={dateTo} placeholder="Date to" />
        </Grid>

        <br />

        <Button variant="contained" color="primary" onClick={update}>Search</Button>
        <br />
        {children}
      </AppContext.Provider>
    </div>
  );
}

export default App;
