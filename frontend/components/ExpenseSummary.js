export default function ExpenseSummary({ expenses }) {
  const categories = {
    Food: { 
      emoji: '🍽️',
      color: 'bg-orange-100 border-orange-300', 
      textColor: 'text-orange-800', 
      amount: 0 
    },
    Transportation: { 
      emoji: '🚗',
      color: 'bg-blue-100 border-blue-300', 
      textColor: 'text-blue-800', 
      amount: 0 
    },
    Entertainment: { 
      emoji: '🎮',
      color: 'bg-purple-100 border-purple-300', 
      textColor: 'text-purple-800', 
      amount: 0 
    },
    Utilities: { 
      emoji: '🔧',
      color: 'bg-green-100 border-green-300', 
      textColor: 'text-green-800', 
      amount: 0 
    },
    Shopping: { 
      emoji: '🛍️',
      color: 'bg-pink-100 border-pink-300', 
      textColor: 'text-pink-800', 
      amount: 0 
    },
    Other: { 
      emoji: '📦',
      color: 'bg-gray-100 border-gray-300', 
      textColor: 'text-gray-800', 
      amount: 0 
    }
  };

  // Calculate totals for each category
  expenses.forEach(expense => {
    if (categories[expense.category]) {
      categories[expense.category].amount += expense.amount;
    } else {
      categories.Other.amount += expense.amount;
    }
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>📊</span>
        <span>Expense Summary</span>
      </h2>
      
      {/* Category bars */}
      <div className="flex h-4 rounded-full overflow-hidden mb-6 border border-gray-200">
        {Object.entries(categories).map(([category, data]) => {
          const width = totalExpenses > 0 
            ? (data.amount / totalExpenses) * 100 
            : 0;
          return (
            <div
              key={category}
              className={`${data.color} border-r last:border-r-0`}
              style={{ width: `${width}%` }}
              title={`${category}: ${formatCurrency(data.amount)}`}
            />
          );
        })}
      </div>

      {/* Category details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(categories).map(([category, data]) => (
          <div 
            key={category}
            className={`p-4 rounded-md border-2 ${data.color} border-${data.textColor} transition-all hover:shadow-md`}
          >
            <div className="flex justify-between items-center">
              <span className={`font-medium ${data.textColor} flex items-center gap-2`}>
                <span className="text-xl">{data.emoji}</span>
                <span>{category}</span>
              </span>
              <span className={`font-semibold ${data.textColor}`}>
                {formatCurrency(data.amount)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1 text-center">
              {totalExpenses > 0 
                ? `${((data.amount / totalExpenses) * 100).toFixed(1)}%` 
                : '0%'}
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700 flex items-center gap-2">
            <span>💰</span>
            <span>Total Expenses</span>
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(totalExpenses)}
          </span>
        </div>
      </div>
    </div>
  );
}
