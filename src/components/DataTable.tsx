import React from 'react';
import { format, fromUnixTime } from 'date-fns'
import NumberFormat from 'react-number-format';
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy } from "react-table"

export function DataTable({ data }) {
    const columns = React.useMemo(
        () => [
            {
                Header: "TX",
                accessor: row => <a href={`https://etherscan.io/tx/${row.transaction.id}`} target="_blank" rel="noreferrer noopener">view tx</a>,
            },
            {
                Header: "Description",
                accessor: row => `Swap ${row.amount0 > 0 ? row.amount0 : row.amount1} ${row.token1.symbol} for ${row.amount0 > 0 ? row.amount1 * -1 : row.amount0 * -1} ${row.token0.symbol}`,
            },
            {
                Header: "Date",
                accessor: row => format(fromUnixTime(row.timestamp), "yyyy-MM-dd HH:mm:ss"),
            },
            {
                Header: "Sender",
                accessor: row => <a href={`https://etherscan.io/address/${row.sender}`} target="_blank" rel="noreferrer noopener">{row.sender}</a>,
            },
            {
                Header: "Recipient",
                accessor: row => <a href={`https://etherscan.io/address/${row.recipient}`} target="_blank" rel="noreferrer noopener">{row.recipient}</a>,
            },
            {
                Header: "USD amount",
                accessor: row => <NumberFormat value={row.amountUSD} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={2} />,
            },
        ],
        [],
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data }, useSortBy)

    return (
        <Table {...getTableProps()}>
            <Thead>
                {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <Th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                isNumeric={column.isNumeric}
                            >
                                {column.render("Header")}
                                <chakra.span pl="4">
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <TriangleDownIcon aria-label="sorted descending" />
                                        ) : (
                                            <TriangleUpIcon aria-label="sorted ascending" />
                                        )
                                    ) : null}
                                </chakra.span>
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row)
                    return (
                        <Tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                    {cell.render("Cell")}
                                </Td>
                            ))}
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}