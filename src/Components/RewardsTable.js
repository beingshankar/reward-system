import React from 'react';
import ReactTable from 'react-table';
import { getIndividualTransactions } from '../Utils/getIndividualTransactions.js';

const RewardsTable = ({title = 'Table', columns = [], pointsPerTransaction = [], data, pageSize = 5, slotContent = false }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-10">
          <h4>{title}</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <ReactTable
            data={data}
            defaultPageSize={pageSize}
            columns={columns}
            SubComponent={!slotContent ? null : (
              row => {
                  return (
                    <div>
                    {
                      getIndividualTransactions(row, pointsPerTransaction).map(tran => {
                      return <div className="container" key={`${tran.transactionDt}${tran.amt}`}>
                        <div className="row">
                          <div className="col-8">
                            <strong>Transaction Date:</strong> {tran.transactionDt} - <strong>Amount: $</strong>{tran.amt} - <strong>Points: </strong>{tran.points}
                          </div>
                        </div>
                      </div>
                    })
                    }
                    </div>
                  )
              }
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default RewardsTable;
