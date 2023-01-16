import React from "react"
import AdminProductCard from "./AdminProductCard"
import useBreakPoint from "../../hooks/useBreakpoint"
import { useStyletron } from "baseui"

const Products = ({ productsCategoryName, products }) => {
  const [css] = useStyletron()
  const breakPoint = useBreakPoint()

  const smXs = breakPoint === "sm" || breakPoint === "xs"

  return (
    <div>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(${smXs ? "100%" : "18rem"
            }, 1fr))`,
          gridGap: "3rem",
        })}
      >
        {products?.map((product) => (
          <AdminProductCard
            data={product}
            key={product.id}
            productsCategoryName={productsCategoryName}
          />
        ))}
      </div>
    </div>
  )
}

export default Products
