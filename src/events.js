// Solar storms and other events, driven by real NASA DONKI data.
// Owner: lead dev (data file owned by science lead)

export async function loadEvents() {
  const res = await fetch("/data/donki-events.json");
  if (!res.ok) return [];
  const data = await res.json();
  return data.events || [];
}

// TODO (hackathon): pick a real 28 day window and map event strength to storm severity
