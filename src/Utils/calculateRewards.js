export function calculateRewards(items) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let [byCustomer, totalPointsByCustomer, tot, totByCustomer] = [{}, {}, [], []];

  const pointsPerTransaction = items.map(transaction => {
      let points = 0
      const { amt, transactionDt } = transaction
      const [ over100 ] = [ amt - 100 ]
      const month = new Date(transactionDt).getMonth()

        if (amt > 100) {
          // A customer receives 2 points for every dollar spent over $100 in each transaction
          points += (over100 * 2) + 50;
        } else if (amt >= 50 && amt <= 100) {
          // plus 1 point for every dollar spent over $50 till $100 in each transaction
          points += (amt - 50);
        }

        return { ...transaction, points, month };
  });

  pointsPerTransaction.forEach(({custid, name, month, points}) => {

    if (!byCustomer[custid]) {
      byCustomer[custid] = [];
    }

    if (!totalPointsByCustomer[name]) {
      totalPointsByCustomer[name] = 0;
    }

    totalPointsByCustomer[name] += points;

    if (byCustomer[custid] && byCustomer[custid][month]) {
      byCustomer[custid][month].points += points;
      byCustomer[custid][month].monthNumber = month;
      byCustomer[custid][month].numTransactions++;
    } else {
      byCustomer[custid][month] = {
        custid,
        points,
        name,
        monthNumber: month,
        month: months[month],
        numTransactions: 1,
      }
    }
  });

  for (const custKey in byCustomer) {
    byCustomer[custKey].forEach(cRow => {
      tot.push(cRow);
    });
  }

  for (const [custKey, value] of Object.entries(totalPointsByCustomer)) {
    totByCustomer.push({
      name: custKey,
      points: value
    });
  }

  return {
    summaryByCustomer: tot,
    pointsPerTransaction,
    totalPointsByCustomer: totByCustomer
  };
}
