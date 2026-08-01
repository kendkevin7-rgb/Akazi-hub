import { PrismaClient, Skill, MomoProvider, RateUnit } from "@prisma/client";

const prisma = new PrismaClient();

const WORKERS = [
  { name: "Jean Mugisha", phone: "+250788123456", skill: Skill.PLUMBER, hood: "Kimironko", rate: 3500, unit: RateUnit.HOUR, momo: MomoProvider.MTN_MOMO, nid: "1199680012345671" },
  { name: "Keza Umutoni", phone: "+250738456789", skill: Skill.CLEANER, hood: "Kacyiru", rate: 8000, unit: RateUnit.DAY, momo: MomoProvider.AIRTEL_MONEY, nid: "1199580098765432" },
  { name: "Eric Kwizera", phone: "+250788987654", skill: Skill.ELECTRICIAN, hood: "Remera", rate: 4500, unit: RateUnit.HOUR, momo: MomoProvider.MTN_MOMO, nid: "1199780055512345" },
  { name: "Aline Mukamana", phone: "+250788222333", skill: Skill.PAINTER, hood: "Nyamirambo", rate: 7000, unit: RateUnit.DAY, momo: MomoProvider.MTN_MOMO, nid: "2199690011122233" },
  { name: "Emmanuel Habimana", phone: "+250738111222", skill: Skill.MASON, hood: "Gikondo", rate: 9000, unit: RateUnit.DAY, momo: MomoProvider.AIRTEL_MONEY, nid: "1199990044455566" },
  { name: "Diane Ingabire", phone: "+250788555444", skill: Skill.CLEANER, hood: "Kicukiro", rate: 2500, unit: RateUnit.HOUR, momo: MomoProvider.MTN_MOMO, nid: "2199580077788899" },
  { name: "Claude Niyigena", phone: "+250788111444", skill: Skill.DRIVER, hood: "Kimironko", rate: 1500, unit: RateUnit.HOUR, momo: MomoProvider.MTN_MOMO, nid: "1199680044455566" },
  { name: "Fidel Mbarushimana", phone: "+250788222555", skill: Skill.IT_SUPPORT, hood: "Remera", rate: 5000, unit: RateUnit.HOUR, momo: MomoProvider.MTN_MOMO, nid: "1199780077788899" },
  { name: "Anita Uwase", phone: "+250788333666", skill: Skill.SOFTWARE_ENGINEER, hood: "Kacyiru", rate: 15000, unit: RateUnit.HOUR, momo: MomoProvider.AIRTEL_MONEY, nid: "1199690099911122" },
  { name: "Josiane Mukandoli", phone: "+250788555777", skill: Skill.WEDDING_PLANNER, hood: "Gisozi", rate: 25000, unit: RateUnit.DAY, momo: MomoProvider.MTN_MOMO, nid: "1199680011122233" },
  { name: "Theogene Rukundo", phone: "+250788666888", skill: Skill.CHEF, hood: "Kicukiro", rate: 12000, unit: RateUnit.DAY, momo: MomoProvider.MTN_MOMO, nid: "1199780033344455" },
  { name: "Vestine Uwimana", phone: "+250738444999", skill: Skill.HOME_WORKER, hood: "Kacyiru", rate: 7000, unit: RateUnit.DAY, momo: MomoProvider.AIRTEL_MONEY, nid: "2199590055566677" },
  { name: "Eric Byiringiro", phone: "+250788777333", skill: Skill.FITNESS_TRAINER, hood: "Kimironko", rate: 10000, unit: RateUnit.HOUR, momo: MomoProvider.MTN_MOMO, nid: "1199780066677788" },
  { name: "Sandrine Nyirahabimana", phone: "+250788888111", skill: Skill.EVENT_SERVICES, hood: "Kicukiro", rate: 40000, unit: RateUnit.DAY, momo: MomoProvider.MTN_MOMO, nid: "1199680077788899" },
];

async function main() {
  console.log("Seeding Akazi Hub database...");

  for (const w of WORKERS) {
    const user = await prisma.user.upsert({
      where: { phoneNumber: w.phone },
      update: {},
      create: {
        phoneNumber: w.phone,
        fullName: w.name,
        role: "WORKER",
        city: "Kigali",
        neighborhood: w.hood,
        preferredLang: "rw",
      },
    });

    const workerProfile = await prisma.workerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        primarySkill: w.skill,
        rateRwf: w.rate,
        rateUnit: w.unit,
        momoProvider: w.momo,
        momoNumber: w.phone,
        isAvailable: true,
        jobsCompleted: Math.floor(Math.random() * 200) + 20,
        yearsActive: Math.floor(Math.random() * 4) + 1,
      },
    });

    await prisma.verification.upsert({
      where: { workerProfileId: workerProfile.id },
      update: {},
      create: {
        workerProfileId: workerProfile.id,
        nidNumber: w.nid,
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    });
  }

  const client = await prisma.user.upsert({
    where: { phoneNumber: "+250788000111" },
    update: {},
    create: {
      phoneNumber: "+250788000111",
      fullName: "Muraho Client",
      role: "CLIENT",
      city: "Kigali",
      neighborhood: "Kimironko",
      preferredLang: "en",
    },
  });

  console.log(`Seeded ${WORKERS.length} workers and client ${client.fullName}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
