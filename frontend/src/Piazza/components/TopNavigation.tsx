import React from 'react';
import './TopNavigation.css';

interface Category {
  id: string;
  name: string;
  count: number;
  isActive?: boolean;
}

export default function TopNavigation() {
  const categories: Category[] = [
    { id: 'live', name: 'LIVE Q&A', count: 0 },
    { id: 'drafts', name: 'Drafts', count: 0 },
    { id: 'hw1', name: 'hw1', count: 21, isActive: true },
    { id: 'hw2', name: 'hw2', count: 21 },
    { id: 'hw3', name: 'hw3', count: 4 },
    { id: 'hw4', name: 'hw4', count: 4 },
    { id: 'hw5', name: 'hw5', count: 14 },
    { id: 'hw6', name: 'hw6', count: 7 },
    { id: 'project', name: 'project', count: 12 },
    { id: 'exam', name: 'exam', count: 2 },
    { id: 'logistics', name: 'logistics', count: 10 },
    { id: 'other', name: 'other', count: 5 },
    { id: 'office_hours', name: 'office_hours', count: 11 }
  ];

  const filters = ['Unread', 'Updated', 'Unresolved', 'Following'];

  return (
    <div className="top-navigation">
      <div className="filter-row">
        {filters.map(filter => (
          <button key={filter} className="filter-button">
            {filter}
          </button>
        ))}
        <select className="filter-dropdown">
          <option value="1">1</option>
        </select>
      </div>

      <div className="categories-row">
        {categories.map(category => (
          <div 
            key={category.id} 
            className={`category-item ${category.isActive ? 'active' : ''}`}
          >
            <span className="category-name">{category.name}</span>
            {category.count > 0 && (
              <span className="category-count">{category.count}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 