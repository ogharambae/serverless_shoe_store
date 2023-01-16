import React from "react";
import { useStyletron } from "baseui";

import { Paragraph1 } from "baseui/typography";
import { Col, Container, Row } from "react-grid-system";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import {deleteItem, updateItem} from "../../utils/adminAxios";

const AdminAddNewItem = () => {
    const [css] = useStyletron();
    const [itemId, setItemId] = React.useState(0)
    const [input, setInput] = React.useState({
        userId: parseInt(localStorage.getItem("user_id")),
        price: 0,
        quantity: 0
    });

    const onChangeInput = (field, value) => {
        setInput({ ...input, [field]: value });
    };

    return (
        <Container className={css({ width: "100%" })}>
            <Row className={css({ margin: "0.5rem 0" })}>
                <Col xs={2}>
                    <Paragraph1 className={css({ fontSize: "1.2rem" })}>Item ID</Paragraph1>
                </Col>
                <Col
                    xs={10}
                    className={css({ display: "flex", justifyContent: "center" })}
                >
                    <Input
                        name="itemId"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
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
                        value={input.shoe_size}
                        onChange={(e) => onChangeInput("price", e.target.value)}
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
            <Row justify="end">
                <Button
                    className={css({ margin: "2rem 0 " })}
                    onClick={async () => {
                        const res = await updateItem(itemId, input)
                        if (res.errorType) {
                            alert("Error updating item");
                        } else {
                            alert("Successfully updated item");
                        }
                    }}
                >
                    Update Item
                </Button>
            </Row>
        </Container>
    );
};

export default AdminAddNewItem;
