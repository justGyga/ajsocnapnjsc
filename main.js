import {
    AlignmentType,
    BorderStyle,
    Document,
    Footer,
    HeightRule,
    ImageRun,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    VerticalAlign,
    WidthType
} from "docx";
import { readFileSync, writeFileSync } from "fs";

const header = new Paragraph({
    children: [
        new ImageRun({
            alignment: AlignmentType.LEFT,
            data: readFileSync("./logo.png"),
            transformation: {
                width: 187.75,
                height: 25.75
            }
        }),
        new TextRun({
            text: "\t\t\t\t\t"
        }),
        new TextRun({
            alignment: AlignmentType.RIGHT,
            text: "Mining Services LLC",
            bold: true,
            size: "16pt",
            font: "Times New Roman",
            color: "#729362"
        })
    ]
});

const cellPhotoContent = (picture) => {
    return [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new ImageRun({
                    transformation: { width: 148, height: 118 },
                    data: readFileSync(picture.path)
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: picture.name, bold: true, size: "12pt", font: "Times New Roman" })]
        })
    ];
};

const cellName = (text, size = "12pt", font = "Times New Roman") => {
    return new Paragraph({
        children: [new TextRun({ text, bold: true, size, font })]
    });
};

const columnName = (text, size = "12pt", font = "Times New Roman") => {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, size, font })]
    });
};

const sectionName = (text, params = {}, size = "12pt", font = "Times New Roman") => {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, size, font, ...params })],
        spacing: { after: 300, before: 500 }
    });
};

const borders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "#000000" }
};

const minerInfoTable = (data) => {
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [cellName(`Miner №${data.miner.id}`)],
                        verticalAlign: VerticalAlign.CENTER,
                        width: { size: 100, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                        children: cellPhotoContent({ path: "./example.jpg", name: "Photo 1" }),
                        rowSpan: 4,
                        verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                        children: cellPhotoContent({ path: "./example.jpg", name: "Photo 2" }),
                        rowSpan: 4,
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [cellName("Serial Number"), new Paragraph(data.miner.serialNumber)],
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [cellName("MAC-Address"), new Paragraph(data.miner.mac)],
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [cellName("Model"), new Paragraph(data.miner.model)],
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [cellName("Task"), new Paragraph(data.miner.task)],
                        verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                        children: cellPhotoContent({ path: "./example.jpg", name: "Photo 3" }),
                        rowSpan: 3,
                        verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                        children: cellPhotoContent({ path: "./example.jpg", name: "Photo 4" }),
                        rowSpan: 3,
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]
            })
        ],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE
        },
        borders
    });
};

const workPerformedTableContentRow = (content) => {
    return new TableRow({
        children: [
            new TableCell({
                children: [new Paragraph(content.test)],
                verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
                children: [new Paragraph(content.repair)],
                verticalAlign: VerticalAlign.CENTER
            })
        ],
        height: {
            value: 1500,
            rule: HeightRule.ATLEAST
        }
    });
};

const workPerformedTable = new Table({
    rows: [
        // Titling Row
        new TableRow({
            tableHeader: true,
            children: [
                new TableCell({
                    children: [columnName("Testing work")],
                    verticalAlign: VerticalAlign.CENTER
                }),
                new TableCell({
                    children: [columnName("Repair work")],
                    verticalAlign: VerticalAlign.CENTER
                })
            ],
            height: {
                value: 500,
                rule: HeightRule.ATLEAST
            }
        }),
        // Content
        workPerformedTableContentRow({ test: "Test", repair: "Repair" }),
        workPerformedTableContentRow({ test: "Test", repair: "Repair" }),
        workPerformedTableContentRow({ test: "Test", repair: "Repair" }),
        workPerformedTableContentRow({ test: "Test", repair: "Repair" })
    ],
    width: {
        size: 100,
        type: WidthType.PERCENTAGE
    },
    borders
});

const minerData = { miner: { id: 1, serialNumber: "Some Serial Number", mac: "AA-AA-AA", model: "SOme model 1", task: "WORK BEACH" } };

const doc = new Document({
    sections: [
        {
            children: [header, sectionName("Miner Information"), minerInfoTable(minerData), sectionName("Work Performed"), workPerformedTable],
            footers: {
                default: new Footer({
                    children: [sectionName("Confidential | AiPROENERGY LLC", { color: "#b4b4b4" })]
                })
            }
        }
    ]
});

Packer.toBuffer(doc).then((buffer) => {
    writeFileSync("output.docx", buffer);
});
