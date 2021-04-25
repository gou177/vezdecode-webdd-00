import styled from "@emotion/styled";
import { useEffect, useMemo } from "react";
import { useTable, usePagination, useFilters } from "react-table";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

const Styles = styled.div`
  padding: 1rem;
  table {
    overflow-x: auto;
    white-space: nowrap;
    border-spacing: 0;
    border: 1px solid black;
    @media (max-width: 500px) {
      display: block;
    }
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

const timestampToDate = (timestamp) => {
  if (!timestamp) return "Обращение открыто";
  let date = new Date(timestamp * 1000);
  return `${('0' + date.getDate()).substr(-2)}.${('0' + date.getMonth()).substr(-2)}.${date.getFullYear()} ${('0' + date.getHours()).substr(-2)}:${('0' + date.getMinutes()).substr(-2)}:${('0' + date.getSeconds()).substr(-2)}`;
}

const idFilter = ({column: { filterValue, setFilter }}) => {
  return (
    <Input style={{ width: 100, height: 35 }} 
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Найти`}
    />
  )
}

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <Select
      style={{ width: 100, height: 35 }} 
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">Все</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
}

export const Table = ({tableData}) => {
  const data = useMemo(
    () => tableData.map(record => {
      return {...record, 
        name: `${record.last_name} ${record.first_name} ${record.patronymic_name === null ? '' : record.patronymic_name}`,
        status: record.status === "NEW" ? 'Открыт' : record.status === "CLOSED" ? 'Закрыт' : record.status === "IN_WORK" ? "В работе" : record.status
      };
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        filter:"myFilter"
      },
      {
        Header: 'Дата создания',
        accessor: 'created_at',
        Filter: ""
      },
      {
        Header: 'ФИО',
        accessor: 'name',
        Filter: ""
      },
      {
        Header: 'Номер телефона',
        accessor: 'phone'
      },
      {
        Header: 'Статус',
        accessor: 'status',
        Filter: SelectColumnFilter,
        filter: "includes"
      },
      {
        Header: 'Дата закрытия',
        accessor: 'closed',
        Filter: ""
      }
    ],
    []
  );

  const defaultColumn = useMemo(
    () => ({
      Filter: idFilter
    }),
    []
  );

  const tableInstance = useTable({ columns, data, defaultColumn, initialState: { pageIndex: 0 } }, useFilters, usePagination);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setPageSize,
    pageOptions,
    nextPage,
    previousPage,
    gotoPage,
    pageCount,
    canPreviousPage,
    canNextPage,
    state: { pageIndex }
  } = tableInstance;

  useEffect(() => setPageSize(10), []);
  return (
    <Styles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>
                    {cell.column.Header === "Дата создания" ? timestampToDate(cell.value) : cell.column.Header === "Дата закрытия" ? timestampToDate(cell.value) : cell.render('Cell')}
                  </td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        <div>
          Показывать по
          <Select style={{ marginLeft: 5 }} onChange={e => setPageSize(Number(e.target.value))}>
            <option key={10}>10</option>
            <option key={20}>20</option>
            <option key={50}>50</option>
          </Select>
        </div>
        <div style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', width: 200 }}>
          <Button onClick={() => gotoPage(0)} isActive={canPreviousPage}>{"<<"}</Button>
          <Button onClick={() => previousPage()} isActive={canPreviousPage}>{"<"}</Button>
          <Button onClick={() => nextPage()} isActive={canNextPage}>{">"}</Button>
          <Button onClick={() => gotoPage(pageCount - 1)} isActive={canNextPage}>{">>"}</Button>
        </div>
        Страница <strong>{pageIndex + 1}</strong> из <strong>{pageOptions.length}</strong>
      </div>
    </Styles>
  );
}