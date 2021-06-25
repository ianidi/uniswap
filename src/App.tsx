import React from 'react';
import Web3 from 'web3';
import { VStack, Container, Flex, FormControl, FormLabel, Select, Input, Checkbox, Button, Progress, useToast } from "@chakra-ui/react"
import { request } from 'graphql-request'
import { useSelector, useDispatch } from "react-redux";
import { selectRangeCheckbox, setRangeCheckbox, selectWallet, setWallet, selectWalletType, setWalletType, selectTimestampFrom, setTimestampFrom, selectTimestampTo, setTimestampTo } from "./store/appSlice";
import { GRAPHQL_API_URL } from './constants';
import { SWAPS_QUERY } from './gql';
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

    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState([]);

    const dateFrom = React.useMemo(() => new Date('2021-01-01T00:00:00'), []);
    const dateTo = React.useMemo(() => new Date(), []);

    const handleDateFromChange = (date) => {
        dispatch(setTimestampFrom(date));
    };

    const handleDateToChange = (date) => {
        dispatch(setTimestampTo(date));
    };

    const find = async () => {
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
            setLoading(true)
            const res = await request(GRAPHQL_API_URL, SWAPS_QUERY, {
                sender: wallet,
                recipient: wallet,
                timestampFrom,
                timestampTo,
            })
            setLoading(false)
            setData(res.swaps)
        } catch (e) {
            console.error(JSON.stringify(e, undefined, 2))
        }
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

        {loading ? <Progress size="xs" isIndeterminate /> : (data.length > 0 && <DataTable data={data} />)}
    </>)
}
