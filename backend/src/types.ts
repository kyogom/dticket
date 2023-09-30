export type RequestBodyInteraction = {
  // https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
  app_permissions?: any;
  application_id: string;
  channel_id?: any;
  channel?: any;
  data: any;
  entitlements: any;
  guild_id?: string;
  id: string;
  token: string;
  type: number;
  user: RequestBodyInteractionUser;
  version: number;
};

export type RequestBodyInteractionUser = {
  avatar: string;
  global_name: string;
  public_flags: number;
  username: string;
};

export type ResponseBodyUsersMe = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  global_name: string;
  mfa_enabled: boolean;
  locale: string;
  premium_type: number;
  email: string;
};
