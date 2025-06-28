export const createReportPdf = (data, layoutConfig = {}) => {
  // This function integrates with the backend's report generation
  // It should match the GET /reports/:id schema structure
  
  const defaultLayout = {
    title: data.title || "Technology Assessment Report",
    sections: [
      "executive_summary",
      "technology_overview", 
      "market_assessment",
      "commercialization",
      "financial_viability",
      "conclusion"
    ],
    ...layoutConfig
  };

  // Return the structured data that matches backend schema
  return {
    id: data.id,
    title: defaultLayout.title,
    content: {
      executive_summary: data.executive_summary || "",
      technology_overview: data.technology_overview || {},
      market_assessment: data.market_assessment || {},
      commercialization: data.commercialization || {},
      financial_viability: data.financial_viability || {},
      conclusion: data.conclusion || ""
    },
    created_at: data.created_at || new Date().toISOString(),
    status: data.status || "completed"
  };
};

export const generatePdfFromReport = async (reportId) => {
  try {
    // Fetch report data from backend
    const response = await fetch(`/api/reports/${reportId}`);
    if (!response.ok) throw new Error('Failed to fetch report');
    
    const reportData = await response.json();
    
    // Create PDF using the original report structure
    const pdfData = createReportPdf(reportData);
    
    return pdfData;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};