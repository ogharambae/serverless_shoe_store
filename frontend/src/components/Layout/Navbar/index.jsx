import React, { useState } from "react";
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem,
} from "baseui/header-navigation";
import { Button } from "baseui/button";
import { Heading } from "baseui/heading";
import { useStyletron } from "baseui";
import {
  MdShoppingCart,
  MdDone,
  MdLogout,
  MdLogin,
  MdHistory,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import useBreakpoint from "../../../hooks/useBreakpoint";
import { FlexGridItem, FlexGrid } from "baseui/flex-grid";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const navData = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  // {
  //     id: 2,
  //     name: "Jackets",
  //     link: "/jackets",
  // },
  {
    id: 2,
    name: "Shoes",
    link: "/shoes",
  },
  // {
  //     id: 4,
  //     name: "Hoodies",
  //     link: "/hoodies",
  // },
  // {
  //     id: 5,
  //     name: "Kids",
  //     link: "/kids",
  // },
];

const Navbar = ({ setIsOpen }) => {
  const [flip, setFlip] = React.useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const cartState = useSelector((state) => state.cart);
  const brkPnt = useBreakpoint();
  const lessThanSmXs = brkPnt === "sm" || brkPnt === "xs";
  const navigate = useNavigate();

  const [css] = useStyletron();
  return (
    <HeaderNavigation className={css({ padding: "0 1rem", maxWidth: "100%" })}>
      <FlexGrid justifyContent="center" alignItems="center">
        {lessThanSmXs && (
          <FlexGridItem>
            <MobileNav
              isNavOpen={isNavOpen}
              setIsNavOpen={setIsNavOpen}
              navData={navData}
            />
          </FlexGridItem>
        )}
      </FlexGrid>
      {!lessThanSmXs && (
        <StyledNavigationList $align={ALIGN.left}>
          <StyledNavigationItem>
            <Link to="/">
              <MdDone size="3rem" />
            </Link>
          </StyledNavigationItem>
        </StyledNavigationList>
      )}
      <StyledNavigationList $align={ALIGN.center} />
      {!lessThanSmXs && <DesktopNav navData={navData} />}
      <StyledNavigationList $align={ALIGN.center} />
      <StyledNavigationList $align={ALIGN.right}>
        <StyledNavigationItem>
          {localStorage.getItem("username") ? (
            <div>Welcome {localStorage.getItem("username")}</div>
          ) : (
            <></>
          )}
          <Link to="/admin">
            <Button kind="secondary">
              <MdOutlineAdminPanelSettings size="1.5rem" />
            </Button>
          </Link>
          <span> </span>
          <Link to="/login">
            <Button kind="secondary">
              <MdLogin size="1.5rem" />
            </Button>
          </Link>
          <span> </span>
          <Link to="/">
            <Button
              onClick={() => {
                localStorage.removeItem("user_id");
                localStorage.removeItem("username");
                setFlip(!flip);
              }}
              kind="secondary"
            >
              <MdLogout size="1.5rem" />
            </Button>
          </Link>
          <span> </span>
          <Link
            to="/"
            onClick={(e) => {
              navigate(`/history/${localStorage.getItem("user_id")}`);
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <Button kind="secondary">
              <MdHistory size="1.5rem" />
            </Button>
          </Link>
          <span> </span>
          <Button onClick={() => setIsOpen(true)} kind="secondary">
            <MdShoppingCart size="1.5rem" />

            {cartState.items.length > 0 && (
              <span>{cartState.items.length}</span>
            )}
          </Button>
        </StyledNavigationItem>
      </StyledNavigationList>
    </HeaderNavigation>
  );
};

export default Navbar;
