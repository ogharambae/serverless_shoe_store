import React, { useEffect } from "react";

import { useStyletron } from "baseui";
import { useDispatch, useSelector } from "react-redux";

import AdminProducts from "./AdminProducts";
import AdminAddNewItem from "./AdminAddNewItem";
import AdminRemoveItem from "./AdminRemoveItem";
import AdminUpdateItem from "./AdminUpdateItem";

import { HeadingMedium } from "baseui/typography";

import { Container, Row } from "react-grid-system";
import { shoeActions } from "../../store";
import Products from "../../components/Blocks/Home/Products";

const Admin = () => {

  const [css] = useStyletron();
  const [menuState, setMenuState] = React.useState("items");

  const state = useSelector((state) => state.products);
  const category = state["shoes"];
  const products = category?.products ?? [];
  const productArray = Object.values(products);

  const dispatch = useDispatch();

  const homeProducts = useSelector((state) => {
    const products = [];
    for (const shoe in state.products?.shoes ?? []) {
      products.push(state.products?.shoes[shoe]);
      // if (state.products?.shoes[shoe].isListed === 1) {

      // }
    }
    return products;
  });

  useEffect(() => {

    const username = localStorage.getItem("username");
    if(username != "admin") {
        alert("Nice try not an Admin: GET OUT");
        window.location.href = "/";
    }
    
    dispatch(shoeActions.getAll());
  }, []);

  return (
    <Container className={css({ maxHeight: "100%" })}>
      <Row
        justify="start"
        className={css({ marginLeft: "-15px", marginRight: "-15px" })}
      >
        <HeadingMedium
          className={css({ marginRight: "1rem", cursor: "pointer" })}
          onClick={() => setMenuState("items")}
        >
          Items
        </HeadingMedium>
        <HeadingMedium className={css({ marginRight: "1rem" })}>
          |
        </HeadingMedium>
        <HeadingMedium
          className={css({ marginRight: "1rem", cursor: "pointer" })}
          onClick={() => setMenuState("addItem")}
        >
          Add item
        </HeadingMedium>

        <HeadingMedium className={css({ marginRight: "1rem" })}>
          |
        </HeadingMedium>
        {/* <HeadingMedium
          className={css({ marginRight: "1rem", cursor: "pointer" })}
          onClick={() => setMenuState("removeItem")}
        >
          Remove item
        </HeadingMedium>

        <HeadingMedium className={css({ marginRight: "1rem" })}>
          |
        </HeadingMedium>
        <HeadingMedium
          className={css({ marginRight: "1rem", cursor: "pointer" })}
          onClick={() => setMenuState("updateItem")}
        >
          Update item
        </HeadingMedium> */}
      </Row>
      <Row>
        {menuState === "addItem" && <AdminAddNewItem />}
        {menuState === "items" && (
          <AdminProducts productsCategoryName="home" products={homeProducts} />
        )}
        {/* {menuState === "removeItem" && <AdminRemoveItem />}
        {menuState === "updateItem" && <AdminUpdateItem />} */}
      </Row>
    </Container>
  );
};

export default Admin;
