import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "V-neck cotton T-shirt",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=200&auto=format&fit=crop",
      price: 60.00,
      originalPrice: 60.00,
      quantity: 1,
      color: "Blue",
      size: "XL"
    },
    {
      id: 2,
      name: "V-neck cotton T-shirt",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop",
      price: 40.00,
      originalPrice: 40.00,
      quantity: 1,
      color: "Blue",
      size: "XL"
    },
    {
      id: 3,
      name: "V-neck cotton T-shirt",
      image: "https://images.unsplash.com/photo-1613243555988-441166d4d6fd?q=80&w=200&auto=format&fit=crop",
      price: 129.00,
      originalPrice: 80.00,
      quantity: 1,
      color: "Blue",
      size: "XL"
    }
  ]);

  const [shippingMethod, setShippingMethod] = useState("free");
  const [discountCode, setDiscountCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(true);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const applyDiscountCode = () => {
    // Simulate discount application
    setAppliedDiscount(true);
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDiscount = () => {
    return appliedDiscount ? 80.00 : 0;
  };

  const getShippingCost = () => {
    switch(shippingMethod) {
      case "local": return 35.00;
      case "flat": return 35.00;
      case "free": 
      default: return 0.00;
    }
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getShippingCost();
  };

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mb-4">
          {/* Cart Items */}
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="row border-bottom pb-3 mb-3">
                <div className="col-6">
                  <h5 className="fw-bold">Products</h5>
                </div>
                <div className="col-2 text-center">
                  <h5 className="fw-bold">Price</h5>
                </div>
                <div className="col-2 text-center">
                  <h5 className="fw-bold">Quantity</h5>
                </div>
                <div className="col-2 text-center">
                  <h5 className="fw-bold">Total Price</h5>
                </div>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="row align-items-center py-3 border-bottom">
                  <div className="col-md-6 d-flex align-items-center mb-3 mb-md-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="img-fluid me-3" 
                      style={{ 
                        width: '80px', 
                        height: '100px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }} 
                    />
                    <div>
                      <h6 className="mb-1">{item.name}</h6>
                      <div className="d-flex gap-2 mb-2">
                        <div className="dropdown">
                          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button">
                            {item.color}
                          </button>
                        </div>
                        <div className="dropdown">
                          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button">
                            {item.size}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 text-center mb-3 mb-md-0">
                    {item.originalPrice !== item.price && (
                      <span className="text-decoration-line-through text-muted me-2">${formatPrice(item.originalPrice)}</span>
                    )}
                    <span className="fw-bold">${formatPrice(item.price)}</span>
                  </div>
                  <div className="col-md-2 text-center mb-3 mb-md-0">
                    <div className="input-group input-group-sm justify-content-center">
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <input 
                        type="text" 
                        className="form-control text-center" 
                        style={{ maxWidth: '50px' }}
                        value={item.quantity} 
                        readOnly
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-end d-flex justify-content-between align-items-center">
                    <span className="fw-bold ms-auto me-3">${formatPrice(item.price * item.quantity)}</span>
                    <button 
                      className="btn btn-sm text-danger" 
                      onClick={() => removeItem(item.id)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Discount Code Input */}
              <div className="mt-4">
                <div className="input-group mb-4">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Add voucher discount" 
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    style={{
                      borderColor: '#dee2e6',
                      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                    }}
                  />
                  <button 
                    className="btn px-4"
                    onClick={applyDiscountCode}
                    style={{ backgroundColor: '#2c6145', color: 'white' }}
                  >
                    Apply Code
                  </button>
                </div>

                {/* Discount Coupons */}
                <div className="d-flex flex-wrap gap-3">
                  {[
                    { code: "MO234231", discount: "10% OFF", minOrder: "from 200$" },
                    { code: "MO234231", discount: "10% OFF", minOrder: "from 200$" },
                    { code: "MO234231", discount: "10% OFF", minOrder: "from 200$" }
                  ].map((coupon, index) => (
                    <div 
                      key={index} 
                      className={`position-relative ${index === 1 ? 'bg-opacity-10' : 'bg-white'}`}
                      style={{ 
                        width: '250px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: index === 1 ? '#e8f5e9' : '#fff'
                      }}
                    >
                      <div className="p-3" style={{ borderBottom: '1px dashed #2c6145' }}>
                        <div className="text-muted small mb-1">Discount</div>
                        <div className={`fw-bold mb-1`} style={{ 
                          fontSize: '1.25rem',
                          color: index === 1 ? '#2c6145' : '#2c6145'
                        }}>
                          {coupon.discount}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                          For all orders {coupon.minOrder}
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center p-3">
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>{coupon.code}</div>
                        <button 
                          className="btn btn-sm"
                          style={{ 
                            fontSize: '0.85rem',
                            padding: '0.3rem 1rem',
                            backgroundColor: '#2c6145',
                            color: 'white'
                          }}
                        >
                          Apply Code
                        </button>
                      </div>

                      {/* Left Circle */}
                      <div 
                        style={{
                          position: 'absolute',
                          left: '-6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '0% 50% 50% 0%',
                          border: '1px dashed #2c6145',
                          zIndex: 1
                        }}
                      />
                      
                      {/* Right Circle */}
                      <div 
                        style={{
                          position: 'absolute',
                          right: '-6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '50% 0% 0% 50%',
                          border: '1px dashed #2c6145',
                          zIndex: 1
                        }}
                      />

                      {/* Border */}
                      <div 
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: '1px dashed #2c6145',
                          borderRadius: '8px',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Order Summary */}
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4">Order Summary</h4>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>${formatPrice(getSubtotal())}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Discounts</span>
                <span>-${formatPrice(getDiscount())}</span>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>${formatPrice(getShippingCost())}</span>
                </div>
                
                <div className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="shipping" 
                    id="freeShipping" 
                    checked={shippingMethod === "free"}
                    onChange={() => setShippingMethod("free")}
                  />
                  <label className="form-check-label d-flex justify-content-between w-100" htmlFor="freeShipping">
                    <span>Free Shipping</span>
                    <span>$0.00</span>
                  </label>
                </div>
                
                <div className="form-check mb-2">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="shipping" 
                    id="localShipping"
                    checked={shippingMethod === "local"}
                    onChange={() => setShippingMethod("local")}
                  />
                  <label className="form-check-label d-flex justify-content-between w-100" htmlFor="localShipping">
                    <span>Local:</span>
                    <span>$35.00</span>
                  </label>
                </div>
                
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="shipping" 
                    id="flatRate"
                    checked={shippingMethod === "flat"}
                    onChange={() => setShippingMethod("flat")}
                  />
                  <label className="form-check-label d-flex justify-content-between w-100" htmlFor="flatRate">
                    <span>Flat Rate:</span>
                    <span>$35.00</span>
                  </label>
                </div>
              </div>
              
              <div className="border-top pt-3 mt-3">
                <div className="d-flex justify-content-between mb-4">
                  <h5 className="fw-bold">Total</h5>
                  <h5 className="fw-bold">${formatPrice(getTotal())}</h5>
                </div>
                
                <div className="form-check mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="terms" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I agree with the <a href="#" className="text-decoration-none">Terms And Conditions</a>
                  </label>
                </div>
                
                <button 
                  className="btn w-100 mb-3" 
                  disabled={!agreedToTerms}
                  style={{ backgroundColor: '#2c6145', color: 'white' }}
                >
                  Process To Checkout
                </button>
                
                <div className="text-center">
                  <a href="#" className="text-decoration-none">Or continue shopping</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<style>
{`
  /* Custom Radio Button Styles */
  .form-check-input[type="radio"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #2c6145;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    position: relative;
    margin-right: 10px;
  }

  .form-check-input[type="radio"]:checked::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #2c6145;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .form-check-input[type="radio"]:focus {
    box-shadow: 0 0 0 4px rgba(44, 97, 69, 0.2);
  }

  /* Custom Checkbox Styles */
  .form-check-input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #2c6145;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    margin-right: 10px;
  }

  .form-check-input[type="checkbox"]:checked {
    background-color: #2c6145;
  }

  .form-check-input[type="checkbox"]:checked::before {
    content: '';
    position: absolute;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -65%) rotate(45deg);
  }

  .form-check-input[type="checkbox"]:focus {
    box-shadow: 0 0 0 4px rgba(44, 97, 69, 0.2);
  }

  /* Form Check Label Styles */
  .form-check-label {
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
  }

  /* Custom Input Focus Styles */
  .form-control:focus {
    border-color: #2c6145;
    box-shadow: 0 0 0 0.25rem rgba(44, 97, 69, 0.25);
  }

  /* Custom Link Color */
  a.text-decoration-none {
    color: #2c6145;
  }

  a.text-decoration-none:hover {
    color: #234e37;
  }
`}
</style>