import {
    AlignmentType,
    BorderStyle,
    Document,
    Footer,
    HeightRule,
    ImageRun,
    Packer,
    PageBreak,
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

class DocumentConstructor {
    static #borders = {
        top: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "#000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "#000000" }
    };

    static #headerGenerate() {
        return new Paragraph({
            alignment: AlignmentType.RIGHT,
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
    }

    static #cellPhotoContent(picture) {
        try {
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
        } catch (error) {
            return [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new ImageRun({
                            transformation: { width: 148, height: 118 },
                            data: readFileSync("./empty-pic.png")
                        })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "", bold: true, size: "12pt", font: "Times New Roman", color: "#ffffff" })]
                })
            ];
        }
    }

    static #cellName(text, size = "12pt", font = "Times New Roman") {
        return new Paragraph({
            children: [new TextRun({ text, bold: true, size, font })]
        });
    }

    static #columnName(text, size = "12pt", font = "Times New Roman") {
        return new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text, bold: true, size, font })]
        });
    }

    static #sectionName(text, params = {}, size = "12pt", font = "Times New Roman") {
        return new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text, bold: true, size, font, ...params })],
            spacing: { after: 300, before: 500 }
        });
    }

    static #minerInfoTable(data) {
        return new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [DocumentConstructor.#cellName(`Miner №${data.id}`)],
                            verticalAlign: VerticalAlign.CENTER,
                            width: { size: 50, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: DocumentConstructor.#cellPhotoContent(data.photos[0]),
                            rowSpan: 4,
                            verticalAlign: VerticalAlign.CENTER,
                            width: { size: 25, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: DocumentConstructor.#cellPhotoContent(data.photos[1]),
                            rowSpan: 4,
                            verticalAlign: VerticalAlign.CENTER,
                            width: { size: 25, type: WidthType.PERCENTAGE }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [DocumentConstructor.#cellName("Serial Number"), new Paragraph(data.serialNumber)],
                            verticalAlign: VerticalAlign.CENTER,
                            width: { size: 50, type: WidthType.PERCENTAGE }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [DocumentConstructor.#cellName("MAC-Address"), new Paragraph(data.mac)],
                            verticalAlign: VerticalAlign.CENTER,
                            width: { size: 50, type: WidthType.PERCENTAGE }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [DocumentConstructor.#cellName("Model"), new Paragraph(data.model)],
                            verticalAlign: VerticalAlign.CENTER,
                            width: { size: 50, type: WidthType.PERCENTAGE }
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [DocumentConstructor.#cellName("Task"), new Paragraph(data.task)],
                            verticalAlign: VerticalAlign.CENTER,
                            width: { size: 50, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: DocumentConstructor.#cellPhotoContent(data.photos[2]),
                            rowSpan: 3,
                            verticalAlign: VerticalAlign.CENTER,
                            width: { size: 25, type: WidthType.PERCENTAGE }
                        }),
                        new TableCell({
                            children: DocumentConstructor.#cellPhotoContent(data.photos[3]),
                            rowSpan: 3,
                            verticalAlign: VerticalAlign.CENTER,
                            width: { size: 25, type: WidthType.PERCENTAGE }
                        })
                    ]
                })
            ],
            borders: DocumentConstructor.#borders
        });
    }

    static #workPerformedTableContentRow(content) {
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
    }

    static #workPerformedTable(content) {
        return new Table({
            rows: [
                // Titling Row
                new TableRow({
                    tableHeader: true,
                    children: [
                        new TableCell({
                            children: [DocumentConstructor.#columnName("Testing work")],
                            verticalAlign: VerticalAlign.CENTER
                        }),
                        new TableCell({
                            children: [DocumentConstructor.#columnName("Repair work")],
                            verticalAlign: VerticalAlign.CENTER
                        })
                    ],
                    height: {
                        value: 450,
                        rule: HeightRule.ATLEAST
                    }
                }),
                // Content
                ...content.map(({ test, repair }) => DocumentConstructor.#workPerformedTableContentRow({ test, repair }))
            ],
            width: {
                size: 100,
                type: WidthType.PERCENTAGE
            },
            borders: DocumentConstructor.#borders
        });
    }

    static #pageComponents(content, isLast) {
        const components = [
            DocumentConstructor.#headerGenerate(),
            DocumentConstructor.#sectionName("Miner Information"),
            DocumentConstructor.#minerInfoTable(content.minerData),
            DocumentConstructor.#sectionName("Work Performed"),
            DocumentConstructor.#workPerformedTable(content.tests)
        ];
        if (!isLast) {
            components.push(new Paragraph({ children: [new PageBreak()] }));
        }
        return components;
    }

    static generateDocument(content) {
        return new Document({
            sections: [
                {
                    children: [...content.map((pageData, idx) => DocumentConstructor.#pageComponents(pageData, idx === pageContent.length - 1)).flat()],
                    footers: {
                        default: new Footer({
                            children: [
                                DocumentConstructor.#sectionName("Confidential | AiPROENERGY LLC", { color: "#b4b4b4" }),
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
    }
}

const doc = DocumentConstructor.generateDocument(pageContent);

Packer.toBuffer(doc).then((buffer) => {
    writeFileSync("output.docx", buffer);
});
