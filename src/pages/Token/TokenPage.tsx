import React, { useMemo, useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import {
  useTokenData,
  usePoolsForToken,
  useTokenChartData,
  useTokenPriceData,
  useTokenTransactions,
} from 'state/tokens/hooks'
import styled from 'styled-components'
import { useColor } from 'hooks/useColor'
import ReactGA from 'react-ga'
import { ThemedBackground, PageWrapper } from 'pages/styled'
import { shortenAddress, getEtherscanLink, currentTimestamp } from 'utils'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed, AutoRow, RowFlat } from 'components/Row'
import { TYPE, StyledInternalLink } from 'theme'
import Loader, { LocalLoader } from 'components/Loader'
import { ExternalLink, Download } from 'react-feather'
import { ExternalLink as StyledExternalLink } from '../../theme/components'
import useTheme from 'hooks/useTheme'
import CurrencyLogo from 'components/CurrencyLogo'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import { ButtonPrimary, ButtonGray, SavedIcon } from 'components/Button'
import { DarkGreyCard, LightGreyCard } from 'components/Card'
import { usePoolDatas } from 'state/pools/hooks'
import PoolTable from 'components/pools/PoolTable'
import LineChart from 'components/LineChart/alt'
import { unixToDate } from 'utils/date'
import { ToggleWrapper, ToggleElementFree } from 'components/Toggle/index'
import BarChart from 'components/BarChart/alt'
import CandleChart from 'components/CandleChart'
import TransactionTable from 'components/TransactionsTable'
import { useSavedTokens } from 'state/user/hooks'
import { ONE_HOUR_SECONDS, TimeWindow } from 'constants/intervals'
import { MonoSpace } from 'components/shared'
import dayjs from 'dayjs'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { networkPrefix } from 'utils/networkPrefix'
import { EthereumNetworkInfo } from 'constants/networks'
import { GenericImageWrapper } from 'components/Logo'
import NetworkDropdown from 'components/Menu/NetworkDropdown'
// import { SmallOptionButton } from '../../components/Button'
import { SponserContent } from '../Home'
import { useCMCLink } from 'hooks/useCMCLink'
import CMCLogo from '../../assets/images/cmc.png'
import etherscan from '../../assets/images/EtherScan.png'
import bscscan from '../../assets/images/bscscan.png'
import Vector from '../../assets/svg/Vector.svg'
import Coingecko from '../../assets/images/Coingecko.png'
import Earth from '../../assets/svg/Vector (1).svg'
import Dove from '../../assets/svg/Vector (2).svg'
import Pencil from '../../assets/svg/Vector (3).svg'
import last from '../../assets/svg/last.svg'
import uniswap from '../../assets/images/uniswap.png'
import pancakeswap from '../../assets/images/pancakeswap.png'
import Inch from '../../assets/images/1Inch.png'
import SwapIcon from '../../assets/svg/SwapIcon.svg'
import { useWeb3React } from '@web3-react/core'

const PriceText = styled(TYPE.label)`
  font-size: 36px;
  line-height: 0.8;
`

const ContentLayout = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-gap: 1em;

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const ResponsiveRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-start;
    row-gap: 24px;
    width: 100%:
  `};
`

const StyledCMCLogo = styled.img`
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const DataCard = styled(DarkGreyCard)`
  border-radius: 1px;
  margin: 2rem 0;

  @media screen and (max-width: 1080px) {
    display: none;
  }
`

const DataShowCard = styled(DarkGreyCard)`
  border-radius: 1px;
  display: none;
  margin: 2rem 0;

  @media screen and (max-width: 1080px) {
    display: block;
  }
`

const DataChildGreyCard = styled(DarkGreyCard)`
  border-radius: 1px;
  // width: ${(props) => (props.hidden ? '100%' : 'block')};

  @media screen and (max-width: 1080px) {
    width: 100%;
  }
`

const SwapButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.bg3};
`

const TokenContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;

  @media screen and (max-width: 1080px) {
    display: block;
    text-algin: center;
  }
`

const Box = styled(AutoColumn)`
  display: flex;
  text-align: center;

  @media screen and (max-width: 1080px) {
    margin: 0.6rem auto;
    justify-content: center;
  }
`

const TokenColumn = styled(AutoColumn)`
  padding: 0.2rem 0.5rem;
`

const TokenImage = styled.img`
  margin: 0 0.3rem;

  @media screen and (max-width: 1080px) {
    margin: 0 0.15rem;
  }
