/* eslint-disable no-console */
const fetch = require('node-fetch');
const Constants = require('../../constants/Constants');

const defaultFetch = async function defaultFetch(url, method, body, authToken) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken || null,
      },
      body: JSON.stringify(body),
    });

    const jsonResp = await response.json();
    if (jsonResp.status === 'error') throw jsonResp;

    return jsonResp.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const sendRevokeToDidi = async function sendRevokeToDidi(did, token) {
  return defaultFetch(`${Constants.DIDI_API}/issuer`, 'DELETE', {
    token,
    did,
    callbackUrl: `${Constants.ISSUER_API_URL}/register`,
  });
};

const sendRefreshToDidi = async function sendRefreshToDidi(did, token) {
  return defaultFetch(`${Constants.DIDI_API}/issuer/${did}/refresh`, 'POST', {
    token,
    callbackUrl: `${Constants.ISSUER_API_URL}/register`,
  });
};

const sendEditDataToDidi = async function sendEditDataToDidi(did, body, imageUrl) {
  const { name, description } = body;
  return defaultFetch(`${Constants.DIDI_API}/issuer/${did}`, 'PATCH', {
    name, description, imageUrl,
  });
};

const sendDidToDidi = async function sendDidToDidi(did, name, token, description, imageUrl) {
  return defaultFetch(`${Constants.DIDI_API}/issuer`, 'POST', {
    did,
    name,
    description,
    callbackUrl: `${Constants.ISSUER_API_URL}/register`,
    token,
    imageUrl,
  });
};

const sendShareRequestToDidi = async function sendShareRequestToDidi(did, jwt, authToken) {
  return defaultFetch(`${Constants.DIDI_API}/issuer/${did}/shareRequest`, 'POST', {
    jwt,
  }, authToken);
};

const getShareRequestsFromDidi = async function getShareRequestsFromDidi(authToken) {
  return defaultFetch(`${Constants.DIDI_API}/shareRequest/list`, 'GET', undefined, authToken);
};

const getShareRequestFromId = async function getShareRequestFromId(id, authToken) {
  return defaultFetch(`${Constants.DIDI_API}/issuer/shareRequest/${id}`, 'GET', undefined, authToken);
};

module.exports = {
  sendRevokeToDidi,
  sendRefreshToDidi,
  sendEditDataToDidi,
  sendDidToDidi,
  sendShareRequestToDidi,
  getShareRequestsFromDidi,
  getShareRequestFromId,
};
