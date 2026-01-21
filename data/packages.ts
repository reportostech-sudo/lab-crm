export const healthPackages = [
    {
        id: 1,
        name: "Whole Body Checkup (Basic)",
        description: "Essential health screening covering vital functions.",
        includes: [
            "CBC (Complete Blood Count)",
            "Blood Sugar (Fasting)",
            "Lipid Profile",
            "Liver Function Test (LFT)",
            "Kidney Function Test (RFT)",
            "Urine Routine"
        ],
        price: 2500,
        originalPrice: 3500,
        discount: "28% OFF"
    },
    {
        id: 2,
        name: "Whole Body Checkup (Advanced)",
        description: "Comprehensive screening for a detailed health overview.",
        includes: [
            "All Basic Package Tests",
            "Thyroid Function Test (TFT)",
            "HBA1c",
            "Vitamin D & B12",
            "ECG",
            "Chest X-Ray"
        ],
        price: 5500,
        originalPrice: 7500,
        discount: "26% OFF"
    },
    {
        id: 3,
        name: "Diabetes Care Package",
        description: "Specialized monitoring for diabetic patients.",
        includes: [
            "Fasting & PP Blood Sugar",
            "HBA1c",
            "Lipid Profile",
            "Urine Microalbumin",
            "Creatinine"
        ],
        price: 1800,
        originalPrice: 2400,
        discount: "25% OFF"
    },
    {
        id: 4,
        name: "Women Health Package",
        description: "Tailored screening for women's health needs.",
        includes: [
            "CBC, Blood Group",
            "Thyroid Profile (T3, T4, TSH)",
            "Pap Smear",
            "Calcium",
            "Iron Profile",
            "Urine Analysis"
        ],
        price: 3200,
        originalPrice: 4200,
        discount: "24% OFF"
    }
];

export const individualTests = [
    { id: 101, name: "CBC (Complete Blood Count)", price: 400, category: "Hematology" },
    { id: 102, name: "Blood Sugar (Fasting/PP)", price: 150, category: "Biochemistry" },
    { id: 103, name: "Lipid Profile", price: 800, category: "Biochemistry" },
    { id: 104, name: "Thyroid Function Test (TFT)", price: 1000, category: "Hormones" },
    { id: 105, name: "Liver Function Test (LFT)", price: 900, category: "Biochemistry" },
    { id: 106, name: "Kidney Function Test (RFT)", price: 800, category: "Biochemistry" },
    { id: 107, name: "Urine Routine", price: 200, category: "Pathology" },
    { id: 108, name: "HBA1c", price: 700, category: "Biochemistry" },
    { id: 109, name: "Vitamin D", price: 1500, category: "Special" },
    { id: 110, name: "PCR Test (Dengue/Typhoid)", price: 1200, category: "Microbiology" },
];
