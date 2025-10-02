import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  useTheme,
  InputAdornment
} from '@mui/material';
import {
  Search,
  Sort,
  FilterList,
  Clear
} from '@mui/icons-material';
import type { Resource } from './types';
import { PREDEFINED_TAGS } from './utils';

interface ResourceSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'name' | 'date' | 'type';
  onSortChange: (value: 'name' | 'date' | 'type') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  typeFilter: Resource['type'] | 'all';
  onTypeFilterChange: (value: Resource['type'] | 'all') => void;
  tagFilter: string[];
  onTagFilterChange: (value: string[]) => void;
  onClearFilters: () => void;
}

const ResourceSearchFilter: React.FC<ResourceSearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  typeFilter,
  onTypeFilterChange,
  tagFilter,
  onTagFilterChange,
  onClearFilters
}) => {
  const theme = useTheme();

  const hasActiveFilters = typeFilter !== 'all' || tagFilter.length > 0 || searchTerm.trim() !== '';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mb: 3,
        p: 2,
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap'
      }}
    >
      {/* Search Input */}
      <TextField
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search resources..."
        variant="outlined"
        size="small"
        sx={{ flex: 1, minWidth: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />

      {/* Type Filter */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={typeFilter}
          label="Type"
          onChange={(e) => onTypeFilterChange(e.target.value as Resource['type'] | 'all')}
          startAdornment={<FilterList sx={{ mr: 1, fontSize: 16 }} />}
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="pdf">PDF</MenuItem>
          <MenuItem value="video">Video</MenuItem>
          <MenuItem value="link">Link</MenuItem>
          <MenuItem value="image">Image</MenuItem>
          <MenuItem value="document">Document</MenuItem>
          <MenuItem value="executable">Executable</MenuItem>
        </Select>
      </FormControl>

      {/* Tag Filter */}
      <Autocomplete
        multiple
        size="small"
        options={PREDEFINED_TAGS}
        value={tagFilter}
        onChange={(_, newValue) => onTagFilterChange(newValue)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              size="small"
              variant="filled"
              sx={{ 
                bgcolor: `${theme.palette.secondary.main}15`,
                color: theme.palette.secondary.main
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by Tags"
            placeholder="Select tags..."
          />
        )}
        sx={{ minWidth: 200, flex: 1 }}
      />

      {/* Sort Options */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortBy}
          label="Sort by"
          onChange={(e) => onSortChange(e.target.value as 'name' | 'date' | 'type')}
          startAdornment={<Sort sx={{ mr: 1, fontSize: 16 }} />}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="type">Type</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Order</InputLabel>
        <Select
          value={sortOrder}
          label="Order"
          onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')}
        >
          <MenuItem value="asc">↑ Ascending</MenuItem>
          <MenuItem value="desc">↓ Descending</MenuItem>
        </Select>
      </FormControl>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Chip
          label="Clear Filters"
          onClick={onClearFilters}
          onDelete={onClearFilters}
          deleteIcon={<Clear />}
          variant="outlined"
          color="secondary"
          size="small"
          sx={{ 
            height: 40,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: `${theme.palette.secondary.main}15`
            }
          }}
        />
      )}
    </Box>
  );
};

export default ResourceSearchFilter;
