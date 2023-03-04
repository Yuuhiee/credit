import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "@/assets/fonts/ZiTiQuanWeiJunHei-W1-2-normal.js"; //引入字体文件

/**
 * 导出为PDF
 * @param { Array<{ label:String, prop:String }> } columns  表头
 * @param { Array< JSON > } data  数据
 * @param { String } name  文件名
 */
export default function (data, columns, name) {
    const pdf = new jsPDF("p", "pt");

    //pdf表格中的列信息
    //所有的行信息
    //单行
    pdf.setFont("ZiTiQuanWeiJunHei-W1-2");
    pdf.setFontSize(15);
    //pdf.text(5, 10, '加分情况:')
    //pdf.setFontSize(10)

    const rows = [];
    data.forEach(row => {
        const temp = []
        columns.forEach(({ prop }) => {
            temp.push(row[prop])
        })
        rows.push(temp)
    })

    autoTable(pdf, {
        head: [columns.map(({ label }) => label)],
        body: rows,
        bodyStyles: {
            font: "ZiTiQuanWeiJunHei-W1-2",
            halign: "center",
            valign: "middle",
        },
        headStyles: {
            font: "ZiTiQuanWeiJunHei-W1-2",
            halign: "center",
            valign: "middle",
        },
        didDrawPage: function (data) {
            pdf.text(`${name}的加分统计表`, 40, 30);
        },
    });
    //pdf名称
    pdf.save(`${name}.pdf`);
    // for (var i = 0; i < data.length; i++) {
    //     sinlgeRow = [];
    //     sinlgeRow.push(data[i].name);
    //     sinlgeRow.push(data[i].score);
    //     sinlgeRow.push(data[i].organization);
    //     sinlgeRow.push(data[i].type);
    //     rows.push(sinlgeRow);
    //     sinlgeRow = [];
    // }
    // pdf.autoTable(columns, rows, {
    //     didDrawPage: function (data) {
    //         pdf.text("xxx的加分统计表", 40, 30);
    //     },
    //     styles: {
    //         font: "ZiTiQuanWeiJunHei-W1-2",
    //         halign: "center",
    //         valign: "middle",
    //     },
    // });
}
