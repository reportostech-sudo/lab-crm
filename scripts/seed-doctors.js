const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const doctors = [
    {
        name: "Dr. Aayush Sharma",
        specialty: "Senior Pathologist",
        education: "MBBS, MD (Pathology)",
        experience: "15+ Years",
        bio: "Dr. Aayush Sharma is a renowned pathologist with over 15 years of experience in diagnostic medicine. He specializes in histopathology and cytopathology, ensuring the highest accuracy in cancer diagnostics. He has previously worked at top reputable hospitals in Nepal and India.",
        image: "/images/doctor1.jpg"
    },
    {
        name: "Dr. Sunita Karki",
        specialty: "Biochemist",
        education: "PhD (Clinical Biochemistry)",
        experience: "10+ Years",
        bio: "Dr. Sunita Karki heads our Biochemistry department. With her expertise in metabolic disorders and hormonal analysis, she ensures that all biochemical tests are conducted with precision and speed.",
        image: "/images/doctor2.jpg"
    },
    {
        name: "Dr. Ramesh Gupta",
        specialty: "Microbiologist",
        education: "MSc, PhD (Microbiology)",
        experience: "12+ Years",
        bio: "Dr. Ramesh Gupta is an expert in infectious diseases and clinical microbiology. He leads our detailed culture and sensitivity testing units, playing a crucial role in effective antibiotic stewardship.",
        image: "/images/doctor3.jpg"
    },
    {
        name: "Dr. Priti Singh",
        specialty: "Hematologist",
        education: "MD (Hematology)",
        experience: "8+ Years",
        bio: "Dr. Priti Singh specializes in blood disorders. From routine CBCs to complex bone marrow analysis, her keen eye ensures early detection and accurate reporting of hematological conditions.",
        image: "/images/doctor4.jpg"
    },
    {
        name: "Dr. Anjali Bhattarai",
        specialty: "Radiologist",
        education: "MD (Radiology)",
        experience: "9+ Years",
        bio: "Dr. Anjali Bhattarai provides expert diagnostic imaging interpretation. Her precise analysis of X-rays, Ultrasounds, and CT scans aids significantly in accurate clinical diagnosis.",
        image: "/images/doctor5.jpg"
    },
    {
        name: "Dr. Bikram Thapa",
        specialty: "General Physician",
        education: "MBBS, MD (Internal Medicine)",
        experience: "14+ Years",
        bio: "Dr. Bikram Thapa focuses on holistic patient care and preventative medicine. He coordinates closely with our lab team to interpret complex test results for patient treatment plans.",
        image: "/images/doctor6.jpg"
    },
    {
        name: "Dr. Neha Shrestha",
        specialty: "Cardiologist",
        education: "DM (Cardiology)",
        experience: "11+ Years",
        bio: "Dr. Neha Shrestha is a leading heart specialist. She oversees our cardiac marker tests and lipid profiling, ensuring critical heart health data is delivered with urgency and accuracy.",
        image: "/images/doctor7.jpg"
    }
];

async function main() {
    console.log('Seeding doctors...');
    for (const doctor of doctors) {
        await prisma.doctor.create({
            data: doctor,
        });
        console.log(`Created doctor: ${doctor.name}`);
    }
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
