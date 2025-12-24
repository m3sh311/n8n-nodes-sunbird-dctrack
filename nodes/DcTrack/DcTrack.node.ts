import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class DcTrack implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'dcTrack',
		name: 'dcTrack',
		icon: 'file:dctrack.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Sunbird dcTrack DCIM platform',
		defaults: {
			name: 'dcTrack',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
		  {
		    name: 'httpBasicAuth',
		    required: false,
		  },
		  {
		    name: 'dcTrackOAuth2Api',
		    required: false,
		  },
		],
		properties: [
			// Base URL configuration
			{
				displayName: 'Base URL',
				name: 'baseUrl',
				type: 'string',
				default: 'https://endusertestdrivedctrackdemo.sunbirddcim.com',
				placeholder: 'https://your-dctrack-instance.com',
				description: 'The base URL of your dcTrack instance (without trailing slash)',
				required: true,
			},
			
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Item',
						value: 'item',
						description: 'Manage equipment and assets',
					},
					{
						name: 'Connection',
						value: 'connection',
						description: 'Manage data connections',
					},
				],
				default: 'item',
			},

			// ITEM OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['item'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new item',
						action: 'Create an item',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an item',
						action: 'Get an item',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an item',
						action: 'Update an item',
					},
					{
						name: 'Move',
						value: 'move',
						description: 'Move an item to a new location',
						action: 'Move an item',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for items with filters',
						action: 'Search items',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an item',
						action: 'Delete an item',
					},
				],
				default: 'create',
			},

			// CREATE ITEM FIELDS
			{
				displayName: 'Item Name',
				name: 'itemName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'The name of the item to create',
			},
			{
				displayName: 'Make',
				name: 'make',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'Dell',
				description: 'The manufacturer/make',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'Poweredge R750',
				description: 'The model of the item',
			},
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				placeholder: 'SITE A',
				description: 'The location/site',
			},
			{
				displayName: 'Cabinet',
				name: 'cabinet',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '8K',
				description: 'The cabinet name',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'U Position',
						name: 'cmbUPosition',
						type: 'string',
						default: '',
						placeholder: '20',
						description: 'U position in the cabinet',
					},
					{
						displayName: 'Status',
						name: 'cmbStatus',
						type: 'options',
						options: [
							{ name: 'Planned', value: 'Planned' },
							{ name: 'Active', value: 'Active' },
							{ name: 'Decommissioned', value: 'Decommissioned' },
							{ name: 'Storage', value: 'Storage' },
						],
						default: 'Planned',
						description: 'Status of the item',
					},
					{
						displayName: 'Serial Number',
						name: 'tiSerialNumber',
						type: 'string',
						default: '',
						description: 'Serial number of the item',
					},
					{
						displayName: 'Asset Tag',
						name: 'tiAssetTag',
						type: 'string',
						default: '',
						description: 'Asset tag identifier',
					},
					{
						displayName: 'Description',
						name: 'tiDescription',
						type: 'string',
						default: '',
						description: 'Description of the item',
					},
					{
						displayName: 'Power Rating (Watts)',
						name: 'tiRatedPower',
						type: 'number',
						default: 0,
						description: 'Rated power consumption in watts',
					},
				],
			},

			// GET ITEM FIELDS
			{
				displayName: 'Search By',
				name: 'searchBy',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['get'],
					},
				},
				options: [
					{
						name: 'Item Name',
						value: 'name',
						description: 'Search by item name',
					},
					{
						name: 'Item ID',
						value: 'id',
						description: 'Search by item ID',
					},
				],
				default: 'name',
				description: 'How to search for the item',
			},
			{
				displayName: 'Item Name',
				name: 'itemNameGet',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['get'],
						searchBy: ['name'],
					},
				},
				default: '',
				required: true,
				description: 'The name of the item to retrieve',
			},
			{
				displayName: 'Item ID',
				name: 'itemIdGet',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['get'],
						searchBy: ['id'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the item',
			},

			// UPDATE ITEM FIELDS
			{
				displayName: 'Item ID',
				name: 'itemIdUpdate',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['update'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the item to update',
			},
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Item Name',
						name: 'tiName',
						type: 'string',
						default: '',
						description: 'New name for the item',
					},
					{
						displayName: 'Make',
						name: 'cmbMake',
						type: 'string',
						default: '',
						description: 'Manufacturer/make',
					},
					{
						displayName: 'Model',
						name: 'cmbModel',
						type: 'string',
						default: '',
						description: 'Model',
					},
					{
						displayName: 'Location',
						name: 'cmbLocation',
						type: 'string',
						default: '',
						description: 'New location for the item',
					},
					{
						displayName: 'Cabinet',
						name: 'cmbCabinet',
						type: 'string',
						default: '',
						description: 'Cabinet name',
					},
					{
						displayName: 'U Position',
						name: 'cmbUPosition',
						type: 'string',
						default: '',
						description: 'U position in cabinet',
					},
					{
						displayName: 'Status',
						name: 'cmbStatus',
						type: 'options',
						options: [
							{ name: 'Planned', value: 'Planned' },
							{ name: 'Active', value: 'Active' },
							{ name: 'Decommissioned', value: 'Decommissioned' },
							{ name: 'Storage', value: 'Storage' },
						],
						default: 'Planned',
						description: 'Status of the item',
					},
					{
						displayName: 'Serial Number',
						name: 'tiSerialNumber',
						type: 'string',
						default: '',
						description: 'Serial number',
					},
					{
						displayName: 'Asset Tag',
						name: 'tiAssetTag',
						type: 'string',
						default: '',
						description: 'Asset tag',
					},
					{
						displayName: 'Description',
						name: 'tiDescription',
						type: 'string',
						default: '',
						description: 'Description',
					},
				],
			},

			// MOVE ITEM FIELDS
			{
				displayName: 'Item ID',
				name: 'itemIdMove',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['move'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the item to move',
			},
			{
				displayName: 'New Cabinet',
				name: 'newCabinet',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['move'],
					},
				},
				default: '',
				required: true,
				placeholder: '8F',
				description: 'The cabinet to move the item to',
			},
			{
				displayName: 'New U Position',
				name: 'newUPosition',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['move'],
					},
				},
				default: '',
				required: true,
				placeholder: '12',
				description: 'The U position in the new cabinet',
			},
			{
				displayName: 'Additional Move Fields',
				name: 'additionalMoveFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['move'],
					},
				},
				options: [
					{
						displayName: 'New Location',
						name: 'cmbLocation',
						type: 'string',
						default: '',
						description: 'Change location/site when moving',
					},
				],
			},

			// SEARCH ITEMS FIELDS
			{
				displayName: 'Search Filters',
				name: 'searchFilterFields',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Item Name',
						name: 'tiName',
						type: 'string',
						default: '',
						placeholder: 'server*',
						description: 'Filter by item name (supports wildcard *)',
					},
					{
						displayName: 'Location',
						name: 'cmbLocation',
						type: 'string',
						default: '',
						placeholder: 'SITE A',
						description: 'Filter by location',
					},
					{
						displayName: 'Cabinet',
						name: 'cmbCabinet',
						type: 'string',
						default: '',
						placeholder: '8K',
						description: 'Filter by cabinet',
					},
					{
						displayName: 'Make',
						name: 'cmbMake',
						type: 'string',
						default: '',
						placeholder: 'Dell',
						description: 'Filter by manufacturer/make',
					},
					{
						displayName: 'Model',
						name: 'cmbModel',
						type: 'string',
						default: '',
						placeholder: 'Poweredge R750',
						description: 'Filter by model',
					},
					{
						displayName: 'Status',
						name: 'cmbStatus',
						type: 'options',
						options: [
							{ name: 'All', value: '' },
							{ name: 'Planned', value: 'Planned' },
							{ name: 'Active', value: 'Active' },
							{ name: 'Decommissioned', value: 'Decommissioned' },
							{ name: 'Storage', value: 'Storage' },
						],
						default: '',
						description: 'Filter by status',
					},
					{
						displayName: 'Class',
						name: 'tiClass',
						type: 'string',
						default: '',
						placeholder: 'Device',
						description: 'Filter by class',
					},
				],
			},
			{
				displayName: 'Return Fields',
				name: 'returnFields',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['search'],
					},
				},
				options: [
					{ name: 'Item Name', value: 'tiName' },
					{ name: 'Location', value: 'cmbLocation' },
					{ name: 'Cabinet', value: 'cmbCabinet' },
					{ name: 'U Position', value: 'cmbUPosition' },
					{ name: 'Make', value: 'cmbMake' },
					{ name: 'Model', value: 'cmbModel' },
					{ name: 'Status', value: 'cmbStatus' },
					{ name: 'Serial Number', value: 'tiSerialNumber' },
					{ name: 'Asset Tag', value: 'tiAssetTag' },
					{ name: 'Class', value: 'tiClass' },
					{ name: 'ID', value: 'id' },
				],
				default: ['tiName', 'cmbLocation', 'cmbCabinet'],
				description: 'Select which fields to return in the results',
			},
			{
				displayName: 'Page Number',
				name: 'pageNumber',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['search'],
					},
				},
				default: 1,
				description: 'Page number for pagination',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['search'],
					},
				},
				default: 100,
				description: 'Number of results per page',
			},

			// DELETE ITEM FIELDS
			{
				displayName: 'Item ID',
				name: 'itemIdDelete',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['delete'],
					},
				},
				default: '',
				required: true,
				description: 'The ID of the item to delete',
			},
			{
				displayName: 'Proceed On Warning',
				name: 'proceedOnWarning',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['item'],
						operation: ['delete'],
					},
				},
				default: true,
				description: 'Whether to proceed if there are warnings',
			},

			// CONNECTION OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['connection'],
					},
				},
				options: [
					{
						name: 'Create Data Connection',
						value: 'createData',
						description: 'Create a new data connection',
						action: 'Create a data connection',
					},
				],
				default: 'createData',
			},

			// CREATE DATA CONNECTION FIELDS
			{
				displayName: 'Circuit ID',
				name: 'circuitId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['createData'],
					},
				},
				default: '',
				required: true,
				placeholder: 'Circuit A',
				description: 'Circuit identifier',
			},
			{
				displayName: 'Starting Item Location',
				name: 'startingItemLocation',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['createData'],
					},
				},
				default: '',
				required: true,
				description: 'Location of the starting item',
			},
			{
				displayName: 'Starting Item Name',
				name: 'startingItemName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['createData'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the starting item',
			},
			{
				displayName: 'Starting Port Name',
				name: 'startingPortName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['createData'],
					},
				},
				default: '',
				required: true,
				placeholder: 'Eth01',
				description: 'Starting port name',
			},
			{
				displayName: 'Ending Item Location',
				name: 'endingItemLocation',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['createData'],
					},
				},
				default: '',
				required: true,
				description: 'Location of the ending item',
			},
			{
				displayName: 'Ending Item Name',
				name: 'endingItemName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['createData'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the ending item',
			},
			{
				displayName: 'Ending Port Name',
				name: 'endingPortName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['createData'],
					},
				},
				default: '',
				required: true,
				placeholder: 'P22',
				description: 'Ending port name',
			},
			{
				displayName: 'Additional Connection Fields',
				name: 'additionalConnectionFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['connection'],
						operation: ['createData'],
					},
				},
				options: [
					{
						displayName: 'Length Units',
						name: 'lengthUnits',
						type: 'options',
						options: [
							{ name: 'US (Feet)', value: 'US' },
							{ name: 'Metric (Meters)', value: 'Metric' },
						],
						default: 'US',
						description: 'Units for cable length',
					},
					{
						displayName: 'Project Number',
						name: 'projectNumber',
						type: 'string',
						default: '',
						description: 'Associated project number',
					},
					{
						displayName: 'Cord List (JSON)',
						name: 'cordList',
						type: 'json',
						default: '[]',
						placeholder: '[{"cordId": "C1", "cordType": "Patch Cord", "cordlength": "10", "cordColor": "Yellow"}]',
						description: 'List of cords as JSON array',
					},
					{
						displayName: 'Hop List (JSON)',
						name: 'hopList',
						type: 'json',
						default: '[]',
						placeholder: '[{"nearEndPanelLocation": "SITE A", "nearEndPanelName": "Panel1", "nearEndPortName": "P1"}]',
						description: 'List of connection hops as JSON array',
					},
					{
						displayName: 'Proceed On Warning',
						name: 'proceedOnWarning',
						type: 'boolean',
						default: false,
						description: 'Whether to proceed if there are warnings',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Detect which credentials type is being used
	let authHeaders: IDataObject = {};
	let useBasicAuth = false;

	try {
		const basicCreds = await this.getCredentials('httpBasicAuth');
		if (basicCreds) {
			useBasicAuth = true;
		}
	} catch (error) {
		// Basic auth not configured, try OAuth2
	}

	// Get OAuth2 token if needed
	let oauthToken = '';
	if (!useBasicAuth) {
		try {
			const oauth2Creds = await this.getCredentials('dcTrackOAuth2Api');
			if (oauth2Creds) {
				// Get OAuth2 token
				const tokenUrl = `${oauth2Creds.baseUrl}/oauth/token`;
				const tokenBody = new URLSearchParams({
					grant_type: 'client_credentials',
					scope: oauth2Creds.scope as string,
					client_id: oauth2Creds.clientId as string,
					client_secret: oauth2Creds.clientSecret as string,
				});

				const tokenResponse = await this.helpers.httpRequest({
					method: 'POST',
					url: tokenUrl,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: tokenBody.toString(),
				});

				oauthToken = tokenResponse.access_token;
				authHeaders = {
					'Authorization': `Bearer ${oauthToken}`,
				};
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				'No valid credentials configured. Please add either Basic Auth or OAuth2 credentials.',
			);
		}
	}

	// Get Basic Auth credentials if using Basic Auth
	const basicAuthCreds = useBasicAuth ? await this.getCredentials('httpBasicAuth') : null;

	for (let i = 0; i < items.length; i++) {
		try {
			const baseUrl = this.getNodeParameter('baseUrl', i) as string;

			// Prepare auth object for Basic Auth
			const auth = useBasicAuth && basicAuthCreds ? {
				username: basicAuthCreds.user as string,
				password: basicAuthCreds.password as string,
			} : undefined;

				// ITEM OPERATIONS
				if (resource === 'item') {
					// CREATE ITEM
					if (operation === 'create') {
						const itemName = this.getNodeParameter('itemName', i) as string;
						const make = this.getNodeParameter('make', i) as string;
						const model = this.getNodeParameter('model', i) as string;
						const location = this.getNodeParameter('location', i) as string;
						const cabinet = this.getNodeParameter('cabinet', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							tiName: itemName,
							cmbModel: model,
							cmbLocation: location,
							...(make && { cmbMake: make }),
							...(cabinet && { cmbCabinet: cabinet }),
							...additionalFields,
						};

						const responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/api/v2/dcimoperations/items`,
							qs: {
								returnDetails: true,
							},
							body: body,
							json: true,
							...(auth && { auth }),
							headers: {
								'Content-Type': 'application/json',
								...authHeaders,
							},
						});

						returnData.push(responseData as IDataObject);
					}

					// GET ITEM
					if (operation === 'get') {
						const searchBy = this.getNodeParameter('searchBy', i) as string;

						if (searchBy === 'name') {
							const itemName = this.getNodeParameter('itemNameGet', i) as string;

							const responseData = await this.helpers.httpRequest({
							  method: 'GET',
							  url: `${baseUrl}/api/v2/dcimoperations/search/items/${encodeURIComponent(itemName)}`,
							  json: true,
							  ...(auth && { auth }),
							  headers: {
							    ...authHeaders,
							  },
							});

							returnData.push(responseData as IDataObject);
						} else {
							const itemId = this.getNodeParameter('itemIdGet', i) as string;

							const responseData = await this.helpers.httpRequest({
							  method: 'GET',
							  url: `${baseUrl}/api/v2/dcimoperations/items/${itemId}`,
							  json: true,
							  ...(auth && { auth }),
							  headers: {
							    ...authHeaders,
							  },
							});

							returnData.push(responseData as IDataObject);
						}
					}

					// UPDATE ITEM
					if (operation === 'update') {
						const itemId = this.getNodeParameter('itemIdUpdate', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const responseData = await this.helpers.httpRequest({
							method: 'PUT',
							url: `${baseUrl}/api/v2/dcimoperations/items/${itemId}`,
							qs: {
								returnDetails: true,
							},
							body: updateFields,
							json: true,
							...(auth && { auth }),
							headers: {
								'Content-Type': 'application/json',
								...authHeaders,
							},
						});

						returnData.push(responseData as IDataObject);
					}

					// MOVE ITEM
					if (operation === 'move') {
						const itemId = this.getNodeParameter('itemIdMove', i) as string;
						const newCabinet = this.getNodeParameter('newCabinet', i) as string;
						const newUPosition = this.getNodeParameter('newUPosition', i) as string;
						const additionalMoveFields = this.getNodeParameter('additionalMoveFields', i, {}) as IDataObject;

						const moveBody: IDataObject = {
							cmbCabinet: newCabinet,
							cmbUPosition: newUPosition,
							...additionalMoveFields,
						};

						const responseData = await this.helpers.httpRequest({
							method: 'PUT',
							url: `${baseUrl}/api/v2/dcimoperations/items/${itemId}`,
							qs: {
								returnDetails: true,
							},
							body: moveBody,
							json: true,
							...(auth && { auth }),
							headers: {
								'Content-Type': 'application/json',
								...authHeaders,
							},
						});

						returnData.push(responseData as IDataObject);
					}

					// SEARCH ITEMS
					if (operation === 'search') {
						const searchFilterFields = this.getNodeParameter('searchFilterFields', i, {}) as IDataObject;
						const returnFields = this.getNodeParameter('returnFields', i) as string[];
						const pageNumber = this.getNodeParameter('pageNumber', i) as number;
						const pageSize = this.getNodeParameter('pageSize', i) as number;

						// Build columns array from search filter fields
						const columns: IDataObject[] = [];
						
						// Add filter for each field that has a value
						for (const [fieldName, fieldValue] of Object.entries(searchFilterFields)) {
							if (fieldValue && fieldValue !== '') {
								columns.push({
									name: fieldName,
									filter: { eq: fieldValue },
								});
							}
						}

						// If no filters provided, search all
						if (columns.length === 0) {
							columns.push({
								name: 'tiMultiField',
								filter: { eq: '*' },
							});
						}

						// Build selected columns array
						const selectedColumns = returnFields.map((field: string) => ({ name: field }));

						const searchBody = {
							columns: columns,
							selectedColumns: selectedColumns,
						};

						const responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/api/v2/quicksearch/items`,
							qs: {
								pageNumber: pageNumber,
								pageSize: pageSize,
							},
							body: searchBody,
							json: true,
							...(auth && { auth }),
							headers: {
								'Content-Type': 'application/json',
								...authHeaders,
							},
						});

						returnData.push(responseData as IDataObject);
					}

					// DELETE ITEM
					if (operation === 'delete') {
						const itemId = this.getNodeParameter('itemIdDelete', i) as string;
						const proceedOnWarning = this.getNodeParameter('proceedOnWarning', i) as boolean;
						await this.helpers.httpRequest({
						  method: 'DELETE',
						  url: `${baseUrl}/api/v2/dcimoperations/items/${itemId}`,
						  qs: {
						    proceedonwarning: proceedOnWarning,
						  },
						  json: true,
						  ...(auth && { auth }),
						  headers: {
						  ...authHeaders,
						  },
						});
						

						returnData.push({ success: true, itemId, deleted: true });
					}
				}

				// CONNECTION OPERATIONS
				if (resource === 'connection') {
					// CREATE DATA CONNECTION
					if (operation === 'createData') {
						const circuitId = this.getNodeParameter('circuitId', i) as string;
						const startingItemLocation = this.getNodeParameter('startingItemLocation', i) as string;
						const startingItemName = this.getNodeParameter('startingItemName', i) as string;
						const startingPortName = this.getNodeParameter('startingPortName', i) as string;
						const endingItemLocation = this.getNodeParameter('endingItemLocation', i) as string;
						const endingItemName = this.getNodeParameter('endingItemName', i) as string;
						const endingPortName = this.getNodeParameter('endingPortName', i) as string;
						const additionalFields = this.getNodeParameter('additionalConnectionFields', i, {}) as IDataObject;

						const body: IDataObject = {
							circuitId,
							startingItemLocation,
							startingItemName,
							startingPortName,
							endingItemLocation,
							endingItemName,
							endingPortName,
							lengthUnits: additionalFields.lengthUnits || 'US',
							projectNumber: additionalFields.projectNumber || '',
							proceedOnWarning: additionalFields.proceedOnWarning || false,
						};

						if (additionalFields.cordList) {
							try {
								body.cordList = JSON.parse(additionalFields.cordList as string);
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									'Cord List must be valid JSON array',
								);
							}
						} else {
							body.cordList = [];
						}

						if (additionalFields.hopList) {
							try {
								body.hopList = JSON.parse(additionalFields.hopList as string);
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									'Hop List must be valid JSON array',
								);
							}
						} else {
							body.hopList = [];
						}

						const responseData = await this.helpers.httpRequest({
							method: 'POST',
							url: `${baseUrl}/api/v2/connections/dataconnections`,
							body: body,
							json: true,
							...(auth && { auth }),
							headers: {
								'Content-Type': 'application/json',
								...authHeaders,
							},
						});

						returnData.push(responseData as IDataObject);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({ error: errorMessage });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
