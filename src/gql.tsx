import { gql } from 'graphql-request'

export const SWAPS_QUERY_SENDER = gql`
query swaps($wallet: String, $timestampFrom: Int, $timestampTo: Int, $items: Int, $offset: Int) {
  swaps(first: $items, skip: $offset, orderBy: timestamp, orderDirection: asc, where: { sender: $wallet, timestamp_gte: $timestampFrom, timestamp_lte: $timestampTo }) {
    id
    transaction { id }
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

export const SWAPS_QUERY_RECIPIENT = gql`
  query swaps($wallet: String, $timestampFrom: Int, $timestampTo: Int, $items: Int, $offset: Int) {
    swaps(first: $items, skip: $offset, orderBy: timestamp, orderDirection: asc, where: { recipient: $wallet, timestamp_gte: $timestampFrom, timestamp_lte: $timestampTo }) {
      id
      transaction { id }
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

// offset to 0
// prev next