import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSONObject: { [key: string]: any };
  JSON: any;
};

/**
 * Represents a single Boolean value. The `count` field indicates how many systems
 * with the given value were returned by a query
 */
export type BooleanValueInfo = {
  __typename?: 'BooleanValueInfo';
  value: Scalars['Boolean'];
  count: Scalars['Int'];
};

/** A list of Boolean values together with count information */
export type BooleanValues = {
  __typename?: 'BooleanValues';
  data: Array<Maybe<BooleanValueInfo>>;
  meta: CollectionMeta;
};

/** Metadata about a collection of entities */
export type CollectionMeta = {
  __typename?: 'CollectionMeta';
  /** number of returned results */
  count: Scalars['Int'];
  /** total number of entities matching the query */
  total: Scalars['Int'];
};

/** Basic filter for boolean fields. */
export type FilterBoolean = {
  /**
   * Compares the document field with the provided value.
   * If `null` is provided then documents where the given field does not exist are returned.
   */
  is?: Maybe<Scalars['Boolean']>;
};

/** Basic filter for string fields that allows filtering based on exact match. */
export type FilterString = {
  /**
   * Compares the document field with the provided value.
   * If `null` is provided then documents where the given field does not exist are returned.
   */
  eq?: Maybe<Scalars['String']>;
};

/** String field filter that allows filtering based on exact match or using regular expression. */
export type FilterStringWithRegex = {
  /**
   * Compares the document field with the provided value.
   * If `null` is provided then documents where the given field does not exist are returned.
   */
  eq?: Maybe<Scalars['String']>;
  /** Matches the document field against the provided regular expression. */
  regex?: Maybe<Scalars['String']>;
};

/** String field filter that allows filtering based on exact match or using wildcards. */
export type FilterStringWithWildcard = {
  /**
   * Compares the document field with the provided value.
   * If `null` is provided then documents where the given field does not exist are returned.
   */
  eq?: Maybe<Scalars['String']>;
  /**
   * Compares the document field with the provided value.
   * Wildcards may be used in the query (e.g. `ki*y`).
   * Two types of wildcard operators are supported:
   * * `?`, which matches any single character
   * * `*`, which can match zero or more characters, including an empty one
   * 
   * See [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)
   * for more details.
   */
  matches?: Maybe<Scalars['String']>;
};

/**
 * String field filter that allows filtering based on exact match or using wildcards.
 * In both cases the case of a letter can be ignored (case-insensitive matching) using the `_lc` suffixed operators.
 */
export type FilterStringWithWildcardWithLowercase = {
  /**
   * Compares the document field with the provided value.
   * If `null` is provided then documents where the given field does not exist are returned.
   */
  eq?: Maybe<Scalars['String']>;
  /**
   * This operator is like [FilterStringWithWildcard.eq](#filterstring) except that it performs case-insensitive matching.
   * Furthermore, unlike for `eq`, `null` is not an allowed value.
   */
  eq_lc?: Maybe<Scalars['String']>;
  /**
   * Compares the document field with the provided value.
   * Wildcards may be used in the query (e.g. `ki*y`).
   * Two types of wildcard operators are supported:
   * * `?`, which matches any single character
   * * `*`, which can match zero or more characters, including an empty one
   * 
   * See [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html)
   * for more details.
   */
  matches?: Maybe<Scalars['String']>;
  /**
   * This operator is like
   * [FilterStringWithWildcard.matches](#filterstringwithwildcard) except that it
   * performs case-insensitive matching.
   */
  matches_lc?: Maybe<Scalars['String']>;
};

/** Filters hosts by the presence of a host tag */
export type FilterTag = {
  /** Tag namespace */
  namespace?: Maybe<FilterString>;
  /** Tag key */
  key: FilterString;
  /** Tag value */
  value?: Maybe<FilterString>;
};

/** Timestamp field filter with support for common operations. */
export type FilterTimestamp = {
  /** Less than */
  lt?: Maybe<Scalars['String']>;
  /** Less than or equal to */
  lte?: Maybe<Scalars['String']>;
  /** Greater than */
  gt?: Maybe<Scalars['String']>;
  /** Greater than or equal to */
  gte?: Maybe<Scalars['String']>;
};

