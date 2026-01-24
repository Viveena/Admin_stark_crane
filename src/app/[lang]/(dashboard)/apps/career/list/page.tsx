// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CareerListTable from '@views/apps/career/view/CareerListTable'
import CareerCard from '@views/apps/career/view/CareerCard'

const getCareerData = async () => {
  // Use absolute URL for server-side fetch or helper needed
  // Since this is a server component, we can call the API directly if we have network access to localhost
  // Note: 'x-auth-token' or session might be needed if protected. 
  // However, get requests for list usually public or require server-side token injection?
  // The 'authMiddleware' checks token.
  // For Server Components to fetch protected data, we need the token from cookies or headers.
  // BUT the user instructions "DO NOT modify existing APIs" implies existing flow.
  // Existing flow used fake data.
  // To avoid Auth complexity in this specific "Fix" without changing Login architecture:
  // Is `/api/careers` public read? 
  // Code I wrote: `router.get('/', dynamicCheckPermission('view'), getAllCareers);`
  // It requires Auth and Permission.
  // Server-side fetch in Next.js App Router from same backend needs headers.
  // To skip complexity for THIS demo step, I will temporarily fetch client-side OR use a script/public bypass?
  // No, I must be robust.

  // Actually, since I am in a server component `careerList`, I can use `headers()` to forward cookie/auth?
  // Or... can I query DB directly here?
  // Direct DB query in Server Component (if running on same server) is often cleaner than self-HTTP-request.
  // But let's stick to API if possible, or use a "services" direct call.

  // Let's rely on client-side fetching in the Table component for simplicity and auth ease?
  // CareerListTable is a Client Component ('use client' in source step 87).
  // So I can pass `initialData={[]}` and let it fetch?
  // Or I can modify this Server Component to return <CareerListTable /> and it fetches?

  // The existing pattern passes `careerData`.
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/careers`, {
      cache: 'no-store'
      // We might be missing Auth header here if triggered by server.
      // For now, let's try unfetched (empty) and handle client-side if it fails?
      // Actually, I'll attempt to fetch if I can?
    });

    // If 401/403, we return empty list and let client handle?
    if (!res.ok) return { careers: [] };
    return res.json();
  } catch (e) {
    console.error(e);
    return { careers: [] };
  }
}

// Switching to Client Side Fetching approach might be safer if Token is in LocalStorage.
// But `careerList` is a Server Component. 
// I will change `careerList` to render the Client Component `CareerList` which handles fetching, or just pass empty and let the Table fetch?
// `CareerListTable` expects `careerData` prop. 
// I will implement a client-side fetch in `CareerListTable` if data is missing, OR wrap it.

// Better Plan: Just update `CareerListTable` to fetch data if `careerData` is empty/undefined, 
// using the token from localStorage (since we know the token is there for the dashboard).

const careerList = async () => {
  // We won't fetch server side to avoid Auth header issues without cookies
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CareerCard />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <CareerListTable />
      </Grid>
    </Grid>
  )
}

export default careerList
