import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayment } from "../redux/slices/payment.Slice";

const Invoice = () => {
  const [isdisplay, setIsDisplay] = useState(true);
  const [variantDataMap, setVariantDataMap] = useState({});
  const navigate = useNavigate();
  const id = localStorage.getItem("paymentId");
  const dispatch = useDispatch();
  const { payment, loading, error } = useSelector((state) => state.payment);

  useEffect(() => {
    if (id) {
      dispatch(fetchPayment(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (payment?.productVarientData?.length) {
      const map = {};
      payment.productVarientData.forEach((variant) => {
        map[variant._id] = variant;
      });
      setVariantDataMap(map);
    }
  }, [payment]);

  const getProduct = (productId) => {
    return payment?.productData?.find((p) => p._id === productId);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);


  const downloadPDF = () => {
    const invoiceElement = document.querySelector('.x_invoice');
    const btns = invoiceElement.querySelector('.no-print-pdf');
    setIsDisplay(false);
    if (btns) btns.style.display = 'none';

    // Wait for images to load before generating PDF
    const images = invoiceElement.querySelectorAll('img');
    const promises = Array.from(images).map(
      img =>
        new Promise(resolve => {
          if (img.complete) resolve();
          else img.onload = img.onerror = resolve;
        })
    );

    Promise.all(promises).then(() => {
      const opt = {
        margin: 0,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(invoiceElement).save().then(() => {
        if (btns) btns.style.display = '';
        setTimeout(() => {
          navigate('/');
        }, 2000);
      });
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">Oops! {error}</div>;
  if (!payment) return <div>No payment data found.</div>;

  const user = payment.userData[0];
  const order = payment.orderData[0];
  const items = order.items;

  // === Dynamic Calculations ===
  const subTotal = items.reduce((acc, item) => {
    const variant = variantDataMap[item.productVarientId];
    const price = variant?.price || item.price;
    return acc + item.quantity * price;
  }, 0);

  const discount = 0.1 * subTotal; // 10% discount
  const tax = 10; // 5% tax after discount
  const grandTotal = subTotal - discount + tax;

  return (
    <div className="x_invoice bg-light p-4">
      <div className="container bg-white shadow p-4 rounded">
        <div className="x_header d-flex flex-column flex-md-row justify-content-between align-items-center bg-info text-white p-3 rounded">
          <div>
            <span className="fw-bold fs-4">FreshMart</span>
            <p className="mb-0">1729 Bangor St, Houlton, ME, USA</p>
            <p className="mb-0">Phone: +1(142)-532-9109</p>
          </div>
          <div className="text-end">
            <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
            <p><strong>Amount:</strong>{formatCurrency(grandTotal)}</p>
            <p><strong>Status:</strong> <span className="badge bg-success">{payment.paymentStatus}</span></p>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <h6>Issue From :</h6>
            <p><strong>FreshMart Admin.INC</strong></p>
            <p>Phone: +1(781)-417-2004</p>
            <p>Email: freshmartstore@gamil.com</p>
          </div>
          <div className="col-md-6 text-md-end">
            <h6>Issue For :</h6>
            <p><strong>{user.email}</strong></p>
            <p>Phone: {user.mobileNo}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>

        {/* // ...existing code... */}
        <div className="table-responsive mt-4">
          <table
            className="table table-bordered"
            style={{
              minWidth: 700,
              tableLayout: "fixed",
              wordBreak: "break-word",
              borderCollapse: "collapse",
              width: "100%",
              background: "#fff"
            }}
          >
            <thead className="table-light">
              <tr>
                <th
                  style={{
                    width: 90,
                    textAlign: "center",
                    verticalAlign: "middle",
                    background: "#f8f9fa",
                    border: "1px solid #dee2e6"
                  }}
                >
                  Image
                </th>
                <th
                  style={{
                    width: 180,
                    textAlign: "left",
                    verticalAlign: "middle",
                    background: "#f8f9fa",
                    border: "1px solid #dee2e6"
                  }}
                >
                  Product
                </th>
                <th
                  style={{
                    width: 90,
                    textAlign: "center",
                    verticalAlign: "middle",
                    background: "#f8f9fa",
                    border: "1px solid #dee2e6"
                  }}
                >
                  Size
                </th>
                <th
                  style={{
                    width: 70,
                    textAlign: "center",
                    verticalAlign: "middle",
                    background: "#f8f9fa",
                    border: "1px solid #dee2e6"
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    width: 90,
                    textAlign: "center",
                    verticalAlign: "middle",
                    background: "#f8f9fa",
                    border: "1px solid #dee2e6"
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    width: 90,
                    textAlign: "center",
                    verticalAlign: "middle",
                    background: "#f8f9fa",
                    border: "1px solid #dee2e6"
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const product = getProduct(item.productId);
                const variant = variantDataMap[item.productVarientId];
                const unit = variant?.unit || "";
                const size = variant?.size || variant?.weight || "N/A";
                const price = variant?.price || item.price;
                const total = item.quantity * price;
                const imgSrc = product?.images?.[0]
                  ? `http://localhost:4000/public/${product.images[0].replace("public\\", "")}`
                  : "";

                return (
                  <tr key={item._id || idx}>
                    <td
                      style={{
                        width: 90,
                        textAlign: "center",
                        verticalAlign: "middle",
                        border: "1px solid #dee2e6",
                        background: "#fff"
                      }}
                    >
                      {imgSrc && (
                        <img
                          src={imgSrc}
                          alt={product?.productName || "Product"}
                          width={50}
                          height={50}
                          style={{
                            objectFit: "cover",
                            borderRadius: 4,
                            border: "1px solid #eee",
                            background: "#fff",
                            display: "block",
                            margin: "0 auto"
                          }}
                        />
                      )}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                        border: "1px solid #dee2e6",
                        background: "#fff"
                      }}
                    >
                      {product?.productName || "Unknown Product"}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                        background: "#fff"
                      }}
                    >
                      {`${size} ${unit}`}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                        background: "#fff"
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                        background: "#fff"
                      }}
                    >
                      {formatCurrency(price)}
                    </td>
                    <td
                      style={{
                        verticalAlign: "middle",
                        textAlign: "center",
                        border: "1px solid #dee2e6",
                        background: "#fff"
                      }}
                    >
                      {formatCurrency(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* // ...existing code... */}
        {/* Dynamically Calculated Amounts */}
        <div className="row justify-content-end">
          <div className="col-md-5">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <span>Sub Total:</span> <strong>{formatCurrency(subTotal)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Discount (10%):</span> <strong>-{formatCurrency(discount)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Estimated Tax :</span> <strong>{formatCurrency(tax)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Grand Total:</span> <strong>{formatCurrency(grandTotal)}</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="alert alert-danger mt-4 x_note">
          <strong>Note:</strong> All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If payment isn't received within 7 days, the quoted fee will be charged to the credit details on file.
        </div>

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