/** Inventory host */
export type Host = {
  __typename?: 'Host';
  id: Scalars['ID'];
  account: Scalars['String'];
  display_name?: Maybe<Scalars['String']>;
  created_on?: Maybe<Scalars['String']>;
  modified_on?: Maybe<Scalars['String']>;
  stale_timestamp?: Maybe<Scalars['String']>;
  reporter?: Maybe<Scalars['String']>;
  ansible_host?: Maybe<Scalars['String']>;
  /** Canonical facts of a host. The subset of keys can be requested using `filter`. */
  canonical_facts?: Maybe<Scalars['JSONObject']>;
  /** System profile of a host. The subset of keys can be requested using `filter`. */
  system_profile_facts?: Maybe<Scalars['JSONObject']>;
  tags?: Maybe<Tags>;
  /** Facts of a host. The subset of keys can be requested using `filter`. */
  facts?: Maybe<Scalars['JSONObject']>;
};


/** Inventory host */
export type HostCanonical_FactsArgs = {
  filter?: Maybe<Array<Scalars['String']>>;
};


/** Inventory host */
export type HostSystem_Profile_FactsArgs = {
  filter?: Maybe<Array<Scalars['String']>>;
};


/** Inventory host */
export type HostFactsArgs = {
  filter?: Maybe<Array<Scalars['String']>>;
};

export enum Host_Tags_Order_By {
  Tag = 'tag',
  Count = 'count'
}

/** Defines criteria by which the hosts are filtered. */
export type HostFilter = {
  /** Apply logical conjunction on the given filtering criteria */
  AND?: Maybe<Array<HostFilter>>;
  /** Apply logical disjunction on the given filtering criteria */
  OR?: Maybe<Array<HostFilter>>;
  /** Negate the given filtering criteria */
  NOT?: Maybe<HostFilter>;
  /** Filter by host id */
  id?: Maybe<FilterStringWithWildcard>;
  /** Filter by insights id */
  insights_id?: Maybe<FilterStringWithWildcard>;
  /** Filter by display_name */
  display_name?: Maybe<FilterStringWithWildcardWithLowercase>;
  /** Filter by fqdn */
  fqdn?: Maybe<FilterStringWithWildcard>;
  /** Filter by 'arch' field of system profile */
  spf_arch?: Maybe<FilterStringWithWildcard>;
  /** Filter by 'os_release' field of system profile */
  spf_os_release?: Maybe<FilterStringWithWildcard>;
  /** Filter by 'os_kernel_version' field of system profile */
  spf_os_kernel_version?: Maybe<FilterStringWithWildcard>;
  /** Filter by 'infrastructure_type' field of system profile */
  spf_infrastructure_type?: Maybe<FilterStringWithWildcard>;
  /** Filter by 'infrastructure_vendor' field of system profile */
  spf_infrastructure_vendor?: Maybe<FilterStringWithWildcard>;
  /** Filter by 'sap_system' field of system profile */
  spf_sap_system?: Maybe<FilterBoolean>;
  /** Filter by 'sap_sids' field of system profile */
  spf_sap_sids?: Maybe<FilterString>;
  /** Filter by 'owner_id' field of system profile */
  spf_owner_id?: Maybe<FilterString>;
  /** Filter by the stale_timestamp value */
  stale_timestamp?: Maybe<FilterTimestamp>;
  /** Filter by host tag. The tag namespace/key/value must match exactly what the host is tagged with */
  tag?: Maybe<FilterTag>;
};

export type Hosts = {
  __typename?: 'Hosts';
  data: Array<Maybe<Host>>;
  meta: CollectionMeta;
};

export enum Hosts_Order_By {
  DisplayName = 'display_name',
  ModifiedOn = 'modified_on'
}

/** Lists unique system profile values. */
export type HostSystemProfile = {
  __typename?: 'HostSystemProfile';
  /** Lists unique values of the `sap_system` field */
  sap_system: BooleanValues;
  /** Lists unique values of the `sap_sids` field */
  sap_sids: StringValues;
};


/** Lists unique system profile values. */
export type HostSystemProfileSap_SystemArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Values_Order_By>;
  order_how?: Maybe<Order_Dir>;
};


/** Lists unique system profile values. */
export type HostSystemProfileSap_SidsArgs = {
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  filter?: Maybe<SapSidFilter>;
  order_by?: Maybe<Values_Order_By>;
  order_how?: Maybe<Order_Dir>;
};

export type HostTags = {
  __typename?: 'HostTags';
  data: Array<Maybe<TagInfo>>;
  meta: CollectionMeta;
};



