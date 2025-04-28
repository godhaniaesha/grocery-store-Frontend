import React, { useEffect, useState } from "react";

import view_products1 from "../../img/u_images/view_products1.png";
import view_products2 from "../../img/u_images/view_products2.png";
import view_products3 from "../../img/u_images/view_products3.png";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { viewProduct } from "../../redux/slices/sellerProductSlice";

const ViewProducts = () => {
  const { id } = useParams();
  const data = useSelector((state) => state.sellerProduct.viewProduct);
  const dispatch = useDispatch();
  const [thumbnail, setThumbnail] = useState("");
  useEffect(() => {
    dispatch(viewProduct(id));
  }, [id]);
  useEffect(() => {
    // console.log("data", data);
    setThumbnail(data[0]?.productData[0].images[0] || "");
  }, [data]);

  const handleThumbnail = (image) => {
    setThumbnail(image);
  };
  return (
    <>
      <div className="umain_container u-bg-color" >
        <div className="uviewP_header">
          <h1>Product</h1>
          <div className="uviewP_breadcrumb">
            <a href="#">Dashboard</a> / <a href="#">Products</a> / View Products
          </div>
        </div>
        {data.map((ele, index) => {
          const sizeString = ele.size;
          // Use RegEx to separate numbers and letters
          const match = sizeString.match(/^(\d+)([a-zA-Z]+)$/);
          var quantity = "";
          var unit = "";
          if (match) {
            quantity = parseInt(match[1]); // 250
            unit = match[2];
          }

          var fieldData = [];
          if (ele.productData[0].specifications) {
            const specification =
              typeof ele.productData[0].specifications === "string"
                ? JSON.parse(ele.productData[0].specifications)
                : ele.productData[0].specifications;

            fieldData = Object.keys(specification).map((key) => ({
              title: key,
              description: specification[key],
            }));

            // console.log("Parsed specification fields:", fieldData);
          }
          return (
            <div className="uproduct_container">
              <div className="uproduct_content">
                <div className="uproduct_images">
                  <img
                    style={{ aspectRatio: "1 / 1" }}
                    src={"http://localhost:4000/" + thumbnail}
                    alt={ele.productData[0].productName}
                    className="umain_image"
                  />
                  <div className="uthumbnail_container flex-wrap">
                    {ele?.productData[0].images.map((image) => {
                      return (
                        <img
                          src={"http://localhost:4000/" + image}
                          alt={image}
                          className="uthumbnail"
                          onClick={() => {
                            handleThumbnail(image);
                          }}
                        />
                      );
                    })}

                    {/* <img
                      src={view_products3}
                      alt="Tomato thumbnail 2"
                      className="uthumbnail"
                    />
                    <img
                      src={view_products2}
                      alt="Tomato thumbnail 3"
                      className="uthumbnail"
                    />
                    <img
                      src={view_products3}
                      alt="Tomato thumbnail 4"
                      className="uthumbnail"
                    /> */}
                  </div>
                </div>

                <div className="uproduct_details flex-fill rounded-2" style={{backgroundColor:'#0F0F0F05'}}>
                  <table className="uproduct_table">
                    <tr>
                      <th>Category</th>
                      <td>{ele?.categoryData?.[0]?.categoryName}</td>
                    </tr>
                    <tr>
                      <th>Product Name</th>
                      <td>{ele?.productData[0]?.productName}</td>
                    </tr>
                    <tr>
                      <th>Price</th>
                      <td>${ele?.price}</td>
                    </tr>
                    <tr>
                      <th>Discount</th>
                      <td>${ele?.discountPrice}</td>
                    </tr>
                    <tr>
                      <th>Unit</th>
                      <td>{unit || ""}</td>
                    </tr>
                    <tr>
                      <th>Quantity</th>
                      <td>{quantity || ""}</td>
                    </tr>
                    <tr>
                      <th>Product Description</th>
                      <td>{ele.productData[0].description}</td>
                    </tr>
                    {fieldData?.map((item) => {
                      return (
                        <tr>
                          <th>{item.title}</th>
                          <td>{item.description}</td>
                        </tr>
                      );
                    })}
                    {/* <tr>
                      <th>Health Benefits</th>
                      <td>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod tempor incididunt. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt
                      </td>
                    </tr>
                    <tr>
                      <th>Storage and Use</th>
                      <td>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod tempor incididunt. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt
                      </td>
                    </tr> */}
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ViewProducts;
