import DOMPurify from "dompurify";

const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html);
};

export default sanitizeHtml;
