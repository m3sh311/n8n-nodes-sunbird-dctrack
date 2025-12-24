import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DcTrackOAuth2Api implements ICredentialType {
	name = 'dcTrackOAuth2Api';
	displayName = 'dcTrack OAuth2 API';
	documentationUrl = 'https://www.sunbirddcim.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://your-dctrack-instance.com',
			placeholder: 'https://endusertestdrivedctrackdemo.sunbirddcim.com',
			description: 'The base URL of your dcTrack instance (without trailing slash)',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			placeholder: 'dcTrack_username_123',
			description: 'OAuth2 Client ID from dcTrack (case sensitive, no spaces)',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'OAuth2 Client Secret from dcTrack',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'user_permissions',
			description: 'OAuth2 scope (typically user_permissions, case sensitive)',
			required: true,
		},
	];
}
