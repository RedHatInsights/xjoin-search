import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: number;
  JSON: any;
  JSONObject: { [key: string]: any };
};

/** Represents a single Boolean value. The `count` field indicates how many systems with the given value were returned by a query */
export type BooleanValueInfo = {
  __typename?: 'BooleanValueInfo';
  count: Scalars['Int'];
  value: Scalars['Boolean'];
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

/** Filter by 'ansible' field of system profile */
export type FilterAnsible = {
  /** Filter by 'catalog_worker_version' field of ansible */
  catalog_worker_version?: InputMaybe<FilterStringWithWildcard>;
  /** Filter by 'controller_version' field of ansible */
  controller_version?: InputMaybe<FilterStringWithWildcard>;
  /** Filter by 'hub_version' field of ansible */
  hub_version?: InputMaybe<FilterStringWithWildcard>;
  /** Filter by 'sso_version' field of ansible */
  sso_version?: InputMaybe<FilterStringWithWildcard>;
};

/** Basic filter for boolean fields. */
export type FilterBoolean = {
  /**
   * Compares the document field with the provided value.
   * If `null` is provided then documents where the given field does not exist are returned.
   */
  is?: InputMaybe<Scalars['Boolean']>;
};

/** Filter by 'disk_devices' field of system profile */
export type FilterDiskDevices = {
  /** Filter by 'device' field of disk_devices */
  device?: InputMaybe<FilterString>;
  /** Filter by 'label' field of disk_devices */
  label?: InputMaybe<FilterString>;
  /** Filter by 'mount_point' field of disk_devices */
  mount_point?: InputMaybe<FilterString>;
  /** Filter by 'type' field of disk_devices */
  type?: InputMaybe<FilterString>;
};

/** Filter by 'dnf_modules' field of system profile */
export type FilterDnfModules = {
  /** Filter by 'name' field of dnf_modules */
  name?: InputMaybe<FilterString>;
  /** Filter by 'stream' field of dnf_modules */
  stream?: InputMaybe<FilterString>;
};

/** Filter by 'installed_products' field of system profile */
export type FilterInstalledProducts = {
  /** Filter by 'id' field of installed_products */
  id?: InputMaybe<FilterString>;
  /** Filter by 'name' field of installed_products */
  name?: InputMaybe<FilterString>;
  /** Filter by 'status' field of installed_products */
  status?: InputMaybe<FilterString>;
};

/** Timestamp field filter with support for common operations. */
export type FilterInt = {
  /** Equal to */
  eq?: InputMaybe<Scalars['BigInt']>;
  /** Greater than */
  gt?: InputMaybe<Scalars['BigInt']>;
  /** Greater than or equal to */
  gte?: InputMaybe<Scalars['BigInt']>;
  /** Less than */
  lt?: InputMaybe<Scalars['BigInt']>;
  /** Less than or equal to */
  lte?: InputMaybe<Scalars['BigInt']>;
};

/** Filter by 'mssql' field of system profile */
export type FilterMssql = {
  /** Filter by 'version' field of mssql */
  version?: InputMaybe<FilterStringWithWildcard>;
};

/** Filter by 'network_interfaces' field of system profile */
export type FilterNetworkInterfaces = {
  /** Filter by 'ipv4_addresses' field of network_interfaces */
  ipv4_addresses?: InputMaybe<FilterString>;
  /** Filter by 'ipv6_addresses' field of network_interfaces */
  ipv6_addresses?: InputMaybe<FilterString>;
  /** Filter by 'mac_address' field of network_interfaces */
  mac_address?: InputMaybe<FilterString>;
  /** Filter by 'mtu' field of network_interfaces */
  mtu?: InputMaybe<FilterInt>;
  /** Filter by 'name' field of network_interfaces */
  name?: InputMaybe<FilterString>;
  /** Filter by 'state' field of network_interfaces */
  state?: InputMaybe<FilterString>;
  /** Filter by 'type' field of network_interfaces */
  type?: InputMaybe<FilterString>;
};

/** Filter by 'operating_system' field of system profile */
export type FilterOperatingSystem = {
  /** Filter by 'major' field of operating_system */
  major?: InputMaybe<FilterInt>;
  /** Filter by 'minor' field of operating_system */
  minor?: InputMaybe<FilterInt>;
  /** Filter by 'name' field of operating_system */
  name?: InputMaybe<FilterString>;
};

/** Per-reporter staleness filter. */
export type FilterPerReporterStaleness = {
  check_in_succeeded?: InputMaybe<FilterBoolean>;
  last_check_in?: InputMaybe<FilterTimestamp>;
  reporter?: InputMaybe<FilterString>;
  stale_timestamp?: InputMaybe<FilterTimestamp>;
};

/** Filter by 'rhsm' field of system profile */
export type FilterRhsm = {
  /** Filter by 'version' field of rhsm */
  version?: InputMaybe<FilterString>;
};

/** Filter by 'rpm_ostree_deployments' field of system profile */
export type FilterRpmOstreeDeployments = {
  /** Filter by 'booted' field of rpm_ostree_deployments */
  booted?: InputMaybe<FilterBoolean>;
  /** Filter by 'checksum' field of rpm_ostree_deployments */
  checksum?: InputMaybe<FilterString>;
  /** Filter by 'id' field of rpm_ostree_deployments */
  id?: InputMaybe<FilterString>;
  /** Filter by 'origin' field of rpm_ostree_deployments */
  origin?: InputMaybe<FilterString>;
  /** Filter by 'osname' field of rpm_ostree_deployments */
  osname?: InputMaybe<FilterString>;
  /** Filter by 'pinned' field of rpm_ostree_deployments */
  pinned?: InputMaybe<FilterBoolean>;
  /** Filter by 'version' field of rpm_ostree_deployments */
  version?: InputMaybe<FilterString>;
};

/** Filter by 'sap' field of system profile */
export type FilterSap = {
  /** Filter by 'instance_number' field of sap */
  instance_number?: InputMaybe<FilterString>;
  /** Filter by 'sap_system' field of sap */
  sap_system?: InputMaybe<FilterBoolean>;
  /** Filter by 'sids' field of sap */
  sids?: InputMaybe<FilterString>;
  /** Filter by 'version' field of sap */
  version?: InputMaybe<FilterString>;
};

/** Basic filter for string fields that allows filtering based on exact match. */
export type FilterString = {
  /**
   * Compares the document field with the provided value.
   * If `null` is provided then documents where the given field does not exist are returned.
   */
  eq?: InputMaybe<Scalars['String']>;
};

/** String field filter that allows filtering based on exact match or using regular expression. */
export type FilterStringWithRegex = {
  /**
   * Compares the document field with the provided value.
   * If `null` is provided then documents where the given field does not exist are returned.
   */
  eq?: InputMaybe<Scalars['String']>;
  /** Matches the document field against the provided regular expression. */
  regex?: InputMaybe<Scalars['String']>;
};

/** String field filter that allows filtering based on exact match or using wildcards. */
export type FilterStringWithWildcard = {
  /**
   * Compares the document field with the provided value.
   * If `null` is provided then documents where the given field does not exist are returned.
   */
  eq?: InputMaybe<Scalars['String']>;
  /**
   * Compares the document field with the provided value.
   * Wildcards may be used in the query (e.g. `ki*y`).
   * Two types of wildcard operators are supported:
   * * `?`, which matches any single character
   * * `*`, which can match zero or more characters, including an empty one
   *
   * See [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html) for more details.
   */
  matches?: InputMaybe<Scalars['String']>;
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
  eq?: InputMaybe<Scalars['String']>;
  /**
   * This operator is like [FilterStringWithWildcard.eq](#filterstring) except that it performs case-insensitive matching.
   * Furthermore, unlike for `eq`, `null` is not an allowed value.
   */
  eq_lc?: InputMaybe<Scalars['String']>;
  /**
   * Compares the document field with the provided value.
   * Wildcards may be used in the query (e.g. `ki*y`).
   * Two types of wildcard operators are supported:
   * * `?`, which matches any single character
   * * `*`, which can match zero or more characters, including an empty one
   *
   * See [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html) for more details.
   */
  matches?: InputMaybe<Scalars['String']>;
  /** This operator is like [FilterStringWithWildcard.matches](#filterstringwithwildcard) except that it performs case-insensitive matching. */
  matches_lc?: InputMaybe<Scalars['String']>;
};

/** Filter by 'system_purpose' field of system profile */
export type FilterSystemPurpose = {
  /** Filter by 'role' field of system_purpose */
  role?: InputMaybe<FilterString>;
  /** Filter by 'sla' field of system_purpose */
  sla?: InputMaybe<FilterString>;
  /** Filter by 'usage' field of system_purpose */
  usage?: InputMaybe<FilterString>;
};

/** Filters hosts by the presence of a host tag */
export type FilterTag = {
  /** Tag key */
  key: FilterString;
  /** Tag namespace */
  namespace?: InputMaybe<FilterString>;
  /** Tag value */
  value?: InputMaybe<FilterString>;
};

/** Timestamp field filter with support for common operations. */
export type FilterTimestamp = {
  /** Equal */
  eq?: InputMaybe<Scalars['String']>;
  /** Greater than */
  gt?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to */
  gte?: InputMaybe<Scalars['String']>;
  /** Less than */
  lt?: InputMaybe<Scalars['String']>;
  /** Less than or equal to */
  lte?: InputMaybe<Scalars['String']>;
};

export enum Hosts_Order_By {
  DisplayName = 'display_name',
  ModifiedOn = 'modified_on',
  OperatingSystem = 'operating_system'
}

export enum Host_Tags_Order_By {
  Count = 'count',
  Tag = 'tag'
}

/** Inventory host */
export type Host = {
  __typename?: 'Host';
  account?: Maybe<Scalars['String']>;
  ansible_host?: Maybe<Scalars['String']>;
  /** Canonical facts of a host. The subset of keys can be requested using `filter`. */
  canonical_facts?: Maybe<Scalars['JSONObject']>;
  created_on?: Maybe<Scalars['String']>;
  display_name?: Maybe<Scalars['String']>;
  /** Facts of a host. The subset of keys can be requested using `filter`. */
  facts?: Maybe<Scalars['JSONObject']>;
  id: Scalars['ID'];
  modified_on?: Maybe<Scalars['String']>;
  org_id: Scalars['String'];
  /** The host's per-reporter staleness data in object format. */
  per_reporter_staleness?: Maybe<Scalars['JSONObject']>;
  /** The host's per-reporter staleness, flattened into an array. */
  per_reporter_staleness_flat?: Maybe<Array<Maybe<Scalars['JSONObject']>>>;
  reporter?: Maybe<Scalars['String']>;
  stale_timestamp?: Maybe<Scalars['String']>;
  /** System profile of a host. The subset of keys can be requested using `filter`. */
  system_profile_facts?: Maybe<Scalars['JSONObject']>;
  tags?: Maybe<Tags>;
};


/** Inventory host */
export type HostCanonical_FactsArgs = {
  filter?: InputMaybe<Array<Scalars['String']>>;
};


/** Inventory host */
export type HostFactsArgs = {
  filter?: InputMaybe<Array<Scalars['String']>>;
};


/** Inventory host */
export type HostPer_Reporter_StalenessArgs = {
  filter?: InputMaybe<Array<Scalars['String']>>;
};


/** Inventory host */
export type HostPer_Reporter_Staleness_FlatArgs = {
  filter?: InputMaybe<Array<Scalars['String']>>;
};


/** Inventory host */
export type HostSystem_Profile_FactsArgs = {
  filter?: InputMaybe<Array<Scalars['String']>>;
};

/** Defines criteria by which the hosts are filtered. */
export type HostFilter = {
  /** Apply logical conjunction on the given filtering criteria */
  AND?: InputMaybe<Array<HostFilter>>;
  /** Negate the given filtering criteria */
  NOT?: InputMaybe<HostFilter>;
  /** Apply logical disjunction on the given filtering criteria */
  OR?: InputMaybe<Array<HostFilter>>;
  /** Filter by display_name */
  display_name?: InputMaybe<FilterStringWithWildcardWithLowercase>;
  /** Filter by fqdn */
  fqdn?: InputMaybe<FilterStringWithWildcardWithLowercase>;
  /** Filter by host id */
  id?: InputMaybe<FilterStringWithWildcard>;
  /** Filter by insights id */
  insights_id?: InputMaybe<FilterStringWithWildcard>;
  /** Filter by per_reporter_staleness sub-fields */
  per_reporter_staleness?: InputMaybe<FilterPerReporterStaleness>;
  /** Filter by provider_id */
  provider_id?: InputMaybe<FilterString>;
  /** Filter by provider_type */
  provider_type?: InputMaybe<FilterString>;
  /** Filter by 'ansible' field of system profile */
  spf_ansible?: InputMaybe<FilterAnsible>;
  /** Filter by 'arch' field of system profile */
  spf_arch?: InputMaybe<FilterString>;
  /** Filter by 'bios_vendor' field of system profile */
  spf_bios_vendor?: InputMaybe<FilterString>;
  /** Filter by 'bios_version' field of system profile */
  spf_bios_version?: InputMaybe<FilterString>;
  /** Filter by 'captured_date' field of system profile */
  spf_captured_date?: InputMaybe<FilterString>;
  /** Filter by 'cloud_provider' field of system profile */
  spf_cloud_provider?: InputMaybe<FilterString>;
  /** Filter by 'cores_per_socket' field of system profile */
  spf_cores_per_socket?: InputMaybe<FilterInt>;
  /** Filter by 'cpu_flags' field of system profile */
  spf_cpu_flags?: InputMaybe<FilterString>;
  /** Filter by 'cpu_model' field of system profile */
  spf_cpu_model?: InputMaybe<FilterString>;
  /** Filter by 'disk_devices' field of system profile */
  spf_disk_devices?: InputMaybe<FilterDiskDevices>;
  /** Filter by 'dnf_modules' field of system profile */
  spf_dnf_modules?: InputMaybe<FilterDnfModules>;
  /** Filter by 'enabled_services' field of system profile */
  spf_enabled_services?: InputMaybe<FilterString>;
  /** Filter by 'gpg_pubkeys' field of system profile */
  spf_gpg_pubkeys?: InputMaybe<FilterString>;
  /** Filter by 'greenboot_fallback_detected' field of system profile */
  spf_greenboot_fallback_detected?: InputMaybe<FilterBoolean>;
  /** Filter by 'greenboot_status' field of system profile */
  spf_greenboot_status?: InputMaybe<FilterString>;
  /** Filter by 'host_type' field of system profile */
  spf_host_type?: InputMaybe<FilterString>;
  /** Filter by 'infrastructure_type' field of system profile */
  spf_infrastructure_type?: InputMaybe<FilterString>;
  /** Filter by 'infrastructure_vendor' field of system profile */
  spf_infrastructure_vendor?: InputMaybe<FilterString>;
  /** Filter by 'insights_client_version' field of system profile */
  spf_insights_client_version?: InputMaybe<FilterStringWithWildcard>;
  /** Filter by 'insights_egg_version' field of system profile */
  spf_insights_egg_version?: InputMaybe<FilterString>;
  /** Filter by 'installed_packages' field of system profile */
  spf_installed_packages?: InputMaybe<FilterString>;
  /** Filter by 'installed_products' field of system profile */
  spf_installed_products?: InputMaybe<FilterInstalledProducts>;
  /** Filter by 'installed_services' field of system profile */
  spf_installed_services?: InputMaybe<FilterString>;
  /** Filter by 'is_marketplace' field of system profile */
  spf_is_marketplace?: InputMaybe<FilterBoolean>;
  /** Filter by 'katello_agent_running' field of system profile */
  spf_katello_agent_running?: InputMaybe<FilterBoolean>;
  /** Filter by 'kernel_modules' field of system profile */
  spf_kernel_modules?: InputMaybe<FilterString>;
  /** Filter by 'last_boot_time' field of system profile */
  spf_last_boot_time?: InputMaybe<FilterTimestamp>;
  /** Filter by 'mssql' field of system profile */
  spf_mssql?: InputMaybe<FilterMssql>;
  /** Filter by 'network_interfaces' field of system profile */
  spf_network_interfaces?: InputMaybe<FilterNetworkInterfaces>;
  /** Filter by 'number_of_cpus' field of system profile */
  spf_number_of_cpus?: InputMaybe<FilterInt>;
  /** Filter by 'number_of_sockets' field of system profile */
  spf_number_of_sockets?: InputMaybe<FilterInt>;
  /** Filter by 'operating_system' field of system profile */
  spf_operating_system?: InputMaybe<FilterOperatingSystem>;
  /** Filter by 'os_kernel_version' field of system profile */
  spf_os_kernel_version?: InputMaybe<FilterStringWithWildcard>;
  /** Filter by 'os_release' field of system profile */
  spf_os_release?: InputMaybe<FilterStringWithWildcard>;
  /** Filter by 'owner_id' field of system profile */
  spf_owner_id?: InputMaybe<FilterString>;
  /** Filter by 'rhc_client_id' field of system profile */
  spf_rhc_client_id?: InputMaybe<FilterString>;
  /** Filter by 'rhc_config_state' field of system profile */
  spf_rhc_config_state?: InputMaybe<FilterString>;
  /** Filter by 'rhsm' field of system profile */
  spf_rhsm?: InputMaybe<FilterRhsm>;
  /** Filter by 'rpm_ostree_deployments' field of system profile */
  spf_rpm_ostree_deployments?: InputMaybe<FilterRpmOstreeDeployments>;
  /** Filter by 'sap' field of system profile */
  spf_sap?: InputMaybe<FilterSap>;
  /** Filter by 'sap_instance_number' field of system profile */
  spf_sap_instance_number?: InputMaybe<FilterString>;
  /** Filter by 'sap_sids' field of system profile */
  spf_sap_sids?: InputMaybe<FilterString>;
  /** Filter by 'sap_system' field of system profile */
  spf_sap_system?: InputMaybe<FilterBoolean>;
  /** Filter by 'sap_version' field of system profile */
  spf_sap_version?: InputMaybe<FilterString>;
  /** Filter by 'satellite_managed' field of system profile */
  spf_satellite_managed?: InputMaybe<FilterBoolean>;
  /** Filter by 'selinux_config_file' field of system profile */
  spf_selinux_config_file?: InputMaybe<FilterString>;
  /** Filter by 'selinux_current_mode' field of system profile */
  spf_selinux_current_mode?: InputMaybe<FilterString>;
  /** Filter by 'subscription_auto_attach' field of system profile */
  spf_subscription_auto_attach?: InputMaybe<FilterString>;
  /** Filter by 'subscription_status' field of system profile */
  spf_subscription_status?: InputMaybe<FilterString>;
  /** Filter by 'system_memory_bytes' field of system profile */
  spf_system_memory_bytes?: InputMaybe<FilterInt>;
  /** Filter by 'system_purpose' field of system profile */
  spf_system_purpose?: InputMaybe<FilterSystemPurpose>;
  /** Filter by 'tuned_profile' field of system profile */
  spf_tuned_profile?: InputMaybe<FilterString>;
  /** Filter by the stale_timestamp value */
  stale_timestamp?: InputMaybe<FilterTimestamp>;
  /** Filter by host tag. The tag namespace/key/value must match exactly what the host is tagged with */
  tag?: InputMaybe<FilterTag>;
};

/** Lists unique system profile values. */
export type HostSystemProfile = {
  __typename?: 'HostSystemProfile';
  operating_system: OperatingSystemValues;
  /** Lists unique values of the `sap_sids` field */
  sap_sids: StringValues;
  /** Lists unique values of the `sap_system` field */
  sap_system: BooleanValues;
};


/** Lists unique system profile values. */
export type HostSystemProfileOperating_SystemArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Values_Order_By>;
  order_how?: InputMaybe<Order_Dir>;
};


