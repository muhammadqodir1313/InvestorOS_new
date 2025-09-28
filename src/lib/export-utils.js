import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * PDF export funksiyasi
 * @param {string} elementId - Export qilinadigan element ID
 * @param {string} filename - Fayl nomi
 * @param {string} title - PDF sarlavhasi
 */
export const exportToPDF = async (elementId, filename = 'export', title = 'Export') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    // Create an off-screen clone to avoid overlays/positioning issues
    const wrapper = document.createElement('div');
    wrapper.id = 'pdf-capture-wrapper';
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-99999px';
    wrapper.style.top = '0';
    wrapper.style.width = `${element.scrollWidth || element.offsetWidth || 1024}px`;
    wrapper.style.background = getComputedStyle(document.body).backgroundColor || '#0a0a0a';

    const clone = element.cloneNode(true);
    clone.id = 'pdf-capture-clone';
    clone.style.width = '100%';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Inject safety CSS to remove gradients/advanced color functions on clone
    const safeStyle = document.createElement('style');
    safeStyle.textContent = `
      *, *::before, *::after {
        background-image: none !important;
        box-shadow: none !important;
        text-shadow: none !important;
        filter: none !important;
        -webkit-filter: none !important;
        outline-color: currentColor !important;
      }
    `;
    clone.prepend(safeStyle);

    // Inline safe computed styles to avoid unsupported color functions (e.g., oklab/oklch)
    const inlineStyles = (srcNode, dstNode) => {
      if (!(srcNode instanceof HTMLElement) || !(dstNode instanceof HTMLElement)) return;
      const cs = getComputedStyle(srcNode);
      // Force simple rgb colors
      dstNode.style.backgroundColor = cs.backgroundColor;
      dstNode.style.color = cs.color;
      dstNode.style.borderTopColor = cs.borderTopColor;
      dstNode.style.borderRightColor = cs.borderRightColor;
      dstNode.style.borderBottomColor = cs.borderBottomColor;
      dstNode.style.borderLeftColor = cs.borderLeftColor;
      dstNode.style.outlineColor = cs.outlineColor;
      dstNode.style.textDecorationColor = cs.textDecorationColor;
      dstNode.style.columnRuleColor = cs.columnRuleColor;
      dstNode.style.caretColor = cs.caretColor;
      // Remove gradients/shadows that may use modern color spaces
      dstNode.style.backgroundImage = 'none';
      dstNode.style.boxShadow = 'none';
      dstNode.style.textShadow = 'none';
      // SVG support
      if (dstNode instanceof SVGElement) {
        dstNode.setAttribute('fill', cs.fill || 'currentColor');
        dstNode.setAttribute('stroke', cs.stroke || 'currentColor');
      }
      // Recurse
      const srcChildren = Array.from(srcNode.children);
      const dstChildren = Array.from(dstNode.children);
      for (let i = 0; i < srcChildren.length; i++) {
        inlineStyles(srcChildren[i], dstChildren[i]);
      }
    };
    inlineStyles(element, clone);

    // HTML elementni canvas'ga aylantirish (clone orqali)
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0a0a0a', // Dark background
      windowWidth: wrapper.offsetWidth,
      windowHeight: clone.scrollHeight,
      logging: false,
      onclone: (doc) => {
        // Ensure pseudo-elements also have gradients off in the cloned doc
        const style = doc.createElement('style');
        style.textContent = `
          *, *::before, *::after {
            background-image: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
            filter: none !important;
            -webkit-filter: none !important;
          }
        `;
        doc.head.appendChild(style);
      }
    });

    // Cleanup clone
    document.body.removeChild(wrapper);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // PDF sarlavhasi
    pdf.setFontSize(20);
    pdf.setTextColor(100, 100, 100);
    pdf.text(title, 20, 20);
    
    // Rasm qo'shish
    const imgWidth = 210; // A4 width
    const pageHeight = 295; // A4 height
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 30;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    throw error;
  }
};

/**
 * Table-based PDF export (robust, no html2canvas)
 * @param {Array<Object>} rows
 * @param {string} filename
 * @param {string} title
 */
