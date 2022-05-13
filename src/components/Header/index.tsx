import React from 'react'
import { NavLink } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import LogoDark from '../../assets/svg/logo_white.svg'
import Menu from '../Menu'
import { RowFixed } from '../Row'
import SearchSmall from 'components/Search'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { networkPrefix } from 'utils/networkPrefix'
import { AutoColumn } from 'components/Column'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from 'state/wallet/hooks'
import Web3Status from '../Web3Status'

const HeaderFrame = styled.div`
  display: flex;
  grid-template-columns: 1fr 120px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  background-color: ${({ theme }) => theme.bg0};

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    padding: 0.5rem 1rem;
    width: calc(100%);
    position: relative;
    display: grid;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1080px) {
    display: none;
  }
`

const HeaderRow = styled(RowFixed)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 75%;
  @media (max-width: 1080px) {
    display: none;
  }
`

const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  :hover {
    cursor: pointer;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
`

const SmallContentGrouping = styled.div`
  width: 100%;
  display: none;
  @media (max-width: 1080px) {
    display: initial;
  }
`

const ResponsiveChildRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const BalanceText = styled(Text)`
  padding: 5px;
  border-radius: 50px;
  background: black;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg3 : theme.bg3)};
  border-radius: 1px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  padding: 0px 3px 0px 5px;
`

export default function Header() {
  const { account } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [activeNetwork] = useActiveNetworkVersion()

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title to={networkPrefix(activeNetwork)}>
          <img width={'170px'} src={LogoDark} alt="logo" />
        </Title>
        <SearchSmall />
      </HeaderRow>
      <HeaderControls>
        <Menu />
        <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
          {account && userEthBalance ? (
            <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
              {userEthBalance?.toSignificant(4)} ETH
            </BalanceText>
          ) : null}
          <Web3Status />
        </AccountElement>
      </HeaderControls>
      <SmallContentGrouping>
        <AutoColumn gap="sm">
          <ResponsiveChildRow>
            <Title to={networkPrefix(activeNetwork)}>
              <img width={'170px'} src={LogoDark} alt="logo" />
            </Title>
            <Menu />
          </ResponsiveChildRow>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} ETH
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
          <SearchSmall />
        </AutoColumn>
      </SmallContentGrouping>
    </HeaderFrame>
  )
}
