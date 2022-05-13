import React, { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { darken } from 'polished'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { useProtocolData } from 'state/protocol/hooks'
import TokenTable from 'components/tokens/TokenTable'
import { PageWrapper, ThemedBackgroundGlobal } from 'pages/styled'
import TokenPairs from 'components/tokens/TokenPairs'
import { Label } from 'components/Text'
import { notEmpty } from 'utils'
import { useAllTokenData } from 'state/tokens/hooks'
import { useActiveNetworkVersion } from 'state/application/hooks'
import ArbitrumIcon from '../../assets/svg/arbitrum.svg'
import EthereumIcon from '../../assets/svg/ethereum.svg'
import Heart from '../../assets/svg/heart.svg'
import { useWeb3React } from '@web3-react/core'

const ResponsiveChildRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 1080px) {
    display: block;
    text-align: center;
  }
`

export const SponserContent = styled.div<{ hidden?: boolean }>`
  width: 100%;
  height: 200px;
  margin-top: 20px;
  background-color: ${({ theme }) => theme.bg3};
  display: ${(props) => (props.hidden ? 'none' : 'block')};
`

const SponserChildContent = styled(SponserContent)`
  width: 23%;

  @media (max-width: 1080px) {
    width: 48%;
    display: inline-flex;
    margin: 20px 2px 0 2px;
  }
`

const SponserChild = styled.div`
  width: 33%;

  @media (max-width: 1080px) {
    width: 100%;
  }
`

const TokenPairLabel = styled(Label)`
  margin: 10px 0px !important;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 1px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 1rem;
  width: fit-content;
  margin: 0 2px;
  padding: 8px 12px;
  font-weight: 500;
  height: 46px;
  &.${activeClassName} {
    border-radius: 1px;
    background-color: ${({ theme }) => theme.bg3};
    color: ${({ theme }) => theme.text1};
  }
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const HeaderLinks = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 1080px) {
    padding: 0.5rem;
    justify-content: center;
  } ;
`

export const ChildResponsiveRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { active } = useWeb3React()

  const [activeNetwork] = useActiveNetworkVersion()

  const [protocolData] = useProtocolData()

  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [liquidityHover, setLiquidityHover] = useState<number | undefined>()

  useEffect(() => {
    setLiquidityHover(undefined)
    setVolumeHover(undefined)
  }, [activeNetwork])

  // if hover value undefined, reset to current day value
  useEffect(() => {
    if (!volumeHover && protocolData) {
      setVolumeHover(protocolData.volumeUSD)
    }
  }, [protocolData, volumeHover])
  useEffect(() => {
    if (!liquidityHover && protocolData) {
      setLiquidityHover(protocolData.tvlUSD)
    }
  }, [liquidityHover, protocolData])

  const allTokens = useAllTokenData()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((t) => t.data)
      .filter(notEmpty)
  }, [allTokens])

  return (
    <PageWrapper>
      <ThemedBackgroundGlobal backgroundColor={activeNetwork.bgColor} />
      <AutoColumn gap="lg">
        <SponserContent hidden={active} />
        <ResponsiveChildRow>
          <SponserChild>
            <TokenPairLabel>Hot Pairs</TokenPairLabel>
            <TokenPairs />
          </SponserChild>
          <SponserChild>
            <TokenPairLabel>Top gainers</TokenPairLabel>
            <TokenPairs />
          </SponserChild>
          <SponserChild>
            <TokenPairLabel>Recently added</TokenPairLabel>
            <TokenPairs />
          </SponserChild>
        </ResponsiveChildRow>
        <ResponsiveChildRow>
          <SponserChildContent hidden={active} />
          <SponserChildContent hidden={active} />
          <SponserChildContent hidden={active} />
          <SponserChildContent hidden={active} />
        </ResponsiveChildRow>
        <HeaderLinks>
          <img width={'28px'} src={Heart} alt="Favourite" style={{ marginRight: '10px' }} />
          <StyledNavLink id={`pool-nav-link`} to={'/'} style={{ color: '#E926C3' }}>
            All
          </StyledNavLink>
          <StyledNavLink id={`stake-nav-link`} to={'/'} isActive={(match, { pathname }) => pathname === '/'}>
            <ChildResponsiveRow>
              <img width={'30px'} src={EthereumIcon} alt="Ethereum" />
              Ethereum
            </ChildResponsiveRow>
          </StyledNavLink>
          <StyledNavLink
            id={`stake-nav-link`}
            to={'/arbitrum'}
            isActive={(match, { pathname }) => pathname === '/arbitrum'}
          >
            <ChildResponsiveRow>
              <img width={'30px'} src={ArbitrumIcon} alt="Arbitrum" />
              Arbitrum
            </ChildResponsiveRow>
          </StyledNavLink>
        </HeaderLinks>
        <TokenTable tokenDatas={formattedTokens} />
      </AutoColumn>
    </PageWrapper>
  )
}
