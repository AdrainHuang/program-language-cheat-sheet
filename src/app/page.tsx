
'use client';

import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import data from '../data.json';
import './globals.css';

const Page = () => {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFeatures, setFilteredFeatures] = useState(data.features);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fuse = new Fuse(data.features.flatMap(section => section.items), {
    keys: ['feature'],
    threshold: 0.3,
  });

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredFeatures(data.features);
      return;
    }

    const results = fuse.search(searchTerm);
    const newFilteredFeatures = data.features.map(section => ({
      ...section,
      items: section.items.filter(item => 
        results.some(result => result.item.feature === item.feature)
      ),
    })).filter(section => section.items.length > 0);

    setFilteredFeatures(newFilteredFeatures);
  }, [searchTerm]);

  const tableRows = filteredFeatures.flatMap((section) => [
    <tr key={section.section} className="section-header">
      <td colSpan={data.languages.length + 1}>{section.section}</td>
    </tr>,
    ...section.items.map((item) => (
      <tr key={item.feature}>
        <td dangerouslySetInnerHTML={{ __html: item.feature }}></td>
        {data.languages.map((lang) => (
          <td key={lang} dangerouslySetInnerHTML={{ __html: item[lang] || '' }}></td>
        ))}
      </tr>
    )),
  ]);

  return (
    <div>
      <div className="header-container">
        <h1>Programming Language Cheat Sheet</h1>
        <input
          type="text"
          id="search-box"
          placeholder="Search features..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-container">
        {isClient && (
          <table id="language-table">
            <thead>
              <tr>
                <th>Feature / Syntax</th>
                {data.languages.map((lang) => (
                  <th key={lang}>{lang}</th>
                ))}
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
