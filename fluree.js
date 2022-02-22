#!/usr/bin/env node

import { signQuery, signTransaction } from '@fluree/crypto-utils';
import fetch from "node-fetch";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';


let endpoint = '';
let uri = '';
let fetchOpts = {};

const { network, db, port, url, privateKey, json } = yargs(hideBin(process.argv))
	.scriptName('flureecli')
	.usage('$0 <cmd> [args]')
	.option('n', {
		alias: 'network',
		demandOption: true,
		default: 'fluree',
		desc: 'name of the network of the dataset',
		type: 'string'
	})
	.option('d', {
		alias: 'db',
		demandOption: true,
		desc: 'name of the database of the dataset',
		type: 'string'
	})
	.option('u', {
		alias: 'url',
		default: 'http://localhost',
		desc: 'base url of the connection string',
		type: 'string'
	})
	.option('p', {
		alias: 'port',
		default: '8090',
		desc: 'port for the connection string',
		type: 'string'
	})
	.option('k', {
		alias: 'privateKey',
		desc: 'private key for the user to sign comms to fluree backend',
		type: 'string',
		demandOption: true
	})
	.option('j', {
		alias: 'json',
		desc: 'json to send as the body to the request to fluree',
		type: 'string'
	})
	.command({
		command: 'query',
		aliases: ['q'],
		desc: 'send a query to the designated url',
		handler: (argv) => handleQuery(argv)
	})
	.command({
		command: 'transact',
		aliases: ['t'],
		desc: 'send a transaction to the designated url',
		handler: (argv) => handleTransaction(argv)
	})
	.help()
	.argv

// Build the uri to connect to and query
if (url === 'https://api.dev.flur.ee') {
	uri = `${url}:${443}/fdb/${network}/${db}/${endpoint}`;
} else {
	uri = `${url}:${port}/fdb/${network}/${db}/${endpoint}`;
}

// Stringify the json body for the query (required for signing)
function buildBody(json) {
	console.log(JSON.stringify(json));
	if (json === undefined) {
		return JSON.stringify({"select": ["*"], "from": "_collection"});
	} else {
		return JSON.stringify(JSON.parse(json));
	}
}

function handleQuery(argv) {
	console.log('inside query')
	endpoint = 'query';
	let dataset = `${argv.network}/${argv.db}`;
	let body = buildBody(argv.json)

	// Pass opts to the signQuery function
	fetchOpts = signQuery(argv.privateKey, body, 'query', dataset);
}

function handleTransaction(argv) {
	console.log('inside txn')
	endpoint = 'command';
	let dataset = `${argv.network}/${argv.db}`;
	let body = buildBody(argv.json);

	fetchOpts = signTransaction('TfJCU87w434V8sipYzawqt69K16j1HAzh5z', dataset, 20, 100000, null, argv.privateKey, body);
	
	console.log(fetchOpts)
}

try {
	// Fetch 
	console.log(fetchOpts);
	const response = await fetch(uri, fetchOpts);
	const data = await response.status;
	console.log(`Data: `);
	console.log(data);
} catch (error) {
	console.error(`Error received: ${error}`)
}
