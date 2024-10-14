import * as ExcelJS from 'exceljs';

const downloadExcel = async (data, nameFile) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  const headers = Object.keys(data[0]);
  worksheet.addRow(headers);

  data.forEach((row) => {
    const rowData = Object.values(row);
    worksheet.addRow(rowData);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${nameFile}.xlsx`;
  link.click();
};
export { downloadExcel };
