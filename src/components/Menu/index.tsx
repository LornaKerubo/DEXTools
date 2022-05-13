import React, { useRef } from 'react'
import { BookOpen, Code, Info, MessageCircle } from 'react-feather'
import Protocol from '../../assets/svg/protocol.svg'
import Terminal from '../../assets/svg/terminal.svg'
import Launch from '../../assets/svg/launch.svg'
import ToggleMenuIcon from '../../assets/svg/menu.svg'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

import { ExternalLink } from '../../theme'
import { ButtonGray } from 'components/Button'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 1px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 15rem;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 1px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 2.6rem;
  right: 0rem;
  z-index: 100;
`

const MenuItem = styled(ExternalLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
    opacity: 0.6;
  }
  > svg {
    margin-right: 8px;
  }
`
const MenuButton = styled(ButtonGray)`
  border-radius: 1px;
  margin: 0px 5px;
  height: 46px;
  padding: 8px 12px;
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <MenuButton onClick={toggle}>
        <img src={ToggleMenuIcon} />
      </MenuButton>
      {open && (
        <MenuFlyout>
          <MenuItem id="link" href="https://google.com/">
            <img width={'140px'} src={Protocol} alt="protocol" />
            <img width={'22px'} src={Launch} alt="launch" />
          </MenuItem>
          <MenuItem id="link" href="https://google.com/">
            <img width={'140px'} src={Terminal} alt="Terminal" />
            <img width={'22px'} src={Launch} alt="launch" />
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
