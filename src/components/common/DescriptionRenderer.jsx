import React from 'react';
import { renderDescriptionHTML } from '@/utils/eventHelpers';
import DOMPurify from 'dompurify';

const DescriptionRenderer = ({ 
  description, 
  maxLength = null, 
  className = "",
  showImages = true 
}) => {
  if (!description) return null;
  
  const htmlContent = renderDescriptionHTML(description, maxLength);
  
  // Sanitize HTML content để tránh XSS
  const cleanHTML = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'strong', 'i', 'em', 'u', 'ins', 's', 'strike',
      'a', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 
      'tr', 'th', 'td', ...(showImages ? ['img'] : [])
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'title', 'style', 'align', 'colspan', 
      'rowspan', 'valign', ...(showImages ? ['src', 'alt', 'width', 'height'] : [])
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  });
  
  return (
    <div 
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHTML }}
      style={{
        wordWrap: 'break-word',
        wordBreak: 'break-word'
      }}
    />
  );
};

export default DescriptionRenderer;