# Google Sheets Database Structure

To use your Google Sheet as the database for **Nong Om**, please set up the following 3 tabs (Sheets) in your file.

Link: [Your Google Sheet](https://docs.google.com/spreadsheets/d/1lfaYmNjYD0sBi6Gzt30xuxhBs4tXqcjdWTTY0Dz9e3I/edit?gid=0#gid=0)

## 1. Tab Name: `Transactions`
Stores all income and expense records.

| Column A | Column B | Column C | Column D | Column E |
| :--- | :--- | :--- | :--- | :--- |
| **id** | **date** | **category** | **amount** | **note** |
| `uuid` | `YYYY-MM-DD` | `food` | `120` | `Lunch` |

## 2. Tab Name: `Budget`
Stores your monthly budget limits.

| Column A | Column B |
| :--- | :--- |
| **category** | **limit** |
| `food` | `5000` |
| `transport`| `2000` |
| ... | ... |

*Note: You can also have a separate row or a small table for `Total Budget` if you prefer, or just sum these up.*

## 3. Tab Name: `Goals`
Stores your savings goals.

| Column A | Column B | Column C | Column D | Column E |
| :--- | :--- | :--- | :--- | :--- |
| **id** | **name** | **target** | **current** | **icon** |
| `1` | `Car` | `800000` | `350000` | `Car` |

---

## Next Steps (N8N Connection)
To make the app read this sheet, you need **N8N** (or a similar tool) to create API endpoints (Webhooks):

1.  **GET /transactions**: Reads rows from `Transactions` tab.
2.  **POST /transactions**: Adds a row to `Transactions`.
3.  **GET /budget**: Reads rows from `Budget`.
4.  **POST /budget**: Updates rows in `Budget`.
5.  **GET /goals**: Reads rows from `Goals`.
