import filter from 'lodash/filter';

export function getIndividualTransactions(row, pointsPerTransaction) {
  let byCustMonth = filter(pointsPerTransaction, (tRow) => {
    return row.original.custid === tRow.custid && row.original.monthNumber === tRow.month;
  });
  return byCustMonth;
}
