import React, { useMemo, useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAllTokenData } from 'state/tokens/hooks'
import { GreyCard } from 'components/Card'
import { TokenData } from 'state/tokens/reducer'
import { AutoColumn } from 'components/Column'
import { RowFixed, RowFlat } from 'components/Row'
import CurrencyLogo from 'components/CurrencyLogo'
import { TYPE, StyledInternalLink } from 'theme'
import { formatDollarAmount } from 'utils/numbers'
import Percent from 'components/Percent'
import HoverInlineText from 'components/HoverInlineText'

const CardWrapper = styled(StyledInternalLink)`
  width: auto;
  margin-right: 12px;

  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const FixedContainer = styled(AutoColumn)`
  width: 70%;
  margin-bottom: 20px;
  @media (max-width: 1080px) {
    width: 100%;
  }
`

export const ScrollableRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;

  ::-webkit-scrollbar {
    display: none;
  }
`
const ResponsiveChildRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const GreyChildCard = styled(GreyCard)`
  background-color: ${({ theme }) => theme.bg3};
`

const DataCard = ({ tokenData }: { tokenData: TokenData }) => {
  return (
    <CardWrapper to={'tokens/' + tokenData.address}>
      <GreyChildCard padding="5px 10px">
        <RowFixed>
          <ResponsiveChildRow>
            <TYPE.label fontSize="14px">
              <HoverInlineText text={tokenData.symbol} />
            </TYPE.label>
            <RowFlat>
              <Percent fontSize="14px" value={tokenData.priceUSDChange} />
            </RowFlat>
            <CurrencyLogo address={tokenData.address} size="22px" />
          </ResponsiveChildRow>
        </RowFixed>
      </GreyChildCard>
    </CardWrapper>
  )
}

export default function TopTokenMovers() {
  const allTokens = useAllTokenData()

  const topPriceIncrease = useMemo(() => {
    return Object.values(allTokens)
      .sort(({ data: a }, { data: b }) => {
        return a && b ? (Math.abs(a?.priceUSDChange) > Math.abs(b?.priceUSDChange) ? -1 : 1) : -1
      })
      .slice(0, Math.min(20, Object.values(allTokens).length))
  }, [allTokens])

  const increaseRef = useRef<HTMLDivElement>(null)
  const [increaseSet, setIncreaseSet] = useState(false)
  const [pauseAnimation, setPauseAnimation] = useState(false)
  const [resetInterval, setClearInterval] = useState<() => void | undefined>()

  useEffect(() => {
    if (!increaseSet && increaseRef && increaseRef.current) {
      setInterval(() => {
        if (increaseRef.current && increaseRef.current.scrollLeft !== increaseRef.current.scrollWidth) {
          increaseRef.current.scrollTo(increaseRef.current.scrollLeft + 1, 0)
          const scrollFlag = increaseRef.current.scrollWidth - increaseRef.current.clientWidth
          if (increaseRef.current.scrollLeft && increaseRef.current.scrollLeft == scrollFlag) {
            increaseRef.current.scrollLeft = 0
          }
        }
      }, 30)
      setIncreaseSet(false)
    }
  }, [increaseRef, increaseSet])

  function handleHover() {
    if (resetInterval) {
      resetInterval()
    }
    setPauseAnimation(true)
  }

  return (
    <FixedContainer gap="md">
      <ScrollableRow ref={increaseRef}>
        {topPriceIncrease.map((entry) =>
          entry.data ? <DataCard key={'top-card-token-' + entry.data?.address} tokenData={entry.data} /> : null
        )}
      </ScrollableRow>
    </FixedContainer>
  )
}
