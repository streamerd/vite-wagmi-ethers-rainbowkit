import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'

import { Account } from './components'

import { useCallback, useEffect } from 'react'
import { useEthersSigner } from './hooks'

export function App() {
  const { isConnected, address } = useAccount()
  const signer = useEthersSigner({ chainId: 5 })
  // or useSigner() from legacy wagmi versions: const { data: signer } = useSigner()

  const tokenboundClient = new TokenboundClient({ signer, chainId: 5 })

  useEffect(() => {
    async function testTokenboundClass() {
      const account = await tokenboundClient.getAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '9',
      })

      const preparedExecuteCall = await tokenboundClient.prepareExecuteCall({
        account: account,
        to: account,
        value: 0n,
        data: '',
      })

      const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '1',
      })

      console.log('getAccount', account)
      console.log('prepareExecuteCall', preparedExecuteCall)
      console.log('preparedAccount', preparedAccount)

      // if (signer) {
      // signer?.sendTransaction(preparedAccount)
      // signer?.sendTransaction(preparedExecuteCall)
      // }
    }

    testTokenboundClass()
  }, [tokenboundClient])

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const createAccount = await tokenboundClient.createAccount({
      tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
      tokenId: '1',
    })
  }, [tokenboundClient])

  const executeCall = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedCall = await tokenboundClient.executeCall({
      account: address,
      to: address,
      value: 0n,
      data: '0x',
    })
  }, [tokenboundClient])

  return (
    <>
      <h1>Ethers 5 Signer + RainbowKit + Vite</h1>
      <ConnectButton />
      {isConnected && <Account />}
      {address && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            margin: '32px 0 0',
            maxWidth: '320px',
          }}
        >
          <button onClick={() => executeCall()}>EXECUTE CALL</button>
          <button onClick={() => createAccount()}>CREATE ACCOUNT</button>
        </div>
      )}
    </>
  )
}
