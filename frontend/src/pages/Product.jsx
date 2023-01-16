import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Container, Row, Col } from "react-grid-system";
import { HeadingMedium, HeadingLarge, Paragraph1 } from "baseui/typography";
import { Button } from "baseui/button";
import { addToCart } from "../store/actions";

const Product = () => {
  const params = useParams();
  const state = useSelector((state) => state.products.shoes);
  const productId = params?.product;
  const currentProduct = state?.[productId];
  const images = currentProduct?.image_url ?? [];
  const dispatch = useDispatch();

  return (
    <Container>
      <div style={{ marginTop: "2rem" }}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={5}>
            <Carousel
              showStatus={false}
              showArrows={true}
              showIndicators={false}
              dynamicHeight={true}
            >
              {images.map((img, index) => (
                <div key={img} index={index}>
                  <img style={{ width: "100%" }} src={img} alt="" />
                </div>
              ))}
            </Carousel>
          </Col>
          <Col xs={12} sm={12} md={12} lg={7}>
            <HeadingLarge marginTop="0.5rem" marginBottom="1rem">
              {currentProduct.shoe_name}
            </HeadingLarge>
            <HeadingMedium marginTop="0">
              Price:{" "}
              <span style={{ color: "red" }}>${currentProduct.price}</span>
            </HeadingMedium>
            <Paragraph1
              dangerouslySetInnerHTML={{
                __html: currentProduct.description,
              }}
            ></Paragraph1>
            <Button
              shape="square"
              size="large"
              disabled={currentProduct.quantity <= 0}
              onClick={() => {
                dispatch(addToCart({ quantity: 1, ...currentProduct }));
              }}
              overrides={{
                BaseButton: {
                  style: {
                    marginTop: "3rem",
                  },
                },
              }}
            >
              Add to Cart
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Product;
