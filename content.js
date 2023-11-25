const sampleObject = {
    minerData: {
        id: 1,
        serialNumber: "Some Serial Number",
        mac: "AA-AA-AA",
        model: "Some model 1",
        task: "WORK BEACH",
        photos: [
            // { path: "./example.jpg", name: "Photo 1" },
            { path: "", name: "" },
            { path: "./example.jpg", name: "Some name" },
            { path: "./logo.png", name: "Another Name" },
            { path: "", name: "" }
        ]
    },
    tests: [
        { test: "", repair: "" },
        { test: "", repair: "" },
        { test: "Test", repair: "Repair" },
        { test: "Test", repair: "Repair" }
    ]
};

// Создание массива из 10 таких объектов
export default Array.from({ length: 10 }, () => ({
    minerData: { ...sampleObject.minerData },
    tests: sampleObject.tests.map(({ test, repair }) => ({ test, repair }))
}));
