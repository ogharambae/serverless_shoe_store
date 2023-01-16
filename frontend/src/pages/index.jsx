import React from "react";
import Hero from "../components/Blocks/Home/Hero";
import Products from "../components/Blocks/Home/Products";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row } from "react-grid-system";
import { HeadingLarge } from "baseui/typography";
import { getAllShoes } from "../utils/fetchUtils";
import { useEffect, useState } from "react";
import { shoeActions } from "../store/index";

const Home = () => {
  const dispatch = useDispatch();

  const homeProducts = useSelector((state) => {
    return Object.keys(state.products?.shoes ?? [])
      .map((key) => {
        return state.products?.shoes[key];
      })
      .filter((shoe) => shoe.isListed);
  });

  useEffect(() => {
    dispatch(shoeActions.getAll());
  }, []);
  return (
    <div>
      <Hero />
      <Container>
        <Row justify="center">
          <HeadingLarge $style={{ textAlign: "center" }}>
            Latest Collection
          </HeadingLarge>
        </Row>
        <Row>
          <Products productsCategoryName="home" products={homeProducts} />
        </Row>
      </Container>
    </div>
  );
};

export default Home;
