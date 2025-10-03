// Simple Supabase connectivity test
require('dotenv').config();
const supabase = require('./db');

(async () => {
  try {
    console.log('Testing supabase projects select...');
    const proj = await supabase.from('projetos').select('*').limit(3);
    console.log('projects result:', proj);
  } catch (err) {
    console.error('projects error:', err);
  }

  try {
    console.log('Testing supabase esportes select...');
    const esp = await supabase.from('esportes').select('*').limit(3);
    console.log('esportes result:', esp);
  } catch (err) {
    console.error('esportes error:', err);
  }

  try {
    console.log('Testing supabase insert (dry run)...');
    const insert = await supabase.from('projetos').insert([{ nome: 'Xtest', descricao: 'desc' }]).select();
    console.log('insert result:', insert);
  } catch (err) {
    console.error('insert error:', err);
  }

  process.exit(0);
})();
