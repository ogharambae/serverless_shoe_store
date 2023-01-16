import React, { useEffect } from "react";
import { Card, StyledAction } from "baseui/card";
import { Button } from "baseui/button";
import { HeadingSmall } from "baseui/typography";
import { useStyletron } from "baseui";
import useBreakpoint from "../../hooks/useBreakpoint";
// import { addToCart } from "../../store/actions"
import { useDispatch } from "react-redux";
import { Input } from "baseui/input";
import { Col } from "react-grid-system";
import { deleteItem, updateItem } from "../../utils/adminAxios";
import { shoeActions } from "../../store";

const AdminProductCard = ({ data, productsCategoryName }) => {
  const [css, theme] = useStyletron();
  const breakPoint = useBreakpoint();
  const smXs = breakPoint === "sm" || breakPoint === "xs";

  const dispatch = useDispatch();

  const [updateInput, setUpdateInput] = React.useState({
    userId: parseInt(localStorage.getItem("user_id")),
    price: data?.price,
    quantity: data?.quantity,
  });

  const [isEditting, setIsEditting] = React.useState(false);

  const onChangeInput = (field, value) => {
    setUpdateInput({ ...updateInput, [field]: value });
  };

  return (
    <div>
      <Card
        overrides={{
          Root: {
            style: {
              position: "relative",
            },
          },
        }}
        headerImage={{
          src: data?.image_url?.[0],
          style: {
            height: `${smXs ? "" : ""}`,
            minWidth: "100%",
            objectFit: "cover",
            cursor: "pointer",
          },
          onClick: () => {
            // navigate(`/${productsCategoryName}/${data?.id}`);
          },
        }}
      >
        <div>
          <div
            className={css({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              position: "absolute",
              top: "0rem",
              padding: "1rem",
              backgroundColor: theme.colors.primary50,
              left: 0,
              right: 0,
            })}
          >
            <div>
              <HeadingSmall
                $style={{
                  margin: "0",
                  color: theme.colors.primary700,
                }}
              >
                {data?.shoe_name}
              </HeadingSmall>
            </div>
          </div>
        </div>

        <div className={css({ fontSize: "1.3rem" })}>
          <div>
            <span className={css({ marginRight: "1rem" })}>Price</span>
            {!isEditting ? (
              <span>{updateInput.price}</span>
            ) : (
              <Input
                name="price"
                value={updateInput.price}
                onChange={(e) => onChangeInput("price", e.target.value)}
              />
            )}
          </div>
          <div className={css({ marginTop: "0.3rem" })}>
            <span className={css({ marginRight: "1rem" })}>Quantity</span>
            {!isEditting ? (
              <span>{updateInput.quantity}</span>
            ) : (
              <Input
                name="quantity"
                value={updateInput.quantity}
                onChange={(e) => onChangeInput("quantity", e.target.value)}
              />
            )}
          </div>
        </div>
        <StyledAction style={{ margin: "2rem 0rem" }}>
          <Button
            onClick={() => {
              console.log(isEditting);
              if (isEditting) {
                setUpdateInput({
                  ...updateInput,
                  ["price"]: data?.price,
                  ["quantity"]: data?.quantity,
                });
              }
              setIsEditting(!isEditting);
            }}
            disabled={!data.isListed && !data.isListed}
            overrides={{
              BaseButton: { style: { backgroundColor: "#0380db" } },
            }}
          >
            {isEditting ? "Discard" : "Edit Item"}
          </Button>
          <Button
            onClick={async () => {
              if (isEditting) {
                await updateItem(data?.shoe_id, updateInput);
              } else if (!data.isListed) {
                console.log("here");
                await updateItem(data?.shoe_id, {
                  userId: updateInput.userId,
                  isListed: true,
                });
              } else {
                //console.log("deleting item with id", data?.shoe_id, updateInput.userId);
                await deleteItem(updateInput.userId, data?.shoe_id);
              }
              dispatch(shoeActions.getAll());
            }}
            overrides={{
              BaseButton: {
                style: {
                  backgroundColor:
                    !data.isListed && !data.isListed ? "#27ae60" : "#ff0000",
                },
              },
            }}
          >
            {isEditting
              ? "Update"
              : data.isListed
              ? "Remove from listing"
              : "Enable listing"}
          </Button>
        </StyledAction>
      </Card>
    </div>
  );
};

export default AdminProductCard;