/** Lists unique system profile values. */
export type HostSystemProfileSap_SidsArgs = {
  filter?: InputMaybe<SapSidFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Values_Order_By>;
  order_how?: InputMaybe<Order_Dir>;
};


/** Lists unique system profile values. */
export type HostSystemProfileSap_SystemArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Values_Order_By>;
  order_how?: InputMaybe<Order_Dir>;
};

export type HostTags = {
  __typename?: 'HostTags';
  data: Array<Maybe<TagInfo>>;
  meta: CollectionMeta;
};

export type Hosts = {
  __typename?: 'Hosts';
  data: Array<Maybe<Host>>;
  meta: CollectionMeta;
};

export enum Order_Dir {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type OperatingSystem = {
  __typename?: 'OperatingSystem';
  major?: Maybe<Scalars['Int']>;
  minor?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /**
   * Fetches a list of unique values for a given system profile field.
   *
   * By default the query operates on all known systems that are registered with the given org_id.
   * This can be altered using `hostFilter` parameter.
   */
  hostSystemProfile?: Maybe<HostSystemProfile>;
  /**
   * Fetches a list of unique tags and the number of their occurenes in the given set of systems.
   *
   * By default the query operates on all known systems that are registered with the given org_id.
   * This can be altered using the `hostFilter` parameter.
   *
   * The tags themselves can be filtered further using the `filter` parameter.
   */
  hostTags?: Maybe<HostTags>;
  /** Fetches a list of hosts based on the given filtering, ordering and pagination criteria. */
  hosts: Hosts;
};


export type QueryHostSystemProfileArgs = {
  hostFilter?: InputMaybe<HostFilter>;
};


export type QueryHostTagsArgs = {
  filter?: InputMaybe<TagAggregationFilter>;
  hostFilter?: InputMaybe<HostFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Host_Tags_Order_By>;
  order_how?: InputMaybe<Order_Dir>;
};


export type QueryHostsArgs = {
  filter?: InputMaybe<HostFilter>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Hosts_Order_By>;
  order_how?: InputMaybe<Order_Dir>;
};

/** Defines the criteria by which sap_sids are filtered in the `hostSystemProfile` query. */
export type SapSidFilter = {
  /**
   * Limits the aggregation to sap_sids that match the given search term.
   * The search term is a regular exression that operates on a string representation of a sap_sid.
   */
  search?: InputMaybe<FilterStringWithRegex>;
};

/** Represents a single String value. The `count` field indicates how many systems with the given value were returned by a query. */
export type StringValueInfo = {
  __typename?: 'StringValueInfo';
  count: Scalars['Int'];
  value: Scalars['String'];
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
  key: Scalars['String'];
  namespace?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** Defines the criteria by which tags are filtered in the `hostTags` query. */
export type TagAggregationFilter = {
  /**
   * Limits the aggregation to tags that match the given search term.
   * The search term is a regular exression that operates on a string representation of a tag.
   * The string representation has a form of "namespace/key=value" i.e. the segments are concatenated together using "=" and "/", respectively.
   * There is no expecing of the control characters in the segments.
   * As a result, "=" and "/" appear in every tag.
   */
  search?: InputMaybe<FilterStringWithRegex>;
};

export type TagInfo = {
  __typename?: 'TagInfo';
  count: Scalars['Int'];
  tag: StructuredTag;
};

export type Tags = {
  __typename?: 'Tags';
  data: Array<Maybe<StructuredTag>>;
  meta: CollectionMeta;
};

export enum Values_Order_By {
  Count = 'count',
  Value = 'value'
}

export type OperatingSystemValueInfo = {
  __typename?: 'operatingSystemValueInfo';
  count: Scalars['Int'];
  value?: Maybe<OperatingSystem>;
};

export type OperatingSystemValues = {
  __typename?: 'operatingSystemValues';
  data: Array<Maybe<OperatingSystemValueInfo>>;
  meta: CollectionMeta;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

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
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BooleanValueInfo: ResolverTypeWrapper<BooleanValueInfo>;
  BooleanValues: ResolverTypeWrapper<BooleanValues>;
  CollectionMeta: ResolverTypeWrapper<CollectionMeta>;
  FilterAnsible: FilterAnsible;
  FilterBoolean: FilterBoolean;
  FilterDiskDevices: FilterDiskDevices;
  FilterDnfModules: FilterDnfModules;
  FilterInstalledProducts: FilterInstalledProducts;
  FilterInt: FilterInt;
  FilterMssql: FilterMssql;
  FilterNetworkInterfaces: FilterNetworkInterfaces;
  FilterOperatingSystem: FilterOperatingSystem;
  FilterPerReporterStaleness: FilterPerReporterStaleness;
  FilterRhsm: FilterRhsm;
  FilterRpmOstreeDeployments: FilterRpmOstreeDeployments;
  FilterSap: FilterSap;
  FilterString: FilterString;
  FilterStringWithRegex: FilterStringWithRegex;
  FilterStringWithWildcard: FilterStringWithWildcard;
  FilterStringWithWildcardWithLowercase: FilterStringWithWildcardWithLowercase;
  FilterSystemPurpose: FilterSystemPurpose;
  FilterTag: FilterTag;
  FilterTimestamp: FilterTimestamp;
  HOSTS_ORDER_BY: Hosts_Order_By;
  HOST_TAGS_ORDER_BY: Host_Tags_Order_By;
  Host: ResolverTypeWrapper<Host>;
  HostFilter: HostFilter;
  HostSystemProfile: ResolverTypeWrapper<HostSystemProfile>;
  HostTags: ResolverTypeWrapper<HostTags>;
  Hosts: ResolverTypeWrapper<Hosts>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']>;
  ORDER_DIR: Order_Dir;
  OperatingSystem: ResolverTypeWrapper<OperatingSystem>;
  Query: ResolverTypeWrapper<{}>;
  SapSidFilter: SapSidFilter;
  String: ResolverTypeWrapper<Scalars['String']>;
  StringValueInfo: ResolverTypeWrapper<StringValueInfo>;
  StringValues: ResolverTypeWrapper<StringValues>;
  StructuredTag: ResolverTypeWrapper<StructuredTag>;
  TagAggregationFilter: TagAggregationFilter;
  TagInfo: ResolverTypeWrapper<TagInfo>;
  Tags: ResolverTypeWrapper<Tags>;
  VALUES_ORDER_BY: Values_Order_By;
  operatingSystemValueInfo: ResolverTypeWrapper<OperatingSystemValueInfo>;
  operatingSystemValues: ResolverTypeWrapper<OperatingSystemValues>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  BooleanValueInfo: BooleanValueInfo;
  BooleanValues: BooleanValues;
  CollectionMeta: CollectionMeta;
  FilterAnsible: FilterAnsible;
  FilterBoolean: FilterBoolean;
  FilterDiskDevices: FilterDiskDevices;
  FilterDnfModules: FilterDnfModules;
  FilterInstalledProducts: FilterInstalledProducts;
  FilterInt: FilterInt;
  FilterMssql: FilterMssql;
  FilterNetworkInterfaces: FilterNetworkInterfaces;
  FilterOperatingSystem: FilterOperatingSystem;
  FilterPerReporterStaleness: FilterPerReporterStaleness;
  FilterRhsm: FilterRhsm;
  FilterRpmOstreeDeployments: FilterRpmOstreeDeployments;
  FilterSap: FilterSap;
  FilterString: FilterString;
  FilterStringWithRegex: FilterStringWithRegex;
  FilterStringWithWildcard: FilterStringWithWildcard;
  FilterStringWithWildcardWithLowercase: FilterStringWithWildcardWithLowercase;
  FilterSystemPurpose: FilterSystemPurpose;
  FilterTag: FilterTag;
  FilterTimestamp: FilterTimestamp;
  Host: Host;
  HostFilter: HostFilter;
  HostSystemProfile: HostSystemProfile;
  HostTags: HostTags;
  Hosts: Hosts;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  JSONObject: Scalars['JSONObject'];
  OperatingSystem: OperatingSystem;
  Query: {};
  SapSidFilter: SapSidFilter;
  String: Scalars['String'];
  StringValueInfo: StringValueInfo;
  StringValues: StringValues;
  StructuredTag: StructuredTag;
  TagAggregationFilter: TagAggregationFilter;
  TagInfo: TagInfo;
  Tags: Tags;
  operatingSystemValueInfo: OperatingSystemValueInfo;
  operatingSystemValues: OperatingSystemValues;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BooleanValueInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['BooleanValueInfo'] = ResolversParentTypes['BooleanValueInfo']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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
  account?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ansible_host?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  canonical_facts?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType, Partial<HostCanonical_FactsArgs>>;
  created_on?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  display_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  facts?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType, Partial<HostFactsArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  modified_on?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  org_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  per_reporter_staleness?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType, Partial<HostPer_Reporter_StalenessArgs>>;
  per_reporter_staleness_flat?: Resolver<Maybe<Array<Maybe<ResolversTypes['JSONObject']>>>, ParentType, ContextType, Partial<HostPer_Reporter_Staleness_FlatArgs>>;
  reporter?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stale_timestamp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  system_profile_facts?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType, Partial<HostSystem_Profile_FactsArgs>>;
  tags?: Resolver<Maybe<ResolversTypes['Tags']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HostSystemProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['HostSystemProfile'] = ResolversParentTypes['HostSystemProfile']> = {
  operating_system?: Resolver<ResolversTypes['operatingSystemValues'], ParentType, ContextType, RequireFields<HostSystemProfileOperating_SystemArgs, 'limit' | 'offset' | 'order_by' | 'order_how'>>;
  sap_sids?: Resolver<ResolversTypes['StringValues'], ParentType, ContextType, RequireFields<HostSystemProfileSap_SidsArgs, 'filter' | 'limit' | 'offset' | 'order_by' | 'order_how'>>;
  sap_system?: Resolver<ResolversTypes['BooleanValues'], ParentType, ContextType, RequireFields<HostSystemProfileSap_SystemArgs, 'limit' | 'offset' | 'order_by' | 'order_how'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HostTagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['HostTags'] = ResolversParentTypes['HostTags']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['TagInfo']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HostsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Hosts'] = ResolversParentTypes['Hosts']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['Host']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type OperatingSystemResolvers<ContextType = any, ParentType extends ResolversParentTypes['OperatingSystem'] = ResolversParentTypes['OperatingSystem']> = {
  major?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minor?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  hostSystemProfile?: Resolver<Maybe<ResolversTypes['HostSystemProfile']>, ParentType, ContextType, Partial<QueryHostSystemProfileArgs>>;
  hostTags?: Resolver<Maybe<ResolversTypes['HostTags']>, ParentType, ContextType, RequireFields<QueryHostTagsArgs, 'limit' | 'offset' | 'order_by' | 'order_how'>>;
  hosts?: Resolver<ResolversTypes['Hosts'], ParentType, ContextType, RequireFields<QueryHostsArgs, 'limit' | 'offset' | 'order_by' | 'order_how'>>;
};

export type StringValueInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['StringValueInfo'] = ResolversParentTypes['StringValueInfo']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StringValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['StringValues'] = ResolversParentTypes['StringValues']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['StringValueInfo']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StructuredTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['StructuredTag'] = ResolversParentTypes['StructuredTag']> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  namespace?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagInfo'] = ResolversParentTypes['TagInfo']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes['StructuredTag'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tags'] = ResolversParentTypes['Tags']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['StructuredTag']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OperatingSystemValueInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['operatingSystemValueInfo'] = ResolversParentTypes['operatingSystemValueInfo']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['OperatingSystem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OperatingSystemValuesResolvers<ContextType = any, ParentType extends ResolversParentTypes['operatingSystemValues'] = ResolversParentTypes['operatingSystemValues']> = {
  data?: Resolver<Array<Maybe<ResolversTypes['operatingSystemValueInfo']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['CollectionMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BigInt?: GraphQLScalarType;
  BooleanValueInfo?: BooleanValueInfoResolvers<ContextType>;
  BooleanValues?: BooleanValuesResolvers<ContextType>;
  CollectionMeta?: CollectionMetaResolvers<ContextType>;
  Host?: HostResolvers<ContextType>;
  HostSystemProfile?: HostSystemProfileResolvers<ContextType>;
  HostTags?: HostTagsResolvers<ContextType>;
  Hosts?: HostsResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  OperatingSystem?: OperatingSystemResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  StringValueInfo?: StringValueInfoResolvers<ContextType>;
  StringValues?: StringValuesResolvers<ContextType>;
  StructuredTag?: StructuredTagResolvers<ContextType>;
  TagInfo?: TagInfoResolvers<ContextType>;
  Tags?: TagsResolvers<ContextType>;
  operatingSystemValueInfo?: OperatingSystemValueInfoResolvers<ContextType>;
  operatingSystemValues?: OperatingSystemValuesResolvers<ContextType>;
};

