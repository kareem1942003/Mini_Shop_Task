const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function run() {
  const { data, error, count } = await supabase
    .from('orders')
    .select('*, profiles(id, name), order_items(*, products(id, name, price, image_url))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, 49);

  if (error) {
    console.error(error);
  } else {
    console.log("Returned rows:", data.length);
    console.log(data.map(d => ({ id: d.id, profile: d.profiles })));
  }
}
run();
