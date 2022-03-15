import {render, screen, cleanup } from '@testing-library/react';
import RewardsTable from '../RewardsTable';
import { calculateRewards } from '../../Utils/calculateRewards';
import React from 'react';
import columns from '../../models/columns';
import fetch from '../../db/dbService.js';

const data = [
    {
        'custid': 1,
        'month': "May",
        'monthNumber': 4,
        'name': "Acme",
        'numTransactions': 3,
        'points': 159
    },
    {
        'custid': 1,
        'month': "Jun",
        'monthNumber': 5,
        'name': "Acme",
        'numTransactions': 2,
        'points': 25
    }
]

describe('Rewards Table Component', () => {
    test('by default should have Table title', () => {
        const { getByText } = render(<RewardsTable/>);
        expect(getByText('Table')).toBeInTheDocument();
    });

    test('should display Table title passed down as props', () => {
        const title = 'Points Rewards System Totals by Months'
        const { getByText } = render(<RewardsTable title={title}/>);
        expect(getByText(title)).toBeInTheDocument();
    });

    test('should show collapsable icon for rows with child content', () => {
        const { container } = render(
            <RewardsTable
                slotContent={true}
                data={data}
                columns={columns}
            />);
        expect(container.querySelector('.rt-expander')).toBeVisible();
    });

    test('should hide collapsable icon for rows without child content', () => {
        const { container } = render(
            <RewardsTable
                slotContent={false}
                data={data}
                columns={columns}
            />);
        expect(container.querySelector('.rt-expander')).toBeNull();
    });

    test(`should show ${Object.keys(data[0]).length -1} columns if slotContent exists`, () => {
        const { getAllByRole } = render(
            <RewardsTable
                slotContent={true}
                data={data}
                columns={columns}
            />);
        expect(getAllByRole('columnheader').length).toEqual(Object.keys(data[0]).length -1);
    });

    test(`should show only ${Object.keys(data[0]).length -2} columns if no slotContent exists`, () => {
        const { getAllByRole } = render(
            <RewardsTable
                slotContent={false}
                data={data}
                columns={columns}
            />);
        expect(getAllByRole('columnheader').length).toEqual(Object.keys(data[0]).length -2);
    });

    test('should calculateRewards correctly', async () => {
        let transaction =[
            {
                custid: 1,
                name: "Acme",
                amt: 0,
                transactionDt: "05-01-2019"
            }
        ]
        const testAmountData = [0, 1, 49, 50, 51, 75, 99, 100, 101, 120, 150, 200]
        const testAmountPoints = [0, 0, 0, 0, 1, 25, 49, 50, 52, 90, 150, 250]

        for(const [key, amount] of Object.entries(testAmountData)) {
            transaction[0]['amt'] = amount
            expect(calculateRewards(transaction).pointsPerTransaction[0]['points']).toEqual(testAmountPoints[key])
        }
    })

    test('should calculate total Rewards correctly', async () => {
        let transaction =[
            {
                custid: 1,
                name: "Acme",
                amt: 0,
                transactionDt: "05-01-2019"
            }
        ]

        let [totalPoints, expectedPoints] = [0, 0]
        const testAmountData = [0, 1, 49, 50, 51, 75, 99, 100, 101, 120, 150, 200]
        const testAmountPoints = [0, 0, 0, 0, 1, 25, 49, 50, 52, 90, 150, 250]

        for(const [key, amount] of Object.entries(testAmountData)) {
            transaction[0]['amt'] = amount
            totalPoints += calculateRewards(transaction).totalPointsByCustomer[0]['points']
            expectedPoints += testAmountPoints[key]

            expect(totalPoints).toEqual(expectedPoints)
        }
    })
})
