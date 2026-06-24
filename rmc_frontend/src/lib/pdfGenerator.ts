import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logger from './logger';

export const generateQuotationPDF = async (elementId: string, orderId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Temporary styling to ensure the PDF looks like paper during capture
  const originalStyle = element.style.boxShadow;
  element.style.boxShadow = "none";

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High resolution for professional printing
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`QUOTATION-#${orderId}.pdf`);
  } catch (error) {
    logger.error("PDF generation failed", error);
  } finally {
    element.style.boxShadow = originalStyle;
  }
};