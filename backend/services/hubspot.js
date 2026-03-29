import axios from 'axios';

const HUBSPOT_BASE = 'https://api.hubapi.com';

function hubspotHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
}

/**
 * Get all open deals from HubSpot
 */
export async function getHubSpotDeals(apiKey) {
  try {
    const { data } = await axios.get(`${HUBSPOT_BASE}/crm/v3/objects/deals`, {
      headers: hubspotHeaders(apiKey),
      params: { limit: 100, properties: 'dealname,amount,dealstage,closedate,hubspot_owner_id' }
    });
    return data.results || [];
  } catch (error) {
    console.error('HubSpot deals fetch failed:', error.message);
    return [];
  }
}

/**
 * Create a contact in HubSpot for a qualified prospect
 */
export async function createHubSpotContact(apiKey, contactData) {
  try {
    const { data } = await axios.post(`${HUBSPOT_BASE}/crm/v3/objects/contacts`, {
      properties: {
        firstname: contactData.contactName?.split(' ')[0],
        lastname: contactData.contactName?.split(' ').slice(1).join(' '),
        email: contactData.contactEmail,
        company: contactData.company,
        jobtitle: contactData.contactTitle
      }
    }, { headers: hubspotHeaders(apiKey) });
    return data.id;
  } catch (error) {
    console.error('HubSpot contact creation failed:', error.message);
    return null;
  }
}


/**
 * Add a note to a HubSpot deal (used to log agent recovery plays)
 */
export async function addHubSpotNote(apiKey, dealId, noteBody) {
  try {
    const { data } = await axios.post(`${HUBSPOT_BASE}/crm/v3/objects/notes`, {
      properties: {
        hs_note_body: noteBody,
        hs_timestamp: Date.now()
      }
    }, { headers: hubspotHeaders(apiKey) });

    const noteId = data.id;

    // Associate note with deal
    await axios.put(`${HUBSPOT_BASE}/crm/v3/objects/notes/${noteId}/associations/deal/${dealId}/214`, 
      {}, 
      { headers: hubspotHeaders(apiKey) }
    );
  } catch (error) {
    console.error('HubSpot note creation failed:', error.message);
  }
}

/**
 * Fetch recent notes (engagements) for a HubSpot deal to analyze sentiment/signals.
 */
export async function getHubSpotEngagementNotes(apiKey, dealId) {
    try {
        // First get associations to notes
        const { data: assocData } = await axios.get(`${HUBSPOT_BASE}/crm/v3/objects/deals/${dealId}/associations/notes`, {
            headers: hubspotHeaders(apiKey)
        });

        const noteIds = assocData.results?.map(r => r.id) || [];
        if (noteIds.length === 0) return [];

        // Fetch note contents
        const notes = [];
        for (const id of noteIds.slice(0, 5)) { // Last 5 notes
            const { data: noteData } = await axios.get(`${HUBSPOT_BASE}/crm/v3/objects/notes/${id}?properties=hs_note_body,hs_timestamp`, {
                headers: hubspotHeaders(apiKey)
            });
            notes.push(noteData.properties.hs_note_body);
        }
        return notes;
    } catch (error) {
        console.error('HubSpot notes fetch failed:', error.message);
        return [];
    }
}
