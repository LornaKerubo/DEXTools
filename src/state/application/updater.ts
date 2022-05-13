import { useCallback, useEffect, useState } from 'react'
import { useSubgraphStatus } from './hooks'
import { useFetchedSubgraphStatus } from '../../data/application'
import useDebounce from '../../hooks/useDebounce'
import { useDispatch } from 'react-redux'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { useActiveWeb3React } from '../../hooks'
import { updateBlockNumber } from './actions'

export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const windowVisible = useIsWindowVisible()
  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null,
  })

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
        }
        return state
      })
    },
    [chainId, setState]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined

    setState({ chainId, blockNumber: null })

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible])

  const debouncedState = useDebounce(state, 100)

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

  // subgraph status
  const [status, updateStatus] = useSubgraphStatus()
  const { available, syncedBlock: newSyncedBlock, headBlock } = useFetchedSubgraphStatus()

  const syncedBlock = status.syncedBlock

  useEffect(() => {
    if (status.available === null && available !== null) {
      updateStatus(available, syncedBlock, headBlock)
    }
    if (!status.syncedBlock || (status.syncedBlock !== newSyncedBlock && syncedBlock)) {
      updateStatus(status.available, newSyncedBlock, headBlock)
    }
  }, [available, headBlock, newSyncedBlock, status.available, status.syncedBlock, syncedBlock, updateStatus])

  return null
}
