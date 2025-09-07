import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExpenseService from '../services/ExpenseService';

const EditExpense = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date(),
    notes: ''
  });
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await ExpenseService.getExpenseById(id);
        const expense = response.data;
        
        setInitialValues({
          ...expense,
          date: new Date(expense.date)
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch expense details. Please try again later.');
        console.error('Error fetching expense:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  const validationSchema = Yup.object({
    description: Yup.string()
      .required('Description is required')
      .min(3, 'Description must be at least 3 characters')
      .max(255, 'Description must be at most 255 characters'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive'),
    category: Yup.string()
      .required('Category is required'),
    date: Yup.date()
      .required('Date is required'),
    notes: Yup.string()
      .max(500, 'Notes must be at most 500 characters')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await ExpenseService.updateExpense(id, values);
      setSuccess(true);
      setError(null);
      
      // Redirect to expense list after 2 seconds
      setTimeout(() => {
        navigate('/expenses');
      }, 2000);
    } catch (err) {
      setError('Failed to update expense. Please try again.');
      console.error('Error updating expense:', err);
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 
    'Healthcare', 'Education', 'Shopping', 'Personal Care', 'Travel', 'Other'
  ];

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
      <h2 className="page-title">Edit Expense</h2>
      
      {success && (
        <Alert variant="success">
          Expense updated successfully! Redirecting to expense list...
        </Alert>
      )}
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="form-container">
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="amount"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.amount && errors.amount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.amount}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.category && errors.category}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <DatePicker
                    selected={values.date}
                    onChange={date => setFieldValue('date', date)}
                    className={`form-control ${touched.date && errors.date ? 'is-invalid' : ''}`}
                    dateFormat="yyyy-MM-dd"
                  />
                  {touched.date && errors.date && (
                    <div className="invalid-feedback d-block">
                      {errors.date}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.notes && errors.notes}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.notes}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate('/expenses')}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Expense'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditExpense;