import type { Employee } from '../types';

const getRelativeDateStr = (daysOffset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const mockEmployees: Employee[] = [
  {
    id: "PPAHHE20260001",
    name: "Aarav Hegde",
    email: "aarav.hegde@peoplepulse.com",
    phone: "+91 98765 43210",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    status: "present",
    manager: "Divya Hinduja",
    location: "Mumbai, India",
    about: "Senior Frontend Developer with 5+ years of experience specialized in building beautiful, accessible React dashboards. Love clean code and interactive motion design.",
    skills: ["React", "TypeScript", "TailwindCSS", "Framer Motion", "Next.js"],
    interests: ["Photography", "Hiking", "Specialty Coffee"],
    certifications: [
      "AWS Certified Cloud Practitioner (2024)",
      "Meta Front-End Developer Professional Certificate (2023)"
    ],
    resume: [
      {
        id: "r1",
        title: "Senior Software Engineer (Frontend)",
        company: "TechNexus Systems",
        duration: "2022 - Present",
        description: "Leading a team of 4 devs to migrate legacy apps to Next.js. Improved performance scores by 35% and accessibility compliance to WCAG AA."
      },
      {
        id: "r2",
        title: "Software Engineer",
        company: "InnovateLabs",
        duration: "2020 - 2022",
        description: "Built and maintained multiple SaaS customer portals. Authored a shared component library used across 3 departments."
      }
    ],
    privateInfo: {
      dob: "1997-04-12",
      address: "Flat 402, Sea Breeze Apartments, Bandra West, Mumbai - 400050",
      nationality: "Indian",
      personalEmail: "aarav.h.personal@gmail.com",
      gender: "Male",
      maritalStatus: "Single",
      dateOfJoining: getRelativeDateStr(-25),
      accountNumber: "918020045612349",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0000104",
      panNo: "ABCDE1234F",
      uanId: "100987654321",
      empCode: "EMP2026001"
    },
    password: "password123",
    role: "employee",
    salary: {
      monthlyWage: 75000,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
      components: {
        basicWagePercent: 50,
        hraPercent: 50,
        standardAllowance: 5000,
        performanceBonusPercent: 10,
        ltaPercent: 5
      },
      pfRatePercent: 12,
      professionalTax: 200
    }
  },
  {
    id: "PPSSSH20260002",
    name: "Sanya Sharma",
    email: "sanya.sharma@peoplepulse.com",
    phone: "+91 87654 32109",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120",
    status: "leave",
    manager: "Divya Hinduja",
    location: "Bangalore, India",
    about: "Lead UI/UX Designer dedicated to crafting user-centric digital experiences. Bridging the gap between beautiful aesthetics and solid engineering.",
    skills: ["Figma", "UI Design", "Design Systems", "Prototyping", "User Research"],
    interests: ["Watercolor Painting", "Baking", "Indie Music"],
    certifications: [
      "NN/g UX Certification (2022)",
      "Google UX Design Professional Certificate (2021)"
    ],
    resume: [
      {
        id: "r1",
        title: "Lead Product Designer",
        company: "FintechFlow",
        duration: "2021 - Present",
        description: "Redesigned core mobile wallet application, increasing daily active transactions by 22%. Established unified design system."
      }
    ],
    privateInfo: {
      dob: "1995-08-25",
      address: "12th Cross, Indiranagar, Bangalore - 560038",
      nationality: "Indian",
      personalEmail: "sanya.sharma.design@outlook.com",
      gender: "Female",
      maritalStatus: "Married",
      dateOfJoining: getRelativeDateStr(-20),
      accountNumber: "50100412384596",
      bankName: "ICICI Bank",
      ifscCode: "ICIC0000002",
      panNo: "FGHIJ5678K",
      uanId: "100123456789",
      empCode: "EMP2026002"
    },
    password: "password123",
    role: "employee",
    salary: {
      monthlyWage: 90000,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 45,
      components: {
        basicWagePercent: 50,
        hraPercent: 50,
        standardAllowance: 6000,
        performanceBonusPercent: 12,
        ltaPercent: 8
      },
      pfRatePercent: 12,
      professionalTax: 200
    }
  },
  {
    id: "PPRRPA20260003",
    name: "Rohan Patel",
    email: "rohan.patel@peoplepulse.com",
    phone: "+91 76543 21098",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120",
    status: "absent",
    manager: "Aarav Hegde",
    location: "Pune, India",
    about: "Fullstack Developer focusing on backend reliability, serverless architecture, and data pipelines. Coffee enthusiast and tech blogger.",
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Docker", "AWS"],
    interests: ["Cricket", "Tinkering with IOT", "Reading Sci-Fi"],
    certifications: [
      "AWS Certified Solutions Architect (2023)"
    ],
    resume: [
      {
        id: "r1",
        title: "Fullstack Engineer",
        company: "CloudVibe Solutions",
        duration: "2021 - 2023",
        description: "Optimized database queries, reducing response times by 40%. Implemented secure JWT-based multi-tenant authentication."
      }
    ],
    privateInfo: {
      dob: "1998-11-03",
      address: "Sector 21, Yamuna Nagar, Nigdi, Pune - 411044",
      nationality: "Indian",
      personalEmail: "rohan.patel98@gmail.com",
      gender: "Male",
      maritalStatus: "Single",
      dateOfJoining: getRelativeDateStr(-15),
      accountNumber: "109876543210",
      bankName: "State Bank of India",
      ifscCode: "SBIN0001234",
      panNo: "KLMNO9012P",
      uanId: "100234567890",
      empCode: "EMP2026003"
    },
    password: "password123",
    role: "employee",
    salary: {
      monthlyWage: 60000,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
      components: {
        basicWagePercent: 45,
        hraPercent: 40,
        standardAllowance: 4000,
        performanceBonusPercent: 8,
        ltaPercent: 5
      },
      pfRatePercent: 12,
      professionalTax: 200
    }
  },
  {
    id: "PPKKME20260004",
    name: "Kavya Mehta",
    email: "kavya.mehta@peoplepulse.com",
    phone: "+91 91234 56789",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
    status: "present",
    manager: "Divya Hinduja",
    location: "Mumbai, India",
    about: "HR Specialist with a passion for employee onboarding, culture building, and conflict resolution. Love organizing team activities.",
    skills: ["Talent Acquisition", "Employee Engagement", "Labor Law", "Conflict Resolution"],
    interests: ["Salsa Dancing", "Book Clubs", "Yoga"],
    certifications: [
      "SHRM Certified Professional (2024)"
    ],
    resume: [
      {
        id: "r1",
        title: "HR Executive",
        company: "Apex Global",
        duration: "2023 - 2025",
        description: "Managed full lifecycle recruitment for 50+ roles annually. Re-designed the remote onboarding process to boost satisfaction."
      }
    ],
    privateInfo: {
      dob: "1996-01-20",
      address: "A-504, Windsor Towers, Powai, Mumbai - 400076",
      nationality: "Indian",
      personalEmail: "kavya.mehta.hr@gmail.com",
      gender: "Female",
      maritalStatus: "Single",
      dateOfJoining: getRelativeDateStr(-10),
      accountNumber: "20098176541",
      bankName: "Axis Bank",
      ifscCode: "UTIB0000004",
      panNo: "QRSTU3456V",
      uanId: "100345678901",
      empCode: "EMP2026004"
    },
    password: "password123",
    role: "employee",
    salary: {
      monthlyWage: 50000,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
      components: {
        basicWagePercent: 50,
        hraPercent: 50,
        standardAllowance: 3000,
        performanceBonusPercent: 10,
        ltaPercent: 5
      },
      pfRatePercent: 12,
      professionalTax: 200
    }
  },
  {
    id: "PPVVSU20260005",
    name: "Vikram Suryavanshi",
    email: "vikram.suryavanshi@peoplepulse.com",
    phone: "+91 92345 67890",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120",
    status: "present",
    manager: "Divya Hinduja",
    location: "New Delhi, India",
    about: "DevOps Engineer focusing on automating infrastructure, CI/CD pipelines, and cloud migrations. Enthusiast in containerization and serverless architecture.",
    skills: ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Bash"],
    interests: ["Road Trips", "Cooking", "Video Games"],
    certifications: [
      "AWS Certified DevOps Engineer (2022)",
      "Certified Kubernetes Administrator (CKA) (2023)"
    ],
    resume: [
      {
        id: "r1",
        title: "Senior DevOps Engineer",
        company: "Systemic Corp",
        duration: "2019 - 2021",
        description: "Implemented cloud orchestration using Terraform. Set up robust monitoring using Prometheus and Grafana, reducing system downtime by 50%."
      }
    ],
    privateInfo: {
      dob: "1992-06-15",
      address: "C-12, Green Park, New Delhi - 110016",
      nationality: "Indian",
      personalEmail: "vikram.surya.devops@gmail.com",
      gender: "Male",
      maritalStatus: "Married",
      dateOfJoining: getRelativeDateStr(-8),
      accountNumber: "30221456987",
      bankName: "Kotak Mahindra Bank",
      ifscCode: "KKBK0000172",
      panNo: "VWXYZ7890A",
      uanId: "100456789012",
      empCode: "EMP2026005"
    },
    password: "password123",
    role: "employee",
    salary: {
      monthlyWage: 120000,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 60,
      components: {
        basicWagePercent: 50,
        hraPercent: 50,
        standardAllowance: 8000,
        performanceBonusPercent: 15,
        ltaPercent: 10
      },
      pfRatePercent: 12,
      professionalTax: 200
    }
  },
  {
    id: "PPNNEI20260006",
    name: "Neha Iyer",
    email: "neha.iyer@peoplepulse.com",
    phone: "+91 93456 78901",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
    status: "leave",
    manager: "Aarav Hegde",
    location: "Chennai, India",
    about: "QAE Specialist with 4+ years of test automation experience. Devoted to writing comprehensive test suites and preventing bugs in production.",
    skills: ["Cypress", "Selenium", "Jest", "Postman", "CI/CD Integration", "Python"],
    interests: ["Carnatic Music", "Gardening", "Table Tennis"],
    certifications: [
      "ISTQB Certified Tester (2022)"
    ],
    resume: [
      {
        id: "r1",
        title: "Quality Assurance Engineer",
        company: "TestCraft Co.",
        duration: "2021 - 2023",
        description: "Built automation scripts covering 85% of core user journeys. Significantly cut down release cycle time by automating smoke tests."
      }
    ],
    privateInfo: {
      dob: "1996-09-30",
      address: "18, Gandhi Nagar, Adyar, Chennai - 600020",
      nationality: "Indian",
      personalEmail: "neha.iyer.qa@gmail.com",
      gender: "Female",
      maritalStatus: "Single",
      dateOfJoining: getRelativeDateStr(-5),
      accountNumber: "60114987652",
      bankName: "IndusInd Bank",
      ifscCode: "INDB0000006",
      panNo: "BCDEF4321G",
      uanId: "100567890123",
      empCode: "EMP2026006"
    },
    password: "password123",
    role: "employee",
    salary: {
      monthlyWage: 65000,
      workingDaysPerWeek: 5,
      breakTimeMinutes: 45,
      components: {
        basicWagePercent: 45,
        hraPercent: 40,
        standardAllowance: 4500,
        performanceBonusPercent: 8,
        ltaPercent: 5
      },
      pfRatePercent: 12,
      professionalTax: 200
    }
  }
];
