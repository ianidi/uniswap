import { gql } from 'graphql-request'

//, $timestampFrom: Int, $timestampTo: Int
//, timestamp_gte: $timestampFrom, timestamp_lte: $timestampTo

export const SWAPS_QUERY = gql`
  query swaps($sender: String) {
    swaps(first: 200, orderBy: timestamp, orderDirection: asc, where: { sender: $sender }) {
      id
      transaction { id }
      sender
      timestamp
      sender
      recipient
      origin
      token0 { symbol, name }
      token1 { symbol, name }
      amount0
      amount1
      amountUSD
    }
  }
`;