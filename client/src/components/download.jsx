// //for downlaod as pdf
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// function generatePDF(id) {
//     const table = document.getElementById(id); 
//     html2canvas(table, { scale: 1.5 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/jpeg", 0.9); // Compress the image
//       const pdf = new jsPDF({orientation:"landscape",unit: "mm",
//         format: "a4"});
//         const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();
//   const imgWidth = pageWidth - 20; // Set margins
//   const imgHeight = (canvas.height * imgWidth) / canvas.width;

//   // Add the canvas image to the PDF (landscape orientation)
//   pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight); 

//       // pdf.addImage(imgData, "PNG", 10, 10);
//       pdf.save("table-content.pdf"); // This will download the PDF locally
//     });
// }

// export default generatePDF