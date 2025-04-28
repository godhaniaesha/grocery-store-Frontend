import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  dashBoard,
  dashRecentOrder,
  dashSalesByCategory,
  dashSatatistics,
  getAlldataseller,
} from "../../redux/slices/sellerDashboard";

// const salesData = [
//   {
//     name: "Leafy",
//     value: 148,
//     color: "linear-gradient(241.18deg, #EBB6CA 57.24%, #FF4F91 21.56%)",
//   },
//   {
//     name: "Seasonal",
//     value: 67,
//     color: "linear-gradient(141.26deg, #AFDDF4 58.97%, #4BC4FF 81.15%)",
//   },
//   {
//     name: "Certified Organic",
//     value: 60,
//     color: "linear-gradient(221.06deg, #89CD5B 68.72%, #D2E7C4 47.29%,)",
//   },
//   {
//     name: "Root",
//     value: 36,
//     color: "linear-gradient(255.51deg, #FFFFFF 45.59%, #FF8F53 85.78%)",
//   },
//   {
//     name: "Hydroponic",
//     value: 21,
//     color: "linear-gradient(166.02deg, #4E5EB2 24%, #B4C2D4 89.17%)",
//   },
// ];

const Home = () => {
  const dispatch = useDispatch();
  const dash = useSelector((state) => state.sellerDashboard.dashBoard);
  const dashTable = useSelector((state) => state.sellerDashboard.recentOrder);
  const salesByCategory = useSelector(
    (state) => state.sellerDashboard.salesByCategory
  );
  const statistics = useSelector((state) => state.sellerDashboard.statistics);
  const sellerData = useSelector(
    (state) => state.sellerDashboard.getdataseller
  );
  console.log("sellerData", sellerData);

  const chartData =
    statistics?.["2025"]?.map((item) => ({
      date: item.month.substring(0, 3),
      revenue: item.revenue,
    })) || [];

  // const Beta  = [
  //   { month: "Jan", revenue: 800 },
  //   { month: "Feb", revenue: 850 },
  //   { month: "Mar", revenue: 950 },
  //   { month: "Apr", revenue: 870 },
  //   { month: "May", revenue: 1000 },
  //   { month: "Jun", revenue: 970 },
  //   { month: "Jul", revenue: 1100 },
  //   { month: "Aug", revenue: 1020 },
  //   { month: "Sep", revenue: 1300 },
  //   { month: "Oct", revenue: 980 },
  //   { month: "Nov", revenue: 890 },
  //   { month: "Dec", revenue: 920 },
  // ];

  useEffect(() => {
    dispatch(dashBoard());
    dispatch(dashRecentOrder());
    dispatch(dashSalesByCategory());
    dispatch(dashSatatistics());
    dispatch(getAlldataseller());
  }, []);

  const colorMapping = {
    Leafy: "linear-gradient(241.18deg, #EBB6CA 57.24%, #FF4F91 21.56%)",
    Seasonal: "linear-gradient(141.26deg, #AFDDF4 58.97%, #4BC4FF 81.15%)",
    "Certified Organic":
      "linear-gradient(221.06deg, #89CD5B 68.72%, #D2E7C4 47.29%,)",
    Root: "linear-gradient(255.51deg, #FFFFFF 45.59%, #FF8F53 85.78%)",
    Hydroponic: "linear-gradient(166.02deg, #4E5EB2 24%, #B4C2D4 89.17%)",
    Vegetables:
      "background: linear-gradient(221.06deg, #D2E7C4 47.29%, #89CD5B 68.72%)",
    CertifiedOrganic:
      "background: linear-gradient(166.02deg, #4E5EB2 24%, #B4C2D4 89.17%)",
  };

  const salesData = salesByCategory?.map((item) => ({
    name: item.categoryName,
    value: item.totalSales,
    color: colorMapping[item.categoryName],
  }));

  const totalValue = salesData?.reduce((sum, item) => sum + item.value, 0);

  const formattedDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString)
      .toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  };

  return (
    <>
      <div style={{ backgroundColor: "#f9f9f9" }}>
        <h4
          className="m-0"
          style={{ padding: "20px 30px", fontFamily: "Inter,sans-serif" }}
        >
          Dashboard
        </h4>
        <div className="ustats_container">
          <div className="ustat_box">
            <div className="text_start">
              <div className="ustat_title">Orders</div>
              <div className="ustat_number">{sellerData?.totalOrders}</div>
              {/* <div className="ustat_change uincrease">
                ▲ {dash?.growth?.orders}%
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
                  d="M18.8125 3.625H17.0477C16.713 2.67925 15.8095 2 14.75 2C13.6905 2 12.787 2.67925 12.4506 3.625H10.6875C10.239 3.625 9.875 3.989 9.875 4.4375V7.6875C9.875 8.136 10.239 8.5 10.6875 8.5H18.8125C19.261 8.5 19.625 8.136 19.625 7.6875V4.4375C19.625 3.989 19.261 3.625 18.8125 3.625Z"
                  fill="url(#paint0_linear_492_6427)"
                />
                <path
                  d="M22.875 5.25H21.25V7.6875C21.25 9.03137 20.1564 10.125 18.8125 10.125H10.6875C9.34363 10.125 8.25 9.03137 8.25 7.6875V5.25H6.625C5.72962 5.25 5 5.97962 5 6.875V26.375C5 27.2866 5.71338 28 6.625 28H22.875C23.7866 28 24.5 27.2866 24.5 26.375V6.875C24.5 5.96338 23.7866 5.25 22.875 5.25ZM14.5128 19.6378L11.2628 22.8878C11.1099 23.0397 10.9031 23.125 10.6875 23.125C10.4719 23.125 10.2651 23.0397 10.1122 22.8878L8.48725 21.2628C8.17037 20.9459 8.17037 20.4308 8.48725 20.1139C8.80412 19.797 9.31925 19.797 9.63613 20.1139L10.6875 21.1636L13.3622 18.4889C13.6791 18.172 14.1943 18.172 14.5111 18.4889C14.828 18.8058 14.8296 19.3193 14.5128 19.6378ZM14.5128 13.1378L11.2628 16.3878C11.1099 16.5397 10.9031 16.625 10.6875 16.625C10.4719 16.625 10.2651 16.5397 10.1122 16.3878L8.48725 14.7628C8.17037 14.4459 8.17037 13.9307 8.48725 13.6139C8.80412 13.297 9.31925 13.297 9.63613 13.6139L10.6875 14.6636L13.3622 11.9889C13.6791 11.672 14.1943 11.672 14.5111 11.9889C14.828 12.3057 14.8296 12.8193 14.5128 13.1378ZM20.4375 21.5H17.1875C16.739 21.5 16.375 21.136 16.375 20.6875C16.375 20.239 16.739 19.875 17.1875 19.875H20.4375C20.886 19.875 21.25 20.239 21.25 20.6875C21.25 21.136 20.886 21.5 20.4375 21.5ZM20.4375 15H17.1875C16.739 15 16.375 14.636 16.375 14.1875C16.375 13.739 16.739 13.375 17.1875 13.375H20.4375C20.886 13.375 21.25 13.739 21.25 14.1875C21.25 14.636 20.886 15 20.4375 15Z"
                  fill="url(#paint1_linear_492_6427)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_492_6427"
                    x1="14.75"
                    y1="2"
                    x2="14.75"
                    y2="8.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0C6C44" />
                    <stop offset="1" stopColor="#479529" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_492_6427"
                    x1="14.75"
                    y1="5.25"
                    x2="14.75"
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

          <div className="ustat_box">
            <div className="text-start">
              <div className="ustat_title">Products</div>
              <div className="ustat_number">{dash?.totalProducts}</div>
              {/* <div className="ustat_change uincrease">
                ▲ {dash?.growth?.products}%
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
                <g clipPath="url(#clip0_492_6441)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.194 12.0349L11.567 11.0963L15.7138 8.70132L17.3407 9.64057L13.194 12.0349ZM18.6817 10.4151L20.3099 11.3549V13.9455C20.3099 14.0042 20.3215 14.0623 20.3439 14.1165C20.3664 14.1707 20.3993 14.22 20.4408 14.2615C20.4823 14.303 20.5316 14.3359 20.5858 14.3584C20.64 14.3809 20.6982 14.3924 20.7568 14.3924C20.8155 14.3924 20.8737 14.3809 20.9279 14.3584C20.9821 14.3359 21.0314 14.303 21.0729 14.2615C21.1144 14.22 21.1473 14.1707 21.1698 14.1165C21.1922 14.0623 21.2038 14.0042 21.2038 13.9455V11.8708L22.8287 12.8093V17.5978L18.682 15.2036L18.6817 10.4151ZM23.2754 12.0349L27.423 9.64064L25.7963 8.70138L21.6495 11.0964L23.2754 12.0349ZM23.2754 7.24638L19.1287 9.64064L20.7556 10.5798L24.9023 8.18557L23.2754 7.24638ZM13.194 7.24638L9.04722 9.64064L10.6734 10.5798L14.821 8.18557L13.194 7.24638ZM8.60002 10.4151V15.2036L12.7468 17.5979V12.8094L11.1216 11.8708V13.9455C11.1223 14.0046 11.1113 14.0633 11.0891 14.1181C11.067 14.173 11.0342 14.2228 10.9926 14.2649C10.951 14.307 10.9015 14.3404 10.847 14.3632C10.7924 14.3859 10.7339 14.3977 10.6747 14.3977C10.6156 14.3977 10.557 14.3859 10.5025 14.3632C10.4479 14.3404 10.3984 14.307 10.3568 14.2649C10.3153 14.2228 10.2825 14.173 10.2603 14.1181C10.2382 14.0633 10.2271 14.0046 10.2278 13.9455V11.3549L8.60002 10.4151ZM13.6409 17.5979L17.7876 15.2036V10.4151L13.6409 12.8094V17.5979ZM23.7225 17.5979V12.8094L27.87 10.4151V15.2036L23.7225 17.5979ZM18.1721 7.57769C17.4228 7.57758 16.6903 7.35529 16.0673 6.93891C15.4443 6.52254 14.9588 5.93079 14.6721 5.23849C14.3854 4.54618 14.3104 3.78441 14.4566 3.0495C14.6029 2.31458 14.9637 1.63953 15.4936 1.10968C16.0234 0.579844 16.6985 0.219012 17.4334 0.0728153C18.1683 -0.0733818 18.9301 0.00162074 19.6224 0.288339C20.3147 0.575058 20.9064 1.06062 21.3228 1.68362C21.7391 2.30662 21.9614 3.03909 21.9615 3.78841C21.9605 4.79311 21.5609 5.75637 20.8505 6.46681C20.1401 7.17724 19.1768 7.57668 18.1721 7.57769ZM16.5012 4.11904L17.3951 5.01226C17.4789 5.09608 17.5926 5.14317 17.7111 5.14317C17.8297 5.14317 17.9434 5.09608 18.0272 5.01226L19.843 3.19651C19.9254 3.1124 19.9713 2.99917 19.9707 2.88143C19.9701 2.76369 19.923 2.65094 19.8398 2.56768C19.7565 2.48441 19.6438 2.43736 19.5261 2.43673C19.4083 2.4361 19.2951 2.48195 19.2109 2.56432L17.7115 4.06412L17.1336 3.48697C17.0498 3.40315 16.9361 3.35607 16.8176 3.35608C16.699 3.35608 16.5853 3.40318 16.5015 3.487C16.4177 3.57083 16.3706 3.68452 16.3706 3.80306C16.3706 3.9216 16.4174 4.03523 16.5012 4.11904ZM9.18236 28.9558C9.16266 29.0309 9.12831 29.1013 9.08129 29.163C9.03427 29.2247 8.9755 29.2765 8.90838 29.3154L6.88573 30.4831L3 23.7529L5.02265 22.5851C5.15847 22.5074 5.31947 22.4865 5.4706 22.527C5.62174 22.5674 5.75079 22.6659 5.82966 22.8011L9.12485 28.5078C9.16339 28.5751 9.18831 28.6493 9.19817 28.7262C9.20802 28.8031 9.20269 28.881 9.18236 28.9558ZM27.4888 22.3571C27.508 21.9958 27.2883 21.6357 26.9174 21.4161C26.6658 21.268 25.9839 20.9832 25.0772 21.5457C25.0702 21.5503 25.063 21.5546 25.0556 21.5584L19.6508 24.5031C18.6331 25.261 16.5836 25.1173 13.3867 24.0645C13.3307 24.0464 13.2787 24.0174 13.2339 23.9791C13.1891 23.9409 13.1523 23.8941 13.1256 23.8416C13.0989 23.7891 13.0828 23.7318 13.0784 23.673C13.0739 23.6143 13.0811 23.5552 13.0995 23.4993C13.1179 23.4433 13.1472 23.3915 13.1857 23.3469C13.2242 23.3024 13.2712 23.2658 13.3239 23.2394C13.3765 23.213 13.4339 23.1973 13.4927 23.1932C13.5515 23.189 13.6105 23.1966 13.6663 23.2153C15.2938 23.7516 16.4629 23.998 17.3031 24.0702C17.9135 23.7497 18.2558 23.4081 18.2685 23.1049C18.2826 22.7697 17.911 22.3412 17.2482 21.9301C15.3053 20.7233 11.613 20.0603 10.4229 20.7021C10.3124 20.7691 9.08912 21.5059 6.8832 22.8384L9.52268 27.4101L9.82911 27.214C10.0759 27.0544 10.2269 27.0033 10.5148 27.1042C10.5499 27.117 10.5895 27.1303 10.6451 27.1457L15.8755 28.5829C15.8851 28.5855 15.8953 28.5886 15.9048 28.5919C16.8153 28.9098 17.618 28.8383 18.3579 28.3716C18.3606 28.3703 18.3632 28.3688 18.3656 28.3671L26.4359 23.5006C26.4503 23.4919 26.4653 23.484 26.4806 23.477C27.1082 23.1891 27.4665 22.7913 27.4888 22.3571ZM5.7582 24.6506L5.23986 23.7535C5.21051 23.7027 5.17145 23.6582 5.12489 23.6225C5.07834 23.5868 5.0252 23.5606 4.96853 23.5454C4.91185 23.5302 4.85274 23.5264 4.79457 23.5341C4.7364 23.5417 4.68032 23.5608 4.62951 23.5901C4.57871 23.6195 4.53418 23.6585 4.49847 23.7051C4.46276 23.7516 4.43658 23.8048 4.4214 23.8615C4.40623 23.9181 4.40237 23.9772 4.41004 24.0354C4.41771 24.0936 4.43676 24.1497 4.46611 24.2005L4.9839 25.0975C5.02309 25.1656 5.07955 25.2222 5.14759 25.2616C5.21562 25.3009 5.29283 25.3216 5.37142 25.3216C5.44986 25.3213 5.52687 25.3007 5.59493 25.2617C5.69739 25.2021 5.77209 25.1043 5.80269 24.9898C5.83328 24.8753 5.81729 24.7533 5.7582 24.6506Z"
                    fill="url(#paint0_linear_492_6441)"
                  />
                </g>
                <defs>
                  <linearGradient
                    id="paint0_linear_492_6441"
                    x1="15.435"
                    y1="0"
                    x2="15.435"
                    y2="30.4831"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0C6C44" />
                    <stop offset="1" stopColor="#479529" />
                  </linearGradient>
                  <clipPath id="clip0_492_6441">
                    <rect width="30" height="30" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <div className="udivider"></div>

          <div className="ustat_box">
            <div className="text-start">
              <div className="ustat_title">Canceled Orders</div>
              <div className="ustat_number">{sellerData?.cancelledOrders}</div>
              {/* <div className="ustat_change udecrease">
                ▼ {dash?.growth?.cancelOrder}%
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
                  d="M14.1066 13.9376L3.32531 9.3981C3.17086 9.33304 3 9.44647 3 9.6141V21.75C2.99999 21.8999 3.04491 22.0463 3.12895 22.1705C3.21298 22.2946 3.33229 22.3907 3.47147 22.4463L13.9286 26.6292C14.0825 26.6908 14.25 26.5774 14.25 26.4116V14.1536C14.25 14.1074 14.2364 14.0624 14.2109 14.0239C14.1853 13.9855 14.1491 13.9555 14.1066 13.9376ZM15.0909 12.6479L25.512 8.26016C25.6993 8.18132 25.7043 7.91769 25.5201 7.83177L15.3172 3.07035C15.2178 3.02401 15.1096 3 15 3C14.8904 3 14.7822 3.02401 14.6828 3.07035L4.47989 7.83172C4.29572 7.91765 4.30073 8.18127 4.48805 8.26012L14.9091 12.6479C14.9672 12.6724 15.0328 12.6724 15.0909 12.6479ZM21.75 15C23.7333 15 25.5193 15.8601 26.7553 17.2265C26.8417 17.322 27 17.2613 27 17.1326V9.6141C27 9.44647 26.8291 9.33304 26.6747 9.3981L15.8934 13.9376C15.8509 13.9555 15.8146 13.9855 15.7891 14.0239C15.7636 14.0623 15.75 14.1074 15.75 14.1536V18.1283C15.75 18.2698 15.9352 18.3225 16.0097 18.2023C17.201 16.2817 19.3285 15 21.75 15Z"
                  fill="url(#paint0_linear_492_6454)"
                />
                <path
                  d="M21.75 16.5C18.8551 16.5 16.5 18.8551 16.5 21.75C16.5 24.6449 18.8551 27 21.75 27C24.6449 27 27 24.6449 27 21.75C27 18.8551 24.6449 16.5 21.75 16.5ZM23.4053 22.3447C23.6982 22.6376 23.6982 23.1124 23.4053 23.4053C23.2589 23.5518 23.067 23.625 22.875 23.625C22.683 23.625 22.4911 23.5518 22.3447 23.4053L21.75 22.8106L21.1553 23.4053C21.0089 23.5518 20.817 23.625 20.625 23.625C20.433 23.625 20.2411 23.5518 20.0947 23.4053C19.8018 23.1124 19.8018 22.6376 20.0947 22.3447L20.6894 21.75L20.0947 21.1553C19.8018 20.8624 19.8018 20.3876 20.0947 20.0947C20.3876 19.8018 20.8625 19.8018 21.1553 20.0947L21.75 20.6893L22.3447 20.0946C22.6376 19.8017 23.1125 19.8017 23.4053 20.0946C23.6983 20.3875 23.6983 20.8624 23.4053 21.1553L22.8106 21.75L23.4053 22.3447Z"
                  fill="url(#paint1_linear_492_6454)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_492_6454"
                    x1="15"
                    y1="3"
                    x2="15"
                    y2="26.6462"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0C6C44" />
                    <stop offset="1" stopColor="#479529" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_492_6454"
                    x1="21.75"
                    y1="16.5"
                    x2="21.75"
                    y2="27"
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

          <div className="ustat_box">
            <div className="text-start">
              <div className="ustat_title">Total Delivered</div>
              <div className="ustat_number">{sellerData?.deliveredOrders}</div>
              {/* <div className="ustat_change uincrease">
                ▲ {dash?.growth?.deliveredOrders}%
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
                  d="M21.8284 16.4062C18.3562 16.4062 15.5312 19.2311 15.5312 22.7032C15.5312 26.1753 18.3562 29.0001 21.8284 29.0001C25.3006 29.0001 28.1255 26.1753 28.1255 22.7032C28.1255 19.2311 25.3006 16.4062 21.8284 16.4062ZM21.0928 25.3418L18.7232 22.9963L19.8789 21.8289L21.0836 23.0215L23.7732 20.3171L24.9379 21.4754L21.0928 25.3418Z"
                  fill="url(#paint0_linear_492_6468)"
                />
                <path
                  d="M14.1076 1L2 7.99017V21.9705L14.1076 28.9607L15.8705 27.9429C15.5059 27.5291 15.1851 27.0786 14.9135 26.5987L14.1076 27.0639L13.2863 26.5897V15.4545L3.64273 9.88697V8.93854L4.46409 8.46433L14.1076 14.0319L18.108 11.7223L8.46449 6.15478L10.1072 5.2064L19.7508 10.7739L23.7512 8.46433L24.5725 8.93854V9.88697L14.929 15.4545V18.7754C16.2975 16.3797 18.8774 14.7613 21.8284 14.7613C23.4491 14.7613 24.9576 15.2498 26.2153 16.0866V7.99017L14.1076 1Z"
                  fill="url(#paint1_linear_492_6468)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_492_6468"
                    x1="21.8284"
                    y1="16.4062"
                    x2="21.8284"
                    y2="29.0001"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#0C6C44" />
                    <stop offset="1" stopColor="#479529" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_492_6468"
                    x1="14.1077"
                    y1="1"
                    x2="14.1077"
                    y2="28.9607"
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
          className="wd d-xxl-flex justify-content-center"
          style={{
            fontFamily: "Inter,sans-serif",
            gap: "20px",
          }}
        >
          <div className="uset_content">
            <div className="uset_w">
              <h1
                className="m-0"
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  padding: "20px 30px",
                  fontSize: "18px",
                }}
              >
                Sales by Category
              </h1>
              <PieChart width={300} height={300}>
                <defs>
                  {salesData?.map((entry, index) => {
                    const startColor =
                      entry.color?.match(/#[0-9A-Fa-f]{6}/g)[0];
                    const endColor = entry.color?.match(/#[0-9A-Fa-f]{6}/g)[1];
                    return (
                      <linearGradient
                        key={`gradient-${index}`}
                        id={`gradient-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor={startColor} />
                        <stop offset="100%" stopColor={endColor} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <Pie
                  data={salesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                  label={({ value }) =>
                    `${((value / totalValue) * 100).toFixed(2)}%`
                  }
                >
                  {salesData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#gradient-${index})`}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            <div className="usetdetail_w">
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "25px",
                }}
              >
                Category
              </h2>
              {salesData?.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: item.color,
                        marginRight: "8px",
                      }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <span>{((item.value / totalValue) * 100).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
              margin: "auto",
              padding: "20px",
              backgroundColor: "white",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Statistics (2024)
            </h2>
            <p style={{ color: "#666", marginBottom: "10px" }}>Revenue</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#0C6C44" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#395692" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0} />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value ?? 0}`, "Revenue"]} />

                <Legend verticalAlign="top" iconType="circle" height={36} />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#166534"
                  strokeWidth={2}
                  fill="url(#colorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="uorder_table_container px-4">
          <h4
            className="m-0 uthead ps-0"
            style={{
              padding: "20px 30px",
              fontWeight: "500",
              fontSize: "18px",
            }}
          >
            Recent Order
          </h4>
          <table>
            <thead>
              <tr>
                <th style={{ backgroundColor: "#F3F9FB" }}>Order ID</th>
                <th style={{ backgroundColor: "#F3F9FB" }}>Customer name</th>
                <th style={{ backgroundColor: "#F3F9FB" }}>Date & Time</th>
                <th style={{ backgroundColor: "#F3F9FB" }}>Payment Method</th>
                <th style={{ backgroundColor: "#F3F9FB" }}>Amount</th>
                <th style={{ backgroundColor: "#F3F9FB" }}>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {sellerData?.data?.slice(0, 10).map((sellerData, index) => {
                let orderColor;
                if (sellerData.orderStatus == "Pending") {
                  orderColor = "sp_btn_yellow";
                }
                if (sellerData.orderStatus == "Confirmed") {
                  orderColor = "sp_btn_green";
                }
                if (sellerData.orderStatus == "Shipped") {
                  orderColor = "sp_btn_green";
                }
                if (sellerData.orderStatus == "outForDelivery") {
                  orderColor = "sp_btn_red";
                }
                if (sellerData.orderStatus == "Delivered") {
                  orderColor = "sp_btn_green";
                }
                if (sellerData.orderStatus == "Cancelled") {
                  orderColor = "sp_btn_red";
                }
                return (
                  <tr key={sellerData._id.sellerData}>
                    <td>{index + 1}</td>
                    <td>
                      {sellerData.useraddress.firstName}{" "}
                      {sellerData.useraddress.lastName}
                    </td>
                    <td>{formattedDate(sellerData.createdAt)}</td>
                    <td> {sellerData.paymentMethod}</td>
                    <td>${sellerData.totalPrice}</td>
                    <td>
                      <span className={`${orderColor} ustatus`}>
                        {sellerData.orderStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Home;
