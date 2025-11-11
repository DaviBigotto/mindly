// Script para verificar se as tabelas existem no banco de dados
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL não está configurado!");
  console.error("Configure com: $env:DATABASE_URL=\"postgresql://...\"");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false },
});

async function checkTables() {
  try {
    console.log("🔍 Conectando ao banco de dados...");
    
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log("\n📊 Tabelas encontradas no banco:");
    if (result.rows.length === 0) {
      console.log("  ⚠️ Nenhuma tabela encontrada!");
    } else {
      result.rows.forEach(row => {
        console.log(`  ✅ ${row.table_name}`);
      });
    }
    
    const expectedTables = [
      'users',
      'journal_entries',
      'meditation_categories',
      'meditation_sessions',
      'meditation_history',
      'focus_sessions',
      'pro_tracks',
      'track_steps',
      'user_track_progress',
      'premium_sounds',
      'kiwify_webhook_logs',
      'sessions'
    ];
    
    console.log("\n🔍 Verificando tabelas esperadas:");
    const existingTables = result.rows.map(r => r.table_name);
    let allExist = true;
    
    expectedTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table} - EXISTE`);
      } else {
        console.log(`  ❌ ${table} - NÃO EXISTE`);
        allExist = false;
      }
    });
    
    console.log("\n" + "=".repeat(50));
    if (allExist) {
      console.log("✅ Todas as tabelas existem! O banco está pronto!");
    } else {
      console.log("❌ Algumas tabelas estão faltando!");
      console.log("💡 Execute: npm run db:push");
    }
    console.log("=".repeat(50));
    
  } catch (error) {
    console.error("❌ Erro ao verificar tabelas:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("💡 Verifique se a URL do banco está correta");
    }
  } finally {
    await pool.end();
  }
}

checkTables();

