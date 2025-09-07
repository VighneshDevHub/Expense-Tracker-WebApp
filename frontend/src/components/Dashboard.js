import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import ExpenseService from '../services/ExpenseService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await ExpenseService.getAllExpenses();
      const expenseData = response.data;
      setExpenses(expenseData);
      
      // Calculate total expense
      const total = expenseData.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      setTotalExpense(total);
      
      // Process data for category chart
      processCategoryData(expenseData);
      
      // Process data for monthly chart
      processMonthlyData(expenseData);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch expense data. Please try again later.');
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const processCategoryData = (expenseData) => {
    const categoryAmounts = {};
    
    expenseData.forEach(expense => {
      const category = expense.category;
      const amount = parseFloat(expense.amount);
      
      if (categoryAmounts[category]) {
        categoryAmounts[category] += amount;
      } else {
        categoryAmounts[category] = amount;
      }
    });
    
    setCategoryData({
      labels: Object.keys(categoryAmounts),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(categoryAmounts),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5'
          ],
          borderWidth: 1,
        },
      ],
    });
  };

  const processMonthlyData = (expenseData) => {
    const monthlyAmounts = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize all months with zero
    months.forEach(month => {
      monthlyAmounts[month] = 0;
    });
    
    // Group expenses by month
    expenseData.forEach(expense => {
      const date = new Date(expense.date);
      const month = months[date.getMonth()];
      const amount = parseFloat(expense.amount);
      
      monthlyAmounts[month] += amount;
    });
    
    setMonthlyData({
      labels: months,
      datasets: [
        {
          label: 'Monthly Expenses',
          data: Object.values(monthlyAmounts),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  const getRecentExpenses = () => {
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={4}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <Card.Title>Total Expenses</Card.Title>
              <h2 className="text-primary">${totalExpense.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <Card.Title>Number of Expenses</Card.Title>
              <h2 className="text-success">{expenses.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card text-center">
            <Card.Body>
              <Card.Title>Average Expense</Card.Title>
              <h2 className="text-info">
                ${expenses.length > 0 ? (totalExpense / expenses.length).toFixed(2) : '0.00'}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={6}>
          <Card className="chart-container">
            <Card.Body>
              <Card.Title>Expenses by Category</Card.Title>
              {Object.keys(categoryData).length > 0 ? (
                <Pie data={categoryData} options={{ responsive: true }} />
              ) : (
                <p className="text-center text-muted">No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="chart-container">
            <Card.Body>
              <Card.Title>Monthly Expenses</Card.Title>
              {Object.keys(monthlyData).length > 0 ? (
                <Bar 
                  data={monthlyData} 
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Amount ($)'
                        }
                      }
                    }
                  }} 
                />
              ) : (
                <p className="text-center text-muted">No data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Expenses</Card.Title>
              {expenses.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRecentExpenses().map(expense => (
                        <tr key={expense.id}>
                          <td>{expense.description}</td>
                          <td>${parseFloat(expense.amount).toFixed(2)}</td>
                          <td>{expense.category}</td>
                          <td>{formatDate(expense.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted">No expenses recorded yet</p>
              )}
              <div className="text-end mt-3">
                <Link to="/expenses" className="btn btn-primary">View All Expenses</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;