`

const ToggleChildWrapper = styled(ToggleWrapper)`
  background: ${({ theme }) => theme.bg3};
  border-radius: 15px;
  padding: 3px;
  border: ${({ theme }) => '2px solid ' + theme.bg3};
`
const ResponsiveBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 0.8rem 0.1rem;
`

const TokenMainContent = styled.div`
  width: 100%;
  display: ${(props) => (props.hidden ? 'none' : 'block')};

  @media screen and (max-width: 1080px) {
    width: 100% !important;
  }
`

const SwapContent = styled(Box)`
  @media screen and (max-width: 1080px) {
    display: none;
  }
`

const SponserTokenContent = styled(SponserContent)`
  height: 350px;
  margin: 3.5rem 0 1rem 0.5rem;

  @media screen and (max-width: 1080px) {
    width: 98%;
  }
`

const SponserTokenChildContent = styled(SponserTokenContent)`
  width: 50%;
  height: 160px;
  margin: 1rem 0 1rem 0.5rem;
`

const SponserHidden = styled.div`
  display: none;
  width: 100%;

  @media screen and (max-width: 1080px) {
    display: block;
  }
`

const SponserShow = styled.div`
  display: block;

  @media screen and (max-width: 1080px) {
    display: none;
  }
`

enum ChartView {
  TVL,
  VOL,
  PRICE,
}

const DEFAULT_TIME_WINDOW = TimeWindow.WEEK

