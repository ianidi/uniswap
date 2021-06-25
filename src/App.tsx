import React from 'react';
import { VStack, Container, Flex, FormControl, FormLabel, Select, Input, Checkbox, Button, Progress } from "@chakra-ui/react"
import { request } from 'graphql-request'
import { GRAPHQL_API_URL } from './constants';
import { SWAPS_QUERY } from './gql';
import { Datepicker } from './components/Datepicker';
import { DataTable } from './components/DataTable';

export default function App() {
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [rangeCheckbox, setRangeCheckbox] = React.useState(false);

    const dateFrom = React.useMemo(() => new Date('2021-01-01T00:00:00'), []);
    const dateTo = React.useMemo(() => new Date('2021-06-01T00:00:00'), []);

    const handleDateFromChange = (date) => {
        // setTimestampFrom(date);
    };

    const handleDateToChange = (date) => {
        // setTimestampTo(date);
    };

    const find = async () => {
        try {
            setLoading(true)
            const res = await request(GRAPHQL_API_URL, SWAPS_QUERY, {
                sender: "0xe592427a0aece92de3edee1f18e0157c05861564"
            })
            setLoading(false)
            setData(res.swaps)
            console.log(JSON.stringify(data, undefined, 2))
        } catch (error) {
            console.error(JSON.stringify(error, undefined, 2))
            process.exit(1)
        }
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
                </FormControl>

            </Container>
            <Container maxW="container.sm">
                <Checkbox checked={rangeCheckbox} onChange={e => setRangeCheckbox(e.target.checked)}>Specify time range</Checkbox>

                {rangeCheckbox && <Flex mt={2} mb={4} container justifyContent="space-between">
                    <Datepicker callback={handleDateFromChange} value={dateFrom} placeholder="Date from" />
                    <Datepicker callback={handleDateToChange} value={dateTo} placeholder="Date to" />
                </Flex>}
            </Container>

            <Button variant="solid" colorScheme="blue" onClick={find}>
                Find transactions
            </Button>
        </VStack>

        {loading ? <Progress size="xs" isIndeterminate /> : (data.length > 0 && <DataTable data={data} />)}
    </>)
}
