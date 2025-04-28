import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";



export const getuserData = createAsyncThunk(
    'getuserData',
    async (_, { rejectWithValue, getState }) => {
        // console.log('id',id);
        // console.log('value',value)
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        var response = await axios.get('http://localhost:4000/api/getUser', config);
        return response.data;
    }
)

export const getProducts = createAsyncThunk(
    'getProducts',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        // console.log('is callled');
            const response = await axios.get('http://localhost:4000/api/allProducts', config);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error);
        }
    }
)
export const getCategory = createAsyncThunk(
    'getCategory',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            const response = await axios.get('http://localhost:4000/api/allCategory', config);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error);
        }
    }
)

export const createProduct = createAsyncThunk(
    'createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            // console.log('productData', productData);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('categoryId', productData.category);
            formData.append('productName', productData.productName);
            formData.append('description', productData.description);

            productData.image.forEach((fileList) => {
                if (fileList.length > 0) {
                    formData.append('images', fileList[0]); // Only first file
                }

            });
            const specifications = productData.fields.reduce((acc, field) => {
                acc[field.title] = field.description; // Correct object structure
                return acc;
            }, {});

            formData.append('specifications', JSON.stringify(specifications));
            // console.log(productData);
            // console.log(formData)
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            const response = await axios.post('http://localhost:4000/api/createProduct', formData, config);
            const requests = productData.variants.map(variant => {
                return axios.post('http://localhost:4000/api/createProductVarient', {
                    productId: response.data.data._id,
                    size: `${variant.quantity}${variant.unit}`,
                    price: variant.price,
                    discount: variant.discount,
                    sellerId: localStorage.getItem('userId')
                }, config);
            });
            const responses = await Promise.all(requests); // Wait for all API calls
            // console.log('All responses:', responses.map(res => res.data));
            formData.append('packSizes', JSON.stringify(packSizes));
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
)

export const deleteProduct = createAsyncThunk(
    'deleteProduct',
    async (productId, { rejectWithValue }) => {
        // console.log('deleteProduct', productId);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        await axios.delete('http://localhost:4000/api/deleteProductVarient/' + productId, config);
        // dispatch(getProducts());
    }
)

export const getSingleProduct = createAsyncThunk(
    'getSingleProduct',
    async (productId, { rejectWithValue }) => {
        // console.log('getSingleProduct', productId);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const response = await axios.get('http://localhost:4000/api/getProductVarient/' + productId, config);
        return response.data;
    }
)

export const updateProduct = createAsyncThunk(
    'updateProduct',
    async (productData, { rejectWithValue, getState }) => {
        try {
            const state = getState(); // Access Redux state
            const myVariable = state.sellerProduct.singleProduct[0];
            // console.log('updateProduct', myVariable);
            // console.log('productData', productData);
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('categoryId', productData.category);
            formData.append('productName', productData.productName);
            formData.append('description', productData.description);

            const existingImages = [];
            if (Array.isArray(productData.image)) {
                productData.image.forEach((imgItem) => {
                    if (typeof imgItem === 'string') {
                        existingImages.push(imgItem);
                    } else if (imgItem instanceof FileList) {
                        for (let i = 0; i < imgItem.length; i++) {
                            formData.append('images', imgItem[i]);
                        }
                    } else if (imgItem instanceof File) {
                        formData.append('images', imgItem);
                    }
                });
            }

            formData.append('existingImages', JSON.stringify(existingImages));

            const specifications = productData.fields.reduce((acc, field) => {
                acc[field.title] = field.description; // Correct object structure
                return acc;
            }, {});

            formData.append('specifications', JSON.stringify(specifications));
            // console.log(productData.variants[0]);
            for (let pair of formData.entries()) {
                // console.log(`${pair[0]}:`, pair[1]);
            }
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            const response = await axios.put('http://localhost:4000/api/updateProduct/' + myVariable.productData[0]._id, formData, config);
            // console.log('hey', response.data);
            // console.log('sss', myVariable)
            const requests = await axios.put('http://localhost:4000/api/updateProductVarient/' + myVariable._id, {
                productId: myVariable.productData[0]._id,
                size: `${productData.variants[0].quantity}${productData.variants[0].unit}`,
                price: productData.variants[0].price,
                discount: productData.variants[0].discount
            }, config);
            // console.log('All responses:', requests.data);
        } catch (error) {
            console.log('error:', error);
        }

        // const requests = 
    }
);

export const viewProduct = createAsyncThunk(
    'viewProduct',
    async (productId, { rejectWithValue }) => {
        console.log('viewProduct', productId);
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const response = await axios.get('http://localhost:4000/api/getProductVarient/' + productId, config);
        return response.data;
    }
)
export const removesingleproduct = createAsyncThunk(
    'removesingleproduct',
    async (_, { rejectWithValue }) => {
        // No actual API here, just return something to trigger reducer
        return [];
    }
);

export const updateProductStats = createAsyncThunk(
    'updateProductStats',
    async ({ id, value }, { rejectWithValue, getState }) => {
        // console.log('id',id);
        console.log('value',value)
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        await axios.put('http://localhost:4000/api/updateProductVarient/' + id, {
            status: value
        }, config);
    }
)
const productSlice = createSlice({
    name: 'product',
    initialState: {
        productData: [],
        categoryData: [],
        singleProduct: [],
        selectedProductId: null,
        viewProduct: [],
        userData: [],
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getuserData.fulfilled, (state, action) => {
            state.userData = action?.payload?.data;
            // console.log('userData get successfully', action?.payload?.data)
        })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.productData = action?.payload?.data;
                // console.log('Products fetched successfully', action.payload.data);
            })
            .addCase(getProducts.rejected, (state, action) => {
                console.error(action.payload);
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.categoryData = action?.payload?.data;
                // console.log('Category fetched successfully', action.payload.data);
            })
            .addCase(getCategory.rejected, (state, action) => {
                console.error(action.payload);
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                // state.categoryData = action?.payload?.data;
                // console.log('Category fetched successfully', action.payload.data);
                // handleAddVariant();
            }).addCase(getSingleProduct.fulfilled, (state, action) => {
                state.singleProduct = action?.payload?.data;
                state.selectedProductId = action?.payload?.data[0]?._id;
                // console.log('Single Product fetched successfully', action.payload.data);
            }).addCase(viewProduct.fulfilled, (state, action) => {
                state.viewProduct = action?.payload?.data;
            }).addCase(removesingleproduct.fulfilled, (state, action) => {
                state.singleProduct = []; // Clear the array
            });
    }
})

export const { } = productSlice.actions;
export default productSlice.reducer;