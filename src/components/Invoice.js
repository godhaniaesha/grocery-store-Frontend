import React, { useState, useEffect } from "react";
// import '../styles/x_app.css'; // Removed: This is a local CSS file and needs to be handled by your project setup.
import html2pdf from "html2pdf.js"; // This library needs to be installed.
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // This library needs to be installed.
import { fetchPayment } from "../redux/slices/payment.Slice"; // Ensure this path is correct in your project.

const Invoice = () => {
  const [isdisplay, setIsDisplay] = useState(true);
  const navigate = useNavigate();
  const id = localStorage.getItem('paymentId');
  const dispatch = useDispatch();
  const { payment, loading, error } = useSelector((state) => state.payment);

  // Effect to fetch payment data when component mounts or 'id' changes
  useEffect(() => {
    if (id) {
      dispatch(fetchPayment(id));
    }
  }, [id, dispatch]);

  // Helper function to get product details by productId from the fetched payment data
  const getProduct = (productId) => {
    const product = payment?.productData?.find((p) => p._id === productId);
    if (!product) {
      console.warn(`Product with ID '${productId}' not found in payment.productData.`);
    }
    return product;
  };

  // Helper function to get variant details by variantId from a product's variant data
  const getVariant = (variantId, product) => {
    console.log(variantId,"variantID")
    if (!product) {
      // This case should ideally be caught by getProduct, but added for robustness.
      console.warn(`Cannot get variant for ID '${variantId}': Product object is undefined.`);
      return undefined;
    }
    const variant = product.productVarientData?.find((v) => v._id === variantId);
    if (!variant) {
      console.warn(`Variant with ID '${variantId}' not found for product '${product._id || "unknown"}'.`);
    }
    return variant;
  };

  // --- Mock Asynchronous Function to Fetch Variant by ID ---
  // This function simulates an real API call to fetch a single product variant by its ID.
  // In a real application, this would typically involve a network request (e.g., using axios or fetch).
  const fetchProductVariantById = async (variantId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if payment data or product data is missing before attempting to find variants
    if (!payment || !payment.productData) {
      console.warn("Payment data or payment.productData is missing when trying to fetch product variant by ID.");
      return null;
    }

    // Iterate through all products to find the variant
    for (const product of payment.productData) {
      // Use optional chaining to safely attempt finding the variant within product.productVarientData
      const variant = product.productVarientData?.find(v => v._id === variantId); 
      if (variant) {
        return variant; // Return the found variant
      }
    }
    // If loop completes and variant is not found
    console.warn(`Variant with ID '${variantId}' not found across any products in payment data.`);
    return null; // Return null if not found
  };
  // --- End Mock Asynchronous Function ---


  // Effect to log invoice items and simulate fetching variant data
  useEffect(() => {
    // Ensure payment data and order data are available before processing
    if (payment && payment.orderData && payment.orderData.length > 0) {
      const items = payment.orderData[0].items;

      if (items && items.length) {
        console.log("Invoice items:", items);
        items.forEach(async (item) => {
          const product = getProduct(item.productId); // Get product details using helper
          // Call the mock async function to get variant data by ID
          const fetchedVariantData = await fetchProductVariantById(item.productVarientId);

          console.log({
            item,
            product,
            // Log the data fetched using the simulated fetchProductVariantById
            fetchedVariantData, // This is the specific variant data fetched by ID
            // The existing variant data from getVariant is also useful for comparison
            variantFromDirectAccess: getVariant(item.productVarientId, product),
            size: fetchedVariantData?.size || fetchedVariantData?.weight || 'N/A', // Use fetched data for size
            price: fetchedVariantData?.price, // Use fetched data for price
            total: (item.quantity * (fetchedVariantData?.price || item.price)) // Use fetched data for total calculation
          });
        });
      }
    }
  }, [payment]); // Rerun this effect when 'payment' data changes

  // Function to handle PDF download
  const downloadPDF = () => {
    const invoiceElement = document.querySelector('.x_invoice');
    const btns = invoiceElement.querySelector('.no-print-pdf');
    setIsDisplay(false); // Hide buttons during PDF generation
    if (btns) btns.style.display = 'none';

    const opt = {
      margin: 0,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(invoiceElement).save().then(() => {
      if (btns) btns.style.display = ''; // Show buttons after PDF generation
      setTimeout(() => {
        navigate('/'); // Navigate home after a short delay
      }, 2000);
    });
  };

  // Conditional rendering for loading, error, and no payment data states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!payment) return <div>No payment data found.</div>;

  // Extract dynamic data *after* confirming payment exists and is not loading/errored
  const user = payment.userData[0];
  const order = payment.orderData[0];
  const items = order.items;
  // products is already available through Redux via payment.productData, no need for a separate constant here
  // const products = payment.productData; 

  return (
    <div className="x_invoice bg-light p-4">
      <div className="container bg-white shadow p-4 rounded">
        {/* Header Section */}
        <div className="x_header d-flex flex-column flex-md-row justify-content-between align-items-center bg-info text-white p-3 rounded">
          <div>
            <span className="fw-bold fs-4">FreshMart</span>
            <p className="mb-0">1729 Bangor St, Houlton, ME, USA</p>
            <p className="mb-0">Phone: +1(142)-532-9109</p>
          </div>
          <div className="text-end">
            <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
            <p><strong>Amount:</strong> ${order.totalAmount}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="badge bg-success">{payment.paymentStatus}</span>
            </p>
          </div>
        </div>

        {/* Issue From/To Sections */}
        <div className="row mt-4">
          <div className="col-md-6 x_p_pad">
            <h6>Issue From :</h6>
            <p><strong>FreshMart Admin.INC</strong></p>
            <p>Phone: +1(781)-417-2004</p>
            <p>Email: freshmartstore@gamil.com</p>
          </div>
          <div className="col-md-6 text-md-end x_p_pad">
            <h6>Issue For :</h6>
            <p><strong>{user.email}</strong></p>
            <p>Phone: {user.mobileNo}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>

        {/* Product Details Table */}
        <div className="table-responsive mt-4">
          <table className="table x_table table-bordered align-middle" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead className="table-light">
              <tr>
                <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Product</th>
                <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Size</th>
                <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Quantity</th>
                <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Price</th>
                <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const product = getProduct(item.productId);
                const variant = getVariant(item.productVarientId, product); // Using the direct access helper here for display

                return (
                  <tr key={item._id || idx}>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>
                      {product && product.images && product.images[0] && (
                        <img
                          src={`http://localhost:4000/public/${product.images[0].replace('public\\', '')}`}
                          alt={product.productName}
                          width={40}
                          style={{ marginRight: 8, verticalAlign: 'middle' }}
                        />
                      )}
                      {product ? product.productName : item.productId}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>
                      {variant?.size || variant?.weight || 'N/A'} {variant?.unit || ''}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{variant?.price || item.price}</td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{item.quantity * (variant?.price || item.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="row justify-content-end">
          <div className="col-md-5">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <span>Sub Total:</span> <strong>${order.totalAmount}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Discount:</span> <strong>-$0.00</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Estimated Tax:</span> <strong>$0.00</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Grand Amount:</span> <strong>${order.totalAmount}</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Note */}
        <div className="alert alert-danger mt-4 x_note">
          <strong>Note:</strong> All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If payment isn't received within 7 days, the quoted fee will be charged to the credit details on file.
        </div>

        {/* Action Buttons (Print and Download) */}
        {isdisplay && (
          <div className="d-flex justify-content-end gap-2 no-print-pdf">
            <button className="btn btn-warning" onClick={() => window.print()}>Print</button>
            <button className="btn btn-success" onClick={downloadPDF}>Download</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
