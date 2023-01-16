import React from "react";
import Products from "../components/Blocks/Home/Products";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Container } from "react-grid-system";
import { HeadingXLarge } from "baseui/typography";

const ProductsPage = () => {
  const params = useParams();
  const productsCategoryName = params.category;
  const state = useSelector((state) =>
    Object.keys(state.products?.shoes ?? []).map((key) => {
      return state.products?.shoes[key];
    })
  );

  return (
    <Container>
      <Row justify="center">
        <HeadingXLarge $style={{ textAlign: "center" }}>Shoes</HeadingXLarge>
      </Row>
      <Row justify="center">
        <Products
          productsCategoryName={productsCategoryName}
          products={state}
        />
      </Row>
    </Container>
  );
};

export default ProductsPage;
