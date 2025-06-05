import React, { useState, useEffect } from "react";
import '../styles/x_app.css';
import html2pdf from "html2pdf.js";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayment } from "../redux/slices/payment.Slice";

const Invoice = () => {
  const [isdisplay, setIsDisplay] = useState(true);
  const navigate = useNavigate();
 const id= localStorage.getItem('paymentId')
  const dispatch = useDispatch();
  const { payment, loading, error } = useSelector((state) => state.payment);

  useEffect(() => {
    if (id) dispatch(fetchPayment(id));
  }, [id, dispatch]);

  const downloadPDF = () => {
    const invoiceElement = document.querySelector('.x_invoice');
    const btns = invoiceElement.querySelector('.no-print-pdf');
    setIsDisplay(false);
    if (btns) btns.style.display = 'none';

    const opt = {
      margin: 0,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(invoiceElement).save().then(() => {
      if (btns) btns.style.display = '';
      setTimeout(() => {
        navigate('/');
      }, 2000);
    });
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!payment) return <div>No payment data found.</div>;


  // Extract dynamic data
  const user = payment.userData[0];
  const order = payment.orderData[0];
  const items = order.items;
  const products = payment.productData;

  // Helper to get product details by productId
  const getProduct = (productId) =>
    products.find((p) => p._id === productId);

  return (
    <div className="x_invoice bg-light p-4">
      <div className="container bg-white shadow p-4 rounded">
        {/* Header */}
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

        {/* Info Sections */}
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

        {/* Product Table */}
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
                console.log(item,"item");
                
                const product = getProduct(item.productId);
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
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{item.size}</td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{item.price}</td>
                    <td style={{ padding: '8px', border: '1px solid #dee2e6' }}>{item.quantity * item.price}</td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary */}
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

        {/* Footer */}
        <div className="alert alert-danger mt-4 x_note">
          <strong>Note:</strong> All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If payment isn't received within 7 days, the quoted fee will be charged to the credit details on file.
        </div>

        {/* Buttons */}
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