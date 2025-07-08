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
            console.log("is called", response.data);

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
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
            const response = await axios.post('http://localhost:4000/api/createProducts', formData, config);
            // ... handle variants if needed ...
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
    async ({ id, variantId, category, subcategory, productName, description, image, fields, variants }, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const myVariable = state.sellerProduct.singleProduct[0];
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('categoryId', category);
            formData.append('subCategoryId', subcategory);
            formData.append('productName', productName);
            formData.append('description', description);

            const existingImages = [];
            const newImages = [];
            
            if (Array.isArray(image)) {
                image.forEach((imgItem) => {
                    if (typeof imgItem === 'string') {
                        // This is an existing image path
                        existingImages.push(imgItem);
                    } else if (imgItem instanceof File) {
                        // This is a new image file
                        newImages.push(imgItem);
                        formData.append('images', imgItem);
                    }
                });
            }

            formData.append('existingImages', JSON.stringify(existingImages));

            const specifications = fields.reduce((acc, field) => {
                acc[field.title] = field.description;
                return acc;
            }, {});

            formData.append('specifications', JSON.stringify(specifications));

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            const response = await axios.put('http://localhost:4000/api/updateProduct/' + id, formData, config);

            // Use the passed variantId, not myVariable._id
            await axios.put('http://localhost:4000/api/updateProductVarient/' + variantId, {
                productId: id,
                size: `${variants[0].quantity}${variants[0].unit}`,
                price: variants[0].price,
                discount: variants[0].discount
            }, config);

            return { success: true };

        } catch (error) {
            console.log('error:', error);
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
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
        console.log('value', value)
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

export const createProductVariant = createAsyncThunk(
    'createProductVariant',
    async (variantData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const response = await axios.post('http://localhost:4000/api/createProductVarient', variantData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        productData: [],
        categoryData: [],
        subcategoryData: [],
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
            console.log('userData get successfully', action?.payload?.data)
        })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.productData = action?.payload?.data;
                console.log('Products fetched successfully', action.payload.data);
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
                console.log('createProduct', action.payload); // Log action.payload
                // Optionally, update productData if you want to add the new product to the list
                if (action.payload && action.payload.data) {
                    state.productData = [...state.productData, action.payload.data];
                }
                // state.subcategoryData = action?.payload?.data;
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
            }).addCase(updateProduct.fulfilled, (state, action) => {
                console.log('Product updated successfully');
            }).addCase(updateProduct.rejected, (state, action) => {
                console.error('Product update failed:', action.payload);
            });
    }
})

export const { } = productSlice.actions;
export default productSlice.reducer;