export enum Order_Dir {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Query = {
  __typename?: 'Query';
  /** Fetches a list of hosts based on the given filtering, ordering and pagination criteria. */
  hosts: Hosts;
  /**
   * Fetches a list of unique tags and the number of their occurenes in the given set of systems.
   * 
   * By default the query operates on all known systems that are registered with the given account.
   * This can be altered using the `hostFilter` parameter.
   * 
   * The tags themselves can be filtered further using the `filter` parameter.
   */
  hostTags?: Maybe<HostTags>;
  /**
   * Fetches a list of unique values for a given system profile field.
   * 
   * By default the query operates on all known systems that are registered with the given account.
   * This can be altered using `hostFilter` parameter.
   */
  hostSystemProfile?: Maybe<HostSystemProfile>;
};


export type QueryHostsArgs = {
  filter?: Maybe<HostFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Hosts_Order_By>;
  order_how?: Maybe<Order_Dir>;
};


export type QueryHostTagsArgs = {
  hostFilter?: Maybe<HostFilter>;
  filter?: Maybe<TagAggregationFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Host_Tags_Order_By>;
  order_how?: Maybe<Order_Dir>;
};


export type QueryHostSystemProfileArgs = {
  hostFilter?: Maybe<HostFilter>;
};

/** Defines the criteria by which sap_sids are filtered in the `hostSystemProfile` query. */
export type SapSidFilter = {
  /**
   * Limits the aggregation to sap_sids that match the given search term.
   * The search term is a regular exression that operates on a string representation of a sap_sid.
   */
  search?: Maybe<FilterStringWithRegex>;
};

/**
 * Represents a single String value. The `count` field indicates how many systems
 * with the given value were returned by a query.
 */
export type StringValueInfo = {
  __typename?: 'StringValueInfo';
  value: Scalars['String'];
  count: Scalars['Int'];
};

/** A list of String values together with count information */
export type StringValues = {
  __typename?: 'StringValues';
  data: Array<Maybe<StringValueInfo>>;
  meta: CollectionMeta;
};

/** Structured representation of a tag */
export type StructuredTag = {
  __typename?: 'StructuredTag';
  namespace?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

/** Defines the criteria by which tags are filtered in the `hostTags` query. */
export type TagAggregationFilter = {
  /**
   * Limits the aggregation to tags that match the given search term.
   * The search term is a regular exression that operates on a string representation of a tag.
   * The string representation has a form of "namespace/key=value" i.e. the
   * segments are concatenated together using "=" and "/", respectively.
   * There is no expecing of the control characters in the segments.
   * As a result, "=" and "/" appear in every tag.
   */
  search?: Maybe<FilterStringWithRegex>;
};

export type TagInfo = {
  __typename?: 'TagInfo';
  tag: StructuredTag;
  count: Scalars['Int'];
};

export type Tags = {
  __typename?: 'Tags';
  data: Array<Maybe<StructuredTag>>;
  meta: CollectionMeta;
};

export enum Values_Order_By {
  Value = 'value',
  Count = 'count'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

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
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  Query: ResolverTypeWrapper<{}>;
  HostFilter: HostFilter;
  FilterStringWithWildcard: FilterStringWithWildcard;
  String: ResolverTypeWrapper<Scalars['String']>;
  FilterStringWithWildcardWithLowercase: FilterStringWithWildcardWithLowercase;
  FilterBoolean: FilterBoolean;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  FilterString: FilterString;
  FilterTimestamp: FilterTimestamp;
  FilterTag: FilterTag;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  HOSTS_ORDER_BY: Hosts_Order_By;
  ORDER_DIR: Order_Dir;
  Hosts: ResolverTypeWrapper<Hosts>;
  Host: ResolverTypeWrapper<Host>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  Tags: ResolverTypeWrapper<Tags>;
  StructuredTag: ResolverTypeWrapper<StructuredTag>;
  CollectionMeta: ResolverTypeWrapper<CollectionMeta>;
  TagAggregationFilter: TagAggregationFilter;
  FilterStringWithRegex: FilterStringWithRegex;
  HOST_TAGS_ORDER_BY: Host_Tags_Order_By;
  HostTags: ResolverTypeWrapper<HostTags>;
  TagInfo: ResolverTypeWrapper<TagInfo>;
  HostSystemProfile: ResolverTypeWrapper<HostSystemProfile>;
  VALUES_ORDER_BY: Values_Order_By;
  BooleanValues: ResolverTypeWrapper<BooleanValues>;
  BooleanValueInfo: ResolverTypeWrapper<BooleanValueInfo>;
  SapSidFilter: SapSidFilter;
  StringValues: ResolverTypeWrapper<StringValues>;
  StringValueInfo: ResolverTypeWrapper<StringValueInfo>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  HostFilter: HostFilter;
  FilterStringWithWildcard: FilterStringWithWildcard;
  String: Scalars['String'];
  FilterStringWithWildcardWithLowercase: FilterStringWithWildcardWithLowercase;
  FilterBoolean: FilterBoolean;
  Boolean: Scalars['Boolean'];
  FilterString: FilterString;
  FilterTimestamp: FilterTimestamp;
  FilterTag: FilterTag;
  Int: Scalars['Int'];
  Hosts: Hosts;
  Host: Host;
  ID: Scalars['ID'];
  JSONObject: Scalars['JSONObject'];
  Tags: Tags;
  StructuredTag: StructuredTag;
  CollectionMeta: CollectionMeta;
  TagAggregationFilter: TagAggregationFilter;
  FilterStringWithRegex: FilterStringWithRegex;
  HostTags: HostTags;
  TagInfo: TagInfo;
  HostSystemProfile: HostSystemProfile;
  BooleanValues: BooleanValues;
  BooleanValueInfo: BooleanValueInfo;
  SapSidFilter: SapSidFilter;
  StringValues: StringValues;
  StringValueInfo: StringValueInfo;
  JSON: Scalars['JSON'];
};

export type BooleanValueInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['BooleanValueInfo'] = ResolversParentTypes['BooleanValueInfo']> = {
  value?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BooleanValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BooleanValues'] = ResolversParentTypes['BooleanValues']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['BooleanValueInfo']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionMeta'] = ResolversParentTypes['CollectionMeta']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Host'] = ResolversParentTypes['Host']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  account?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  display_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_on?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modified_on?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stale_timestamp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reporter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ansible_host?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  canonical_facts?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType, RequireFields<HostCanonical_FactsArgs, never>>;
  system_profile_facts?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType, RequireFields<HostSystem_Profile_FactsArgs, never>>;
  tags?: Resolver<Maybe<ResolversTypes['Tags']>, ParentType, ContextType>;
  facts?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType, RequireFields<HostFactsArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HostsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Hosts'] = ResolversParentTypes['Hosts']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['Host']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HostSystemProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['HostSystemProfile'] = ResolversParentTypes['HostSystemProfile']> = {
  sap_system?: Resolver<ResolversTypes['BooleanValues'], ParentType, ContextType, RequireFields<HostSystemProfileSap_SystemArgs, 'limit' | 'offset' | 'order_by' | 'order_how'>>;
  sap_sids?: Resolver<ResolversTypes['StringValues'], ParentType, ContextType, RequireFields<HostSystemProfileSap_SidsArgs, 'limit' | 'offset' | 'filter' | 'order_by' | 'order_how'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HostTagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['HostTags'] = ResolversParentTypes['HostTags']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['TagInfo']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  hosts?: Resolver<ResolversTypes['Hosts'], ParentType, ContextType, RequireFields<QueryHostsArgs, 'limit' | 'offset' | 'order_by' | 'order_how'>>;
  hostTags?: Resolver<Maybe<ResolversTypes['HostTags']>, ParentType, ContextType, RequireFields<QueryHostTagsArgs, 'limit' | 'offset' | 'order_by' | 'order_how'>>;
  hostSystemProfile?: Resolver<Maybe<ResolversTypes['HostSystemProfile']>, ParentType, ContextType, RequireFields<QueryHostSystemProfileArgs, never>>;
};

export type StringValueInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['StringValueInfo'] = ResolversParentTypes['StringValueInfo']> = {
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StringValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['StringValues'] = ResolversParentTypes['StringValues']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['StringValueInfo']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StructuredTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['StructuredTag'] = ResolversParentTypes['StructuredTag']> = {
  namespace?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagInfo'] = ResolversParentTypes['TagInfo']> = {
  tag?: Resolver<ResolversTypes['StructuredTag'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tags'] = ResolversParentTypes['Tags']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['StructuredTag']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BooleanValueInfo?: BooleanValueInfoResolvers<ContextType>;
  BooleanValues?: BooleanValuesResolvers<ContextType>;
  CollectionMeta?: CollectionMetaResolvers<ContextType>;
  Host?: HostResolvers<ContextType>;
  Hosts?: HostsResolvers<ContextType>;
  HostSystemProfile?: HostSystemProfileResolvers<ContextType>;
  HostTags?: HostTagsResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  StringValueInfo?: StringValueInfoResolvers<ContextType>;
  StringValues?: StringValuesResolvers<ContextType>;
  StructuredTag?: StructuredTagResolvers<ContextType>;
  TagInfo?: TagInfoResolvers<ContextType>;
  Tags?: TagsResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
