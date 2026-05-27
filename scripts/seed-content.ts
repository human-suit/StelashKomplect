import { seedAllContent } from "../src/lib/server/cms/admin";

async function main() {
  const counts = await seedAllContent();
  console.log("Контент импортирован:", counts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
