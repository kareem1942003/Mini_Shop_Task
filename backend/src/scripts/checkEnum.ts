import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkEnum() {
  console.log('Querying pg_enum to find order_status enum values...');
  const { data, error } = await supabase.rpc('get_enum_values'); // We might not have this RPC. Let's run a raw query using a select or try to insert 'confirmed'!
  
  // Alternative: Try to insert a mock order with status 'confirmed' using service role.
  console.log("Attempting to insert a test order with status 'confirmed'...");
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: 'd28fabab-7ca5-4a14-9fa6-e19839273997', // Use any valid user_id or the one we found in seed
      status: 'confirmed',
      total_amount: 10.00
    })
    .select();

  if (orderError) {
    console.log("❌ Failed to insert 'confirmed' status order! Error:", orderError.message);
  } else {
    console.log("✅ Successfully inserted 'confirmed' status order! Full order:", order);
    // Cleanup
    await supabase.from('orders').delete().eq('id', order[0].id);
  }

  console.log("Attempting to insert a test order with status 'processing'...");
  const { data: orderProc, error: orderProcError } = await supabase
    .from('orders')
    .insert({
      user_id: 'd28fabab-7ca5-4a14-9fa6-e19839273997',
      status: 'processing',
      total_amount: 10.00
    })
    .select();

  if (orderProcError) {
    console.log("❌ Failed to insert 'processing' status order! Error:", orderProcError.message);
  } else {
    console.log("✅ Successfully inserted 'processing' status order! Full order:", orderProc);
    // Cleanup
    await supabase.from('orders').delete().eq('id', orderProc[0].id);
  }
}

checkEnum().catch(console.error);
