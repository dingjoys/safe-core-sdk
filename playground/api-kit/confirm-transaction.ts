import SafeApiKit from '@safe-global/api-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'

// This file can be used to play around with the Safe Core SDK

interface Config {
  CHAIN_ID: bigint
  RPC_URL: string
  SIGNER_ADDRESS_PRIVATE_KEY: string
  SAFE_ADDRESS: string
  TX_SERVICE_URL: string
  SAFE_TX_HASH: string
}

const config: Config = {
  CHAIN_ID: BigInt(84532),
  RPC_URL: "https://maximum-spring-daylight.base-sepolia.quiknode.pro/f80c89e1e8f03bdb4eea77aa68bf8546d8862cc5/",
  SIGNER_ADDRESS_PRIVATE_KEY: 'e8bf34d06d398fa2998c1ec84e7e139f920d256eb43f20e8a9939f35f214bd7c',
  SAFE_ADDRESS: '0x559527a6D82Ac336821F2082c1cda49A4eB63588',
  TX_SERVICE_URL: 'https://safe-transaction-goerli.safe.global/', // Check https://docs.safe.global/safe-core-api/available-services
  SAFE_TX_HASH: '0x68e805a953646753fa1f327798f0c63254b240e41aea477e6bedf40464ef384a'
}

async function main() {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL)
  const signer = new ethers.Wallet(config.SIGNER_ADDRESS_PRIVATE_KEY, provider)

  // Create EthAdapter instance
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer
  })

  // Create Safe instance
  const safe = await Safe.create({
    ethAdapter,
    safeAddress: config.SAFE_ADDRESS
  })

  // Create Safe API Kit instance
  const service = new SafeApiKit({
    chainId: config.CHAIN_ID
  })


  console.log(config.SAFE_TX_HASH)

  // Get the transaction
  const transaction = await service.getTransaction(config.SAFE_TX_HASH)

  console.log(transaction)
  // const transactions = await service.getPendingTransactions()
  // const transactions = await service.getIncomingTransactions()
  // const transactions = await service.getMultisigTransactions()
  // const transactions = await service.getModuleTransactions()
  // const transactions = await service.getAllTransactions()

  const safeTxHash = transaction.safeTxHash
  const signature = await safe.signHash(safeTxHash)

  // Confirm the Safe transaction
  const signatureResponse = await service.confirmTransaction(safeTxHash, signature.data)

  const signerAddress = await signer.getAddress()
  console.log('Added a new signature to transaction with safeTxGas:', config.SAFE_TX_HASH)
  console.log('- Signer:', signerAddress)
  console.log('- Signer signature:', signatureResponse.signature)
}

main()
