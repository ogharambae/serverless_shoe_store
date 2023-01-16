import {Col, Container, Row} from "react-grid-system";
import {Paragraph1} from "baseui/typography";
import {Input} from "baseui/input";
import {Button} from "baseui/button";
import {deleteItem, postItem} from "../../utils/adminAxios";
import React from "react";
import {useStyletron} from "baseui";

const AdminRemoveItem = () => {
    const [css] = useStyletron();
    const [itemId, setItemId] = React.useState(0)
    const user_id = localStorage.getItem("user_id")
    return (
        <Container className={css({ width: "100%" })}>
            <Row className={css({ margin: "0.5rem 0 " })}>
                <Col xs={2}>
                    <Paragraph1 className={css({ fontSize: "1.2rem" })}>
                        Item Id
                    </Paragraph1>
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
            <Row justify="end">
                <Button
                    className={css({ margin: "2rem 0 " })}
                    onClick={async () => {
                        const res = await deleteItem(user_id, itemId)
                        if (res.errorType) {
                            alert("Error deleting item");
                        } else {
                            alert("Successfully deleted item");
                        }
                    }}
                >
                    Remove Item
                </Button>
            </Row>
        </Container>
        );
};

export default AdminRemoveItem;
