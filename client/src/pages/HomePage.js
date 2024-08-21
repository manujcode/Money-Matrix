import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker,ConfigProvider} from "antd";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Analytics from "./Analytics";
const dayjs = require("dayjs");
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransactions] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{dayjs(text).format("YYYY-MM-DD").toUpperCase()}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => <span>{text.toString().toUpperCase()}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text) => <span>{text.toUpperCase()}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text) => <span>{text.toUpperCase()}</span>,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text) => <span>{text.toUpperCase()}</span>,
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];
  

  //get all transactions
  const getAllTransactions = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post("/api/v1/transactions/get-transaction",
        {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        }
      );
      setLoading(false);
      setAllTransactions(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
      message.error("Fetch issue with transaction: " + error.message);
    }
  }, [frequency, selectedDate, type]);

  //useEffect Hook
  useEffect(() => {
    getAllTransactions();
  }, [getAllTransactions]);

  //delete handler
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/v1/transactions/delete-transaction", {
        transactionid: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted!");
      getAllTransactions();
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Unable to delete");
    }
  };

  //form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post(
          "/api/v1/transactions/edit-transaction",
          {
            payload: {
              ...values,
              userid: user._id,
            },
            transactionId: editable._id,
          }
        );
        setLoading(false);
        message.success("Transaction updated successfully");
      } else {
        await axios.post("/api/v1/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction added successfully");
      }
      setShowModal(false);
      setEditable(null);
      getAllTransactions();
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transaction");
    }
  };
  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select  className="custom-select" value={frequency} onChange={(values) => setFrequency(values)} >
            <Select.Option value="7" >LAST 1 WEEK</Select.Option>
            <Select.Option value="30">LAST 1 MONTH</Select.Option>
            <Select.Option value="365">LAST 1 YEAR</Select.Option>
            <Select.Option value="custom">CUSTOM</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>
        <div className="filter-tab ">
          <h6>Select Type</h6>
          
          <Select value={type} onChange={(values) => setType(values)} className="custom-select" >
            <Select.Option value="all">ALL</Select.Option>
            <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option>
          </Select>
        </div>
        <div className="switch-icons mt-2">
          <UnorderedListOutlined
            className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>
          <button className="btn btn-dark" onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>
      <div className="content ">
        {viewData === "table" ? (
          <Table
            columns={columns}
            dataSource={allTransaction}
            rowClassName={() => 'custom-row'}
            className="custom-table "
            pagination={{ className: 'custom-pagination' }} 
          />
        ) : (
          <Analytics allTransaction={allTransaction} />
        )}
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
        >
          <Form.Item label="Amount" name="amount">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="tax">TAX</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" required />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-dark">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
