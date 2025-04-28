import React, { useState, useEffect } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import { Modal, Offcanvas } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaAngleUp,
} from "react-icons/fa";
import { PiGreaterThanBold, PiLessThanBold } from "react-icons/pi";
import { RiFilter2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import axios from "axios";
function Payment() {
  const [filterOff, setfilterOff] = useState(false);
  const [payments, setPayments] = useState([]);
  const [payments1, setPayments1] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [Dashboard, setDashboard] = useState({});
  // const [searchQuery, setSearchQuery] = useState("");
  console.log("Dashboard", Dashboard);

  const handleClose = () => setfilterOff(false);
  const handleShow = () => setfilterOff(true);
  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(10000);
  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };

  const applyFilters = (searchQuery) => {
    console.log(searchQuery);
    const trimmedQuery = searchQuery?.trim()?.toLowerCase();

    const searchMatch = trimmedQuery
      ? payments.filter((payment) => {
          const fullName = `${payment.userData[0]?.firstName || ""} ${
            payment.userData[0]?.lastName || ""
          }`.toLowerCase();
          const method = payment.paymentMethod?.toLowerCase() || "";
          const amount = payment.orderData[0]?.totalAmount?.toString() || "";
          const status = payment.paymentStatus?.toLowerCase() || "";

          return (
            fullName.includes(trimmedQuery) ||
            method.includes(trimmedQuery) ||
            amount.includes(trimmedQuery) ||
            status.includes(trimmedQuery)
          );
        })
      : payments;
    console.log("filterDate", filterDate);
    const filteredPayments = searchMatch.filter((payment) => {
      const dateMatch = filterDate
        ? new Date(payment.createdAt).toDateString() ===
          new Date(filterDate).toDateString()
        : true;
      const methodMatch = filterMethod
        ? payment.paymentMethod === filterMethod
        : true;
      const statusMatch = filterStatus
        ? payment.paymentStatus === filterStatus
        : true;

      return dateMatch && methodMatch && statusMatch;
    });

    setPayments1(filteredPayments);
    console.log("filteredPayments", filteredPayments);
    setCurrentPage(1); // Reset to first page after filtering

    handleClose();
  };

  const resetFilters = () => {
    setFilterDate("");
    setFilterMethod("");
    setFilterStatus("");
    handleClose();
    setPayments1(payments);
  };

  useEffect(() => {
    const fetchPayments = async () => {
      var token = localStorage.getItem("token");
      var sellerId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://localhost:4000/api/getalldatabyseller/${sellerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        console.log(data);
        setDashboard(data);
        if (Array.isArray(data.data)) {
          setPayments(data.data);
          setPayments1(data.data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  // useEffect(() => {
  //   const paymentDashboard = async () => {
  //     var token = localStorage.getItem("token");
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:4000/api/paymentSummary",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const data = response.data;
  //       // console.log(data);
  //       setDashboard(data);
  //     } catch (error) {
  //       console.error("Error fetching payments:", error);
  //     }
  //   };
  //   paymentDashboard();
  // }, []);

  // pagination code
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  useEffect(() => {
    const total = Math.ceil((payments1.length ?? 0) / itemsPerPage);
    setTotalPages(total);

    const currentDataSlice = payments1.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    setCurrentData(currentDataSlice);
  }, [payments1, currentPage]);
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="sp_container">
      <div className="d-lg-flex justify-content-between align-item-center ">
        <div>
          <h4>Payment</h4>
          <Link className="sp_text_grey" to={"/seller/home"}>
            Dashboard
          </Link>{" "}
          / <Link>Payment </Link>
        </div>
        <div className="d-sm-flex align-items-center justify-sm-content-start justify-content-end">
          <div className="sp_search flex-fill">
            <BiSearch className="sp_sear_icon" />
            <input
              type="text"
              placeholder="Search..."
              className=""
              onChange={(e) => {
                applyFilters(e.target.value);
              }}
            />
          </div>
          <div className="d-flex justify-content-md-center align-items-center justify-content-between ">
            <button
              className="btn sp_filter_btn sp_filter_btn1 sp_linear1 border-no"
              onClick={handleShow}
            >
              <RiFilter2Fill className="mx-2" /> Filter
            </button>
          </div>
        </div>
      </div>
      <div className="ustats_container mx-0 mt-4">
        <div className="ustat_box flex-fill">
          <div className="text-start">
            <div className="ustat_title">Total Earnings</div>
            <div className="ustat_number">${Dashboard?.totalAmount}</div>
            {/* <div className="ustat_change uincrease">
              <FaAngleUp />
              10.0%
            </div> */}
          </div>
          <div className="uicon">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.0363 15.8154C21.8141 15.8154 24.8872 12.7397 24.8872 8.95844C24.8872 5.17747 21.8141 2 18.0363 2C14.2584 2 11.1853 5.17747 11.1853 8.95844C11.1853 12.7397 14.2584 15.8154 18.0363 15.8154ZM18.0363 9.72043C16.777 9.72043 15.7526 8.69521 15.7526 7.43487C15.7526 6.44274 16.391 5.60512 17.2751 5.28944V4.38727C17.2751 3.96617 17.6155 3.62528 18.0363 3.62528C18.4569 3.62528 18.7973 3.96617 18.7973 4.38727V5.28944C19.6814 5.60507 20.3198 6.44274 20.3198 7.43482C20.3198 7.85597 19.9794 8.19666 19.5587 8.19666C19.1379 8.19666 18.7973 7.85597 18.7973 7.43487C18.7973 7.01433 18.4562 6.67283 18.0362 6.67283C17.6163 6.67283 17.2751 7.01438 17.2751 7.43487C17.2751 7.85521 17.6163 8.19666 18.0362 8.19666C19.2955 8.19666 20.3198 9.22193 20.3198 10.4823C20.3198 11.4744 19.6815 12.312 18.7974 12.6277V13.5298C18.7974 13.951 18.4569 14.2919 18.0362 14.2919C17.6155 14.2919 17.2751 13.951 17.2751 13.5299V12.6277C16.391 12.312 15.7527 11.4744 15.7527 10.4823C15.7527 10.0612 16.093 9.72043 16.5138 9.72043C16.9346 9.72043 17.2751 10.0612 17.2751 10.4823C17.2751 10.9028 17.6163 11.2443 18.0362 11.2443C18.4562 11.2443 18.7973 10.9028 18.7973 10.4823C18.7973 10.0619 18.4562 9.72043 18.0363 9.72043ZM2.76111 26.4821H5.85685C6.27722 26.4821 6.61801 26.1408 6.61801 25.72V16.5775C6.61801 15.3152 5.59563 14.2919 4.33437 14.2919H2.76116C2.34079 14.2919 2 14.633 2 15.0538V25.7201C2 26.1408 2.34074 26.4821 2.76111 26.4821ZM25.9732 20.9354C25.9732 20.9354 17.8232 23.4345 17.2751 23.4345C16.8182 23.4345 16.3463 23.3277 15.9047 23.1145L13.1034 21.6973C12.7686 21.545 12.3879 21.6363 12.1596 21.9105C11.9008 22.2458 11.4136 22.2915 11.094 22.0326C10.7589 21.7735 10.6981 21.301 10.972 20.9658C11.6419 20.1278 12.8142 19.8687 13.7733 20.341C13.5932 20.2515 16.4372 21.6671 16.5899 21.743C17.3689 22.1329 18.2603 21.8122 18.6299 21.0725C19.0173 20.297 18.6908 19.3658 17.9601 19.0307C18.3682 19.2354 11.7984 15.9398 11.6419 15.8611C10.966 15.5231 10.2329 15.4452 9.44954 15.6632L8.14034 16.0829V25.3113L12.0684 27.2743C13.8953 28.2039 16.133 28.2191 17.8382 27.442C17.9904 27.3811 27.0693 23.7546 27.0844 23.7546C27.9219 23.3886 28.1958 22.3374 27.8608 21.7735C27.5563 21.0727 26.7496 20.6763 25.9732 20.9354Z"
                fill="url(#paint0_linear_492_8074)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_492_8074"
                  x1="15"
                  y1="2"
                  x2="15"
                  y2="28"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="udivider"></div>

        <div className="ustat_box flex-fill">
          <div className="text-start">
            <div className="ustat_title">Online Payment Received</div>
            <div className="ustat_number">${Dashboard?.onlineAmount}</div>
            {/* <div className="ustat_change uincrease">
              <FaAngleUp /> 10.0%
            </div> */}
          </div>
          <div className="uicon">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.28516 28H15C16.2601 28 17.2852 26.9749 17.2852 25.7148V21.8555H11.9531C10.693 21.8555 9.66797 20.8304 9.66797 19.5703V8.90625C9.66797 7.64616 10.693 6.62109 11.9531 6.62109H17.2852V4.28516C17.2852 3.02507 16.2601 2 15 2H4.28516C3.02507 2 2 3.02507 2 4.28516V25.7148C2 26.9749 3.02507 28 4.28516 28ZM9.66797 4.28516C10.0886 4.28516 10.4297 4.67688 10.4297 5.09766C10.4297 5.51833 10.0886 5.85938 9.66797 5.85938C9.2473 5.85938 8.90625 5.51833 8.90625 5.09766C8.90625 4.67688 9.2473 4.28516 9.66797 4.28516ZM8.90625 23.3789H10.4297C10.8507 23.3789 11.1914 23.7196 11.1914 24.1406C11.1914 24.5617 10.8507 24.9023 10.4297 24.9023H8.90625C8.48522 24.9023 8.14453 24.5617 8.14453 24.1406C8.14453 23.7196 8.48522 23.3789 8.90625 23.3789Z"
                fill="url(#paint0_linear_492_8087)"
              />
              <path
                d="M27.2393 8.1543H11.9541C11.5331 8.1543 11.1924 8.49499 11.1924 8.91602V11.2012H28.001V8.91602C28.001 8.49499 27.6603 8.1543 27.2393 8.1543ZM11.1924 19.5801C11.1924 20.0011 11.5331 20.3418 11.9541 20.3418H27.2393C27.6603 20.3418 28.001 20.0011 28.001 19.5801V12.7246H11.1924V19.5801ZM22.6182 14.248H24.1416C24.5626 14.248 24.9033 14.5887 24.9033 15.0098C24.9033 15.4308 24.5626 15.7715 24.1416 15.7715H22.6182C22.1971 15.7715 21.8564 15.4308 21.8564 15.0098C21.8564 14.5887 22.1971 14.248 22.6182 14.248Z"
                fill="url(#paint1_linear_492_8087)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_492_8087"
                  x1="9.64258"
                  y1="2"
                  x2="9.64258"
                  y2="28"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_492_8087"
                  x1="19.5967"
                  y1="8.1543"
                  x2="19.5967"
                  y2="20.3418"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="udivider d-none d-xl-block"></div>

        <div className="ustat_box flex-fill">
          <div className="text-start">
            <div className="ustat_title">COD Payment Received</div>
            <div className="ustat_number">${Dashboard?.codAmount}</div>
            {/* <div className="ustat_change udecrease">
              <FaAngleDown /> 3.0%
            </div> */}
          </div>
          <div className="uicon">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="50" height="50" rx="4" fill="#DDF2D5" />
              <path
                d="M15.5526 28.5956C15.8082 28.5956 16.0154 28.3884 16.0154 28.1328C16.0154 27.8771 15.8082 27.6699 15.5526 27.6699C15.297 27.6699 15.0898 27.8771 15.0898 28.1328C15.0898 28.3884 15.297 28.5956 15.5526 28.5956Z"
                fill="url(#paint0_linear_492_8099)"
              />
              <path
                d="M24.8093 23.041C22.0024 23.041 19.7188 25.3249 19.7188 28.1322C19.7188 30.9394 22.0024 33.2233 24.8093 33.2233C27.6162 33.2233 29.8998 30.9394 29.8998 28.1322C29.8998 25.3249 27.6162 23.041 24.8093 23.041ZM24.8321 27.6695C25.8423 27.6817 26.6604 28.5075 26.6604 29.5207C26.6604 30.3512 26.1107 31.0557 25.3561 31.2896C25.3067 31.3049 25.272 31.3492 25.272 31.4009V31.819C25.272 32.0655 25.0861 32.2807 24.8401 32.2967C24.7769 32.3009 24.7134 32.2921 24.6538 32.2708C24.5941 32.2495 24.5394 32.2162 24.4931 32.1729C24.4468 32.1296 24.41 32.0772 24.3847 32.0191C24.3595 31.9609 24.3465 31.8982 24.3465 31.8348V31.4027C24.3465 31.3518 24.3143 31.3055 24.2656 31.2906C23.5199 31.061 22.9736 30.372 22.9585 29.5554C22.9537 29.2979 23.1431 29.0694 23.4003 29.0583C23.4628 29.0555 23.5251 29.0654 23.5837 29.0874C23.6422 29.1094 23.6956 29.143 23.7408 29.1862C23.7859 29.2294 23.8219 29.2813 23.8464 29.3388C23.871 29.3963 23.8837 29.4582 23.8837 29.5207C23.8837 30.0458 24.3231 30.4701 24.8535 30.4453C25.3243 30.4233 25.7117 30.0358 25.7337 29.5649C25.7585 29.0345 25.3342 28.595 24.8092 28.595C23.7885 28.595 22.9581 27.7645 22.9581 26.7437C22.9581 25.9132 23.5078 25.2086 24.2623 24.9748C24.3117 24.9595 24.3464 24.9152 24.3464 24.8635V24.4454C24.3464 24.1989 24.5324 23.9836 24.7784 23.9677C24.8416 23.9635 24.905 23.9723 24.9647 23.9936C25.0244 24.0149 25.0791 24.0482 25.1253 24.0915C25.1716 24.1348 25.2085 24.1871 25.2337 24.2453C25.259 24.3034 25.272 24.3661 25.272 24.4295V24.8616C25.272 24.9125 25.3042 24.9588 25.3529 24.9738C26.0986 25.2034 26.6449 25.8924 26.66 26.7089C26.6648 26.9664 26.4754 27.1949 26.2181 27.206C26.1557 27.2088 26.0933 27.1989 26.0348 27.1769C25.9763 27.1549 25.9229 27.1213 25.8777 27.0781C25.8325 27.0349 25.7966 26.983 25.772 26.9255C25.7475 26.8681 25.7348 26.8062 25.7348 26.7437C25.7348 26.2333 25.3196 25.818 24.8093 25.818C24.2956 25.818 23.8783 26.2387 23.8838 26.7536C23.8892 27.2645 24.3213 27.6633 24.8321 27.6695Z"
                fill="url(#paint1_linear_492_8099)"
              />
              <path
                d="M38.2292 20.2637H11.3883C10.6228 20.2637 10 20.8866 10 21.6522V34.6115C10 35.3771 10.6228 36 11.3883 36H38.2292C38.9947 36 39.6175 35.3771 39.6175 34.6115V21.6522C39.6175 20.8865 38.9947 20.2637 38.2292 20.2637ZM19.7183 34.1487H13.7022C13.4479 34.1487 13.2385 33.9435 13.2394 33.6892C13.2413 33.1761 12.8235 32.7583 12.3105 32.7602C12.0562 32.7611 11.8511 32.5517 11.8511 32.2973V23.9663C11.8511 23.712 12.0562 23.5026 12.3105 23.5035C12.8235 23.5054 13.2413 23.0875 13.2394 22.5745C13.2385 22.3202 13.4479 22.115 13.7022 22.115H19.7024C19.9489 22.115 20.1641 22.301 20.18 22.547C20.1843 22.6102 20.1754 22.6737 20.1541 22.7334C20.1328 22.7931 20.0995 22.8477 20.0562 22.894C20.0129 22.9403 19.9606 22.9772 19.9025 23.0024C19.8443 23.0277 19.7816 23.0407 19.7183 23.0407H14.2355C14.1608 23.0407 14.0949 23.0887 14.0713 23.1597C13.8876 23.7133 13.4492 24.1518 12.8956 24.3355C12.861 24.3469 12.8309 24.3689 12.8096 24.3984C12.7882 24.4279 12.7767 24.4633 12.7766 24.4998V31.7639C12.7766 31.8386 12.8247 31.9046 12.8956 31.9281C13.4492 32.1119 13.8876 32.5503 14.0713 33.1039C14.0827 33.1385 14.1047 33.1686 14.1342 33.19C14.1637 33.2114 14.1991 33.2229 14.2355 33.2229H19.7023C19.9488 33.2229 20.164 33.4089 20.18 33.6549C20.1842 33.7182 20.1754 33.7816 20.1541 33.8413C20.1328 33.901 20.0995 33.9557 20.0562 34.002C20.0129 34.0483 19.9606 34.0852 19.9025 34.1104C19.8443 34.1356 19.7816 34.1487 19.7183 34.1487ZM16.9416 28.1318C16.9416 28.8974 16.3188 29.5203 15.5533 29.5203C14.7878 29.5203 14.165 28.8974 14.165 28.1318C14.165 27.3663 14.7878 26.7433 15.5533 26.7433C16.3188 26.7433 16.9416 27.3662 16.9416 28.1318ZM24.8088 34.1487C21.4915 34.1487 18.7927 31.4495 18.7927 28.1318C18.7927 24.8141 21.4915 22.115 24.8088 22.115C28.1261 22.115 30.8248 24.8141 30.8248 28.1318C30.8248 31.4495 28.1261 34.1487 24.8088 34.1487ZM37.7664 32.2973C37.7664 32.5517 37.5613 32.7611 37.307 32.7602C36.794 32.7583 36.3763 33.1761 36.3781 33.6892C36.3791 33.9435 36.1696 34.1487 35.9154 34.1487H29.9151C29.6687 34.1487 29.4535 33.9627 29.4375 33.7167C29.4333 33.6534 29.4421 33.59 29.4634 33.5303C29.4847 33.4706 29.518 33.4159 29.5613 33.3697C29.6046 33.3234 29.657 33.2865 29.7151 33.2612C29.7732 33.236 29.8359 33.223 29.8993 33.223H35.382C35.4567 33.223 35.5227 33.175 35.5462 33.104C35.73 32.5503 36.1684 32.1119 36.7219 31.9282C36.7565 31.9168 36.7866 31.8948 36.808 31.8653C36.8293 31.8358 36.8409 31.8003 36.8409 31.7639V24.4998C36.8409 24.425 36.7929 24.3591 36.7219 24.3355C36.1683 24.1518 35.7299 23.7133 35.5462 23.1597C35.5348 23.1251 35.5128 23.095 35.4834 23.0736C35.4539 23.0522 35.4184 23.0407 35.382 23.0407H29.9152C29.6687 23.0407 29.4535 22.8547 29.4376 22.6087C29.4333 22.5454 29.4422 22.482 29.4635 22.4223C29.4848 22.3626 29.5181 22.3079 29.5614 22.2617C29.6047 22.2154 29.657 22.1785 29.7151 22.1533C29.7733 22.128 29.836 22.115 29.8993 22.115H35.9154C36.1697 22.115 36.3791 22.3202 36.3782 22.5745C36.3763 23.0875 36.7941 23.5054 37.3071 23.5035C37.5614 23.5026 37.7665 23.712 37.7665 23.9663V32.2973H37.7664ZM32.6759 28.1318C32.6759 27.3663 33.2988 26.7433 34.0643 26.7433C34.8297 26.7433 35.4526 27.3663 35.4526 28.1318C35.4526 28.8974 34.8297 29.5203 34.0643 29.5203C33.2988 29.5203 32.6759 28.8974 32.6759 28.1318Z"
                fill="url(#paint2_linear_492_8099)"
              />
              <path
                d="M34.0643 28.5956C34.3199 28.5956 34.5271 28.3884 34.5271 28.1328C34.5271 27.8771 34.3199 27.6699 34.0643 27.6699C33.8088 27.6699 33.6016 27.8771 33.6016 28.1328C33.6016 28.3884 33.8088 28.5956 34.0643 28.5956Z"
                fill="url(#paint3_linear_492_8099)"
              />
              <path
                d="M37.8781 17.8997C37.7827 17.1345 37.0816 16.5902 36.3081 16.6969L18.6297 19.2257C18.5586 19.2359 18.5661 19.3408 18.6379 19.3408H37.927C37.9434 19.3408 37.9596 19.3373 37.9745 19.3306C37.9895 19.3238 38.0028 19.314 38.0137 19.3017C38.0246 19.2894 38.0327 19.2749 38.0375 19.2592C38.0424 19.2436 38.0438 19.227 38.0418 19.2108L37.8781 17.8997ZM35.2862 15.9079C35.3022 15.9056 35.3175 15.9 35.3312 15.8914C35.3449 15.8828 35.3566 15.8714 35.3656 15.8579C35.3746 15.8445 35.3807 15.8293 35.3834 15.8134C35.3862 15.7974 35.3855 15.7811 35.3815 15.7654L35.2032 15.0515C35.0158 14.2993 34.249 13.8447 33.4909 14.0489L18.9435 18.1292C18.874 18.1487 18.8954 18.2525 18.9669 18.2422C22.6226 17.7194 32.5945 16.2933 35.2862 15.9079Z"
                fill="url(#paint4_linear_492_8099)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_492_8099"
                  x1="15.5526"
                  y1="27.6699"
                  x2="15.5526"
                  y2="28.5956"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_492_8099"
                  x1="24.8093"
                  y1="23.041"
                  x2="24.8093"
                  y2="33.2233"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_492_8099"
                  x1="24.8088"
                  y1="20.2637"
                  x2="24.8088"
                  y2="36"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_492_8099"
                  x1="34.0643"
                  y1="27.6699"
                  x2="34.0643"
                  y2="28.5956"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_492_8099"
                  x1="28.3114"
                  y1="14"
                  x2="28.3114"
                  y2="19.3408"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="udivider"></div>

        <div className="ustat_box flex-fill">
          <div className="text-start">
            <div className="ustat_title">Pending Payments</div>
            <div className="ustat_number">
              ${Dashboard?.pendingPaymentAmount}
            </div>
            {/* <div className="ustat_change udecrease">
              <FaAngleDown />
              10.0%
            </div> */}
          </div>
          <div className="uicon">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="50" height="50" rx="4" fill="#DDF2D5" />
              <path
                d="M30.293 24.2324C26.2221 24.2324 22.9102 27.5441 22.9102 31.6146C22.9102 35.6852 26.2221 38.9969 30.293 38.9969C34.3639 38.9969 37.6758 35.6852 37.6758 31.6146C37.6758 27.5441 34.3639 24.2324 30.293 24.2324ZM31.3867 31.8334C31.3867 32.2864 31.0194 32.6536 30.5664 32.6536H28.0857C27.6326 32.6536 27.2654 32.2864 27.2654 31.8334C27.2654 31.3804 27.6326 31.0131 28.0857 31.0131H29.7461V29.3377C29.7461 28.8847 30.1134 28.5175 30.5664 28.5175C31.0194 28.5175 31.3867 28.8847 31.3867 29.3377V31.8334Z"
                fill="url(#paint0_linear_492_8116)"
              />
              <path
                d="M21.4126 33.1909C21.2589 33.219 21.4652 33.2001 17.148 33.2057C16.6947 33.2057 16.3277 32.8382 16.3277 32.3855C16.3277 31.9327 16.6947 31.5652 17.148 31.5652C21.5315 31.5652 21.2639 31.5648 21.2748 31.5658C21.278 31.0069 21.3316 30.4601 21.4328 29.9302H17.1508C16.6974 29.9302 16.3305 29.5627 16.3305 29.1099C16.3305 28.6572 16.6974 28.2897 17.1508 28.2897H21.9108C23.2496 24.924 26.5363 22.5815 30.3276 22.5931V14.2529C30.3276 13.0052 30.7973 11.8653 31.5689 11H17.1005C14.8397 11 13 12.8395 13 15.1001V38.1627C13 38.9006 13.9027 39.2631 14.4131 38.7298L15.4626 37.6339L16.5711 38.7429C16.891 39.0628 17.4105 39.0628 17.731 38.7429L18.7816 37.693L19.8425 38.7451C20.1624 39.0623 20.6781 39.0623 20.998 38.7451L22.0759 37.6766L23.1544 38.7451C23.4737 39.0623 23.9889 39.0623 24.3088 38.7456L24.5177 38.5389C22.9198 37.2025 21.7899 35.3252 21.4126 33.1909ZM19.7922 20.8933C20.0405 20.5143 20.5485 20.4082 20.928 20.6559C21.3371 20.9239 22.018 21.0223 22.3565 20.8626C22.5944 20.7511 22.771 20.5187 22.7973 20.2846C22.8525 19.7946 22.1924 19.5506 21.7402 19.3725C21.1725 19.1483 20.4659 18.8689 20.0629 18.1422C19.4887 17.1043 20.0001 15.7119 21.1927 15.2631V15.1406C21.1927 14.6878 21.5602 14.3204 22.013 14.3204C22.4664 14.3204 22.8334 14.6878 22.8334 15.1406V15.2084C23.1828 15.3063 23.506 15.4736 23.7609 15.7088C24.0939 16.0161 24.1152 16.535 23.8079 16.868C23.5005 17.2011 22.9816 17.2218 22.6485 16.9145C22.4615 16.7417 21.9283 16.6761 21.6789 16.8434C21.5034 16.9615 21.4175 17.2011 21.4984 17.3471C21.7282 17.7628 22.7472 17.8514 23.5361 18.4664C25.0739 19.6648 24.5205 21.8496 22.8334 22.4364V22.6037C22.8334 23.0565 22.4664 23.424 22.013 23.424C21.5602 23.424 21.1927 23.0565 21.1927 22.6037V22.4993C20.7558 22.4058 20.3484 22.2374 20.0295 22.029C19.6505 21.7808 19.5445 21.2728 19.7922 20.8933ZM17.1535 25.0032H21.2551C21.7079 25.0032 22.0754 25.3707 22.0754 25.8235C22.0754 26.2763 21.7079 26.6437 21.2551 26.6437H17.1535C16.7002 26.6437 16.3332 26.2763 16.3332 25.8235C16.3332 25.3707 16.7002 25.0032 17.1535 25.0032ZM34.8135 11C33.212 11 31.9137 12.2982 31.9137 13.8996V22.5513H36.893C37.346 22.5513 37.7133 22.184 37.7133 21.731V13.8996C37.7133 12.2982 36.415 11 34.8135 11Z"
                fill="url(#paint1_linear_492_8116)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_492_8116"
                  x1="30.293"
                  y1="24.2324"
                  x2="30.293"
                  y2="38.9969"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_492_8116"
                  x1="25.3566"
                  y1="11"
                  x2="25.3566"
                  y2="38.9838"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0C6C44" />
                  <stop offset="1" stopColor="#479529" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div
        className="sp_table d-flex justify-content-between flex-column"
        style={{ minHeight: "550px" }}
      >
        <table className="table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Customer name</th>
              <th>Payment method</th>
              <th>Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>

          {currentData.length > 0 ? (
            Array.isArray(payments) && (
              <tbody>
                {currentData?.map((payment, index) => {
                  var formattedDate = payment?.createdAt
                    ? new Date(payment?.createdAt)
                        .toLocaleString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        .replace(",", "")
                    : "N/A";
                  return (
                    <tr key={payment.id}>
                      <td>
                        {(currentPage - 1) * itemsPerPage + index + 1 || "-"}
                      </td>
                      <td>{formattedDate || "-"}</td>
                      <td>
                        {payment?.user?.firstName && payment?.user?.lastName
                          ? `${payment?.user?.firstName} ${payment?.user?.lastName}`
                          : "-"}
                      </td>
                      <td>{payment.paymentMethod || "-"}</td>
                      <td>
                        <div>{`${
                          payment?.totalPrice ? "$ " + payment?.totalPrice : "-"
                        }`}</div>
                      </td>
                      <td>
                        <div
                          className={`sp_btn_${payment.paymentStatus?.toLowerCase()} text-center`}
                          style={{ width: "100px" }}
                        >
                          {payment.paymentStatus || "-"}
                        </div>
                      </td>
                    </tr>
                  );
                })}{" "}
              </tbody>
            )
          ) : (
            <div className="sp_404">
              <div className="d-flex justify-content-center align-items-center">
                <img src={require("../../img/s_img/404.png")}></img>
              </div>
              <h6 className="sp_text_grey">No data Available.</h6>
            </div>
          )}
        </table>
        {payments1.length > itemsPerPage && (
          <div className="sp_pagination justify-content-sm-center justify-content-start justify-content-md-end overflow-auto">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaAngleLeft />
            </button>

            {totalPages > 4 && currentPage > 3 && (
              <>
                <button onClick={() => setCurrentPage(1)}>1</button>
                {currentPage > 4 && <button>...</button>}
              </>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((pageNum) => {
                // Show current page and one page before and after
                if (
                  pageNum === currentPage ||
                  pageNum === currentPage - 1 ||
                  pageNum === currentPage + 1
                ) {
                  return true;
                }
                // Special case for small number of pages
                if (totalPages <= 3) {
                  return true;
                }
                return false;
              })
              .map((pageNum) => (
                <button
                  key={pageNum}
                  className={currentPage === pageNum ? "active" : ""}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

            {totalPages > 4 && currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <button>...</button>}
                <button onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <FaAngleRight />
            </button>
          </div>
        )}
      </div>
      {/* filter offanavs */}
      <Offcanvas
        className="sp_filter_off"
        show={filterOff}
        onHide={handleClose}
        placement={"end"}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column justify-content-between">
          <div>
            <div className="sp_filter_select">
              <p>Date</p>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              ></input>
            </div>
            <div className="sp_filter_select">
              <p>Payment Method</p>
              <select
                onChange={(e) => setFilterMethod(e.target.value)}
                value={filterMethod}
              >
                <option value="">All</option>
                <option value="Cod">Cashon Delivery</option>
                <option value="Card">Credit Card / Debit Card</option>
                <option value="Net Banking">Net banking</option>
                <option value="Upi">UPI</option>
              </select>
            </div>
            <div className="sp_filter_select">
              <p>Payment Status</p>
              <select
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
              >
                <option value="">All</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Cancel">Cancel</option>
              </select>
            </div>
          </div>

          <div className="d-flex  align-items-center justify-content-between ">
            <div
              className="sp_filter_btn"
              onClick={() => {
                handleClose(), resetFilters();
              }}
            >
              Cancle
            </div>
            <Link
              onClick={() => {
                handleClose(), applyFilters();
              }}
              className="sp_add_btn"
            >
              Apply
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
export default Payment;
