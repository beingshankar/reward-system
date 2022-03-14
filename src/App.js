import React, { useState, useEffect } from "react";
import RewardsTable from './Components/RewardsTable.js';
import columns from './models/columns';
import totalsByColumns from './models/totalsByColumns';
import fetch from './db/dbService.js';
import { calculateRewards } from './Utils/calculateRewards.js';
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
      setTransactionData([])
    });
  },[]);

  return transactionData == null
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
        pageSize={5}
      />
      <RewardsTable
        title={'Points Rewards System Totals by Customer'}
        data={transactionData.totalPointsByCustomer}
        columns={totalsByColumns}
        pointsPerTransaction={transactionData.pointsPerTransaction}
        pageSize={5}
      />
    </div>
}

export default App;
