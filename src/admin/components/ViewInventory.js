import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SingleInventory } from "../../redux/slices/sellerInventorySlice";
import { Link, useParams } from "react-router-dom";

const ViewInventory = () => {
  // console.log(getSingleInventory[0].productData[0].productName);
  const dispatch = useDispatch();
  const { id } = useParams();
  // console.log(id);
  useEffect(() => {
    // Fetch inventory data when the component mounts
    dispatch(SingleInventory(id));
  }, [id]);

  const getSingleInventory = useSelector(
    (state) => state.sellerInventory.inventory
  );

  // getSingleInventory.productData.productName;

  // console.log("hihihi", getSingleInventory);

  return (
    <>
      <div className="u-bg-color">
        <div style={{ padding: "20px 0px" }}>
          <h5 className="uInventory_title">Inventory</h5>
          <div style={{ padding: "0px 30px", fontFamily: "Inter, sans-serif" }}>
            <Link to={"/seller/home"} className="sp_text_grey">
              Dashboard
            </Link>
            <span style={{ padding: "0px 5px" }}>/</span>
            <Link to={"/seller/inventory"} className="sp_text_grey">
              Inventory
            </Link>
            <span style={{ padding: "0px 5px" }}>/</span>
            <Link>View Inventory</Link>
          </div>
        </div>
        <div className="d-md-flex" style={{ margin: "30px", gap: "20px" }}>
          {getSingleInventory?.map((item) => {
            return (
              <>
                <div className="uproduct_card">
                  <img
                    src={`http://localhost:4000/${item.productData?.[0].images?.[0]}`}
                    alt={item.productData?.[0].productName}
                    className="uproduct_image"
                  />
                  <div className="uproduct_details">
                    <div className="d-flex justify-content-between">
                      <h4 className="uproduct_title text-nowrap me-5">
                        Product Name
                      </h4>
                      <h4 className="uproduct_title text-nowrap text-truncate">
                        {item.productData?.[0]?.productName}
                      </h4>
                    </div>
                    <div className="uproduct_info">
                      <div className="uinfo_item">
                        <span className="uinfo_label">Price:</span>
                        <span className="uinfo_value">{`$${item.productVarientData?.[0]?.price}`}</span>
                      </div>
                      <div className="uinfo_item">
                        <span className="uinfo_label">Unit:</span>
                        <span className="uinfo_value">{`${item.productVarientData[0]?.size}`}</span>
                      </div>
                      <div className="uinfo_item">
                        <span className="uinfo_label">Quantity:</span>
                        <span className="uinfo_value">{`${item.productVarientData[0]?.size}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="utable_container">
                  <table className="utable">
                    <thead className="uthead1">
                      <tr>
                        <th className="uth">Date & Time</th>
                        <th className="uth">Quantity</th>
                        <th className="uth">Unit</th>
                        <th className="uth">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="utbody">
                      {item.productVarientData?.map((item) => {
                          const sizeString = item.size;
                          // Use RegEx to separate numbers and letters
                          const match = sizeString.match(/^(\d+)([a-zA-Z]+)$/);
                          var quantity = "";
                          var unit = "";
                          if (match) {
                            quantity = parseInt(match[1]); // 250
                            unit = match[2];
                          }
                        return (
                          <tr>
                            <td>{`${new Date(item.createdAt).toLocaleString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )} (${new Date(item.createdAt).toLocaleString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )})`}</td>
                            <td>{quantity}</td>
                            <td>{unit}</td>
                            <td>{`$${item.price}`}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {/* <div className="upagination">
                  <a href="#" className="upagination_btn">
                    1
                  </a>
                  <a href="#" className="upagination_btn active">
                    2
                  </a>
                  <a href="#" className="upagination_btn">
                    3
                  </a>
                  <a href="#" className="upagination_btn">
                    4
                  </a>
                </div> */}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ViewInventory;
