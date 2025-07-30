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

    // Store original classes and styles to restore later
    const originalClasses = {
      header: invoiceElement.querySelector('.x_header')?.className,
      issueRow: invoiceElement.querySelector('.row.g-3')?.className,
      issueCols: Array.from(invoiceElement.querySelectorAll('.col-12.col-md-6')).map(col => col.className),
      desktopTable: invoiceElement.querySelector('.d-none.d-md-block')?.className,
      mobileCards: invoiceElement.querySelector('.d-md-none')?.className,
      summaryCol: invoiceElement.querySelector('.col-12.col-md-5')?.className,
      buttonContainer: invoiceElement.querySelector('.d-flex.flex-column.flex-sm-row')?.className
    };

    // Force desktop layout for PDF generation
    const header = invoiceElement.querySelector('.x_header');
    if (header) {
      header.className = 'x_header d-flex flex-row justify-content-between align-items-center bg-info text-white p-3 rounded mb-3';
      header.style.flexDirection = 'row';
    }

    // Force desktop issue sections layout
    const issueRow = invoiceElement.querySelector('.row.g-3');
    if (issueRow) {
      issueRow.className = 'row g-3 mb-3';
      const issueCols = issueRow.querySelectorAll('.col-12.col-md-6');
      issueCols.forEach(col => {
        col.className = 'col-6';
      });
    }

    // Force desktop table layout
    const desktopTable = invoiceElement.querySelector('.d-none.d-md-block');
    if (desktopTable) {
      desktopTable.className = 'd-block';
      desktopTable.style.display = 'block';
    }

    // Hide mobile cards in PDF
    const mobileCards = invoiceElement.querySelector('.d-md-none');
    if (mobileCards) {
      mobileCards.style.display = 'none';
    }

    // Force desktop summary layout
    const summaryRow = invoiceElement.querySelector('.row.justify-content-end');
    if (summaryRow) {
      const summaryCol = summaryRow.querySelector('.col-12.col-md-5');
      if (summaryCol) {
        summaryCol.className = 'col-md-5';
      }
    }

    // Force desktop button layout
    const buttonContainer = invoiceElement.querySelector('.d-flex.flex-column.flex-sm-row');
    if (buttonContainer) {
      buttonContainer.className = 'd-flex justify-content-end gap-2 no-print-pdf mt-3';
      buttonContainer.style.flexDirection = 'row';
    }

    // Hide buttons in PDF
    const pdfButtons = invoiceElement.querySelector('.no-print-pdf');
    if (pdfButtons) {
      pdfButtons.style.display = 'none';
    }

    // Set container width for PDF
    const container = invoiceElement.querySelector('.container');
    if (container) {
      container.style.maxWidth = '800px';
      container.style.width = '100%';
    }

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
        margin: [10, 10, 10, 10],
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          width: 800,
          height: invoiceElement.scrollHeight
        },
        jsPDF: { 
          unit: 'pt', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      html2pdf().set(opt).from(invoiceElement).save().then(() => {
        // Restore original classes and styles
        if (header && originalClasses.header) {
          header.className = originalClasses.header;
          header.style.flexDirection = '';
        }

        if (issueRow && originalClasses.issueRow) {
          issueRow.className = originalClasses.issueRow;
          const issueCols = issueRow.querySelectorAll('.col-6');
          issueCols.forEach((col, index) => {
            if (originalClasses.issueCols[index]) {
              col.className = originalClasses.issueCols[index];
            }
          });
        }

        if (desktopTable && originalClasses.desktopTable) {
          desktopTable.className = originalClasses.desktopTable;
          desktopTable.style.display = '';
        }

        if (mobileCards && originalClasses.mobileCards) {
          mobileCards.className = originalClasses.mobileCards;
          mobileCards.style.display = '';
        }

        if (summaryRow) {
          const summaryCol = summaryRow.querySelector('.col-md-5');
          if (summaryCol && originalClasses.summaryCol) {
            summaryCol.className = originalClasses.summaryCol;
          }
        }

        if (buttonContainer && originalClasses.buttonContainer) {
          buttonContainer.className = originalClasses.buttonContainer;
          buttonContainer.style.flexDirection = '';
        }

        if (pdfButtons) {
          pdfButtons.style.display = '';
        }

        if (container) {
          container.style.maxWidth = '';
          container.style.width = '';
        }

        if (btns) btns.style.display = '';
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }).catch((error) => {
        console.error('PDF generation error:', error);
        // Restore original state even if PDF generation fails
        if (btns) btns.style.display = '';
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
    <div className="x_invoice bg-light p-2 p-md-4">
      <div className="container bg-white shadow p-2 p-md-4 rounded">
        {/* Header Section - Responsive */}
        <div className="x_header d-flex flex-md-row flex-column justify-content-between align-items-start bg-info text-white p-3 rounded mb-3">
          <div className="w-100 mb-3 mb-md-0">
            <span className="fw-bold fs-4 d-block">FreshMart</span>
            <p className="mb-1 small">1729 Bangor St, Houlton, ME, USA</p>
            <p className="mb-0 small">Phone: +1(142)-532-9109</p>
          </div>
          <div className="w-100 text-start text-md-end">
            <p className="mb-1 small"><strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
            <p className="mb-1 small"><strong>Amount:</strong> {formatCurrency(grandTotal)}</p>
            <p className="mb-0 small"><strong>Status:</strong> <span className="badge bg-success">{payment.paymentStatus}</span></p>
          </div>
        </div>

        {/* Issue From/For Section - Responsive */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <div className="border rounded p-3 h-100">
              <h6 className="fw-bold mb-2">Issue From:</h6>
              <p className="mb-1 small"><strong>FreshMart Admin.INC</strong></p>
              <p className="mb-1 small">Phone: +1(781)-417-2004</p>
              <p className="mb-0 small">Email: freshmartstore@gamil.com</p>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="border rounded p-3 h-100">
              <h6 className="fw-bold mb-2">Issue For:</h6>
              <p className="mb-1 small"><strong>{user.email}</strong></p>
              <p className="mb-1 small">Phone: {user.mobileNo}</p>
              <p className="mb-0 small">Email: {user.email}</p>
            </div>
          </div>
        </div>

        {/* Products Table - Mobile Responsive */}
        <div className="mt-4">
          <h6 className="fw-bold mb-3">Order Items:</h6>
          
          {/* Desktop Table */}
          <div className="d-none d-md-block">
            <div className="table-responsive">
              <table className="table table-bordered mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="text-start">Product</th>
                    <th className="text-center">Size</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Total</th>
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

                    return (
                      <tr key={item._id || idx}>
                        <td className="text-start">
                          {product?.productName || "Unknown Product"}
                        </td>
                        <td className="text-center">
                          {`${size} ${unit}`}
                        </td>
                        <td className="text-center">
                          {item.quantity}
                        </td>
                        <td className="text-center">
                          {formatCurrency(price)}
                        </td>
                        <td className="text-center">
                          {formatCurrency(total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="d-md-none">
            {items.map((item, idx) => {
              const product = getProduct(item.productId);
              const variant = variantDataMap[item.productVarientId];
              const unit = variant?.unit || "";
              const size = variant?.size || variant?.weight || "N/A";
              const price = variant?.price || item.price;
              const total = item.quantity * price;

              return (
                <div key={item._id || idx} className="card mb-3">
                  <div className="card-body p-3">
                    <div className="row g-2">
                      <div className="col-12">
                        <h6 className="fw-bold mb-2">{product?.productName || "Unknown Product"}</h6>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Size:</small>
                        <p className="mb-1">{`${size} ${unit}`}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Quantity:</small>
                        <p className="mb-1">{item.quantity}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Price:</small>
                        <p className="mb-1">{formatCurrency(price)}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Total:</small>
                        <p className="mb-0 fw-bold">{formatCurrency(total)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Section - Responsive */}
        <div className="row justify-content-end mt-4">
          <div className="col-12 col-md-5">
            <div className="card">
              <div className="card-body p-3">
                <h6 className="fw-bold mb-3">Order Summary:</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Sub Total:</span>
                  <strong>{formatCurrency(subTotal)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Discount (10%):</span>
                  <strong className="text-danger">-{formatCurrency(discount)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Estimated Tax:</span>
                  <strong>{formatCurrency(tax)}</strong>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Grand Total:</span>
                  <strong className="fs-5">{formatCurrency(grandTotal)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="alert alert-danger mt-4 x_note small">
          <strong>Note:</strong> All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If payment isn't received within 7 days, the quoted fee will be charged to the credit details on file.
        </div>

        {/* Action Buttons - Responsive */}
        {isdisplay && (
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 no-print-pdf mt-3">
            <button className="btn btn-warning btn-sm" onClick={() => window.print()}>
              <i className="fas fa-print me-1"></i>Print
            </button>
            <button className="btn btn-success btn-sm" onClick={downloadPDF}>
              <i className="fas fa-download me-1"></i>Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
