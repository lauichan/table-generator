function formatHtml(htmlString: string, tabSize: number = 4): string {
  let formatted = "";
  const tab = " ".repeat(tabSize);
  let indentLevel = 0;

  const elements = htmlString.split(/(<[^>]+>)/).filter(Boolean);

  elements.forEach((element) => {
    if (element.startsWith("</")) {
      indentLevel = Math.max(indentLevel - 1, 0);
      formatted += `${tab.repeat(indentLevel)}${element}\n`;
    } else if (element.startsWith("<")) {
      formatted += `${tab.repeat(indentLevel)}${element}\n`;
      indentLevel += 1;
    } else {
      const text = element.trim();
      if (text) formatted += `${tab.repeat(indentLevel)}${text}\n`;
    }
  });

  return formatted.trim();
}

export default formatHtml;
