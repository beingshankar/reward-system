import React, { useEffect, useState } from "react";
import RewardsTable from './Components/RewardsTable.js';
import { calculateRewards } from './Utils/calculateRewards.js';
import columns from './models/columns';
import fetch from './db/dbService.js';
import totalsByColumns from './models/totalsByColumns';
import "./App.css";

function App() {
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    let isCompMounted = true
    fetch().then(data => {
      if (isCompMounted) {
        setTransactionData(calculateRewards(data))
      }

      return () => {
        isCompMounted = false;
      }
    })
    .catch(error => {
      setTransactionData(null)
    });
  },[]);

  return transactionData === null
      ?
    <div>Loading...</div>
      :
    <div>
      <RewardsTable
        title={'Points Rewards System Totals by Months'}
        columns={columns}
        data={transactionData.summaryByCustomer}
        pointsPerTransaction={transactionData.pointsPerTransaction}
        slotContent={true}
      />
      <RewardsTable
        title={'Points Rewards System Totals by Customer'}
        data={transactionData.totalPointsByCustomer}
        columns={totalsByColumns}
        pointsPerTransaction={transactionData.pointsPerTransaction}
      />
    </div>
}

export default App;
