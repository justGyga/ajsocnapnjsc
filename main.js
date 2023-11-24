import {
    AlignmentType,
    BorderStyle,
    Document,
    Footer,
    HeightRule,
    ImageRun,
    Packer,
    PageNumber,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    VerticalAlign,
    WidthType
} from "docx";
import { readFileSync, writeFileSync } from "fs";
import pageContent from "./content.js";

const header = new Paragraph({
    alignment: AlignmentType.RIGHT,
    pageBreakBefore: true,
    children: [
        new ImageRun({
            data: readFileSync("./logo.png"),
            transformation: {
                width: 187.75,
                height: 25.75
            },
            floating: {
                horizontalPosition: {
                    offset: 914400
                },
                verticalPosition: {
                    offset: 864400
                }
            }
        }),
        new TextRun({
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
                        children: [cellName(`Miner №${data.id}`)],
                        verticalAlign: VerticalAlign.CENTER,
                        width: { size: 100, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                        children: cellPhotoContent(data.photos[0]),
                        rowSpan: 4,
                        verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                        children: cellPhotoContent(data.photos[1]),
                        rowSpan: 4,
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [cellName("Serial Number"), new Paragraph(data.serialNumber)],
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [cellName("MAC-Address"), new Paragraph(data.mac)],
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [cellName("Model"), new Paragraph(data.model)],
                        verticalAlign: VerticalAlign.CENTER
                    })
                ]
            }),
            new TableRow({
                children: [
                    new TableCell({
                        children: [cellName("Task"), new Paragraph(data.task)],
                        verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                        children: cellPhotoContent(data.photos[2]),
                        rowSpan: 3,
                        verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                        children: cellPhotoContent(data.photos[3]),
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

const workPerformedTable = (content) => {
    return new Table({
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
            ...content.map(({ test, repair }) => workPerformedTableContentRow({ test, repair }))
        ],
        width: {
            size: 100,
            type: WidthType.PERCENTAGE
        },
        borders
    });
};

const pageComponents = (content) => {
    return [header, sectionName("Miner Information"), minerInfoTable(content.minerData), sectionName("Work Performed"), workPerformedTable(content.tests)];
};

const doc = new Document({
    sections: [
        {
            children: [...pageContent.map((pageData) => pageComponents(pageData))].flat(),
            footers: {
                default: new Footer({
                    children: [
                        sectionName("Confidential | AiPROENERGY LLC", { color: "#b4b4b4" }),
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                                new TextRun({
                                    children: ["Page ", PageNumber.CURRENT],
                                    font: "Times New Roman",
                                    size: "12pt",
                                    color: "#b4b4b4"
                                })
                            ]
                        })
                    ]
                })
            }
        }
    ]
});

Packer.toBuffer(doc).then((buffer) => {
    writeFileSync("output.docx", buffer);
});