export const exportTablePDF = (rows, filename = 'export', title = 'Export') => {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('No data to export');
  }
  const doc = new jsPDF('p', 'mm', 'a4');
  doc.setFontSize(16);
  doc.text(title, 14, 16);
  const headers = [Object.keys(rows[0])];
  const data = rows.map((r) => headers[0].map((h) => String(r[h] ?? '')));
  autoTable(doc, {
    head: headers,
    body: data,
    startY: 22,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [40, 40, 40], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });
  doc.save(`${filename}.pdf`);
};

/**
 * CSV export funksiyasi
 * @param {Array} data - Export qilinadigan ma'lumotlar
 * @param {string} filename - Fayl nomi
 * @param {Array} headers - CSV headers
 */
export const exportToCSV = (data, filename = 'export', headers = []) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Headers yaratish
    const csvHeaders = headers.length > 0 ? headers : Object.keys(data[0]);
    
    // CSV content yaratish
    const csvContent = [
      csvHeaders.join(','),
      ...data.map(row => 
        csvHeaders.map(header => {
          const value = row[header];
          // String bo'lsa va vergul yoki quote bo'lsa, quote qo'shish
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    // BOM qo'shish (UTF-8 uchun)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    saveAs(blob, `${filename}.csv`);
  } catch (error) {
    console.error('CSV export error:', error);
    throw error;
  }
};

/**
 * Excel export funksiyasi
 * @param {Array} data - Export qilinadigan ma'lumotlar
 * @param {string} filename - Fayl nomi
 * @param {string} sheetName - Sheet nomi
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1') => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    // Workbook yaratish
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Sheet qo'shish
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Excel fayl yaratish
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (error) {
    console.error('Excel export error:', error);
    throw error;
  }
};

/**
 * Pipeline deals uchun maxsus export
 * @param {Array} deals - Deal ma'lumotlari
 * @param {string} format - Export format ('pdf', 'csv', 'excel')
 */
export const exportPipelineDeals = async (deals, format = 'csv') => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `pipeline-deals-${timestamp}`;
    
    // Deal ma'lumotlarini formatlash
    const formattedDeals = deals.map(deal => ({
      'Company': deal.company,
      'Deal Name': deal.name,
      'Stage': deal.stage,
      'Amount': deal.amount,
      'Score': deal.score,
      'Sector': deal.sector,
      'Description': deal.description,
      'Last Update': deal.lastUpdate,
      'Comments Count': deal.comments?.length || 0
    }));

    switch (format) {
      case 'pdf':
        // PDF uchun HTML element yaratish
        const tableHtml = createDealsTableHTML(formattedDeals);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableHtml;
        tempDiv.id = 'temp-export-table';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);
        
        await exportToPDF('temp-export-table', filename, 'Pipeline Deals Export');
        document.body.removeChild(tempDiv);
        break;
        
      case 'csv':
        exportToCSV(formattedDeals, filename);
        break;
        
      case 'excel':
        exportToExcel(formattedDeals, filename, 'Pipeline Deals');
        break;
        
      default:
        throw new Error('Unsupported format');
    }
  } catch (error) {
    console.error('Pipeline export error:', error);
    throw error;
  }
};

/**
 * Deals uchun HTML table yaratish
 * @param {Array} deals - Deal ma'lumotlari
 */
const createDealsTableHTML = (deals) => {
  return `
    <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 20px;">
      <h1 style="color: #6366f1; margin-bottom: 20px;">Pipeline Deals Export</h1>
      <table style="width: 100%; border-collapse: collapse; background: #1a1a1a;">
        <thead>
          <tr style="background: #2a2a2a;">
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Company</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Deal Name</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Stage</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Amount</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Score</th>
            <th style="padding: 12px; border: 1px solid #333; text-align: left;">Sector</th>
          </tr>
        </thead>
        <tbody>
          ${deals.map(deal => `
            <tr>
              <td style="padding: 12px; border: 1px solid #333;">${deal.Company}</td>
              <td style="padding: 12px; border: 1px solid #333;">${deal['Deal Name']}</td>
              <td style="padding: 12px; border: 1px solid #333;">${deal.Stage}</td>
              <td style="padding: 12px; border: 1px solid #333;">${deal.Amount}</td>
              <td style="padding: 12px; border: 1px solid #333;">${deal.Score}</td>
              <td style="padding: 12px; border: 1px solid #333;">${deal.Sector}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};
