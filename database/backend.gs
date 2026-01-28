function doGet(e) {
  const action = e.parameter.action;
  const userId = e.parameter.userId;
  
  if (action === 'getTransactions') {
    return getTransactions(userId);
  } else if (action === 'getBudget') {
    return getBudget(userId);
  } else if (action === 'getGoals') {
    return getGoals(userId);
  } else if (action === 'getProfile') {
    return getProfile(userId);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = e.parameter.action;
  
  if (action === 'addTransaction') {
    return addTransaction(data);
  } else if (action === 'updateBudget') {
    return updateBudget(data);
  } else if (action === 'updateGoal') {
    return updateGoal(data);
  } else if (action === 'addGoal') {
    return addGoal(data);
  } else if (action === 'updateTransaction') {
    return updateTransaction(data);
  } else if (action === 'updateProfile') {
    return updateProfile(data);
  } else if (action === 'deleteTransaction') {
    return deleteTransaction(data);
  } else if (action === 'deleteGoal') {
    return deleteGoal(data);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' })).setMimeType(ContentService.MimeType.JSON);
}

// --- Helpers ---
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Add Headers if new - NOW WITH userId COLUMN
    if (name === 'Transactions') sheet.appendRow(['userId', 'id', 'date', 'category', 'amount', 'note']);
    if (name === 'Budget') sheet.appendRow(['userId', 'category', 'limit']);
    if (name === 'Goals') sheet.appendRow(['userId', 'id', 'name', 'target', 'current', 'icon', 'color']);
    if (name === 'Profiles') sheet.appendRow(['userId', 'displayName', 'avatarUrl', 'updatedAt']);
  }
  return sheet;
}

// =============== TRANSACTIONS ===============
function getTransactions(userId) {
  if (!userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Transactions');
  const rows = sheet.getDataRange().getValues();
  rows.shift(); // Remove headers
  
  // Filter by userId (column 0)
  const data = rows
    .filter(r => r[0] == userId)
    .map(r => ({
      id: r[1], date: r[2], category: r[3], amount: r[4], note: r[5]
    }));
    
  return responseJSON(data);
}

function addTransaction(data) {
  if (!data.userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Transactions');
  // Columns: userId, id, date, category, amount, note
  sheet.appendRow([data.userId, data.id, data.date, data.category, data.amount, data.note]);
  return responseJSON({ success: true });
}

function updateTransaction(data) {
  if (!data.userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Transactions');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    // Match both userId AND transaction id
    if (rows[i][0] == data.userId && rows[i][1] == data.id) {
      const range = sheet.getRange(i + 1, 1, 1, 6);
      range.setValues([[data.userId, data.id, data.date, data.category, data.amount, data.note]]);
      return responseJSON({ success: true });
    }
  }
  return responseJSON({ success: false, error: 'Transaction not found' });
}

// =============== BUDGET ===============
function getBudget(userId) {
  if (!userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Budget');
  const rows = sheet.getDataRange().getValues();
  rows.shift();
  
  let allocations = {};
  let total = 0;
  
  // Filter by userId (column 0)
  rows.filter(r => r[0] == userId).forEach(r => {
    if (r[1] === 'TOTAL_BUDGET') {
      total = Number(r[2]);
    } else if (r[1]) {
      allocations[r[1]] = Number(r[2]);
    }
  });

  return responseJSON({ total, allocations });
}

function updateBudget(data) {
  if (!data.userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Budget');
  const rows = sheet.getDataRange().getValues();
  
  // Delete existing rows for this user
  for (let i = rows.length - 1; i >= 1; i--) {
    if (rows[i][0] == data.userId) {
      sheet.deleteRow(i + 1);
    }
  }
  
  // Add new budget rows for this user
  // Columns: userId, category, limit
  sheet.appendRow([data.userId, 'TOTAL_BUDGET', data.total]);
  
  Object.keys(data.allocations).forEach(key => {
    sheet.appendRow([data.userId, key, data.allocations[key]]);
  });
  
  return responseJSON({ success: true });
}

// =============== GOALS ===============
function getGoals(userId) {
  if (!userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Goals');
  const rows = sheet.getDataRange().getValues();
  rows.shift();
  
  // Filter by userId (column 0)
  const data = rows
    .filter(r => r[0] == userId)
    .map(r => ({
      id: r[1], name: r[2], target: r[3], current: r[4], icon: r[5], color: r[6]
    }));
    
  return responseJSON(data);
}

function addGoal(data) {
  if (!data.userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Goals');
  // Columns: userId, id, name, target, current, icon, color
  sheet.appendRow([data.userId, data.id, data.name, data.target, data.current, data.icon, data.color]);
  return responseJSON({ success: true });
}

function updateGoal(data) {
  if (!data.userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Goals');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    // Match both userId AND goal id
    if (rows[i][0] == data.userId && rows[i][1] == data.id) {
      // Update 'current' column (index 4 in 0-based, column 5 in 1-based)
      sheet.getRange(i + 1, 5).setValue(data.current);
      return responseJSON({ success: true });
    }
  }
  return responseJSON({ success: false, error: 'Goal not found' });
}

// =============== PROFILE ===============
function getProfile(userId) {
  if (!userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Profiles');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == userId) {
      return responseJSON({
        userId: rows[i][0],
        displayName: rows[i][1],
        avatarUrl: rows[i][2],
        updatedAt: rows[i][3]
      });
    }
  }
  
  return responseJSON({ userId: userId, displayName: '', avatarUrl: '', updatedAt: '' });
}

function updateProfile(data) {
  if (!data.userId) {
    return responseJSON({ error: 'userId required' });
  }
  
  const sheet = getSheet('Profiles');
  const rows = sheet.getDataRange().getValues();
  const now = new Date().toISOString();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == data.userId) {
      const range = sheet.getRange(i + 1, 1, 1, 4);
      range.setValues([[data.userId, data.displayName || rows[i][1], data.avatarUrl || rows[i][2], now]]);
      return responseJSON({ success: true });
    }
  }
  
  sheet.appendRow([data.userId, data.displayName || '', data.avatarUrl || '', now]);
  return responseJSON({ success: true });
}

// =============== DELETE TRANSACTION ===============
function deleteTransaction(data) {
  if (!data.userId || !data.id) {
    return responseJSON({ error: 'userId and id required' });
  }
  
  const sheet = getSheet('Transactions');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == data.userId && rows[i][1] == data.id) {
      sheet.deleteRow(i + 1);
      return responseJSON({ success: true });
    }
  }
  return responseJSON({ success: false, error: 'Transaction not found' });
}

// =============== DELETE GOAL ===============
function deleteGoal(data) {
  if (!data.userId || !data.id) {
    return responseJSON({ error: 'userId and id required' });
  }
  
  const sheet = getSheet('Goals');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == data.userId && rows[i][1] == data.id) {
      sheet.deleteRow(i + 1);
      return responseJSON({ success: true });
    }
  }
  return responseJSON({ success: false, error: 'Goal not found' });
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
