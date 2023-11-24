// Исходный объект
const sampleObject = {
    minerData: { id: 1, serialNumber: "Some Serial Number", mac: "AA-AA-AA", model: "Some model 1", task: "WORK BEACH" },
    tests: [
        { test: "Test", repair: "Repair" },
        { test: "Test", repair: "Repair" },
        { test: "Test", repair: "Repair" },
        { test: "Test", repair: "Repair" }
    ]
};

// Создание массива из 100 таких объектов
export default Array.from({ length: 100 }, () => ({
    minerData: { ...sampleObject.minerData },
    tests: sampleObject.tests.map(({ test, repair }) => ({ test, repair }))
}));
