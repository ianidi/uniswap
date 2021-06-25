import React from 'react';
import { VStack, Container, Flex, FormControl, FormLabel, Select, Input, Checkbox, Button, Progress, Table, Thead, Tbody, Tr, Th, Td, chakra } from "@chakra-ui/react"
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useTable, useSortBy } from "react-table"
import { getUnixTime } from "date-fns"
import { Datepicker } from './components/datepicker';

export default function App() {

    const [rangeCheckbox, setRangeCheckbox] = React.useState(false);
    const [dateFrom, setDateFrom] = React.useState(new Date('2021-01-01T00:00:00'));
    const [dateTo, setDateTo] = React.useState(new Date('2021-06-01T00:00:00'));
    const [timestampFrom, setTimestampFrom] = React.useState(0);
    const [timestampTo, setTimestampTo] = React.useState(getUnixTime(new Date()));

    const data = React.useMemo(
        () => [
            {
                tx: "inches",
                description: "millimetres (mm)",
                date: "25.4",
                sender: "25.4",
                recipient: "25.4",
                amountUSD: "25.4",
            },
        ],
        [],
    )

    const handleDateFromChange = (date) => {
        setTimestampFrom(date);
    };

    const handleDateToChange = (date) => {
        setTimestampTo(date);
    };

    return (<>
        <VStack mt={10} mb={10} spacing={4}>
            <Container maxW="container.sm">
                <FormControl id="email">
                    <FormLabel mb={3}>
                        <Flex align="center">
                            Enter&nbsp;
                            <Select variant="filled" maxWidth={120} size="sm">
                                <option value="sender" selected>Sender</option>
                                <option value="recipient">Recipient</option>
                            </Select>&nbsp;wallet address
                        </Flex>
                    </FormLabel>
                    <Input placeholder="Enter wallet address" size="md" />
                    {/* <FormHelperText>Please enter sender wallet address.</FormHelperText> */}
                </FormControl>

            </Container>
            <Container maxW="container.sm">
                <Checkbox checked={rangeCheckbox} onChange={e => setRangeCheckbox(e.target.checked)}>Specify time range</Checkbox>

                {rangeCheckbox && <Flex mt={2} mb={4} container justifyContent="space-between">
                    <Datepicker callback={handleDateFromChange} value={dateFrom} placeholder="Date from" />
                    <Datepicker callback={handleDateToChange} value={dateTo} placeholder="Date to" />
                </Flex>}
            </Container>

            <Button variant="solid" colorScheme="blue">
                Find transactions
            </Button>
        </VStack>

        <Container maxW="container.xl">
            <Progress size="xs" isIndeterminate />
            <DataTable data={data} />
        </Container>
    </>)
}

function DataTable({ data }) {


    const columns = React.useMemo(
        () => [
            {
                Header: "TX",
                accessor: "tx",
            },
            {
                Header: "Description",
                accessor: "description",
            },
            {
                Header: "Date",
                accessor: "date",
            },
            {
                Header: "Sender",
                accessor: "sender",
            },
            {
                Header: "Recipient",
                accessor: "recipient",
            },
            {
                Header: "USD amount",
                accessor: "amountUSD",
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