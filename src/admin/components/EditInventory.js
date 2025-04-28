import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateInventory } from "../../redux/slices/sellerInventorySlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getCategory,
  getProducts,
} from "../../redux/slices/sellerProductSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const EditInventory = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const inventoryData = location.state?.inventoryData;

  const allCategory = useSelector((state) => state.sellerProduct.categoryData);
  const allProducts = useSelector((state) => state.sellerProduct.productData);

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    inventoryData?.categoryId || ""
  );

  // console.log(inventoryData);
  // console.log("catagory", allCategory);

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getProducts());
    dispatch(updateInventory());
  }, []);

  const validationSchema = Yup.object().shape({
    categoryId: Yup.string().required("Category is required"),
    productId: Yup.string().required("Product Name is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive()
      .integer(),
    lowStockLimit: Yup.number()
      .required("Low Stock Limit is required")
      .positive()
      .integer(),
  });

  return (
    <>
      <div className="u-bg-color">
        <div style={{ padding: "20px 0px" }}>
          <h5 className="uInventory_title">Inventory</h5>
          <div style={{ padding: "0px 30px", fontFamily: "Inter, sans-serif" }}>
            <Link to="/seller/home" className="sp_text_grey">Dashboard</Link>
            <span style={{ padding: "0px 5px" }}>/</span>
            <Link to="/seller/inventory" className="sp_text_grey">Inventory</Link>
            <span style={{ padding: "0px 5px" }}>/</span>
            <Link>Edit Inventory</Link>
          </div>
        </div>
        <div className="addInventory_container">
          <Formik
            initialValues={{
              _id: inventoryData?._id || "",
              categoryId: inventoryData?.categoryId || "",
              productId: inventoryData?.productId || "",
              quantity: inventoryData?.quantity || "",
              lowStockLimit: inventoryData?.lowStockLimit || "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              // Handle form submission
              // console.log(values);
              dispatch(updateInventory({ id: values._id, ...values })).then(
                (response) => {
                  if (response.payload.status == 200) {
                    resetForm();
                    navigate("/seller/inventory");
                  }
                }
              );
            }}
          >
            {({ handleChange, handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <div className="uinventory_form_group">
                  <div className="uinventory_form_field">
                    <label htmlFor="categoryId">Category</label>
                    <Field
                      as="select"
                      id="categoryId"
                      name="categoryId"
                      onChange={(e) => {
                        setSelectedCategoryId(e.target.value);
                        handleChange(e);
                        setFieldValue("productId", ""); // Reset productId when category changes
                      }}
                      style={{ outline: "none" }}
                    >
                      <option value="">Select</option>
                      {allCategory?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.categoryName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="categoryId"
                      component="div"
                      className="error"
                    />
                  </div>

                  <div className="uinventory_form_field">
                    <label htmlFor="productId">Product Name</label>
                    <Field
                      as="select"
                      id="productId"
                      name="productId"
                      style={{ outline: "none" }}
                    >
                      <option value="">Select</option>
                      {allProducts
                        .filter(
                          (item) => item.categoryId === selectedCategoryId
                        )
                        .map((item) => {
                          if (
                            item.productVarientData &&
                            item.productVarientData.length > 0
                          ) {
                            return (
                              <option key={item._id} value={item._id}>
                                {item.productName}
                              </option>
                            );
                          }
                        })}
                    </Field>
                    <ErrorMessage
                      name="productId"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>
                <div className="uinventory_form_group">
                  <div className="uinventory_form_field">
                    <label htmlFor="quantity">Quantity</label>
                    <Field
                      type="text"
                      id="quantity"
                      name="quantity"
                      placeholder="Quantity"
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="error"
                    />
                  </div>

                  <div className="uinventory_form_field">
                    <label htmlFor="lowStockLimit">Low Stock Limit</label>
                    <Field
                      type="text"
                      id="lowStockLimit"
                      name="lowStockLimit"
                      placeholder="Low Stock Limit"
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="lowStockLimit"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>
                <div className="text-end my-4">
                  <Link type="button" className="ucancelbtn" to={"/seller/inventory"}>
                    Cancel
                  </Link>
                  <button type="submit" className="uaddbtn">
                    Update
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default EditInventory;
