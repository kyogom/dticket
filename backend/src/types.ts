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

export type ResponseBodyTokenExchange = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export type ResponseBodyUsersMe = {
  avatar: string;
  email: string;
  id: string;
  locale: string;
  username: string;
};

export type ResponseBodyGuild = {
  id: string;
  name: string;
  icon: string;
  approximate_member_count?: string;
};

export type ResponseBodyChannel = Array<{
  id: string;
  type: number;
  position: number;
  name: string;
}>;
