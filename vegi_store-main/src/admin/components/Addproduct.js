import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UploadImage from '../../img/Kassets/UploadImage.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, getCategory, getProducts, getSingleProduct, removesingleproduct, updateProduct } from '../../redux/slices/sellerProductSlice';
import { RiCloseCircleFill } from 'react-icons/ri';
function Addproduct() {
    const { id } = useParams();
    const [fields, setFields] = useState([]); // Initially empty
    const productData123 = useSelector((state) => state.sellerProduct?.singleProduct);
    const [productData, setProductData] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            dispatch(getSingleProduct(id))
        }
        else {
            dispatch(removesingleproduct());
        }
    }, [id])
    // console.log('pro', productData);
    useEffect(() => {
        setProductData(productData123)
    }, [productData123])
    const [addVarient, setAddVarient] = useState([{ variantName: "", price: "", unit: "", quantity: "" }]);

    const addMoreVarient = () => {
        setAddVarient([...addVarient, { price: "", discount: "", unit: "", quantity: "" }]);
        formik.setValues((prevValues) => ({
            ...prevValues,
            variants: [...prevValues.variants, { price: "", quantity: "", unit: "KG" }],
        }));
    }
    const removeVarient = (index) => {
        const updatedAddVarient = [...addVarient];
        updatedAddVarient.splice(index, 1);
        setAddVarient(updatedAddVarient);

        formik.setValues((prevValues) => {
            const updatedVariants = [...prevValues.variants];
            updatedVariants.splice(index, 1);
            return {
                ...prevValues,
                variants: updatedVariants,
            };
        });
    };
    const addMoreFields = () => {
        setFields([...fields, { title: "", description: "" }]);
        formik.setValues((prevValues) => ({
            ...prevValues,
            fields: [...prevValues.fields, { title: "", description: "" }],
        }));
    };
    const removeFields = (index) => {
        const updatedFields = [...fields];
        updatedFields.splice(index, 1);
        setFields(updatedFields);

        formik.setValues((prevValues) => {
            const updatedFormikFields = [...prevValues.fields];
            updatedFormikFields.splice(index, 1);
            return {
                ...prevValues,
                fields: updatedFormikFields,
            };
        });
    };
    const [images, setImages] = useState([]);

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const imageArray = [...images, ...Array.from(files).map((file) => URL.createObjectURL(file))];
            setImages(imageArray);
            formik.setValues((prevValues) => ({
                ...prevValues,
                image: [...prevValues.image, event.target.files],
            }));
        }
    };
    const handleDeleteImage = (e, index) => {
        e.preventDefault();
        const filteredImages = images.filter((_, i) => i !== index);
        setImages(filteredImages);

        formik.setValues((prevValues) => ({
            ...prevValues,
            image: filteredImages
        }));
    };
    // form validation code is here !!
    const formik = useFormik({
        initialValues: {
            category: '',
            productName: "",
            description: "",
            image: [],
            variants: addVarient.map(() => ({
                price: "",
                discount: "",
                unit: "KG",
                quantity: "",
            })),
            fields: fields.map(() => ({
                title: "",
                description: ""
            }))
        },
        validationSchema: Yup.object({
            category: Yup.string().required("Select category"),
            productName: Yup.string().required("Enter product name"),
            description: Yup.string().required("Enter description"),
            variants: Yup.array().of(
                Yup.object({
                    price: Yup.number().required("Enter price").positive("Price must be positive"),
                    quantity: Yup.number().required("Enter quantity").positive("Quantity must be positive"),
                })
            ),
        }),
        onSubmit: async (values) => {
            if (productData.length > 0) {
                dispatch(updateProduct(values)).then(() => { dispatch(getProducts()) });
            } else {
                dispatch(createProduct(values)).then(() => { dispatch(getProducts()) });
            }
            formik.setValues((prevValues) => ({
                category: '',
                productName: "",
                description: "",
                image: [],
                variants: addVarient.map(() => ({
                    price: "",
                    discount: "",
                    unit: "KG",
                    quantity: "",
                })),
                fields: fields.map(() => ({
                    title: "",
                    description: ""
                }))
            }));
            setAddVarient([{ variantName: "", price: "", unit: "", quantity: "" }])
            setFields([]);
            setImages([]);
            navigate('/seller/product')
        },
    });

    useEffect(() => {
        if (productData.length > 0) {
            let numbers = productData[0].size.match(/\d+/g)?.join('') || ''; // Extract numbers
            let chars = productData[0].size.match(/[a-zA-Z]+/g)?.join('') || ''; // Extract characters
            var fieldData = []
            if (productData[0].productData[0].specifications) {
                var data = typeof productData[0].productData[0].specifications === "string"
                    ? JSON.parse(productData[0].productData[0].specifications)
                    : productData[0].productData[0].specifications;
                fieldData = Object.keys(data).map((key) => ({
                    title: key,   // Key as title
                    description: data[key]  // Value as description
                }))
            }

            formik.setValues((prevValues) => ({
                category: productData[0].productData[0].categoryId,
                productName: productData[0].productData[0].productName,
                description: productData[0].productData[0].description,
                image: productData[0].productData[0].images,
                variants: [{
                    price: productData[0].price,
                    discount: productData[0].discount || 0,
                    unit: chars,
                    quantity: numbers,
                }],
                // fields: productData[0].productData[0].specifications.map((item,id) => ({
                //         title: "",
                //         description: item
                //     }))

                fields: fieldData,
            }));
            setFields(formik.values.fields)
            setImages(productData[0].productData[0].images)
            // console.log(formik.values.fields);
        }
    }, [productData])

    // fetch catgeory data using redux 
    const dispatch = useDispatch();
    const categoryData = useSelector((state) => state.sellerProduct.categoryData);
    useEffect(() => {
        dispatch(getCategory());
    }, [])
    return (
        <section className='sp_container'>
            <div className="d-lg-flex justify-content-between align-item-center">
                <div><h4>Product</h4>
                    <Link to={'/seller/home'}>Dashboard</Link> /
                    <Link to={'/seller/product'}>Product</Link> /
                    <Link>{productData.length <= 0 ? 'Add Product' : 'Edit Product'}</Link>
                </div>
            </div>

            <div className='sp_table p-4 bg-white shadow-sm rounded'>
                <Form onSubmit={formik.handleSubmit}>
                    <div className="row flex-wrap">
                        <div className="col-xl-12 col-lg-12 col-xxl-3 text-center">
                            <div
                                className={`${images.length <= 0 ? "z_uploadbox flex-column" : 'flex-wrap'} p-4 d-flex   align-items-center justify-content-center`}
                                onClick={() => { images.length <= 0 ? document.getElementById("fileInput").click() : '' }} >

                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="d-none"
                                    onChange={handleImageChange}
                                />
                                {/* {console.log('images', images)} */}
                                {images.length > 0 ? (
                                    <>
                                        {images.map((img, index) => (

                                            <div className='sp_uploadimg'
                                            >
                                                {img.includes('public') ? <img key={index} src={'http://localhost:4000/' + img} alt={`Upload ${index}`} className="m-2" /> : <img key={index} src={img} alt={`Upload ${index}`} className="m-2" />}
                                                <RiCloseCircleFill className='sp_icon' onClick={(e) => { handleDeleteImage(e, index) }} />
                                            </div>
                                        ))}
                                        <div className='sp_image'
                                            onClick={() => document.getElementById("fileInput").click()}>
                                            <img src={UploadImage} alt="Upload" className="img-fluid" /><br></br>
                                            <small className='mb-0'>Add image</small>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img src={UploadImage} alt="Upload" className="img-fluid" />
                                        <p className="text-muted">Click to upload images of your Product.</p>
                                    </>
                                )}
                                {formik.touched.image && formik.errors.image ? (
                                    <small className="error text-capitalize" style={{ color: "red" }}>
                                        {formik.errors.image}
                                    </small>
                                ) : null}
                            </div>
                        </div>

                        <div className="col-xl-12 col-lg-12 col-xxl-9">
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <Form.Group className='z_input_group'>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select className='z_input' value={formik.values.category} onChange={(e) => formik.setFieldValue("category", e.target.value)}>
                                            <option>Select</option>
                                            {categoryData?.map((category) => {
                                                return (<option value={category._id}>{category.categoryName}</option>)
                                            })}
                                        </Form.Select>
                                        {formik.touched.category &&
                                            formik.errors.category ? (
                                            <small className="error text-capitalize" style={{ color: "red" }}>
                                                {formik.errors.category}
                                            </small>
                                        ) : null}
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6 mb-3">
                                    <Form.Group className='z_input_group'>
                                        <Form.Label>Product Name</Form.Label>
                                        <Form.Control className='z_input' value={formik.values.productName} onChange={(e) => formik.setFieldValue("productName", e.target.value)} type="text" placeholder="Product name" />
                                        {formik.touched.productName &&
                                            formik.errors.productName ? (
                                            <small className="error text-capitalize" style={{ color: "red" }}>
                                                {formik.errors.productName}
                                            </small>
                                        ) : null}
                                    </Form.Group>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <Form.Group className='z_input_group'>
                                        <Form.Label>Product Description</Form.Label>
                                        <Form.Control className='z_textarea' value={formik.values.description} onChange={(e) => formik.setFieldValue("description", e.target.value)} as="textarea" rows={3} placeholder="Enter description..." />
                                        {formik.touched.description &&
                                            formik.errors.description ? (
                                            <small className="error text-capitalize" style={{ color: "red" }}>
                                                {formik.errors.description}
                                            </small>
                                        ) : null}
                                    </Form.Group>
                                </div>
                                <div className="col-md-12 mb-3 d-flex justify-content-end">
                                    {productData.length <= 0 && (
                                        <Link to="#" className="z_add_more" onClick={addMoreVarient}>
                                            Add Product
                                        </Link>
                                    )}
                                </div>
                                {/* {console.log("values", formik.values)} */}
                                {addVarient.map((variant, index) => (
                                    <div key={index} className="row">
                                        {index === 0 ? '' :
                                            <span className='text-end' onClick={() => { removeVarient(index) }}><RiCloseCircleFill className='sp_icon' onClick={(e) => { handleDeleteImage(e, index) }} /></span>
                                        }
                                        <div className="col-lg-6 mb-3">
                                            <Form.Group className='z_input_group'>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    className='z_input'
                                                    value={formik.values.variants[index]?.price || ""}
                                                    onChange={(e) => formik.setFieldValue(`variants[${index}].price`, e.target.value)}
                                                    type="text"
                                                    placeholder="Price"
                                                />
                                                {formik.touched.variants?.[index]?.price &&
                                                    formik.errors.variants?.[index]?.price ? (
                                                    <small className="error text-capitalize" style={{ color: "red" }}>
                                                        {formik.errors.variants[index].price}
                                                    </small>
                                                ) : null}
                                            </Form.Group>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <Form.Group className='z_input_group'>
                                                <Form.Label>Discount (optional)</Form.Label>
                                                <Form.Control
                                                    className='z_input'
                                                    value={formik.values.variants[index]?.discount || ""}
                                                    onChange={(e) => formik.setFieldValue(`variants[${index}].discount`, e.target.value)}
                                                    type="text"
                                                    placeholder="Discount"
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <Form.Group className="z_input_group">
                                                <Form.Label>Unit</Form.Label>
                                                <div className="d-flex">
                                                    {["KG", "Gram", "Piece"].map((unit) => (
                                                        <label key={unit} className="x_radio-wrapper me-3">
                                                            <input
                                                                type="radio"
                                                                name={`unit-${index}`}
                                                                className="x_radio-input"
                                                                checked={formik.values.variants[index]?.unit === unit}
                                                                onChange={() => formik.setFieldValue(`variants[${index}].unit`, unit)}
                                                            />
                                                            <span className="x_radio-custom"></span>
                                                            <span className="x_radio-label">{unit}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </Form.Group>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <Form.Group className='z_input_group'>
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control
                                                    className='z_input'
                                                    value={formik.values.variants[index]?.quantity || ""}
                                                    onChange={(e) => formik.setFieldValue(`variants[${index}].quantity`, e.target.value)}
                                                    type="text"
                                                    placeholder="Quantity"
                                                />
                                                {formik.touched.variants?.[index]?.quantity &&
                                                    formik.errors.variants?.[index]?.quantity ? (
                                                    <small className="error text-capitalize" style={{ color: "red" }}>
                                                        {formik.errors.variants[index].quantity}
                                                    </small>
                                                ) : null}
                                            </Form.Group>
                                        </div>
                                    </div>
                                ))}

                                <div className="col-md-12 mb-3 d-flex justify-content-between">
                                    <span className="text-dark">More Details</span>
                                    {productData.length <= 0 && (
                                        <Link to="#" className="z_add_more" onClick={addMoreFields}>
                                            Add More
                                        </Link>
                                    )}
                                </div>

                                {formik.values.fields.map((field, index) => (
                                    <React.Fragment key={index}>
                                        {productData.length <= 0 && (
                                            <span className='text-end' onClick={() => { removeFields(index) }}><RiCloseCircleFill className='sp_icon' onClick={(e) => { handleDeleteImage(e, index) }} /></span>

                                        )}

                                        <div className="col-lg-6 mb-3">
                                            <Form.Group className="z_input_group">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control
                                                    className="z_input"
                                                    type="text"
                                                    placeholder="Title"
                                                    value={formik.values.fields[index]?.title || ""}
                                                    onChange={(e) => formik.setFieldValue(`fields[${index}].title`, e.target.value)}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <Form.Group className="z_input_group">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    className="z_input"
                                                    type="text"
                                                    placeholder="Description"
                                                    value={formik.values.fields[index]?.description || ""}
                                                    onChange={(e) => formik.setFieldValue(`fields[${index}].description`, e.target.value)}
                                                />
                                            </Form.Group>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4">

                        <Button variant="border" className="border px-5 text-secondary z_btn" onClick={() => { navigate('/seller/product') }}>Cancel</Button>
                        <Button type='submit' className='z_button z_add_btn px-5 fw-bold' variant="success" >{productData.length <= 0 ? 'Add' : 'Update'}</Button>
                    </div>
                </Form>
            </div>
        </section>
    );
}

export default Addproduct;