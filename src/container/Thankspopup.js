import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Thankyou from '../img/Kassets/Thankyou.png'

function Thankspopup() {
    const [show, setShow] = useState(false);

    return (
        <>
            <Button onClick={() => setShow(true)}>Show Popup</Button>
            <Modal className="Z_thanks_modal" show={show} onHide={() => setShow(false)} centered>
                <div className="Z_modal-content text-center p-4">
                    <img
                        src={Thankyou}
                        alt="Order Confirmed"
                        className="Z_image img-fluid mx-auto d-block"
                    />
                    <h2 className="Z_title mt-3">Thank you</h2>
                    <p className="Z_text text-secondary">Your order has been placed successfully.</p>
                </div>
            </Modal>
        </>
    );
}

export default Thankspopup;