export default function TokenPage({
  match: {
    params: { address },
  },
}: RouteComponentProps<{ address: string }>) {
  const [activeNetwork] = useActiveNetworkVersion()

  address = address.toLowerCase()
  // theming
  const backgroundColor = useColor(address)
  const theme = useTheme()

  // scroll on page view
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { active } = useWeb3React()
  const tokenData = useTokenData(address)
  const poolsForToken = usePoolsForToken(address)
  const poolDatas = usePoolDatas(poolsForToken ?? [])
  const transactions = useTokenTransactions(address)
  const chartData = useTokenChartData(address)

  // check for link to CMC
  const cmcLink = useCMCLink(address)

  // format for chart component
  const formattedTvlData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.totalValueLockedUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  const formattedVolumeData = useMemo(() => {
    if (chartData) {
      return chartData.map((day) => {
        return {
          time: unixToDate(day.date),
          value: day.volumeUSD,
        }
      })
    } else {
      return []
    }
  }, [chartData])

  // chart labels
  const [view, setView] = useState(ChartView.PRICE)
  const [latestValue, setLatestValue] = useState<number | undefined>()
  const [valueLabel, setValueLabel] = useState<string | undefined>()
  const [timeWindow] = useState(DEFAULT_TIME_WINDOW)

  // pricing data
  const priceData = useTokenPriceData(address, ONE_HOUR_SECONDS, timeWindow)
  const adjustedToCurrent = useMemo(() => {
    if (priceData && tokenData && priceData.length > 0) {
      const adjusted = Object.assign([], priceData)
      adjusted.push({
        time: currentTimestamp() / 1000,
        open: priceData[priceData.length - 1].close,
        close: tokenData?.priceUSD,
        high: tokenData?.priceUSD,
        low: priceData[priceData.length - 1].close,
      })
      return adjusted
    } else {
      return undefined
    }
  }, [priceData, tokenData])

  // watchlist
  const [savedTokens, addSavedToken] = useSavedTokens()

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={backgroundColor} />
      {tokenData ? (
        !tokenData.exists ? (
          <LightGreyCard style={{ textAlign: 'center' }}>
            No pool has been created with this token yet. Create one
            <StyledExternalLink style={{ marginLeft: '4px' }} href={`https://app.uniswap.org/#/add/${address}`}>
              here.
            </StyledExternalLink>
          </LightGreyCard>
        ) : (
          <TokenMainContent>
            <AutoColumn gap="32px">
              <RowBetween>
                <AutoRow gap="4px">
                  <StyledInternalLink to={networkPrefix(activeNetwork)}>
                    <TYPE.main>{`Home > `}</TYPE.main>
                  </StyledInternalLink>
                  <StyledInternalLink to={networkPrefix(activeNetwork) + 'tokens'}>
                    <TYPE.label>{` Tokens `}</TYPE.label>
                  </StyledInternalLink>
                  <TYPE.main>{` > `}</TYPE.main>
                  <TYPE.label>{` ${tokenData.symbol} `}</TYPE.label>
                  <StyledExternalLink href={getEtherscanLink(1, address, 'address', activeNetwork)}>
                    <TYPE.main>{` (${shortenAddress(address)}) `}</TYPE.main>
                  </StyledExternalLink>
                </AutoRow>
              </RowBetween>
              <SponserContent hidden={active} />
            </AutoColumn>
            <DataCard style={{ padding: '2rem' }}>
              <TokenContent>
                <AutoColumn gap="md">
                  <RowFixed gap="lg">
                    <CurrencyLogo address={address} />
                    <TYPE.label ml={'10px'} fontSize="20px">
                      {tokenData.name}
                    </TYPE.label>
                    <TYPE.main ml={'6px'} fontSize="20px">
                      ({tokenData.symbol})
                    </TYPE.main>
                    {activeNetwork === EthereumNetworkInfo ? null : (
                      <GenericImageWrapper src={activeNetwork.imageURL} style={{ marginLeft: '8px' }} size={'26px'} />
                    )}
                  </RowFixed>
                  <RowFlat style={{ marginTop: '8px' }}>
                    <PriceText mr="10px"> {formatDollarAmount(tokenData.priceUSD)}</PriceText>
                    (<Percent value={tokenData.priceUSDChange} />)
                  </RowFlat>
                </AutoColumn>
                <Box gap="lg">
                  <TokenContent>
                    <TokenColumn gap="4px">
                      <TYPE.main fontWeight={400}>TVL</TYPE.main>
                      <TYPE.label fontSize="24px">{formatDollarAmount(tokenData.tvlUSD)}</TYPE.label>
                      <Percent value={tokenData.tvlUSDChange} />
                    </TokenColumn>
                    <TokenColumn gap="4px">
                      <TYPE.main fontWeight={400}>24h Trading Vol</TYPE.main>
                      <TYPE.label fontSize="24px">{formatDollarAmount(tokenData.volumeUSD)}</TYPE.label>
                      <Percent value={tokenData.volumeUSDChange} />
                    </TokenColumn>
                    <TokenColumn gap="4px">
                      <TYPE.main fontWeight={400}>7d Trading Vol</TYPE.main>
                      <TYPE.label fontSize="24px">{formatDollarAmount(tokenData.volumeUSDWeek)}</TYPE.label>
                    </TokenColumn>
                    <TokenColumn gap="4px">
                      <TYPE.main fontWeight={400}>24h Fees</TYPE.main>
                      <TYPE.label fontSize="24px">{formatDollarAmount(tokenData.feesUSD)}</TYPE.label>
                    </TokenColumn>
                  </TokenContent>
                </Box>
                <RowFixed justify="center">
                  <SavedIcon fill={savedTokens.includes(address)} onClick={() => addSavedToken(address)} />
                  {cmcLink && (
                    <StyledExternalLink
                      href={cmcLink}
                      style={{ marginLeft: '12px' }}
                      onClickCapture={() => {
                        ReactGA.event({
                          category: 'CMC',
                          action: 'CMC token page click',
                        })
                      }}
                    >
                      <StyledCMCLogo src={CMCLogo} />
                    </StyledExternalLink>
                  )}
                  <StyledExternalLink href={getEtherscanLink(1, address, 'address', activeNetwork)}>
                    <ExternalLink stroke={theme.text2} size={'17px'} style={{ marginLeft: '12px' }} />
                  </StyledExternalLink>
                </RowFixed>
              </TokenContent>
              <TokenContent style={{ marginTop: '2rem', alignItems: 'center' }}>
                <Box gap="lg">
                  <TokenContent>
                    <TokenImage width={'30px'} src={etherscan} />
                    <TokenImage width={'30px'} src={bscscan} />
                    <TokenImage width={'30px'} src={Vector} />
                    <TokenImage width={'30px'} src={Coingecko} />
                    <TokenImage width={'30px'} src={Earth} />
                    <TokenImage width={'30px'} src={Dove} />
                    <TokenImage width={'30px'} src={Pencil} />
                    <TokenImage width={'30px'} src={last} />
                  </TokenContent>
                </Box>
                <Box gap="lg" style={{ width: '57%' }}>
                  <TokenColumn gap="4px">
                    <TYPE.main fontWeight={400}>Best to Buy</TYPE.main>
                    <Box>
                      <TokenImage width={'30px'} src={uniswap} />
                      <TYPE.label fontSize="24px">$0.99</TYPE.label>
                    </Box>
                  </TokenColumn>
                  <TokenColumn gap="4px">
                    <TYPE.main fontWeight={400}>Best to Sell</TYPE.main>
                    <Box>
                      <TokenImage width={'30px'} src={pancakeswap} />
                      <TYPE.label fontSize="24px">$1.02</TYPE.label>
                    </Box>
                  </TokenColumn>
                  <TokenColumn gap="4px">
                    <TYPE.main fontWeight={400}>Available on</TYPE.main>
                    <Box>
                      <TokenImage width={'30px'} src={uniswap} />
                      <TokenImage width={'30px'} src={Inch} />
                      <TokenImage width={'30px'} src={pancakeswap} />
                    </Box>
                  </TokenColumn>
                </Box>
              </TokenContent>
            </DataCard>
            <DataShowCard style={{ padding: '1rem 0.5rem' }}>
              <ResponsiveBox>
                <AutoColumn gap="md">
                  <RowFixed gap="lg">
                    <CurrencyLogo address={address} />
                    <TYPE.label ml={'10px'} fontSize="20px">
                      {tokenData.name}
                    </TYPE.label>
                    <TYPE.main ml={'6px'} fontSize="20px">
                      ({tokenData.symbol})
                    </TYPE.main>
                    {activeNetwork === EthereumNetworkInfo ? null : (
                      <GenericImageWrapper src={activeNetwork.imageURL} style={{ marginLeft: '8px' }} size={'24px'} />
                    )}
                  </RowFixed>
                  <RowFlat style={{ marginTop: '8px' }}>
                    <PriceText mr="10px"> {formatDollarAmount(tokenData.priceUSD)}</PriceText>
                    (<Percent value={tokenData.priceUSDChange} />)
                  </RowFlat>
                </AutoColumn>
                <RowFixed justify="center">
                  <SavedIcon fill={savedTokens.includes(address)} onClick={() => addSavedToken(address)} />
                  {cmcLink && (
                    <StyledExternalLink
                      href={cmcLink}
                      style={{ marginLeft: '12px' }}
                      onClickCapture={() => {
                        ReactGA.event({
                          category: 'CMC',
                          action: 'CMC token page click',
                        })
                      }}
                    >
                      <StyledCMCLogo src={CMCLogo} />
                    </StyledExternalLink>
                  )}
                  <StyledExternalLink href={getEtherscanLink(1, address, 'address', activeNetwork)}>
                    <ExternalLink stroke={theme.text2} size={'17px'} style={{ marginLeft: '12px' }} />
                  </StyledExternalLink>
                </RowFixed>
              </ResponsiveBox>
              <ResponsiveBox>
                <TokenColumn gap="4px" style={{ textAlign: 'center' }}>
                  <TYPE.main fontWeight={400}>TVL</TYPE.main>
                  <TYPE.label fontSize="24px">{formatDollarAmount(tokenData.tvlUSD)}</TYPE.label>
                  <Percent value={tokenData.tvlUSDChange} />
                </TokenColumn>
                <TokenColumn gap="4px" style={{ textAlign: 'center' }}>
                  <TYPE.main fontWeight={400}>24h Trading Vol</TYPE.main>
                  <TYPE.label fontSize="24px">{formatDollarAmount(tokenData.volumeUSD)}</TYPE.label>
                  <Percent value={tokenData.volumeUSDChange} />
                </TokenColumn>
              </ResponsiveBox>
              <ResponsiveBox>
                <TokenColumn gap="4px" style={{ textAlign: 'center' }}>
                  <TYPE.main fontWeight={400}>7d Trading Vol</TYPE.main>
                  <TYPE.label fontSize="24px">{formatDollarAmount(tokenData.volumeUSDWeek)}</TYPE.label>
                </TokenColumn>
                <TokenColumn gap="4px" style={{ textAlign: 'center' }}>
                  <TYPE.main fontWeight={400}>24h Fees</TYPE.main>
                  <TYPE.label fontSize="24px">{formatDollarAmount(tokenData.feesUSD)}</TYPE.label>
                </TokenColumn>
              </ResponsiveBox>

              <TokenContent style={{ marginTop: '2rem', alignItems: 'center' }}>
                <Box gap="lg">
                  <TokenContent>
                    <TokenImage width={'30px'} src={etherscan} />
                    <TokenImage width={'30px'} src={bscscan} />
                    <TokenImage width={'30px'} src={Vector} />
                    <TokenImage width={'30px'} src={Coingecko} />
                    <TokenImage width={'30px'} src={Earth} />
                    <TokenImage width={'30px'} src={Dove} />
                    <TokenImage width={'30px'} src={Pencil} />
                    <TokenImage width={'30px'} src={last} />
                  </TokenContent>
                </Box>
                <Box gap="lg">
                  <TokenColumn gap="4px">
                    <TYPE.main fontWeight={400}>Best to Buy</TYPE.main>
                    <Box>
                      <TokenImage width={'30px'} src={uniswap} />
                      <TYPE.label fontSize="24px">$0.99</TYPE.label>
                    </Box>
                  </TokenColumn>
                  <TokenColumn gap="4px">
                    <TYPE.main fontWeight={400}>Best to Sell</TYPE.main>
                    <Box>
                      <TokenImage width={'30px'} src={pancakeswap} />
                      <TYPE.label fontSize="24px">$1.02</TYPE.label>
                    </Box>
                  </TokenColumn>
                  <TokenColumn gap="4px">
                    <TYPE.main fontWeight={400}>Available on</TYPE.main>
                    <Box>
                      <TokenImage width={'30px'} src={uniswap} />
                      <TokenImage width={'30px'} src={Inch} />
                      <TokenImage width={'30px'} src={pancakeswap} />
                    </Box>
                  </TokenColumn>
                </Box>
              </TokenContent>
              <Box>
                <ResponsiveRow align="flex-end">
                  {activeNetwork !== EthereumNetworkInfo ? null : (
                    <RowFixed style={{ margin: 'auto' }}>
                      <StyledExternalLink href={`https://app.uniswap.org/#/add/${address}`}>
                        <ButtonGray
                          width="170px"
                          mr="12px"
                          height={'100%'}
                          style={{ height: '44px', borderRadius: '1px' }}
                        >
                          <RowBetween>
                            <Download size={24} />
                            <div style={{ display: 'flex', alignItems: 'center' }}>Add Liquidity</div>
                          </RowBetween>
                        </ButtonGray>
                      </StyledExternalLink>
                      <StyledExternalLink href={`https://app.uniswap.org/#/swap?inputCurrency=${address}`}>
                        <ButtonPrimary width="100px" style={{ height: '44px', borderRadius: '1px' }}>
                          <TokenImage width={'25px'} src={SwapIcon} style={{ marginRight: '0.2rem' }} />
                          Swap
                        </ButtonPrimary>
                      </StyledExternalLink>
                    </RowFixed>
                  )}
                </ResponsiveRow>
              </Box>
            </DataShowCard>
            <Box style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <NetworkDropdown />
              <SwapContent>
                <ResponsiveRow align="flex-end">
                  {activeNetwork !== EthereumNetworkInfo ? null : (
                    <RowFixed>
                      <StyledExternalLink href={`https://app.uniswap.org/#/add/${address}`}>
                        <ButtonGray
                          width="170px"
                          mr="12px"
                          height={'100%'}
                          style={{ height: '44px', borderRadius: '1px' }}
                        >
                          <RowBetween>
                            <Download size={24} />
                            <div style={{ display: 'flex', alignItems: 'center' }}>Add Liquidity</div>
                          </RowBetween>
                        </ButtonGray>
                      </StyledExternalLink>
                      <StyledExternalLink href={`https://app.uniswap.org/#/swap?inputCurrency=${address}`}>
                        <ButtonPrimary width="100px" style={{ height: '44px', borderRadius: '1px' }}>
                          Swap
                        </ButtonPrimary>
                      </StyledExternalLink>
                    </RowFixed>
                  )}
                </ResponsiveRow>
              </SwapContent>
            </Box>
            <DataChildGreyCard>
              <RowBetween align="flex-start">
                <AutoColumn>
                  <RowFixed>
                    <TYPE.label fontSize="24px" height="30px">
                      <MonoSpace>
                        {latestValue
                          ? formatDollarAmount(latestValue, 2)
                          : view === ChartView.VOL
                          ? formatDollarAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
                          : view === ChartView.TVL
                          ? formatDollarAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
                          : formatDollarAmount(tokenData.priceUSD, 2)}
                      </MonoSpace>
                    </TYPE.label>
                  </RowFixed>
                  <TYPE.main height="20px" fontSize="12px">
                    {valueLabel ? (
                      <MonoSpace>{valueLabel} (UTC)</MonoSpace>
                    ) : (
                      <MonoSpace>{dayjs.utc().format('MMM D, YYYY')}</MonoSpace>
                    )}
                  </TYPE.main>
                </AutoColumn>
                <ToggleChildWrapper width="220px">
                  <ToggleElementFree
                    isActive={view === ChartView.VOL}
                    fontSize="14px"
                    onClick={() => (view === ChartView.VOL ? setView(ChartView.TVL) : setView(ChartView.VOL))}
                  >
                    Volume
                  </ToggleElementFree>
                  <ToggleElementFree
                    isActive={view === ChartView.TVL}
                    fontSize="14px"
                    onClick={() => (view === ChartView.TVL ? setView(ChartView.PRICE) : setView(ChartView.TVL))}
                  >
                    TVL
                  </ToggleElementFree>
                  <ToggleElementFree
                    isActive={view === ChartView.PRICE}
                    fontSize="14px"
                    onClick={() => setView(ChartView.PRICE)}
                  >
                    Price
                  </ToggleElementFree>
                </ToggleChildWrapper>
              </RowBetween>
              {view === ChartView.TVL ? (
                <LineChart
                  data={formattedTvlData}
                  color={backgroundColor}
                  minHeight={340}
                  value={latestValue}
                  label={valueLabel}
                  setValue={setLatestValue}
                  setLabel={setValueLabel}
                />
              ) : view === ChartView.VOL ? (
                <BarChart
                  data={formattedVolumeData}
                  color={backgroundColor}
                  minHeight={340}
                  value={latestValue}
                  label={valueLabel}
                  setValue={setLatestValue}
                  setLabel={setValueLabel}
                />
              ) : view === ChartView.PRICE ? (
                adjustedToCurrent ? (
                  <CandleChart
                    data={adjustedToCurrent}
                    setValue={setLatestValue}
                    setLabel={setValueLabel}
                    color={backgroundColor}
                  />
                ) : (
                  <LocalLoader fill={false} />
                )
              ) : null}
              {/* <RowBetween width="100%">
                  <div> </div>
                  <AutoRow gap="4px" width="fit-content">
                    <SmallOptionButton
                      active={timeWindow === TimeWindow.DAY}
                      onClick={() => setTimeWindow(TimeWindow.DAY)}
                    >
                      24H
                    </SmallOptionButton>
                    <SmallOptionButton
                      active={timeWindow === TimeWindow.WEEK}
                      onClick={() => setTimeWindow(TimeWindow.WEEK)}
                    >
                      1W
                    </SmallOptionButton>
                    <SmallOptionButton
                      active={timeWindow === TimeWindow.MONTH}
                      onClick={() => setTimeWindow(TimeWindow.MONTH)}
                    >
                      1M
                    </SmallOptionButton>
                    <SmallOptionButton
                      active={timeWindow === TimeWindow.DAY}
                      onClick={() => setTimeWindow(TimeWindow.DAY)}
                    >
                      All
                    </SmallOptionButton>
                  </AutoRow>
                </RowBetween> */}
            </DataChildGreyCard>
            <TokenContent>
              <SponserHidden>
                <TokenMainContent>
                  <SponserTokenContent hidden={active} />
                  <Box>
                    <SponserTokenChildContent hidden={active} />
                    <SponserTokenChildContent hidden={active} />
                  </Box>
                  <Box>
                    <SponserTokenChildContent hidden={active} />
                    <SponserTokenChildContent hidden={active} />
                  </Box>
                </TokenMainContent>
              </SponserHidden>
              <TokenMainContent>
                <TYPE.main my={'1rem'} fontSize="20px" fontWeight="500">
                  Pools
                </TYPE.main>
                <DataChildGreyCard>
                  <PoolTable poolDatas={poolDatas} />
                </DataChildGreyCard>
                <TYPE.main my={'1rem'} fontSize="20px" fontWeight="500">
                  Transactions
                </TYPE.main>
                <DataChildGreyCard>
                  {transactions ? (
                    <TransactionTable transactions={transactions} color={backgroundColor} />
                  ) : (
                    <LocalLoader fill={false} />
                  )}
                </DataChildGreyCard>
              </TokenMainContent>
              <TokenMainContent style={{ width: '650px' }} hidden={active}>
                <SponserShow>
                  <SponserTokenContent hidden={active} />
                  <Box>
                    <SponserTokenChildContent hidden={active} />
                    <SponserTokenChildContent hidden={active} />
                  </Box>
                  <Box>
                    <SponserTokenChildContent hidden={active} />
                    <SponserTokenChildContent hidden={active} />
                  </Box>
                </SponserShow>
              </TokenMainContent>
            </TokenContent>
          </TokenMainContent>
        )
      ) : (
        <Loader />
      )}
    </PageWrapper>
  )
}
