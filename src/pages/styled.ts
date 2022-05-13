import styled from 'styled-components'

export const PageWrapper = styled.div`
  width: 90%;
  margin-top: 1rem;

  @media (max-width: 1080px) {
    width: 96%;
  }
`

export const ThemedBackground = styled.div<{ backgroundColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  max-width: 100vw !important;
  height: 200vh;
  mix-blend-mode: color;
  transform: translateY(-176vh);
`

export const ThemedBackgroundGlobal = styled.div<{ backgroundColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  max-width: 100vw !important;
  height: 200vh;
  mix-blend-mode: color;
  transform: translateY(-150vh);
`
