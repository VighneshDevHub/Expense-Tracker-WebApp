import axios from 'axios';

const API_URL = '/api/expenses';

class ExpenseService {
  getAllExpenses() {
    return axios.get(API_URL);
  }

  getExpenseById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  createExpense(expense) {
    return axios.post(API_URL, expense);
  }

  updateExpense(id, expense) {
    return axios.put(`${API_URL}/${id}`, expense);
  }

  deleteExpense(id) {
    return axios.delete(`${API_URL}/${id}`);
  }

  getExpensesByCategory(category) {
    return axios.get(`${API_URL}/category/${category}`);
  }

  getExpensesByDateRange(startDate, endDate) {
    return axios.get(`${API_URL}/date-range?startDate=${startDate}&endDate=${endDate}`);
  }

  getExpensesByCategoryAndDateRange(category, startDate, endDate) {
    return axios.get(`${API_URL}/category/${category}/date-range?startDate=${startDate}&endDate=${endDate}`);
  }
}

export default new ExpenseService();