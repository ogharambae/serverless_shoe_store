import React from "react";
import { useStyletron } from "baseui";

import { Paragraph1 } from "baseui/typography";
import { Col, Container, Row } from "react-grid-system";
import { Input } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { Button } from "baseui/button";
import { postItem } from "../../utils/adminAxios";

const AdminAddNewItem = () => {
  const [css] = useStyletron();
  const [input, setInput] = React.useState({
    userId: parseInt(localStorage.getItem("user_id")),
    shoe_name: "",
    shoe_size: 0,
    price: 0,
    quantity: 0,
    description: "",
    category: "",
    image_url: "",
    currency: ""
  });

  const onChangeInput = (field, value) => {
    setInput({ ...input, [field]: value });
  };

  return (
    <Container className={css({ width: "100%" })}>
      {/*<Row className={css({ margin: "0.5rem 0" })}>*/}
      {/*  <Col xs={2}>*/}
      {/*    <Paragraph1 className={css({ fontSize: "1.2rem" })}>ID</Paragraph1>*/}
      {/*  </Col>*/}
      {/*  <Col*/}
      {/*    xs={10}*/}
      {/*    className={css({ display: "flex", justifyContent: "center" })}*/}
      {/*  >*/}
      {/*    <Input*/}
      {/*      name="id"*/}
      {/*      value={input.id}*/}
      {/*      onChange={(e) => onChangeInput(e.target.name, e.target.value)}*/}
      {/*    />*/}
      {/*  </Col>*/}
      {/*</Row>*/}
      <Row className={css({ margin: "0.5rem 0" })}>
        <Col xs={2}>
          <Paragraph1 className={css({ fontSize: "1.2rem" })}>Name</Paragraph1>
        </Col>
        <Col
          xs={10}
          className={css({ display: "flex", justifyContent: "center" })}
        >
          <Input
            name="shoe_name"
            value={input.shoe_name}
            onChange={(e) => onChangeInput("shoe_name", e.target.value)}
          />
        </Col>
      </Row>
      <Row className={css({ margin: "0.5rem 0 " })}>
        <Col xs={2}>
          <Paragraph1 className={css({ fontSize: "1.2rem" })}>Shoe size</Paragraph1>
        </Col>
        <Col
            xs={10}
            className={css({ display: "flex", justifyContent: "center" })}
        >
          <Input
              name="shoe_size"
              value={input.shoe_size}
              onChange={(e) => onChangeInput("shoe_size", e.target.value)}
          />
        </Col>
      </Row>
      <Row className={css({ margin: "0.5rem 0 " })}>
        <Col xs={2}>
          <Paragraph1 className={css({ fontSize: "1.2rem" })}>Price</Paragraph1>
        </Col>
        <Col
          xs={10}
          className={css({ display: "flex", justifyContent: "center" })}
        >
          <Input
            name="price"
            value={input.price}
            onChange={(e) => onChangeInput("price", e.target.value)}
          />
        </Col>
      </Row>
      <Row className={css({ margin: "0.5rem 0 " })}>
        <Col xs={2}>
          <Paragraph1 className={css({ fontSize: "1.2rem" })}>
            Currency Type
          </Paragraph1>
        </Col>
        <Col
            xs={10}
            className={css({ display: "flex", justifyContent: "center" })}
        >
          <Input
              name="currency"
              value={input.currency}
              onChange={(e) => onChangeInput("currency", e.target.value)}
          />
        </Col>
      </Row>
      <Row className={css({ margin: "0.5rem 0 " })}>
        <Col xs={2}>
          <Paragraph1 className={css({ fontSize: "1.2rem" })}>
            Quantity
          </Paragraph1>
        </Col>
        <Col
          xs={10}
          className={css({ display: "flex", justifyContent: "center" })}
        >
          <Input
            name="quantity"
            value={input.quantity}
            onChange={(e) => onChangeInput("quantity", e.target.value)}
          />
        </Col>
      </Row>
      <Row className={css({ margin: "0.5rem 0 " })}>
        <Col xs={2}>
          <Paragraph1 className={css({ fontSize: "1.2rem" })}>
            Category
          </Paragraph1>
        </Col>
        <Col
          xs={10}
          className={css({ display: "flex", justifyContent: "center" })}
        >
          <Input
            name="category"
            value={input.category}
            onChange={(e) => onChangeInput("category", e.target.value)}
          />
        </Col>
      </Row>
      <Row className={css({ margin: "0.5rem 0 " })}>
        <Col xs={2}>
          <Paragraph1 className={css({ fontSize: "1.2rem" })}>
            Description
          </Paragraph1>
        </Col>
        <Col
          xs={10}
          className={css({ display: "flex", justifyContent: "center" })}
        >
          <Textarea
            name="description"
            value={input.description}
            onChange={(e) => onChangeInput("description", e.target.value)}
          />
        </Col>
      </Row>
      <Row className={css({ margin: "0.5rem 0 " })}>
        <Col xs={2}>
          <Paragraph1 className={css({ fontSize: "1.2rem" })}>
            Image URLs
          </Paragraph1>
        </Col>
        <Col
          xs={10}
          className={css({ display: "flex", justifyContent: "center" })}
        >
          <Input
            name="imageUrls"
            value={input.imageUrls}
            onChange={(e) => onChangeInput("image_url", e.target.value)}
          />
        </Col>
      </Row>
      <Row justify="end">
        <Button
            className={css({ margin: "2rem 0 " })}
            onClick={async () => {
              const res = await postItem(input)
              if (res.errorType) {
                alert("Error adding item");
              } else {
                alert("Successfully added item");
              }
            }}
        >
          Add Item
        </Button>
      </Row>
    </Container>
  );
};

export default AdminAddNewItem;
