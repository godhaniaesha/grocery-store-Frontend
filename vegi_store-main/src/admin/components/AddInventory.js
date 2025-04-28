import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategory,
  getProducts,
} from "../../redux/slices/sellerProductSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  createInventory,
  getStockBySeller,
} from "../../redux/slices/sellerInventorySlice";
import { Link, useNavigate } from "react-router-dom";
import { color } from "framer-motion";

const AddInventory = () => {
  const sellerStock = useSelector((state) => state.sellerInventory.inventory);
  console.log(sellerStock);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allCategory = useSelector((state) => state.sellerProduct.categoryData);
  const allProducts = useSelector((state) => state.sellerProduct.productData);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getProducts());
    dispatch(getStockBySeller());
  }, [dispatch]);

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
            <Link to="/seller/home" className="sp_text_grey">
              Dashboard
            </Link>
            <span style={{ padding: "0px 5px" }}>/</span>
            <Link to="/seller/inventory" className="sp_text_grey">
              Inventory
            </Link>
            <span style={{ padding: "0px 5px" }}>/</span>
            <Link>Add Inventory</Link>
          </div>
        </div>
        <div className="addInventory_container">
          <Formik
            initialValues={{
              categoryId: "",
              productId: "",
              quantity: "",
              lowStockLimit: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              dispatch(createInventory(values)).then((response) => {
                if (response?.payload?.status === 200) {
                  resetForm();
                  navigate("/seller/inventory");
                }
              });
            }}
          >
            {({ handleSubmit, setFieldValue }) => (
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
                        setFieldValue("categoryId", e.target.value);
                        setFieldValue("productId", ""); // Reset productId when category changes
                      }}
                      style={{ outline: "none" }}
                    >
                      <option value="">Select</option>
                      {allCategory.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.categoryName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="categoryId" component="div" style={{color:"red"}} />
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
                      {sellerStock
                        ?.flatMap((stock) => stock?.products)
                        .filter(
                          (item) => item?.categoryId === selectedCategoryId
                        )
                        .map((item) => (
                          <option key={item?.productId} value={item?.productId}>
                            {item?.productName}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage name="productId" component="div" style={{color:"red"}} />
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
                    />
                    <ErrorMessage name="quantity" component="div" style={{color:"red"}}/>
                  </div>

                  <div className="uinventory_form_field">
                    <label htmlFor="lowStockLimit">Low Stock Limit</label>
                    <Field
                      type="text"
                      id="lowStockLimit"
                      name="lowStockLimit"
                      placeholder="Low Stock Limit"
                    />
                    <ErrorMessage name="lowStockLimit" component="div" style={{color:"red"}}/>
                  </div>
                </div>
                <div className="text-end my-4">
                  <button type="button" className="ucancelbtn">
                    Cancel
                  </button>
                  <button type="submit" className="uaddbtn">
                    Add
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

export default AddInventory;
