import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  try {
    // Import the ingestion script
    const { main } = await import('../../scripts/ingest-github-telemetry.mjs');
    
    // Run the ingestion
    await main();
    
    return new Response(
      JSON.stringify({ success: true, message: 'Data refreshed successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error refreshing data:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
