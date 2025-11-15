import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  SelectChangeEvent,
  Typography,
  Divider,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SortBy } from '@/domain/entities/Task';
import { useAppStore } from '../store/appStore';

const sortOptions = [
  { value: SortBy.CREATED_AT, label: 'Created Date' },
  { value: SortBy.DUE_DATE, label: 'Due Date' },
  { value: SortBy.PRIORITY, label: 'Priority' },
  { value: SortBy.CATEGORY, label: 'Category' },
];

export const TaskFilters: React.FC = () => {
  const { filters, setFilters, resetFilters } = useAppStore();

  const handleSortChange = (event: SelectChangeEvent<SortBy>) => {
    const newSortBy = event.target.value as SortBy;
    
    if (newSortBy === SortBy.CREATED_AT) {
      setFilters({ 
        sortBy: newSortBy,
        dueDateFrom: null,
        dueDateTo: null,
        page: 0,
      });
    } else if (newSortBy === SortBy.DUE_DATE) {
      setFilters({ 
        sortBy: newSortBy,
        createdDateFrom: null,
        createdDateTo: null,
        page: 0,
      });
    } else {
      setFilters({ 
        sortBy: newSortBy,
        createdDateFrom: null,
        createdDateTo: null,
        dueDateFrom: null,
        dueDateTo: null,
        page: 0,
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ mb: 3 }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={resetFilters}
              sx={{ minWidth: 120 }}
            >
              Reset Filters
            </Button>
          </Stack>

          {filters.sortBy === SortBy.CREATED_AT && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Created Date Range
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <DatePicker
                    label="From"
                    value={filters.createdDateFrom}
                    onChange={(date) => setFilters({ createdDateFrom: date, page: 0 })}
                    slotProps={{
                      textField: { size: 'small', sx: { minWidth: 200 } },
                    }}
                  />
                  <DatePicker
                    label="To"
                    value={filters.createdDateTo}
                    onChange={(date) => setFilters({ createdDateTo: date, page: 0 })}
                    minDate={filters.createdDateFrom || undefined}
                    slotProps={{
                      textField: { size: 'small', sx: { minWidth: 200 } },
                    }}
                  />
                </Stack>
              </Box>
            </>
          )}

          {filters.sortBy === SortBy.DUE_DATE && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Due Date Range
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <DatePicker
                    label="From"
                    value={filters.dueDateFrom}
                    onChange={(date) => setFilters({ dueDateFrom: date, page: 0 })}
                    slotProps={{
                      textField: { size: 'small', sx: { minWidth: 200 } },
                    }}
                  />
                  <DatePicker
                    label="To"
                    value={filters.dueDateTo}
                    onChange={(date) => setFilters({ dueDateTo: date, page: 0 })}
                    minDate={filters.dueDateFrom || undefined}
                    slotProps={{
                      textField: { size: 'small', sx: { minWidth: 200 } },
                    }}
                  />
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </LocalizationProvider>
  );
};
