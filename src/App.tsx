import React from 'react';
import Web3 from 'web3';
import XLSX from "xlsx";
import { VStack, Container, Flex, FormControl, FormLabel, Select, Input, Checkbox, ButtonGroup, Button, Progress, useToast } from "@chakra-ui/react"
import { request } from 'graphql-request'
import { useSelector, useDispatch } from "react-redux";
import { selectRangeCheckbox, setRangeCheckbox, selectWallet, setWallet, selectWalletType, setWalletType, selectTimestampFrom, setTimestampFrom, selectTimestampTo, setTimestampTo, selectItems, setItems, selectOffset, prevOffset, nextOffset } from "./store/appSlice";
import { selectLoading, setLoading, selectData, setData } from "./store/dataSlice";
import { GRAPHQL_API_URL } from './constants';
import { SWAPS_QUERY_SENDER, SWAPS_QUERY_RECIPIENT } from './gql';
import { Datepicker } from './components/Datepicker';
import { DataTable } from './components/DataTable';

export default function App() {
    const dispatch = useDispatch();
    const toast = useToast()

    const rangeCheckbox = useSelector(selectRangeCheckbox);
    const wallet = useSelector(selectWallet);
    const walletType = useSelector(selectWalletType);
    const timestampFrom = useSelector(selectTimestampFrom);
    const timestampTo = useSelector(selectTimestampTo);
    const items = useSelector(selectItems);
    const offset = useSelector(selectOffset);

    const loading = useSelector(selectLoading);
    const data = useSelector(selectData);

    const dateFrom = React.useMemo(() => new Date('2021-01-01T00:00:00'), []);
    const dateTo = React.useMemo(() => new Date(), []);

    const handleDateFromChange = (date) => {
        dispatch(setTimestampFrom(date));
    };

    const handleDateToChange = (date) => {
        dispatch(setTimestampTo(date));
    };

    const find = async () => {
        if (loading) { return }

        if (!Web3.utils.isAddress(wallet)) {
            toast({
                title: "Invalid wallet address.",
                description: "Please enter a valid wallet address.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            return
        }

        try {
            dispatch(setLoading(true))

            if (walletType === "sender") {
                const res = await request(GRAPHQL_API_URL, SWAPS_QUERY_SENDER, {
                    wallet,
                    timestampFrom,
                    timestampTo,
                    items,
                    offset
                })
                dispatch(setData(res.swaps))
            } else {
                const res = await request(GRAPHQL_API_URL, SWAPS_QUERY_RECIPIENT, {
                    wallet,
                    timestampFrom,
                    timestampTo,
                    items,
                    offset
                })
                dispatch(setData(res.swaps))
            }

            dispatch(setLoading(false))

        } catch (e) {
            toast({
                title: "An error occured.",
                description: JSON.stringify(e, undefined, 2),
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            console.error(JSON.stringify(e, undefined, 2))
            dispatch(setLoading(false))
        }
    };

    const exportExcel = () => {
        if (loading || data.length === 0) { return }

        let exportWS = XLSX.utils.json_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, exportWS, "tx");
        XLSX.writeFile(wb, "tx.xlsx");
    };

    return (<>
        <VStack mt={10} mb={10} spacing={4}>
            <Container maxW="container.sm">
                <FormControl id="email">
                    <FormLabel mb={3}>
                        <Flex align="center">
                            Enter&nbsp;
                            <Select variant="filled" maxWidth={120} size="sm" onChange={e => dispatch(setWalletType(e.target.value))}>
                                <option value="sender" selected={walletType === "sender"}>Sender</option>
                                <option value="recipient" selected={walletType === "recipient"}>Recipient</option>
                            </Select>&nbsp;wallet address
                        </Flex>
                    </FormLabel>
                    <Input placeholder="Enter wallet address" size="md" autoComplete="off" value={wallet} onChange={e => dispatch(setWallet(e.target.value))} />
                </FormControl>
            </Container>
            <Container maxW="container.sm">
                <Checkbox defaultChecked={rangeCheckbox} onChange={e => dispatch(setRangeCheckbox(e.target.checked))}>Specify time range</Checkbox>
                {rangeCheckbox && <Flex mt={2} mb={4} container justifyContent="space-between">
                    <Datepicker callback={handleDateFromChange} value={dateFrom} placeholder="Date from" />
                    <Datepicker callback={handleDateToChange} value={dateTo} placeholder="Date to" />
                </Flex>}
            </Container>
            <Button variant="solid" colorScheme="blue" onClick={find}>Find transactions</Button>
        </VStack>

        {loading ? <Progress size="xs" isIndeterminate /> : (data.length > 0 && <>
            <Flex align="center" justify="space-between" ml={4} mr={4} mb={4}>
                <ButtonGroup variant="outline" spacing="2">
                    <Button onClick={() => { dispatch(prevOffset()); find(); }} disabled={offset === 0}>Previous</Button>
                    <Select variant="filled" maxWidth={140} size="md" onChange={e => { dispatch(setItems(e.target.value)); find(); }}>
                        <option value="100" selected={items === 100}>100 records</option>
                        <option value="200" selected={items === 200}>200 records</option>
                        <option value="300" selected={items === 300}>300 records</option>
                        <option value="400" selected={items === 400}>400 records</option>
                        <option value="500" selected={items === 500}>500 records</option>
                    </Select>
                    <Button onClick={() => { dispatch(nextOffset()); find(); }} disabled={data.length < offset}>Next</Button>
                </ButtonGroup>

                <Button variant="outline" colorScheme="green" onClick={exportExcel}>Download Excel</Button>
            </Flex>

            <DataTable data={data} />
        </>)}
    </>)
}
