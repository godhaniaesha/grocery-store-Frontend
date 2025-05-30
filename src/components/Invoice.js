import React from "react";
import '../styles/x_app.css';


const Invoice = () => {
  return (
    <div className="x_invoice bg-light p-4">
      <div className="container bg-white shadow p-4 rounded">
        {/* Header */}
        <div className="x_header d-flex flex-column flex-md-row justify-content-between align-items-center bg-info text-white p-3 rounded">
          <div>
            <img src="/logo.png" alt="Logo" height="40" />
            <h5 className="mt-2">Larkon Admin.</h5>
            <p className="mb-0">1729 Bangor St, Houlton, ME, USA</p>
            <p className="mb-0">Phone: +1(142)-532-9109</p>
          </div>
          <div className="text-end">
            <p>
              <strong>Invoice:</strong> #INV-075826790
            </p>
            <p>
              <strong>Issue Date:</strong> 23 April 2024
            </p>
            <p>
              <strong>Due Date:</strong> 26 April 2024
            </p>
            <p>
              <strong>Amount:</strong> $737.00
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="badge bg-success">Paid</span>
            </p>
          </div>
        </div>

        {/* Info Sections */}
        <div className="row mt-4">
          <div className="col-md-6">
            <h6>Issue From :</h6>
            <p>
              <strong>Larkon Admin.INC</strong>
            </p>
            <p>2437 Romano Street Cambridge, MA 02141</p>
            <p>Phone: +1(781)-417-2004</p>
            <p>Email: JulianeKuhn@jourrapide.com</p>
          </div>
          <div className="col-md-6 text-md-end">
            <h6>Issue For :</h6>
            <p>
              <strong>Gaston Lapierre</strong>
            </p>
            <p>1344 Hershell Hollow Road WA 98168, USA</p>
            <p>Phone: +1(123)-732-760-5760</p>
            <p>Email: hello@dundermuffin.com</p>
          </div>
        </div>

        {/* Product Table */}
        <div className="table-responsive mt-4">
          <table className="table x_table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Tax</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src="/tshirt.png" width="40" alt="T-shirt" /> Men Black Slim Fit T-shirt
                  <br />
                  <small>Size : M</small>
                </td>
                <td>1</td>
                <td>$80.00</td>
                <td>$3.00</td>
                <td>$83.00</td>
              </tr>
              <tr>
                <td>
                  <img src="/pant.png" width="40" alt="Pant" /> Dark Green Cargo Pant
                  <br />
                  <small>Size : M</small>
                </td>
                <td>3</td>
                <td>$110.00</td>
                <td>$4.00</td>
                <td>$330.00</td>
              </tr>
              <tr>
                <td>
                  <img src="/wallet.png" width="40" alt="Wallet" /> Men Dark Brown Wallet
                  <br />
                  <small>Size : S</small>
                </td>
                <td>1</td>
                <td>$132.00</td>
                <td>$5.00</td>
                <td>$137.00</td>
              </tr>
              <tr>
                <td>
                  <img src="/kids.png" width="40" alt="Kids T-shirt" /> Kid’s Yellow T-shirt
                  <br />
                  <small>Size : S</small>
                </td>
                <td>2</td>
                <td>$110.00</td>
                <td>$5.00</td>
                <td>$223.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="row justify-content-end">
          <div className="col-md-5">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <span>Sub Total:</span> <strong>$777.00</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Discount:</span> <strong>-$60.00</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Estimated Tax (15.5%):</span> <strong>$20.00</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Grand Amount:</span> <strong>$737.00</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="alert alert-danger mt-4 x_note">
          <strong>Note:</strong> All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged the agreed quoted fee noted above.
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-success" onClick={() => window.print()}>
            Print
          </button>
          <button className="btn btn-warning">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;