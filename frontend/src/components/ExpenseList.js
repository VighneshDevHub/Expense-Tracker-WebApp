import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ExpenseService from '../services/ExpenseService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await ExpenseService.getAllExpenses();
      setExpenses(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(expense => expense.category))];
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch expenses. Please try again later.');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await ExpenseService.deleteExpense(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
      } catch (err) {
        setError('Failed to delete expense. Please try again later.');
        console.error('Error deleting expense:', err);
      }
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      let response;
      
      if (filterCategory && startDate && endDate) {
        // Filter by category and date range
        response = await ExpenseService.getExpensesByCategoryAndDateRange(
          filterCategory,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
      } else if (startDate && endDate) {
        // Filter by date range only
        response = await ExpenseService.getExpensesByDateRange(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
      } else if (filterCategory) {
        // Filter by category only
        response = await ExpenseService.getExpensesByCategory(filterCategory);
      } else {
        // No filters, get all expenses
        response = await ExpenseService.getAllExpenses();
      }
      
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to filter expenses. Please try again later.');
      console.error('Error filtering expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterCategory('');
    setStartDate(null);
    setEndDate(null);
    fetchExpenses();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div>
      <h2 className="page-title">Expense List</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Filter Expenses</Card.Title>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select start date"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="form-control"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select end date"
                />
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end mb-3">
              <Button variant="primary" onClick={handleFilter} className="me-2">
                Apply Filters
              </Button>
              <Button variant="secondary" onClick={clearFilters}>
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {expenses.length === 0 ? (
            <div className="alert alert-info">No expenses found. Add some expenses to get started!</div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</td>
                    <td className="expense-category">{expense.category}</td>
                    <td className="expense-date">{formatDate(expense.date)}</td>
                    <td>{expense.notes || '-'}</td>
                    <td>
                      <Link to={`/edit-expense/${expense.id}`} className="btn btn-sm btn-primary me-2">
                        Edit
                      </Link>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          
          <div className="d-flex justify-content-end">
            <Link to="/add-expense" className="btn btn-success">
              Add New Expense
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseList;