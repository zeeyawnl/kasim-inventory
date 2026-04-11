import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), "backups");
const DB_PATH = path.join(process.cwd(), "prisma", "dev.db");

function backupDatabase() {
  if (!existsSync(DB_PATH)) {
    console.error("Database file not found:", DB_PATH);
    process.exit(1);
  }

  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `dev-${timestamp}.db`);

  try {
    execSync(`copy "${DB_PATH}" "${backupPath}"`, { shell: "cmd.exe" });
    console.log(`✅ Database backed up to: ${backupPath}`);
  } catch (error) {
    console.error("❌ Backup failed:", error);
    process.exit(1);
  }
}

backupDatabase();
