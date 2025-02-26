import { useState, useEffect } from 'react';

export default function ExpenseForm({ expense, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const value = e.target.name === 'amount' 
      ? parseFloat(e.target.value) || ''
      : e.target.value;
    
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div>
        <input
          id="description"
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <input
          id="amount"
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          <option value="">Select a category</option>
          <option value="Food">🍽️ Food</option>
          <option value="Transportation">🚗 Transportation</option>
          <option value="Entertainment">🎮 Entertainment</option>
          <option value="Utilities">🔧 Utilities</option>
          <option value="Shopping">🛍️ Shopping</option>
          <option value="Other">📦 Other</option>
        </select>
      </div>

      <div>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full transition-colors border border-primary/20 shadow-sm"
        >
          {expense ? 'Update' : 'Add'} Expense
        </button>
        {expense && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-200 transition-colors border border-gray-300 shadow-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
