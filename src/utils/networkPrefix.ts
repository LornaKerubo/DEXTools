import { EthereumNetworkInfo, NetworkInfo } from 'constants/networks'

export function networkPrefix(activeNetwork: NetworkInfo) {
  const isEthereum = activeNetwork === EthereumNetworkInfo
  if (isEthereum) {
    return '/'
  }
  const prefix = '/' + activeNetwork.route.toLocaleLowerCase() + '/'
  return prefix
}
