import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function Markdown({ content }) {
  return (
    <div className="md-content">
      <ReactMarkdown>{content || ''}</ReactMarkdown>
    </div>
  );
}
