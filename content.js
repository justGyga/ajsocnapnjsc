// Исходный объект
const sampleObject = {
    minerData: {
        id: 1,
        serialNumber: "Some Serial Number",
        mac: "AA-AA-AA",
        model: "Some model 1",
        task: "WORK BEACH",
        photos: [
            { path: "./example.jpg", name: "Photo 1" },
            { path: "./example.jpg", name: "Photo 2" },
            { path: "./example.jpg", name: "Photo 3" },
            { path: "./example.jpg", name: "Photo 4" }
        ]
    },
    tests: [
        { test: "Test", repair: "Repair" },
        { test: "Test", repair: "Repair" },
        { test: "Test", repair: "Repair" },
        { test: "Test", repair: "Repair" }
    ]
};

// Создание массива из 1000 таких объектов
export default Array.from({ length: 1000 }, () => ({
    minerData: { ...sampleObject.minerData },
    tests: sampleObject.tests.map(({ test, repair }) => ({ test, repair }))
}));
