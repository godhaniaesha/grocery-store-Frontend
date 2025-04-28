import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import productReducer from '../slices/product.Slice';
import productVariantReducer from '../slices/productVeriant.Slice';
import userReducer from '../slices/userSlice';
import categoryReducer from '../slices/categorySlice';
import contactReducer from '../slices/contactSlice';
import emailVerificationReducer from '../slices/emailVerificationSlice';
import addressReducer from '../slices/address.Slice';
import cartReducer from '../slices/cart.Slice';
import couponReducer from '../slices/coupon.Slice';
import orderReducer from '../slices/order.Slice';
import sellerProductReducer from '../slices/sellerProductSlice';
import sellerInventoryReducer from '../slices/sellerInventorySlice';
import sellerDashboardReducer from '../slices/sellerDashboard';
import searchReducer from '../slices/search.Slice';
import SellerOrderReducer from '../slices/sellerOrderSlice';
import currencyReducer from '../slices/currency.Slice';
import deleteAccReducer  from '../slices/deleteAcc.Slice';
import resendOtpReducer from '../slices/resendOtp.Slice';
export const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  productveriant: productVariantReducer,
  category: categoryReducer,
  contact: contactReducer,
  user: userReducer,
  emailVerification: emailVerificationReducer,
  address: addressReducer,
  addcart: cartReducer,
  coupons: couponReducer,  // Add this line
  order: orderReducer,
  search: searchReducer,
  
  // seller reducer
  sellerProduct: sellerProductReducer,
  sellerInventory: sellerInventoryReducer,
  sellerDashboard: sellerDashboardReducer,
  sellerOrder: SellerOrderReducer,
  currency: currencyReducer,
  deleteAcc: deleteAccReducer,
  resendOtpSlice: resendOtpReducer,
});