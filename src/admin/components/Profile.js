import React from "react";
import "../../styles/umang.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Profile_1 from "../../img/u_images/Profile_1.png";
import { FaEye } from "react-icons/fa";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosEyeOff } from "react-icons/io";
import { useRef } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getuserData } from "../../redux/slices/sellerDashboard";
import { useNavigate } from "react-router-dom";
import { deleteAcc } from "../../redux/slices/deleteAcc.Slice";
import { resendOtp, sendOtp } from "../../redux/slices/resendOtp.Slice";
const Profile = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTaxdetails, setShowTaxDetails] = useState("");
  const [editBankDetails, setEditBankDetails] = useState("");
  const [step, setstep] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [users, setusers] = useState([]);
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);

  var otp = "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getuserData());
    // dispatch(deleteAcc());
    // dispatch(getResendOtp());
  }, []);
  var userData = useSelector((state) => state.sellerProduct.userData);
  // var deleteData = useSelector((state) => state.deleteAcc.deleteData);
  // var resendOtpData = useSelector(
  //   (state) => state.resendOtpSlice.resendOtpData
  // );

  console.log("resendOtpData", userData);

  // const [profileImage, setProfileImage] = useState(Profile_1);
  const userId = localStorage.getItem("userId");
  const currentUser = users.find((v) => v._id == userId);

  // const toggleSectionTaxDetails = (item) => {
  //   setActiveItem(item);
  // };
  const toggleSectionTaxDetails = (value) => {
    setShowTaxDetails(value);
    setstep(0);
    setActiveItem(value);
  };

  const handleEditBankDetails = (value) => {
    setEditBankDetails(value);
    setstep(() => setstep(step + 1));
  };

  const inputsRef = useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;

    if (value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleOTPInput = (e, index) => {
    const value = e.target.value;
    if (value.length === 0) {
      otp = "";
    } else {
      otp = otp + value;
    }
    if (value.length === 1) {
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
    const allFilled = [...inputsRef.current].every(
      (input) => input.value.length === 1
    );
    if (allFilled) {
      if (parseInt(otp) === userData?.otp) {
        setstep(3);
      } else {
        alert("Invalid OTP");
        otp = "";
        inputsRef.current.forEach((input) => (input.value = ""));
      }
    }
  };

  const getUser = async () => {
    try {
      var token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/getUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("response", response);
      const fetchedUser = response.data.data;
      if (fetchedUser) {
        setUser(fetchedUser);
        formik.setFieldValue("mobile", fetchedUser.mobileNo);
        formik.setFieldValue("email", fetchedUser.email);
        formik.setFieldValue("firstName", fetchedUser.firstName);
        formik.setFieldValue("lastName", fetchedUser.lastName);
        formik.setFieldValue("mobile", fetchedUser.mobileNo);
        formik.setFieldValue("email", fetchedUser.email);
        formik.setFieldValue("image", fetchedUser.image);

        addressFormik.setFieldValue(
          "buildingNumber",
          fetchedUser.buildingNumber
        );
        addressFormik.setFieldValue("locality", fetchedUser.locality);
        addressFormik.setFieldValue("landmark", fetchedUser.landmark);
        addressFormik.setFieldValue("pincode", fetchedUser.pincode);
        addressFormik.setFieldValue("city", fetchedUser.city);
        addressFormik.setFieldValue("state", fetchedUser.state);

        // setAddress(fetchedUser.addressId);

        editBankD.setFieldValue("bankName", fetchedUser.bankName);
        editBankD.setFieldValue("accountNumber", fetchedUser.accountNumber);
        editBankD.setFieldValue(
          "confirmAccountNumber",
          fetchedUser.accountNumber
        );
        editBankD.setFieldValue("IFSCCode", fetchedUser.IFSCCode);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleDeactivateAccount = async (values) => {
    console.log("DeleteFormik", DeleteFormik);
    await dispatch(deleteAcc(DeleteFormik?.values?.currentPassword)).then(
      (response) => {
        console.log(response);
        if (response.payload.success) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          navigate("/seller/sell-on-login");
        }
      }
    );
  };

  const DeleteFormik = useFormik({
    initialValues: {
      // Change Password
      currentPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
    }),
    onSubmit: handleDeactivateAccount,
  });

  const formik = useFormik({
    initialValues: {
      // Edit profile
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      image: null,
    },
    validationSchema: Yup.object({
      // Edit Profile
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        var token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("mobileNo", values.mobile);
        formData.append("email", values.email);
        if (values.image) {
          formData.append("image", values.image);
        }

        const response = await axios.put(
          "http://localhost:4000/api/updateUser",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        getUser();
        dispatch(getuserData());
      } catch (error) {
        console.error("Error updating profile:", error.response.data.message);
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      // Change Password
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      // Change Password
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        var token = localStorage.getItem("token");
        const response = await axios.put(
          "http://localhost:4000/api/changePassword",
          {
            oldPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert(response.data.message);
        formik.resetForm();
      } catch (error) {
        console.error("Error changing password:", error.response.data.message);
      }
    },
  });

  const addressFormik = useFormik({
    initialValues: {
      buildingNumber: "",
      locality: "",
      landmark: "",
      pincode: "",
      city: "",
      state: "",
    },
    validationSchema: Yup.object({
      buildingNumber: Yup.string().required(
        "Room/ Floor/ Building Number is required"
      ),
      locality: Yup.string().required("Street/ Locality is required"),
      landmark: Yup.string().required("Landmark is required"),
      pincode: Yup.string()
        .required("Pincode is required")
        .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
    }),
    onSubmit: async (values) => {
      try {
        var token = localStorage.getItem("token");
        const response = await axios.put(
          `http://localhost:4000/api/updateUser`,
          {
            buildingNumber: values.buildingNumber,
            locality: values.locality,
            landmark: values.landmark,
            pincode: values.pincode,
            city: values.city,
            state: values.state,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert(response.data.message);
        getUser();
        // localStorage.setItem("address", JSON.stringify(values));
      } catch (error) {
        console.error("Error updating address:", error.response.data.message);
      }
    },
  });

  const editBankD = useFormik({
    initialValues: {
      bankName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      IFSCCode: "",
    },
    validationSchema: Yup.object({
      bankName: Yup.string().required("Bank Name is Required"),
      accountNumber: Yup.string()
        .required("Account number is required")
        .matches(/^\d{9,18}$/, "Account number must be between 9 to 18 digits"),
      confirmAccountNumber: Yup.string()
        .oneOf([Yup.ref("accountNumber"), null], "Account numbers must match")
        .matches(/^\d{9,18}$/, "Account number must be between 9 to 18 digits")
        .required("Confirming account number is required"),
      IFSCCode: Yup.string()
        .required("IFSC code is required")
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
    }),
    onSubmit: async (values) => {
      try {
        var token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("bankName", values.bankName);
        formData.append("accountNumber", values.accountNumber);
        formData.append("confirmAccountNumber", values.confirmAccountNumber);
        formData.append("IFSCCode", values.IFSCCode);

        const response = await axios.put(
          "http://localhost:4000/api/updateUser",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        getUser();
        dispatch(getuserData());
      } catch (error) {
        console.error("Error updating profile:", error.response.data.message);
      }
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const token = localStorage.getItem("token");
          const response = await axios.put(
            "http://localhost:4000/api/updateUser",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          getUser();
          dispatch(getuserData());
        } catch (error) {
          console.error(
            "Error updating profile:",
            error?.response?.data?.message || error.message
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const userLogout = () => {
    navigate("/seller/sell-on-login");
  };

  return (
    <>
      <div
        style={{ backgroundColor: "#f9f9f9" }}
        className="uprofile_container d-flex flex-column"
      >
        <h1 style={{ fontSize: "24px", fontWeight: "500px" }}>Profile</h1>
        <div className="umain_section flex-fill">
          <div className="uprofile_sidebar d-flex flex-column">
            <div className="uprofile_card ">
              <div className="uprofile_info">
                <div className="uprofile_image">
                  {console.log(typeof formik.values.image)}
                  {console.log(formik.values.image)}

                  <img
                    src={
                      typeof formik.values.image === "string"
                        ? `http://localhost:4000/${formik.values.image}`
                        : formik.values.image instanceof File
                        ? URL.createObjectURL(formik.values.image)
                        : ""
                    }
                    alt="Not Available"
                  />
                  <div
                    className="ucamera_icon"
                    onClick={() =>
                      document.getElementById("profileImageInput").click()
                    }
                  >
                    <img
                      src="https://img.icons8.com/material-outlined/24/000000/camera.png"
                      alt="Camera Icon"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                    id="profileImageInput"
                  />
                </div>
                <div className="uprofile_name">
                  {user?.firstName && user?.lastName
                    ? user?.firstName + " " + user?.lastName
                    : "Not Avaible"}
                </div>
                <div className="uprofile_email">{user?.email}</div>
              </div>
            </div>

            <div className="umenu_card flex-fill pt-4">
              <div
                className={`umenu_item ${
                  activeItem === "Password" ? "active" : ""
                }`}
                onClick={() => toggleSectionTaxDetails("Password")}
              >
                <div className="umenu_icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.125 8.5H15.5V6C15.5 3.2425 13.2575 1 10.5 1C7.7425 1 5.5 3.2425 5.5 6V8.5H4.875C4.37792 8.50066 3.90139 8.69842 3.54991 9.0499C3.19842 9.40139 3.00066 9.87792 3 10.375V19.125C3 20.1592 3.84167 21 4.875 21H16.125C17.1583 21 18 20.1592 18 19.125V10.375C18 9.34083 17.1583 8.5 16.125 8.5ZM7.16667 6C7.16667 4.16167 8.66167 2.66667 10.5 2.66667C12.3383 2.66667 13.8333 4.16167 13.8333 6V8.5H7.16667V6ZM11.3333 14.935V16.8333C11.3333 17.0543 11.2455 17.2663 11.0893 17.4226C10.933 17.5789 10.721 17.6667 10.5 17.6667C10.279 17.6667 10.067 17.5789 9.91074 17.4226C9.75446 17.2663 9.66667 17.0543 9.66667 16.8333V14.935C9.17083 14.6458 8.83333 14.1142 8.83333 13.5C8.83333 12.5808 9.58083 11.8333 10.5 11.8333C11.4192 11.8333 12.1667 12.5808 12.1667 13.5C12.1667 14.1142 11.8292 14.6458 11.3333 14.935Z"
                      fill="#0F0F0F"
                    />
                  </svg>
                </div>
                <div className="umenu_text">Change Password</div>
              </div>

              <div
                className={`umenu_item ${activeItem === "tax" ? "active" : ""}`}
                onClick={() => toggleSectionTaxDetails("tax")}
              >
                <div className="umenu_icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_492_14585)">
                      <path
                        d="M21.5482 9.25271L21.0621 1.47451C21.0517 1.30731 20.9805 1.14968 20.862 1.03123C20.7436 0.91279 20.5859 0.841681 20.4187 0.831265L12.6407 0.345117C12.5434 0.338966 12.4458 0.353623 12.3546 0.388112C12.2634 0.422601 12.1806 0.476131 12.1116 0.545137L0.201355 12.4555C0.0724293 12.5844 0 12.7593 0 12.9416C0 13.124 0.0724293 13.2988 0.201355 13.4278L8.46566 21.6921C8.59459 21.821 8.76945 21.8934 8.95177 21.8934C9.13409 21.8934 9.30895 21.821 9.43787 21.6921L21.3482 9.7817C21.4172 9.71275 21.4706 9.62993 21.5051 9.53872C21.5396 9.44752 21.5543 9.35003 21.5482 9.25271ZM8.95177 16.3446L6.52111 13.9139L5.54882 14.8862L4.57656 13.9139L7.49341 10.9971L8.46566 11.9694L7.49337 12.9416L9.92402 15.3723L8.95177 16.3446ZM13.5056 12.0981L12.6525 11.6716L11.5708 12.7532L11.9974 13.6063L10.7675 14.2212L8.82299 10.3321C8.75848 10.2031 8.73621 10.057 8.75935 9.91453C8.78248 9.7721 8.84985 9.64056 8.9519 9.53854L9.43805 9.05239C9.54006 8.95034 9.6716 8.88298 9.81403 8.85984C9.95646 8.8367 10.1026 8.85897 10.2316 8.92348L14.1207 10.868L13.5056 12.0981ZM17.1537 8.27878L15.3017 8.11039L15.4701 9.96234L14.1007 10.0869L13.9095 7.98376L11.8064 7.79255L11.931 6.42322L13.7829 6.59161L13.6146 4.73966L14.9839 4.61505L15.1751 6.71824L17.2783 6.90945L17.1537 8.27878ZM19.1908 4.75354C18.9985 4.94584 18.7535 5.0768 18.4868 5.12986C18.22 5.18292 17.9436 5.15569 17.6923 5.05162C17.4411 4.94756 17.2263 4.77132 17.0752 4.5452C16.9241 4.31908 16.8435 4.05324 16.8435 3.78129C16.8435 3.50933 16.9241 3.24349 17.0752 3.01737C17.2263 2.79125 17.4411 2.61501 17.6923 2.51095C17.9436 2.40688 18.22 2.37965 18.4868 2.43271C18.7535 2.48577 18.9985 2.61673 19.1908 2.80903C19.4487 3.06687 19.5936 3.41659 19.5936 3.78125C19.5936 4.14591 19.4488 4.49566 19.191 4.75354H19.1908Z"
                        fill="#0F0F0F"
                        fillOpacity="0.6"
                      />
                      <path
                        d="M11.3554 11.0234L10.4883 10.5898L10.9218 11.457L11.3554 11.0234Z"
                        fill="#0F0F0F"
                        fillOpacity="0.6"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_492_14585">
                        <rect width="22" height="22" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="umenu_text">Tax Details</div>
              </div>

              <div
                className={`umenu_item ${
                  activeItem === "Bank Details" ? "active" : ""
                }`}
                onClick={() => toggleSectionTaxDetails("Bank Details")}
              >
                <div className="umenu_icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_492_14595)">
                      <path
                        d="M21.3984 19.207H0.6875C0.288578 19.3359 8.48614e-10 19.6245 8.48614e-10 19.9804V21.3554C8.48614e-10 21.7114 0.288578 22 0.644531 22H21.3555C21.7114 22 22 21.7114 22 21.3554V19.9804C22 19.6245 21.7114 19.3359 21.3984 19.207ZM21.6025 4.34609L11.247 0.0492108C11.1687 0.0167228 11.0848 0 11 0C10.9152 0 10.8313 0.0167228 10.753 0.0492108L0.397504 4.34609C0.279823 4.39491 0.179254 4.47751 0.108502 4.58347C0.0377512 4.68942 -6.53594e-06 4.81397 8.48614e-10 4.94138L8.48614e-10 6.23044C8.48614e-10 6.58639 0.288578 6.87497 0.644531 6.87497H21.3555C21.7114 6.87497 22 6.58639 22 6.23044V4.94138C22 4.68086 21.8432 4.4459 21.6025 4.34609ZM14.8672 4.94138H7.13281C6.77686 4.94138 6.48828 4.6528 6.48828 4.29684C6.48828 3.94089 6.77686 3.65231 7.13281 3.65231H14.8672C15.2231 3.65231 15.5117 3.94089 15.5117 4.29684C15.5117 4.6528 15.2231 4.94138 14.8672 4.94138ZM1.22461 16.7578V18.0468H6.16602V16.7578C6.16602 16.4018 5.87744 16.1133 5.52148 16.1133H1.86914C1.51319 16.1133 1.22461 16.4018 1.22461 16.7578ZM2.08398 8.16403H5.30664V14.8242H2.08398V8.16403ZM16.6934 8.16403H19.916V14.8242H16.6934V8.16403ZM15.834 16.7578V18.0468H20.7754V16.7578C20.7754 16.4018 20.4868 16.1133 20.1309 16.1133H16.4785C16.1226 16.1133 15.834 16.4018 15.834 16.7578ZM11 15.039C10.6446 15.039 10.3555 14.7499 10.3555 14.3945C10.3555 14.0385 10.0669 13.75 9.71094 13.75C9.35498 13.75 9.06641 14.0385 9.06641 14.3945C9.06641 15.2348 9.60528 15.9512 10.3555 16.2172V16.5429C10.3555 16.8989 10.644 17.1875 11 17.1875C11.356 17.1875 11.6445 16.8989 11.6445 16.5429V16.2172C12.3947 15.9512 12.9336 15.2348 12.9336 14.3945C12.9336 13.3283 12.0662 12.4609 11 12.4609C10.6446 12.4609 10.3555 12.1718 10.3555 11.8164C10.3555 11.461 10.6446 11.1718 11 11.1718C11.3554 11.1718 11.6445 11.461 11.6445 11.8164C11.6445 12.1723 11.9331 12.4609 12.2891 12.4609C12.645 12.4609 12.9336 12.1723 12.9336 11.8164C12.9336 10.9761 12.3947 10.2597 11.6445 9.99364V9.66794C11.6445 9.31199 11.356 9.02341 11 9.02341C10.644 9.02341 10.3555 9.31199 10.3555 9.66794V9.99364C9.60528 10.2597 9.06641 10.9761 9.06641 11.8164C9.06641 12.8826 9.93382 13.75 11 13.75C11.3554 13.75 11.6445 14.0391 11.6445 14.3945C11.6445 14.7499 11.3554 15.039 11 15.039Z"
                        fill="#0F0F0F"
                        fillOpacity="0.6"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_492_14595">
                        <rect width="22" height="22" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="umenu_text">Bank Details</div>
              </div>

              <div
                className={`umenu_item ${
                  activeItem === "editAddress" ? "active" : ""
                }`}
                onClick={() => toggleSectionTaxDetails("editAddress")}
              >
                <div className="umenu_icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 0.25C9.67936 0.25 7.45376 1.17187 5.81282 2.81282C4.17187 4.45376 3.25 6.67936 3.25 9C3.25 10.052 3.629 11.275 4.165 12.5C4.709 13.743 5.449 15.063 6.241 16.333C7.826 18.873 9.658 21.27 10.661 22.535C10.8205 22.7378 11.0239 22.9017 11.2559 23.0144C11.4879 23.1272 11.7425 23.1857 12.0005 23.1857C12.2585 23.1857 12.5131 23.1272 12.7451 23.0144C12.9771 22.9017 13.1805 22.7378 13.34 22.535C14.342 21.27 16.174 18.873 17.759 16.332C18.551 15.062 19.291 13.742 19.835 12.5C20.371 11.275 20.75 10.052 20.75 9C20.75 6.67936 19.8281 4.45376 18.1872 2.81282C16.5462 1.17187 14.3206 0.25 12 0.25ZM12 4.25C10.8728 4.25 9.79183 4.69777 8.9948 5.4948C8.19777 6.29183 7.75 7.37283 7.75 8.5C7.75 9.62717 8.19777 10.7082 8.9948 11.5052C9.79183 12.3022 10.8728 12.75 12 12.75C13.1272 12.75 14.2082 12.3022 15.0052 11.5052C15.8022 10.7082 16.25 9.62717 16.25 8.5C16.25 7.37283 15.8022 6.29183 15.0052 5.4948C14.2082 4.69777 13.1272 4.25 12 4.25Z"
                      fill="#0F0F0F"
                      fillOpacity="0.6"
                    />
                  </svg>
                </div>
                <div className="umenu_text">Edit Address</div>
              </div>

              <div
                className={`umenu_item ${
                  activeItem === "deleteAccount" ? "active" : ""
                }`}
                onClick={() => toggleSectionTaxDetails("deleteAccount")}
              >
                <div className="umenu_icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.00315 -0.00292969C6.79158 -0.00292969 5.62964 0.4784 4.77293 1.33517C3.91622 2.19194 3.43493 3.35398 3.43493 4.56563C3.43493 5.77729 3.91622 6.93932 4.77293 7.79609C5.62964 8.65287 6.79158 9.1342 8.00315 9.1342C9.21472 9.1342 10.3767 8.65287 11.2334 7.79609C12.0901 6.93932 12.5714 5.77729 12.5714 4.56563C12.5714 3.35398 12.0901 2.19194 11.2334 1.33517C10.3767 0.4784 9.21472 -0.00292969 8.00315 -0.00292969ZM8.46256 11.3583C8.7187 10.9862 8.47476 10.4211 8.02246 10.4221H7.60574L6.7977 10.4231C4.99483 10.4231 3.26581 11.1393 1.991 12.4142C0.716184 13.6892 0 15.4183 0 17.2213C0 17.9573 0.292342 18.6631 0.812713 19.1835C1.33309 19.7039 2.03886 19.9963 2.77478 19.9963H8.08141C8.53879 19.9963 8.78578 19.4128 8.5205 19.0398C7.71171 17.9068 7.27808 16.5489 7.28049 15.1568C7.28049 13.746 7.71754 12.4378 8.46256 11.3583Z"
                      fill="#0F0F0F"
                      fillOpacity="0.6"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.1434 15.1581C19.1434 15.8368 19.0098 16.509 18.75 17.1361C18.4903 17.7632 18.1096 18.333 17.6297 18.8129C17.1497 19.2929 16.58 19.6736 15.9529 19.9334C15.3258 20.1931 14.6538 20.3268 13.975 20.3268C13.2963 20.3268 12.6242 20.1931 11.9972 19.9334C11.3701 19.6736 10.8004 19.2929 10.3204 18.8129C9.8405 18.333 9.4598 17.7632 9.20006 17.1361C8.94033 16.509 8.80664 15.8368 8.80664 15.1581C8.80664 13.7872 9.35117 12.4725 10.3204 11.5032C11.2897 10.5338 12.6043 9.98926 13.975 9.98926C15.3458 9.98926 16.6604 10.5338 17.6297 11.5032C18.5989 12.4725 19.1434 13.7872 19.1434 15.1581ZM16.3727 12.7592C16.4437 12.83 16.5001 12.9141 16.5385 13.0067C16.5769 13.0993 16.5967 13.1986 16.5967 13.2989C16.5967 13.3992 16.5769 13.4985 16.5385 13.5911C16.5001 13.6837 16.4437 13.7678 16.3727 13.8387L15.4122 14.7982C15.3649 14.8454 15.3274 14.9015 15.3017 14.9633C15.2761 15.025 15.2629 15.0912 15.2629 15.1581C15.2629 15.2249 15.2761 15.2911 15.3017 15.3528C15.3274 15.4146 15.3649 15.4707 15.4122 15.5179L16.3727 16.4785C16.5074 16.623 16.5807 16.8141 16.5772 17.0116C16.5737 17.2091 16.4937 17.3976 16.3541 17.5372C16.2144 17.6769 16.026 17.7569 15.8285 17.7604C15.631 17.7639 15.4399 17.6906 15.2954 17.5559L14.3349 16.5954C14.2395 16.5001 14.1103 16.4465 13.9756 16.4465C13.8408 16.4465 13.7116 16.5001 13.6163 16.5954L12.6558 17.5559C12.5112 17.6906 12.3201 17.7639 12.1226 17.7604C11.9251 17.7569 11.7367 17.6769 11.597 17.5372C11.4574 17.3976 11.3774 17.2091 11.3739 17.0116C11.3704 16.8141 11.4437 16.623 11.5784 16.4785L12.5379 15.5179C12.6331 15.4226 12.6866 15.2933 12.6866 15.1586C12.6866 15.0238 12.6331 14.8945 12.5379 14.7992L11.5774 13.8387C11.4384 13.6949 11.3615 13.5024 11.3631 13.3025C11.3648 13.1026 11.4449 12.9114 11.5861 12.77C11.7274 12.6286 11.9186 12.5483 12.1184 12.5465C12.3183 12.5446 12.5109 12.6214 12.6547 12.7602L13.6163 13.7208C13.7116 13.816 13.8408 13.8696 13.9756 13.8696C14.1103 13.8696 14.2395 13.816 14.3349 13.7208L15.2954 12.7602C15.4383 12.6174 15.632 12.5372 15.834 12.5372C16.0361 12.5372 16.2298 12.6164 16.3727 12.7592Z"
                      fill="#0F0F0F"
                      fillOpacity="0.6"
                    />
                  </svg>
                </div>
                <div className="umenu_text">Delete Account</div>
              </div>

              <div className="umenu_item">
                <div className="umenu_icon">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.8149 4.81257C17.6685 4.65444 17.49 4.52954 17.2913 4.44631C17.0926 4.36307 16.8783 4.32344 16.663 4.33008C16.4446 4.33602 16.23 4.38859 16.0336 4.48426C15.8372 4.57993 15.6635 4.71649 15.5242 4.88478C15.2941 5.16921 15.1738 5.52684 15.1852 5.89253C15.1967 6.25822 15.3391 6.60763 15.5865 6.87711C16.4334 7.79201 16.9829 8.94223 17.1626 10.176C17.3423 11.4097 17.1438 12.6689 16.5931 13.7874C16.0424 14.9059 15.1656 15.8312 14.0783 16.441C12.991 17.0508 11.7444 17.3165 10.503 17.2031C9.35582 17.1017 8.26002 16.6808 7.33998 15.988C6.41994 15.2952 5.7125 14.3584 5.29796 13.2838C4.88343 12.2092 4.77839 11.0399 4.99478 9.90861C5.21116 8.77732 5.74031 7.72936 6.52215 6.88367C6.71897 6.66763 6.84962 6.3996 6.89858 6.11146C6.94754 5.82332 6.91275 5.52718 6.79835 5.25824C6.68394 4.9893 6.49473 4.75886 6.2532 4.59433C6.01168 4.42979 5.72799 4.33808 5.43587 4.33008C5.21911 4.32224 5.00323 4.36163 4.8032 4.44551C4.60316 4.52939 4.42375 4.65575 4.27739 4.81585C3.34869 5.81998 2.65581 7.01878 2.24929 8.3248C1.84278 9.63082 1.73288 11.0111 1.92761 12.365C2.25219 14.4906 3.30406 16.4377 4.9038 17.8743C6.50354 19.3108 8.55204 20.1478 10.6999 20.2424H11.0511C12.8349 20.2356 14.5784 19.711 16.0699 18.7322C17.5613 17.7534 18.7365 16.3625 19.4528 14.7286C20.1691 13.0946 20.3956 11.2878 20.1048 9.52753C19.8141 7.76728 19.0185 6.12933 17.8149 4.81257Z"
                      fill="#0F0F0F"
                      fillOpacity="0.6"
                    />
                    <path
                      d="M11.0475 11.5581C11.4523 11.5581 11.8404 11.3973 12.1266 11.111C12.4128 10.8248 12.5736 10.4366 12.5736 10.0318V2.44324C12.5736 2.03845 12.4128 1.65025 12.1266 1.36402C11.8404 1.07779 11.4523 0.916992 11.0475 0.916992C10.6428 0.916992 10.2546 1.07779 9.96845 1.36402C9.68226 1.65025 9.52148 2.03845 9.52148 2.44324V10.0318C9.52148 10.4366 9.68226 10.8248 9.96845 11.111C10.2546 11.3973 10.6428 11.5581 11.0475 11.5581Z"
                      fill="#0F0F0F"
                      fillOpacity="0.6"
                    />
                  </svg>
                </div>
                <div className="umenu_text" onClick={() => setModalShow(true)}>
                  Logout
                </div>
              </div>
            </div>
          </div>

          <div className="uedit_container">
            {showTaxdetails === "" && (
              <>
                <h2 className="uedit_title">Edit Profile Detail</h2>
                <form onSubmit={formik.handleSubmit}>
                  <div className="uform_group">
                    <div className="uform_field">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        {...formik.getFieldProps("firstName")}
                      />
                      {formik.touched.firstName && formik.errors.firstName ? (
                        <div
                          className="error"
                          style={{ color: "red", fontSize: "14px" }}
                        >
                          {formik.errors.firstName}
                        </div>
                      ) : null}
                    </div>

                    <div className="uform_field">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        {...formik.getFieldProps("lastName")}
                      />
                      {formik.touched.lastName && formik.errors.lastName ? (
                        <div
                          className="error"
                          style={{ color: "red", fontSize: "14px" }}
                        >
                          {formik.errors.lastName}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="uform_group">
                    <div className="uform_field">
                      <label htmlFor="mobile">Mobile Number</label>
                      <input
                        type="text"
                        id="mobile"
                        {...formik.getFieldProps("mobile")}
                      />
                      {formik.touched.mobile && formik.errors.mobile ? (
                        <div
                          className="error"
                          style={{ color: "red", fontSize: "14px" }}
                        >
                          {formik.errors.mobile}
                        </div>
                      ) : null}
                    </div>

                    <div className="uform_field">
                      <label htmlFor="email">Email Id</label>
                      <input
                        type="email"
                        id="email"
                        {...formik.getFieldProps("email")}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <div
                          className="error"
                          style={{ color: "red", fontSize: "14px" }}
                        >
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <button type="submit" className="z_button py-2 px-5">
                    Update
                  </button>
                </form>
              </>
            )}
            {showTaxdetails === "Password" && (
              <>
                <div className="upass_container">
                  <h1
                    style={{
                      fontSize: "20px",
                      color: "#333",
                      marginBottom: "20px",
                      fontWeight: "600",
                      padding: "20px 0px",
                    }}
                  >
                    Change Password
                  </h1>
                  <form onSubmit={passwordFormik.handleSubmit}>
                    <div className="uform_grouppass">
                      <label className="upasslabel" htmlFor="current-password">
                        Current Password
                      </label>
                      <div className="uinput_containerpass">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="current-password"
                          placeholder="Current Password"
                          {...passwordFormik.getFieldProps("currentPassword")}
                        />
                        <span
                          className="ueye_iconpass"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEye /> : <IoIosEyeOff />}
                        </span>
                      </div>
                      {passwordFormik.touched.currentPassword &&
                      passwordFormik.errors.currentPassword ? (
                        <div
                          className="error"
                          style={{ color: "red", fontSize: "14px" }}
                        >
                          {passwordFormik.errors.currentPassword}
                        </div>
                      ) : null}
                    </div>

                    <div className="uform_grouppass">
                      <label className="upasslabel" htmlFor="new-password">
                        New Password
                      </label>
                      <div className="uinput_containerpass">
                        <input
                          type={showPassword1 ? "text" : "password"}
                          id="new-password"
                          placeholder="New Password"
                          {...passwordFormik.getFieldProps("newPassword")}
                        />
                        <span
                          className="ueye_iconpass"
                          onClick={() => setShowPassword1(!showPassword1)}
                        >
                          {showPassword1 ? <FaEye /> : <IoIosEyeOff />}
                        </span>
                      </div>
                      {passwordFormik.touched.newPassword &&
                      passwordFormik.errors.newPassword ? (
                        <div
                          className="error"
                          style={{ color: "red", fontSize: "14px" }}
                        >
                          {passwordFormik.errors.newPassword}
                        </div>
                      ) : null}
                    </div>

                    <div className="uform_grouppass">
                      <label className="upasslabel" htmlFor="confirm-password">
                        Re-type New Password
                      </label>
                      <div className="uinput_containerpass">
                        <input
                          type={showPassword2 ? "text" : "password"}
                          id="confirm-password"
                          placeholder="Re-type New Password"
                          {...passwordFormik.getFieldProps("confirmPassword")}
                        />
                        <span
                          className="ueye_iconpass"
                          onClick={() => setShowPassword2(!showPassword2)}
                        >
                          {showPassword2 ? <FaEye /> : <IoIosEyeOff />}
                        </span>
                      </div>
                      {passwordFormik.touched.confirmPassword &&
                      passwordFormik.errors.confirmPassword ? (
                        <div
                          className="error"
                          style={{ color: "red", fontSize: "14px" }}
                        >
                          {passwordFormik.errors.confirmPassword}
                        </div>
                      ) : null}
                    </div>

                    <button className="z_button mt-3" type="submit">
                      Change Password
                    </button>
                  </form>
                </div>
              </>
            )}

            {showTaxdetails === "tax" && (
              <div className="utaxD_container">
                <h1
                  className="utaxDheading"
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#000",
                    padding: "20px 0px",
                  }}
                >
                  GST Details
                </h1>

                <div className="udetail_item">
                  <div className="udetail_label">
                    GSTIN Registered Mobile Number
                  </div>
                  <div className="udetail_value">+1 XXXXXX8526</div>
                </div>

                <div className="udetail_item">
                  <div className="udetail_label">GSTIN Registered Email ID</div>
                  <div className="udetail_value">{userData?.email}</div>
                </div>

                <div className="udetail_item">
                  <div className="udetail_label">GSTIN Number</div>
                  <div className="udetail_value">{userData?.gstNumber}</div>
                </div>

                <div className="udetail_item">
                  <div className="udetail_label">PAN Number</div>
                  <div className="udetail_value">{userData?.PANNumber}</div>
                </div>

                <div className="udetail_item">
                  <div className="udetail_label">GSTIN Type</div>
                  <div className="udetail_value">Regular</div>
                </div>
              </div>
            )}

            {showTaxdetails == "Bank Details" && step == 0 && (
              <div className="ubankD_container">
                <h1
                  className="ubankDheading"
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#000",
                    padding: "20px 0px",
                  }}
                >
                  Bank Details
                </h1>

                <div className="udetail_item">
                  <div className="udetail_label">Beneficiary Name</div>
                  <div className="udetail_value">
                    {userData?.firstName + " " + userData?.lastName}
                  </div>
                </div>

                <div className="udetail_item">
                  <div className="udetail_label">Account Number</div>
                  <div className="udetail_value">{userData?.accountNumber}</div>
                </div>

                <div className="udetail_item">
                  <div className="udetail_label">Bank Name</div>
                  <div className="udetail_value">{userData?.bankName}</div>
                </div>

                <div className="udetail_item">
                  <div className="udetail_label">IFSC Code</div>
                  <div className="udetail_value">{userData?.IFSCCode}</div>
                </div>

                <a
                  href="#"
                  className="z_button px-4 "
                  onClick={() => {
                    toggleSectionTaxDetails("Bank Details");
                    setstep(1);
                  }}
                >
                  Edit Bank Details
                </a>
              </div>
            )}

            {showTaxdetails === "Bank Details" && step == 1 && (
              <div className="ueditBankD_container">
                <div className="uhead">
                  <span className="uback_arrow" onClick={() => setstep(0)}>
                    <FaArrowLeft />
                  </span>
                  <h1
                    className="ueditBankDheading mb-0"
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#000",
                      padding: "20px 0px",
                    }}
                  >
                    Bank Details
                  </h1>
                </div>

                <p className="udescription">
                  Confirm identity to edit your bank details. OTP will be sent
                  to registered mobile number and email ID
                </p>

                <div className="udetail_item">
                  <div className="udetail_label">Mobile Number</div>
                  <div className="udetail_value">{userData?.mobileNo}</div>
                </div>

                <div className="udetail_item">
                  <div className="udetail_label">Email ID</div>
                  <div className="udetail_value">{userData?.email}</div>
                </div>

                <button
                  className="z_button"
                  onClick={() => {
                    // dispatch(sendOtp(userData?.email)).unwrap()
                    dispatch(sendOtp(userData?.email));
                    setstep(2);
                  }}
                >
                  Send OTP
                </button>
              </div>
            )}

            {showTaxdetails === "Bank Details" && step == 2 && (
              <div className="ueditBankD_container">
                <div className="uhead">
                  <span className="uback_arrow" onClick={() => setstep(1)}>
                    <FaArrowLeft />
                  </span>
                  <h1
                    className="ueditBankDheading mb-0"
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#000",
                      padding: "20px 0px",
                    }}
                  >
                    Bank Details
                  </h1>
                </div>

                <p className="udescription">
                  Confirm identity to edit your bank details. OTP will be sent
                  to registered mobile number and email ID
                </p>

                <div className="udetail_item">
                  <div className="udetail_label">Mobile Number</div>
                  <div className="udetail_value">{userData?.mobileNo}</div>
                </div>

                <div className="udetail_item">
                  <div className="udetail_label">Email ID</div>
                  <div className="udetail_value">{userData?.email}</div>
                </div>

                <div className="uotp_container">
                  <label className="uotp_label">Enter OTP</label>
                  <div className="uotp_inputs">
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="uotp_input"
                        ref={(el) => (inputsRef.current[index] = el)}
                        onInput={(e) => handleOTPInput(e, index)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                      />
                    ))}
                  </div>
                  <a
                    href="#"
                    className="uresend_otp"
                    onClick={() => {
                      dispatch(resendOtp(userData?.email));
                      setstep(3);
                    }}
                  >
                    Resend OTP
                  </a>
                </div>
              </div>
            )}

            {showTaxdetails === "Bank Details" && step == 3 && (
              <div className="udetail_container">
                <div className="uheader">
                  <a href="#" className="uback_button">
                    <span className="uback_arrow" onClick={() => setstep(2)}>
                      <FaArrowLeft />
                    </span>
                  </a>
                  <h1 className="uHeading mb-0">Edit Bank Details</h1>
                </div>

                <form onSubmit={editBankD.handleSubmit}>
                  <div className="uformGroup">
                    <label htmlFor="account-number">Bank Name</label>
                    <input
                      type="text"
                      id="account-number"
                      placeholder="Bank Name"
                      className="u_AcInput"
                      {...editBankD.getFieldProps("bankName")}
                    />
                    {editBankD.touched.bankName && editBankD.errors.bankName ? (
                      <div
                        className="error"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        {editBankD.errors.bankName}
                      </div>
                    ) : null}
                  </div>

                  <div className="uformGroup">
                    <label htmlFor="account-number">Account Number</label>
                    <input
                      type="text"
                      id="account-number"
                      placeholder="Account number"
                      className="u_AcInput"
                      {...editBankD.getFieldProps("accountNumber")}
                    />
                    {editBankD.touched.accountNumber &&
                    editBankD.errors.accountNumber ? (
                      <div
                        className="error"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        {editBankD.errors.accountNumber}
                      </div>
                    ) : null}
                  </div>

                  <div className="uformGroup">
                    <label htmlFor="confirm-account-number">
                      Confirm Account Number
                    </label>
                    <input
                      type="text"
                      id="confirm-account-number"
                      placeholder="Account number"
                      className="u_AcInput"
                      {...editBankD.getFieldProps("confirmAccountNumber")}
                    />
                    {editBankD.touched.confirmAccountNumber &&
                    editBankD.errors.confirmAccountNumber ? (
                      <div
                        className="error"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        {editBankD.errors.confirmAccountNumber}
                      </div>
                    ) : null}
                  </div>

                  <div className="uformGroup">
                    <div className="uifsc_info">
                      <label htmlFor="ifsc-code">IFSC Code</label>
                    </div>
                    <input
                      type="text"
                      id="ifsc-code"
                      placeholder="IFSC Code"
                      className="u_AcInput"
                      {...editBankD.getFieldProps("IFSCCode")}
                    />
                    {editBankD.touched.IFSCCode && editBankD.errors.IFSCCode ? (
                      <div
                        className="error"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        {editBankD.errors.IFSCCode}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="updateBtn"
                    onClick={setstep(1)}
                  >
                    Update
                  </button>
                </form>
              </div>
            )}

            {showTaxdetails === "editAddress" && (
              <div className="editA_container">
                <h1
                  className="editAhead"
                  style={{
                    fontWeight: "600",
                    fontSize: "20px",
                    marginBottom: "20px",
                    color: "#000",
                    padding: "20px 0px",
                  }}
                >
                  Edit Address
                </h1>

                <form onSubmit={addressFormik.handleSubmit}>
                  <div className="ueditAform_group">
                    <label className="uform_label">
                      Room/ Floor/ Building Number
                    </label>
                    <input
                      type="text"
                      className="uform_input"
                      id="buildingNumber"
                      {...addressFormik.getFieldProps("buildingNumber")}
                    />
                    {addressFormik.touched.buildingNumber &&
                    addressFormik.errors.buildingNumber ? (
                      <div
                        className="error"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        {addressFormik.errors.buildingNumber}
                      </div>
                    ) : null}
                  </div>

                  <div className="ueditAform_group">
                    <label className="uform_label">Street/ Locality</label>
                    <input
                      type="text"
                      className="uform_input"
                      id="locality"
                      {...addressFormik.getFieldProps("locality")}
                    />
                    {addressFormik.touched.locality &&
                    addressFormik.errors.locality ? (
                      <div
                        className="error"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        {addressFormik.errors.locality}
                      </div>
                    ) : null}
                  </div>

                  <div className="ueditAform_group">
                    <label className="uform_label">Landmark</label>
                    <input
                      type="text"
                      className="uform_input"
                      id="landmark"
                      {...addressFormik.getFieldProps("landmark")}
                    />
                    {addressFormik.touched.landmark &&
                    addressFormik.errors.landmark ? (
                      <div
                        className="error"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        {addressFormik.errors.landmark}
                      </div>
                    ) : null}
                  </div>

                  <div className="uform_row">
                    <div className="form-column flex-fill">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        className="uform_input"
                        id="pincode"
                        {...addressFormik.getFieldProps("pincode")}
                      />
                      {addressFormik.touched.pincode &&
                      addressFormik.errors.pincode ? (
                        <div
                          className="error"
                          style={{ color: "red", fontSize: "14px" }}
                        >
                          {addressFormik.errors.pincode}
                        </div>
                      ) : null}
                    </div>

                    <div className="uform_column flex-fill">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="uform_input"
                        id="city"
                        {...addressFormik.getFieldProps("city")}
                      />
                      {addressFormik.touched.city &&
                      addressFormik.errors.city ? (
                        <div
                          className="error"
                          style={{ color: "red", fontSize: "14px" }}
                        >
                          {addressFormik.errors.city}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="ueditAform_group">
                    <label className="uform_label">State</label>
                    <input
                      type="text"
                      className="uform_input"
                      id="state"
                      {...addressFormik.getFieldProps("state")}
                    />
                    {addressFormik.touched.state &&
                    addressFormik.errors.state ? (
                      <div
                        className="error"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        {addressFormik.errors.state}
                      </div>
                    ) : null}
                  </div>

                  <button type="submit" className="z_button px-5 mt-4">
                    Update
                  </button>
                </form>
              </div>
            )}

            {showTaxdetails === "deleteAccount" && (
              <div className="deleteA_container">
                <h1
                  className="deleteAhead"
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    color: "#000",
                    padding: "20px 0px",
                  }}
                >
                  Delete Account
                </h1>

                <p>When you deactivate your account</p>

                <ul className="udetail">
                  <li className="udetailText">
                    Your profile will be disabled.
                  </li>
                  <li className="udetailText">
                    You will lose access to your account.
                  </li>
                  <li className="udetailText">
                    You will be unsubscribed from receiving promotional emails
                    from Fastcart.
                  </li>
                </ul>

                <p className="uwarning">
                  This will make your account permanently unusable. you will not
                  be re-register the same user ID.
                </p>

                <p className="uirreversible">This action is irreversible.</p>

                <p className="upassword_instruction">
                  To continue, Please enter your password.
                </p>

                <form onSubmit={DeleteFormik.handleSubmit}>
                  <label className="upassword_label">Password</label>
                  <input
                    type="password"
                    className="upassword_input"
                    placeholder="Enter Password"
                    {...DeleteFormik.getFieldProps("currentPassword")}
                  />
                  {DeleteFormik.touched.currentPassword &&
                  DeleteFormik.errors.currentPassword ? (
                    <div
                      className="error"
                      style={{ color: "red", fontSize: "14px" }}
                    >
                      {DeleteFormik.errors.currentPassword}
                    </div>
                  ) : null}
                  <button className="z_button" type="submit">
                    Deactivate Account
                  </button>
                </form>
              </div>
            )}

            <Modal
              show={modalShow}
              onHide={() => setModalShow(false)}
              size="md"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <div className="udialog">
                <h2 className="utitle">Logout</h2>

                <p className="umessage">
                  Are you sure you want to <br></br> Logout Account?
                </p>

                <div className="ubuttons">
                  <button
                    className="ubtn ubtn_no"
                    onClick={() => setModalShow(false)}
                  >
                    No
                  </button>
                  <button
                    className="z_button ubtn"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("userId") + userLogout();
                    }}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
