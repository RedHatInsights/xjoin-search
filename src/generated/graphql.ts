import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  JSONObject: { [key: string]: any },
  JSON: any,
};

/** Metadata about a collection of entities */
export type CollectionMeta = {
   __typename?: 'CollectionMeta',
  /** number of returned results */
  count: Scalars['Int'],
  /** total number of entities matching the query */
  total: Scalars['Int'],
};

export type Host = {
   __typename?: 'Host',
  id: Scalars['ID'],
  account: Scalars['String'],
  display_name?: Maybe<Scalars['String']>,
  created_on?: Maybe<Scalars['String']>,
  modified_on?: Maybe<Scalars['String']>,
  canonical_facts?: Maybe<Scalars['JSONObject']>,
  /** EXPERIMENTAL - do not use! */
  system_profile_facts?: Maybe<Scalars['JSONObject']>,
};

/** 
 * Defines criteria by which the hosts are filtered.
 * 
 * Some filters support wildcards.
 * Those that do can be used for exact matches (`fqdn: example.com`) or with wildcards (`fqdn: *.example.co?`)
 **/
export type HostFilter = {
  AND?: Maybe<Array<HostFilter>>,
  OR?: Maybe<Array<HostFilter>>,
  NOT?: Maybe<HostFilter>,
  /** Filter by host id. This filter supports wildcards */
  id?: Maybe<Scalars['String']>,
  /** Filter by insights id. This filter supports wildcards */
  insights_id?: Maybe<Scalars['String']>,
  /** Filter by display_name. This filter supports wildcards */
  display_name?: Maybe<Scalars['String']>,
  /** Filter by fqdn. This filter supports wildcards */
  fqdn?: Maybe<Scalars['String']>,
  spf_arch?: Maybe<Scalars['String']>,
  spf_os_release?: Maybe<Scalars['String']>,
  spf_os_kernel_version?: Maybe<Scalars['String']>,
  spf_infrastructure_type?: Maybe<Scalars['String']>,
  spf_infrastructure_vendor?: Maybe<Scalars['String']>,
};

export type Hosts = {
   __typename?: 'Hosts',
  data: Array<Maybe<Host>>,
  meta: CollectionMeta,
};

export enum Hosts_Order_By {
  DisplayName = 'display_name',
  ModifiedOn = 'modified_on'
}



export enum Order_Dir {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Query = {
   __typename?: 'Query',
  /** Fetches a list of hosts based on the given filtering, ordering and pagination criteria. */
  hosts: Hosts,
};


export type QueryHostsArgs = {
  filter?: Maybe<HostFilter>,
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>,
  order_by?: Maybe<Hosts_Order_By>,
  order_how?: Maybe<Order_Dir>
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  HostFilter: HostFilter,
  String: ResolverTypeWrapper<Scalars['String']>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  HOSTS_ORDER_BY: Hosts_Order_By,
  ORDER_DIR: Order_Dir,
  Hosts: ResolverTypeWrapper<Hosts>,
  Host: ResolverTypeWrapper<Host>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>,
  CollectionMeta: ResolverTypeWrapper<CollectionMeta>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  JSON: ResolverTypeWrapper<Scalars['JSON']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  HostFilter: HostFilter,
  String: Scalars['String'],
  Int: Scalars['Int'],
  HOSTS_ORDER_BY: Hosts_Order_By,
  ORDER_DIR: Order_Dir,
  Hosts: Hosts,
  Host: Host,
  ID: Scalars['ID'],
  JSONObject: Scalars['JSONObject'],
  CollectionMeta: CollectionMeta,
  Boolean: Scalars['Boolean'],
  JSON: Scalars['JSON'],
};

export type CollectionMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionMeta'] = ResolversParentTypes['CollectionMeta']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
};

export type HostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Host'] = ResolversParentTypes['Host']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  account?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  display_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  created_on?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  modified_on?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  canonical_facts?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>,
  system_profile_facts?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>,
};

export type HostsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Hosts'] = ResolversParentTypes['Hosts']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['Host']>>, ParentType, ContextType>,
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>,
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject'
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  hosts?: Resolver<ResolversTypes['Hosts'], ParentType, ContextType, RequireFields<QueryHostsArgs, 'limit' | 'offset' | 'order_by' | 'order_how'>>,
};

export type Resolvers<ContextType = any> = {
  CollectionMeta?: CollectionMetaResolvers<ContextType>,
  Host?: HostResolvers<ContextType>,
  Hosts?: HostsResolvers<ContextType>,
  JSON?: GraphQLScalarType,
  JSONObject?: GraphQLScalarType,
  Query?: QueryResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
