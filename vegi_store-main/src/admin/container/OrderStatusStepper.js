import React, { useState, useEffect } from "react";
import { Check, Circle, X } from "lucide-react";

const OrderStatusStepper = ({
  orderStatus,
  statusUpdatedAt,
  orderCreatedAt,
}) => {
  
  const [steps, setSteps] = useState([]);

  const standardSteps = [
    {
      id: 1,
      title: "Order Confirmed",
      timestamp: null,
      completed: false,
    },
    {
      id: 2,
      title: "Shipped",
      timestamp: null,
      completed: false,
    },
    {
      id: 3,
      title: "outForDelivery",
      timestamp: null,
      completed: false,
    },
    {
      id: 4,
      title: "Delivered",
      timestamp: null,
      completed: false,
    },
  ];

 
  const getStepNumberFromStatus = (status) => {
    const statusMap = {
      Confirmed: 1,
      Shipped: 2,
      outForDelivery: 3,
      Delivered: 4 ,
    };

    return statusMap[status] || 1; 
  };

  
  useEffect(() => {
    if (!orderStatus) {
      setSteps(standardSteps);
      return;
    }

   
    if (orderStatus === "Cancelled") {
      
      const cancelledSteps = [
        {
          id: 1,
          title: "Order Confirmed",
          timestamp: orderCreatedAt
            ? formatTimestamp(new Date(orderCreatedAt))
            : null,
          completed: true,
        },
        {
          id: 2,
          title: "Under Progress",
          timestamp: null,
          completed: false,
        },
        {
          id: 3,
          title: "Shipped",
          timestamp: null,
          completed: false,
        },
        {
          id: 2,
          title: "Cancelled",
          timestamp: statusUpdatedAt
            ? formatTimestamp(new Date(statusUpdatedAt))
            : null,
          completed: true,
          isCancelled: true,
        },
      ];

      setSteps(cancelledSteps);
    } else {
      
      const currentStepNumber = getStepNumberFromStatus(orderStatus);

      const updatedSteps = standardSteps.map((step) => {
        const isCompleted = step.id <= currentStepNumber;
        let timestamp = null;

        if (isCompleted) {
          if (step.id === currentStepNumber && statusUpdatedAt) {
            timestamp = formatTimestamp(new Date(statusUpdatedAt));
          } else if (step.id === 1 && orderCreatedAt) {
            timestamp = formatTimestamp(new Date(orderCreatedAt));
          } else {
            timestamp = "Status completed";
          }
        }

        return {
          ...step,
          completed: isCompleted,
          timestamp,
        };
      });

      setSteps(updatedSteps);
    }
  }, [orderStatus, statusUpdatedAt, orderCreatedAt]);

  // Format timestamp in "MMM DD, YYYY hh:mm AM/PM" format
  const formatTimestamp = (date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="k-status-container mb-4 mt-4 mt-xl-0">
      <div className="k-status-box">
        <div className="k-status-steper">
          <div className="card k-order-stepper">
            <div className="card-header k-card-header">
              <p className="card-title k-card-title m-0">Order Status</p>
            </div>
            <div className="card-body k-card-body">
              <div className="k-stepper-container">
                <div className="k-vertical-line"></div>
                <div className="k-steps-container">
                  {steps.map((step) => (
                    <div key={step.id} className="k-step-item">
                      <div
                        className={`k-step-indicator ${
                          step.completed
                            ? step.isCancelled
                              ? "k-cancelled"
                              : "k-completed"
                            : ""
                        }`}
                      >
                        {step.completed ? (
                          step.isCancelled ? (
                            <X
                              className="k-cancel-icon"
                              style={{ color: "red" }}
                            />
                          ) : (
                            <Check className="k-check-icon" />
                          )
                        ) : (
                          <Circle className="k-circle-icon" />
                        )}
                      </div>
                      <div className="k-step-content">
                        <div
                          className={`k-step-title ${
                            step.isCancelled ? "text-danger" : ""
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="k-step-timestamp">{step.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusStepper;
