export type RequestBodyInteraction = {
  // https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
  app_permissions?: any;
  application_id?: string;
  channel_id?: any;
  channel?: any;
  data?: any;
  entitlements?: any;
  guild_id?: string;
  id?: string;
  token?: string;
  type: number;
  user?: RequestBodyInteractionUser;
  version?: number;
};

export type RequestBodyInteractionUser = {
  avatar: string;
  global_name: string;
  public_flags: number;
  username: string;
};

export type ResponseBodyTokenExchange = {
  access_token: string;
  refresh_token: string;
  // expires_in: number;
  // scope: string;
  // token_type: string;
};

export type ResponseBodyUsersMe = {
  avatar: string;
  email: string;
  id: string;
  locale: string;
  username: string;
};

export type ResponseBodyGuild = {
  approximate_member_count?: number;
  icon: string;
  id: string;
  name: string;
  system_channel_id?: string;
};

export type ResponseBodyChannel = Array<{
  id: string;
  type: number;
  position: number;
  name: string;
}>;

type LocalizationDict = {
  [key in 'ja' | 'en-GB' | 'en-US']: string;
};

export type RequestBodyCommand = {
  id?: string;
  type: 3; // A UI-based command that shows up when you right click or tap on a message
  application_id?: string;
  guild_id?: string;
  name: string;
  name_localizations: LocalizationDict;
  description: string;
  description_localizations: LocalizationDict;
};

export type ResponseBodyCommand = {
  id: string;
  application_id: string;
  version: string;
  type: string;
  name: string;
  guild_id: string;
};
