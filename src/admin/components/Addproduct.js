import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UploadImage from '../../img/Kassets/UploadImage.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, createProductVariant, getCategory, getProducts, getSingleProduct, removesingleproduct, updateProduct } from '../../redux/slices/sellerProductSlice';
import { RiCloseCircleFill } from 'react-icons/ri';
import { getAllSubcategories } from '../../redux/slices/Subcategory.slice';
import { updateProductVariant } from '../../redux/slices/productVeriant.Slice';

function Addproduct() {
    const { id } = useParams();
    const [fields, setFields] = useState([]);
    const singleProductFromRedux = useSelector((state) => state.sellerProduct?.singleProduct);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const [addVarient, setAddVarient] = useState([{ variantName: "", price: "", unit: "KG", quantity: "" }]);
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Track if data is loaded

    // Fetch category and subcategory data
    const categoryData = useSelector((state) => state.sellerProduct.categoryData);
    const subcategoriesData = useSelector((state) => state.subcategory.subcategories);

    useEffect(() => {
        dispatch(getCategory());
        dispatch(getAllSubcategories());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            category: '',
            subcategory: '',
            productName: "",
            description: "",
            image: [],
            variants: addVarient.map(() => ({
                price: "",
                discount: "",
                unit: "KG",
                quantity: "",
            })) || [],
            fields: fields.map(() => ({
                title: "",
                description: ""
            })) || []
        },
        validationSchema: Yup.object({
            category: Yup.string().required("Select category"),
            subcategory: Yup.string().required("Select subcategory"),
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
            const formData = new FormData();
            formData.append('categoryId', values.category);
            formData.append('subCategoryId', values.subcategory);
            formData.append('productName', values.productName);
            formData.append('description', values.description);

            // Append images
            values.image.forEach((file) => {
                formData.append('images', file);
            });

            // Add specifications (fields)
            const specifications = values.fields.reduce((acc, field) => {
                acc[field.title] = field.description;
                return acc;
            }, {});
            formData.append('specifications', JSON.stringify(specifications));

            if (id) {
                // Find productId from loaded data
                const product = singleProductFromRedux[0];
                const productId = product?.productData?.[0]?._id;
                dispatch(updateProduct({
                    id: productId,
                    variantId: id, // id from URL param
                    category: values.category,
                    subcategory: values.subcategory,
                    productName: values.productName,
                    description: values.description,
                    image: values.image,
                    fields: values.fields,
                    variants: values.variants
                })).then(() => { 
                    dispatch(getProducts()) 
                });
            } else {
                // Create new product
                dispatch(createProduct(formData)).then((res) => {
                    if (res.payload && res.payload.data) {
                        // After product is created, create variants
                        const productId = res.payload.data._id;
                        values.variants.forEach(variant => {
                            dispatch(createProductVariant({
                                productId: productId,
                                size: `${variant.quantity}${variant.unit}`,
                                price: variant.price,
                                discount: variant.discount || 0,
                                sellerId: localStorage.getItem('userId')
                            }));
                        });
                    }
                    dispatch(getProducts());
                });
            }

            formik.resetForm();
            setAddVarient([{ variantName: "", price: "", unit: "KG", quantity: "" }]);
            setFields([]);
            setImages([]);
            navigate('/seller/product');
        },
    });

    // Effect to fetch single product data when ID is present
    useEffect(() => {
        if (id) {
            // Clear previous product data immediately
            dispatch(removesingleproduct());
            setIsDataLoaded(false);
            formik.resetForm();
            setAddVarient([{ variantName: "", price: "", unit: "KG", quantity: "" }]);
            setFields([]);
            setImages([]);
            // Now fetch the new product
            dispatch(getSingleProduct(id));
        } else {
            dispatch(removesingleproduct());
            setIsDataLoaded(true);
            formik.resetForm();
            setAddVarient([{ variantName: "", price: "", unit: "KG", quantity: "" }]);
            setFields([]);
            setImages([]);
        }
    }, [id, dispatch]);

    // Effect to populate formik values when singleProductFromRedux is available
    useEffect(() => {
        // Only fill the form if the loaded product's id matches the URL param id
        if (
            id &&
            singleProductFromRedux &&
            singleProductFromRedux.length > 0 &&
            singleProductFromRedux[0]?._id === id &&
            !isDataLoaded
        ) {
            const product = singleProductFromRedux[0];
            if (product) {
                let numbers = product.size.match(/\d+/g)?.join('') || '';
                let chars = product.size.match(/[a-zA-Z]+/g)?.join('') || '';
                let fieldData = [];

                if (product.productData[0].specifications) {
                    const data = typeof product.productData[0].specifications === "string"
                        ? JSON.parse(product.productData[0].specifications)
                        : product.productData[0].specifications;
                    
                    fieldData = Object.keys(data).map((key) => ({
                        title: key,
                        description: data[key]
                    }));
                }

                // Set form values
                formik.setValues({
                    category: product.productData[0].categoryId,
                    subcategory: product.productData[0].subCategoryId || '', // Ensure subcategory is set
                    productName: product.productData[0].productName,
                    description: product.productData[0].description,
                    image: product.productData[0].images || [], // Set existing images
                    variants: [{
                        price: product.price,
                        discount: product.discount || 0,
                        unit: chars,
                        quantity: numbers,
                    }],
                    fields: fieldData,
                });
                console.log(product.productData[0].subCategoryId,"sxfgdfgdgd");
                

                // Set component state
                setAddVarient([{
                    variantName: "",
                    price: product.price,
                    unit: chars,
                    quantity: numbers,
                }]);

                setFields(fieldData);
                setImages(product.productData[0].images);
                setIsDataLoaded(true); // Mark data as loaded
            }
        }
    }, [singleProductFromRedux, id, isDataLoaded]);

    // Show loading if we're in edit mode but data isn't loaded yet
    if (
        id &&
        (
            !singleProductFromRedux ||
            singleProductFromRedux.length === 0 ||
            singleProductFromRedux[0]?._id !== id ||
            !isDataLoaded
        )
    ) {
        return (
            <section className='sp_container x_err'>
                <div className="d-xl-flex justify-content-between align-item-center">
                    <div>
                        <h4>Product</h4>
                        <Link to={'/seller/home'}>Dashboard</Link> /
                        <Link to={'/seller/product'}>Product</Link> /
                        <Link>Loading...</Link>
                    </div>
                </div>
                <div className='sp_table p-4 bg-white shadow-sm rounded text-center'>
                    <p>Loading product data...</p>
                </div>
            </section>
        );
    }

    const addMoreVarient = () => {
        setAddVarient([...addVarient, { price: "", discount: "", unit: "KG", quantity: "" }]);
        formik.setValues((prevValues) => ({
            ...prevValues,
            variants: [...prevValues.variants, { price: "", quantity: "", unit: "KG" }],
        }));
    };

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

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const newImageFiles = Array.from(files);
            const imageArray = [...images, ...newImageFiles.map((file) => URL.createObjectURL(file))];
            setImages(imageArray);
            
            // Combine existing images with new files
            const currentFormikImages = formik.values.image || [];
            formik.setFieldValue("image", [...currentFormikImages, ...newImageFiles]);
        }
    };

    const handleDeleteImage = (e, index) => {
        e.preventDefault();
        const filteredImages = images.filter((_, i) => i !== index);
        setImages(filteredImages);
        
        // Handle both existing images (strings) and new files
        const currentFormikImages = formik.values.image || [];
        const filteredFormikImages = currentFormikImages.filter((_, i) => i !== index);
        formik.setFieldValue("image", filteredFormikImages);
    };

    const selectedSubcategory = (subcategoriesData || [])?.find(
        sub => sub._id === formik.values.subcategory
    );
      const selectedSubcategoryName = selectedSubcategory ? selectedSubcategory.subCategoryName : '';
      console.log(selectedSubcategoryName,"selectedSubcategoryName");
      
    return (
        <section className='sp_container x_err'>
            <div className="d-xl-flex justify-content-between align-item-center">
                <div><h4>Product</h4>
                    <Link to={'/seller/home'}>Dashboard</Link> /
                    <Link to={'/seller/product'}>Product</Link> /
                    <Link>{id ? 'Edit Product' : 'Add Product'}</Link>
                </div>
            </div>
            <div className='sp_table p-4 bg-white shadow-sm rounded'>
                <Form onSubmit={formik.handleSubmit}>
                    <div className="row flex-wrap">
                        <div className="col-xl-12 col-lg-12 col-xxl-3 text-center x_p0">
                            <div
                                className={`${images.length <= 0 ? "z_uploadbox flex-column" : 'flex-wrap'} p-4 d-flex align-items-center justify-content-center`}
                                onClick={() => { images.length <= 0 ? document.getElementById("fileInput").click() : '' }} >
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="d-none"
                                    onChange={handleImageChange}
                                />
                                {images.length > 0 ? (
                                    <>
                                        {images.map((img, index) => (
                                            <div className='sp_uploadimg' key={index}>
                                                {img.includes('public') ? <img src={'http://localhost:4000/' + img} alt={`Upload ${index}`} className="m-2" /> : <img src={img} alt={`Upload ${index}`} className="m-2" />}
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
                        <div className="col-xl-12 col-lg-12 col-xxl-9 ">
                            <div className="row">
                                <div className="col-lg-6 mb-3 x_p0">
                                    <Form.Group className='z_input_group'>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select
                                            className='z_input'
                                            name="category"
                                            value={formik.values.category}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value="">Select</option>
                                            {(categoryData || []).map((category) => {
                                                return (<option key={category._id} value={category._id}>{category.categoryName}</option>)
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
                                <div className="col-lg-6 mb-3 x_p0">
                                    <Form.Group className='z_input_group'>
                                        <Form.Label>Subcategory</Form.Label>
                                        
                                        <Form.Select
                                            className='z_input'
                                            name="subcategory"
                                            value={formik.values.subcategory}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value="">{selectedSubcategoryName || 'Select'}</option>
                                            {(subcategoriesData || [])
                                                .filter(sub => sub.categoryId === formik.values.category)
                                                .map((subcategory) => (
                                                    <option key={subcategory._id} value={subcategory._id}>
                                                        {subcategory.subCategoryName}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                        {formik.touched.subcategory &&
                                            formik.errors.subcategory ? (
                                            <small className="error text-capitalize" style={{ color: "red" }}>
                                                {formik.errors.subcategory}
                                            </small>
                                        ) : null}
                                    </Form.Group>
                                </div>
                                <div className="col-lg-6 mb-3 x_p0">
                                    <Form.Group className='z_input_group'>
                                        <Form.Label>Product Name</Form.Label>
                                        <Form.Control
                                            className='z_input'
                                            name="productName"
                                            value={formik.values.productName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            type="text"
                                            placeholder="Product name"
                                        />
                                        {formik.touched.productName &&
                                            formik.errors.productName ? (
                                            <small className="error text-capitalize" style={{ color: "red" }}>
                                                {formik.errors.productName}
                                            </small>
                                        ) : null}
                                    </Form.Group>
                                </div>
                                <div className="col-md-12 mb-3 x_p0">
                                    <Form.Group className='z_input_group'>
                                        <Form.Label>Product Description</Form.Label>
                                        <Form.Control
                                            className='z_textarea'
                                            name="description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter description..."
                                        />
                                        {formik.touched.description &&
                                            formik.errors.description ? (
                                            <small className="error text-capitalize" style={{ color: "red" }}>
                                                {formik.errors.description}
                                            </small>
                                        ) : null}
                                    </Form.Group>
                                </div>
                                <div className="col-md-12 mb-3 d-flex justify-content-end x_p0">
                                    {!id && (
                                        <Link to="#" className="z_add_more" onClick={addMoreVarient}>
                                            Add Product Variant
                                        </Link>
                                    )}
                                </div>
                                {addVarient.map((variant, index) => (
                                    <div key={index} className="row p-0 m-auto">
                                        {index === 0 && id ? '' :
                                            <span className='text-end' onClick={() => { removeVarient(index) }}><RiCloseCircleFill className='sp_icon' /></span>
                                        }
                                        <div className="col-lg-6 mb-3 x_p0">
                                            <Form.Group className='z_input_group'>
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control
                                                    className='z_input'
                                                    name={`variants[${index}].price`}
                                                    value={formik.values.variants[index]?.price || ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
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
                                        <div className="col-lg-6 mb-3 x_p0">
                                            <Form.Group className='z_input_group'>
                                                <Form.Label>Discount (optional)</Form.Label>
                                                <Form.Control
                                                    className='z_input'
                                                    name={`variants[${index}].discount`}
                                                    value={formik.values.variants[index]?.discount || ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    type="text"
                                                    placeholder="Discount"
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-lg-6 mb-3 x_p0">
                                            <Form.Group className="z_input_group">
                                                <Form.Label>Unit</Form.Label>
                                                <div className="d-flex">
                                                    {["KG", "Gram", "Piece"].map((unit) => (
                                                        <label key={unit} className="x_radio-wrapper me-3">
                                                            <input
                                                                type="radio"
                                                                name={`variants[${index}].unit`}
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
                                        <div className="col-lg-6 mb-3 x_p0">
                                            <Form.Group className='z_input_group'>
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control
                                                    className='z_input'
                                                    name={`variants[${index}].quantity`}
                                                    value={formik.values.variants[index]?.quantity || ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
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
                                <div className="col-md-12 mb-3 d-flex justify-content-between x_p0">
                                    <span className="text-dark">More Details</span>
                                    {!id && (
                                        <Link to="#" className="z_add_more" onClick={addMoreFields}>
                                            Add More
                                        </Link>
                                    )}
                                </div>
                                {formik.values.fields.map((field, index) => (
                                    <React.Fragment key={index}>
                                        {!id && (
                                            <span className='text-end' onClick={() => { removeFields(index) }}><RiCloseCircleFill className='sp_icon' /></span>
                                        )}
                                        <div className="col-lg-6 mb-3 x_p0">
                                            <Form.Group className="z_input_group">
                                                <Form.Label>Title</Form.Label>
                                                <Form.Control
                                                    className="z_input"
                                                    type="text"
                                                    placeholder="Title"
                                                    name={`fields[${index}].title`}
                                                    value={formik.values.fields[index]?.title || ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            </Form.Group>
                                        </div>
                                        <div className="col-lg-6 mb-3 x_p0">
                                            <Form.Group className="z_input_group">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    className="z_input"
                                                    type="text"
                                                    placeholder="Description"
                                                    name={`fields[${index}].description`}
                                                    value={formik.values.fields[index]?.description || ""}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                            </Form.Group>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3 mt-4 ">
                        <Button variant="border" className="border text-secondary z_btn" onClick={() => { navigate('/seller/product') }}>Cancel</Button>
                        <Button type='submit' className='z_button z_add_btn fw-bold' variant="success" >{id ? 'Update' : 'Add'}</Button>
                    </div>
                </Form>
            </div>
        </section>
    );
}

export default Addproduct;