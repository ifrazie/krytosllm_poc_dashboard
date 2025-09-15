import React, { useState, useMemo } from 'react';
import styles from './Table.module.css';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnConfig<T = any> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowClick?: (row: T, index: number) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  selectable?: boolean;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  pageSize?: number;
  showPagination?: boolean;
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  onRowSelect,
  selectable = false,
  className = '',
  emptyMessage = 'No data available',
  loading = false,
  pageSize = 10,
  showPagination = false
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: '', direction: null });
  
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };

  // Handle row selection
  const handleRowSelect = (index: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (checked) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    
    setSelectedRows(newSelectedRows);
    
    if (onRowSelect) {
      const selectedData = Array.from(newSelectedRows).map(i => filteredAndSortedData[i]);
      onRowSelect(selectedData);
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndices = new Set(filteredAndSortedData.map((_, index) => index));
      setSelectedRows(allIndices);
      if (onRowSelect) {
        onRowSelect(filteredAndSortedData);
      }
    } else {
      setSelectedRows(new Set());
      if (onRowSelect) {
        onRowSelect([]);
      }
    }
  };

  // Handle filtering
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Apply filtering and sorting
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => {
          const cellValue = row[key];
          return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, filters, sortConfig]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredAndSortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <i className="fas fa-sort" />;
    }
    
    if (sortConfig.direction === 'asc') {
      return <i className="fas fa-sort-up" />;
    } else if (sortConfig.direction === 'desc') {
      return <i className="fas fa-sort-down" />;
    }
    
    return <i className="fas fa-sort" />;
  };

  console.log('Table component - data:', data.length, data);
  console.log('Table component - loading:', loading);
  console.log('Table component - paginatedData:', paginatedData.length, paginatedData);

  if (loading) {
    return (
      <div className={`${styles.tableContainer} ${className}`}>
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      {/* Filter inputs */}
      {columns.some(col => col.filterable) && (
        <div className={styles.filtersRow}>
          {columns.map(column => (
            <div key={column.key} className={styles.filterCell} style={{ width: column.width }}>
              {column.filterable && (
                <input
                  type="text"
                  placeholder={`Filter ${column.header}...`}
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  className={styles.filterInput}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            {selectable && (
              <th className={styles.selectColumn}>
                <input
                  type="checkbox"
                  checked={selectedRows.size === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className={styles.checkbox}
                />
              </th>
            )}
            {columns.map(column => (
              <th
                key={column.key}
                className={`${styles.th} ${column.sortable ? styles.sortable : ''}`}
                style={{ 
                  width: column.width,
                  textAlign: column.align || 'left'
                }}
                onClick={column.sortable ? () => handleSort(column.key) : undefined}
              >
                <div className={styles.headerContent}>
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className={styles.sortIcon}>
                      {getSortIcon(column.key)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (selectable ? 1 : 0)} 
                className={styles.emptyCell}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, index) => (
              <tr
                key={index}
                className={`${styles.tr} ${onRowClick ? styles.clickable : ''} ${
                  selectedRows.has(index) ? styles.selected : ''
                }`}
                onClick={onRowClick ? () => onRowClick(row, index) : undefined}
              >
                {selectable && (
                  <td className={styles.selectColumn}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowSelect(index, e.target.checked);
                      }}
                      className={styles.checkbox}
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td
                    key={column.key}
                    className={styles.td}
                    style={{ textAlign: column.align || 'left' }}
                  >
                    {column.render 
                      ? column.render(row[column.key], row, index)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            <i className="fas fa-chevron-left" />
          </button>
          
          <span className={styles.paginationInfo}>
            Page {currentPage} of {totalPages} ({filteredAndSortedData.length} items)
          </span>
          
          <button
            className={styles.paginationButton}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;