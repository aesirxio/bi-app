import * as XLSX from 'xlsx';
const downloadExcel = (data, nameFile) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${nameFile}.xlsx`);
};
export { downloadExcel };
