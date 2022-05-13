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

  @media (max-width: 1080px) {
    margin-right: 0px;
  }
`

const FixedContainer = styled(AutoColumn)``

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
const RowResponsiv = styled.div`
  display: flex;
  align-items: center;
`

const DataCard = ({ tokenData }: { tokenData: TokenData }) => {
  return (
    <CardWrapper to={'tokens/' + tokenData.address}>
      <GreyCard padding="7px 10px" borderRadius="1px">
        <ResponsiveChildRow>
          <RowResponsiv>
            <CurrencyLogo address={tokenData.address} size="22px" style={{ marginRight: '5px' }} />
            <TYPE.label fontSize="14px">
              <HoverInlineText text={tokenData.symbol} />
            </TYPE.label>
          </RowResponsiv>
          <RowResponsiv>
            <Percent fontSize="14px" value={tokenData.priceUSDChange} />
          </RowResponsiv>
        </ResponsiveChildRow>
      </GreyCard>
    </CardWrapper>
  )
}

export default function TokenPairs() {
  const allTokens = useAllTokenData()

  const topPriceIncrease = useMemo(() => {
    return Object.values(allTokens).slice(0, Math.min(5, Object.values(allTokens).length))
  }, [allTokens])

  return (
    <FixedContainer gap="sm">
      {topPriceIncrease.map((entry) =>
        entry.data ? <DataCard key={'top-card-token-' + entry.data?.address} tokenData={entry.data} /> : null
      )}
    </FixedContainer>
  )
}
