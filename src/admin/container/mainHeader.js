import { Button, Dropdown, Offcanvas } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import '../../styles/sp_style.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getuserData } from '../../redux/slices/sellerDashboard';
function mainHeader() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                handleClose();
            }
        }
        handleResize(); // Check on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getuserData())
    }, [])

    //   get user data
    var userData = useSelector((state) => state.sellerProduct.userData)

    // console.log('console log', userData)
    const LogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('filledSteps');
    }
    return (
        <>
            <section className='d-flex'>
                {/* admin profile header */}
                {/* <div className='sp_header d-flex justify-content-between align-items-center'>
                    <FaBars className="d-lg-none sp_bar" onClick={handleShow} />
                    <h5 className='mb-0'>FastKart</h5>
                    <div >
                        <img className="uprofile_img" src={require('../../img/s_img/userprofile.png')} alt="" />

                    </div>
                </div> */}
                <div className="sp_header d-flex align-items-center justify-content-between">
                    {/* <div className='d-flex align-items-center'> */}
                    <FaBars className=" sp_bar" onClick={handleShow} />
                    {/* <h1 className='ms-3'>LOGO</h1> */}
                    {/* </div> */}
                    <div>
                        <h3 style={{ fontSize: "20px" }} className="m-0">FastKart</h3>
                    </div>
                    <div className="d-flex align-items-center">
                        <div>
                            {userData?.image ? <img className="uprofile_img rounded-circle" src={'http://localhost:4000/' + userData?.image} alt="" /> : <img className="uprofile_img" src={require('../../img/s_img/userprofile.png')} alt="" />}
                        </div>
                        <Dropdown className='sp_profile_drop '>
                            <Dropdown.Toggle id="dropdown-basic" className='bg-transparent d-flex align-items-center flex-column'>
                                <h6 className="m-0 px-2">{userData?.firstName} {userData?.lastName}</h6>
                                <small className="px-2 sp_text_grey w-100 d-flex justify-content-start align-items-center">
                                    {userData?.role === 'admin' ? 'seller' : 'user'} <MdOutlineKeyboardArrowDown />
                                </small>
                            </Dropdown.Toggle>
                            {/* <Dropdown.Toggle variant="success" >
                                Dropdown Button
                            </Dropdown.Toggle> */}

                            <Dropdown.Menu>
                                <Dropdown.Item href="/seller/profile">
                                    <div className='sp_drop_icon'>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.9997 13.6919C13.5465 13.6919 14.9762 13.256 16.12 12.5153C17.0059 11.9481 18.159 12.0419 18.9372 12.7497C21.0981 14.7091 22.3262 17.4888 22.3215 20.4091V21.6606C22.3215 22.9544 21.2715 23.9997 19.9778 23.9997H4.02154C2.72779 23.9997 1.67779 22.9544 1.67779 21.6606V20.4091C1.66841 17.4935 2.89654 14.7091 5.05748 12.7544C5.8356 12.0466 6.99341 11.9528 7.87466 12.52C9.0231 13.256 10.4481 13.6919 11.9997 13.6919Z" fill="#0F0F0F" />
                                            <path d="M12.0004 11.6063C15.2054 11.6063 17.8035 9.0081 17.8035 5.80313C17.8035 2.59815 15.2054 0 12.0004 0C8.79541 0 6.19727 2.59815 6.19727 5.80313C6.19727 9.0081 8.79541 11.6063 12.0004 11.6063Z" fill="#0F0F0F" />
                                        </svg>
                                    </div>

                                    <small className='ms-3' >
                                        Profile
                                    </small>
                                </Dropdown.Item>
                                <Dropdown.Item href="/seller/sell-on-login" onClick={() => { LogOut() }}>
                                    <div className='sp_drop_icon'>
                                        <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.4337 4.25008C17.2741 4.07757 17.0793 3.94132 16.8625 3.85052C16.6457 3.75972 16.412 3.71648 16.1771 3.72372C15.9388 3.73021 15.7047 3.78755 15.4905 3.89192C15.2762 3.99629 15.0867 4.14526 14.9348 4.32885C14.6837 4.63914 14.5525 5.02928 14.565 5.42821C14.5775 5.82715 14.7328 6.20832 15.0028 6.5023C15.9266 7.50037 16.5261 8.75516 16.7222 10.101C16.9182 11.4469 16.7016 12.8206 16.1009 14.0408C15.5001 15.261 14.5436 16.2704 13.3575 16.9356C12.1713 17.6009 10.8114 17.8907 9.4571 17.767C8.20564 17.6564 7.01022 17.1972 6.00654 16.4414C5.00286 15.6857 4.23111 14.6637 3.77889 13.4914C3.32666 12.3191 3.21208 11.0435 3.44814 9.80939C3.6842 8.57526 4.26144 7.43203 5.11436 6.50946C5.32907 6.27377 5.4716 5.98139 5.52502 5.66705C5.57843 5.35272 5.54047 5.02966 5.41567 4.73626C5.29086 4.44287 5.08445 4.19149 4.82097 4.012C4.55748 3.8325 4.24801 3.73245 3.92933 3.72372C3.69286 3.71518 3.45736 3.75814 3.23914 3.84965C3.02092 3.94115 2.8252 4.079 2.66553 4.25366C1.6524 5.34907 0.896534 6.65685 0.453062 8.0816C0.00958998 9.50635 -0.110301 11.0121 0.102135 12.4891C0.45623 14.8079 1.60372 16.9321 3.34889 18.4992C5.09406 20.0664 7.32879 20.9794 9.67191 21.0827H10.055C12.001 21.0752 13.903 20.5029 15.5301 19.4351C17.1571 18.3673 18.4391 16.8501 19.2205 15.0675C20.0019 13.285 20.249 11.3139 19.9318 9.39367C19.6146 7.4734 18.7468 5.68654 17.4337 4.25008Z" fill="#0F0F0F" />
                                            <path d="M10.0515 11.6084C10.493 11.6084 10.9165 11.433 11.2287 11.1208C11.5409 10.8085 11.7163 10.385 11.7163 9.94343V1.665C11.7163 1.22341 11.5409 0.799914 11.2287 0.487666C10.9165 0.175419 10.493 0 10.0515 0C9.60997 0 9.18653 0.175419 8.87432 0.487666C8.56211 0.799914 8.38672 1.22341 8.38672 1.665V9.94343C8.38672 10.385 8.56211 10.8085 8.87432 11.1208C9.18653 11.433 9.60997 11.6084 10.0515 11.6084Z" fill="#0F0F0F" />
                                        </svg>
                                    </div>
                                    <small className='ms-3'>
                                        Logout
                                    </small>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        {/* <div>
                            <h6 className="m-0 px-2">Robert Fox</h6>
                            <small className="px-2 sp_text_grey">
                                Seller <MdOutlineKeyboardArrowDown onClick={() => { }} />
                            </small>
                        </div> */}
                    </div>
                </div>
            </section>
            {show === true && (
                <Sidebar
                    isOpen={show}
                    onClose={() => { handleClose(false) }}
                />
            )}
        </>
    )
}
export default mainHeader;