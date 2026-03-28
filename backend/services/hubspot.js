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
    await axios.post(`${HUBSPOT_BASE}/crm/v3/objects/notes`, {
      properties: {
        hs_note_body: noteBody,
        hs_timestamp: Date.now()
      },
      associations: [{ to: { id: dealId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 214 }] }]
    }, { headers: hubspotHeaders(apiKey) });
  } catch (error) {
    console.error('HubSpot note creation failed:', error.message);
  }
}
