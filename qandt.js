import fetch from 'node-fetch';

const query = { "select": ["*"], "from": "_user" };
const transaction = [{ "_id": "_user", "username": "treyb" }];
const networkName = 'fluree';
const datasetID = '387028092977276';
const APIKey = 'b0044407cc34692ed2ab63af59a7c8b2dc6b2e3121968760f8838b665163b342';

const url = `https://api.dev.flur.ee/fdb/${networkName}/${datasetID}`
const headers = {
	'Content-Type': 'application/json',
	'Authorization': `Bearer ${APIKey}`
}

try {
	const resp = await fetch(`${url}/query`, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(query)
	})
	const data = await resp.json();
	console.log(data);
} catch (error) {
	console.error(error)
}

// try {
// 	const resp = await fetch(`${url}/transact`, {
// 		method: 'POST',
// 		headers: headers,
// 		body: JSON.stringify(transaction)
// 	})
// 	const data = await resp.json();
// 	console.log(data);
// } catch (error) {
// 	console.error(error)
// }