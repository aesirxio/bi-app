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
const timeAgo = (isoString) => {
  const now = Date.now();
  const past = new Date(isoString).getTime();
  const diff = Math.floor((now - past) / 1000); // seconds

  if (diff < 60) {
    return `${diff}s ago`;
  }

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};
export { downloadExcel, timeAgo };
