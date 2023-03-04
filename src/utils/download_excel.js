import * as XLSX from "xlsx";

function downloadExcel(exportArr, header, tableName) {
    const headerWs = XLSX.utils.aoa_to_sheet(header);
    const ws = XLSX.utils.sheet_add_json(headerWs, exportArr, {
        skipHeader: true,
        origin: "A2",
    });

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "sheetName");
    XLSX.writeFile(wb, tableName + ".xlsx");
}
export { downloadExcel }
