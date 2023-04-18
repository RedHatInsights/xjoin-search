# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Objects](#objects)
    * [BooleanValueInfo](#booleanvalueinfo)
    * [BooleanValues](#booleanvalues)
    * [CollectionMeta](#collectionmeta)
    * [Group](#group)
    * [GroupInfo](#groupinfo)
    * [Groups](#groups)
    * [Host](#host)
    * [HostGroups](#hostgroups)
    * [HostSystemProfile](#hostsystemprofile)
    * [HostTags](#hosttags)
    * [Hosts](#hosts)
    * [OperatingSystem](#operatingsystem)
    * [StringValueInfo](#stringvalueinfo)
    * [StringValues](#stringvalues)
    * [StructuredTag](#structuredtag)
    * [TagInfo](#taginfo)
    * [Tags](#tags)
    * [operatingSystemValueInfo](#operatingsystemvalueinfo)
    * [operatingSystemValues](#operatingsystemvalues)
  * [Inputs](#inputs)
    * [FilterAnsible](#filteransible)
    * [FilterBoolean](#filterboolean)
    * [FilterDiskDevices](#filterdiskdevices)
    * [FilterDnfModules](#filterdnfmodules)
    * [FilterGroup](#filtergroup)
    * [FilterInstalledProducts](#filterinstalledproducts)
    * [FilterInt](#filterint)
    * [FilterMssql](#filtermssql)
    * [FilterNetworkInterfaces](#filternetworkinterfaces)
    * [FilterOperatingSystem](#filteroperatingsystem)
    * [FilterPerReporterStaleness](#filterperreporterstaleness)
    * [FilterRhsm](#filterrhsm)
    * [FilterRpmOstreeDeployments](#filterrpmostreedeployments)
    * [FilterSap](#filtersap)
    * [FilterString](#filterstring)
    * [FilterStringWithRegex](#filterstringwithregex)
    * [FilterStringWithWildcard](#filterstringwithwildcard)
    * [FilterStringWithWildcardWithLowercase](#filterstringwithwildcardwithlowercase)
    * [FilterSystemPurpose](#filtersystempurpose)
    * [FilterTag](#filtertag)
    * [FilterTimestamp](#filtertimestamp)
    * [HostFilter](#hostfilter)
    * [SapSidFilter](#sapsidfilter)
    * [TagAggregationFilter](#tagaggregationfilter)
  * [Enums](#enums)
    * [HOSTS_ORDER_BY](#hosts_order_by)
    * [HOST_GROUPS_ORDER_BY](#host_groups_order_by)
    * [HOST_TAGS_ORDER_BY](#host_tags_order_by)
    * [ORDER_DIR](#order_dir)
    * [VALUES_ORDER_BY](#values_order_by)
  * [Scalars](#scalars)
    * [BigInt](#bigint)
    * [Boolean](#boolean)
    * [ID](#id)
    * [Int](#int)
    * [JSON](#json)
    * [JSONObject](#jsonobject)
    * [String](#string)

</details>

## Query
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>hosts</strong></td>
<td valign="top"><a href="#hosts">Hosts</a>!</td>
<td>

Fetches a list of hosts based on the given filtering, ordering and pagination criteria.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top"><a href="#hostfilter">HostFilter</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top"><a href="#hosts_order_by">HOSTS_ORDER_BY</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_how</td>
<td valign="top"><a href="#order_dir">ORDER_DIR</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hostTags</strong></td>
<td valign="top"><a href="#hosttags">HostTags</a></td>
<td>

Fetches a list of unique tags and the number of their occurenes in the given set of systems.

By default the query operates on all known systems that are registered with the given org_id.
This can be altered using the `hostFilter` parameter.

The tags themselves can be filtered further using the `filter` parameter.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">hostFilter</td>
<td valign="top"><a href="#hostfilter">HostFilter</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top"><a href="#tagaggregationfilter">TagAggregationFilter</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top"><a href="#host_tags_order_by">HOST_TAGS_ORDER_BY</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_how</td>
<td valign="top"><a href="#order_dir">ORDER_DIR</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hostSystemProfile</strong></td>
<td valign="top"><a href="#hostsystemprofile">HostSystemProfile</a></td>
<td>

Fetches a list of unique values for a given system profile field.

By default the query operates on all known systems that are registered with the given org_id.
This can be altered using `hostFilter` parameter.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">hostFilter</td>
<td valign="top"><a href="#hostfilter">HostFilter</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hostGroups</strong></td>
<td valign="top"><a href="#hostgroups">HostGroups</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">hostFilter</td>
<td valign="top"><a href="#hostfilter">HostFilter</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top"><a href="#host_groups_order_by">HOST_GROUPS_ORDER_BY</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_how</td>
<td valign="top"><a href="#order_dir">ORDER_DIR</a></td>
<td></td>
</tr>
</tbody>
</table>

## Objects

### BooleanValueInfo

Represents a single Boolean value. The `count` field indicates how many systems with the given value were returned by a query

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### BooleanValues

A list of Boolean values together with count information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>data</strong></td>
<td valign="top">[<a href="#booleanvalueinfo">BooleanValueInfo</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#collectionmeta">CollectionMeta</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### CollectionMeta

Metadata about a collection of entities

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

number of returned results

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>total</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

total number of entities matching the query

</td>
</tr>
</tbody>
</table>

### Group

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>account</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>org_id</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>created_on</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>modified_on</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### GroupInfo

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>group</strong></td>
<td valign="top"><a href="#group">Group</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Groups

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>data</strong></td>
<td valign="top">[<a href="#group">Group</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#collectionmeta">CollectionMeta</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Host

Inventory host

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>account</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>org_id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>display_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>created_on</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>modified_on</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stale_timestamp</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>reporter</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ansible_host</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>canonical_facts</strong></td>
<td valign="top"><a href="#jsonobject">JSONObject</a></td>
<td>

Canonical facts of a host. The subset of keys can be requested using `filter`.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top">[<a href="#string">String</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>system_profile_facts</strong></td>
<td valign="top"><a href="#jsonobject">JSONObject</a></td>
<td>

System profile of a host. The subset of keys can be requested using `filter`.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top">[<a href="#string">String</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tags</strong></td>
<td valign="top"><a href="#tags">Tags</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>facts</strong></td>
<td valign="top"><a href="#jsonobject">JSONObject</a></td>
<td>

Facts of a host. The subset of keys can be requested using `filter`.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top">[<a href="#string">String</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>per_reporter_staleness</strong></td>
<td valign="top"><a href="#jsonobject">JSONObject</a></td>
<td>

The host's per-reporter staleness data in object format.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top">[<a href="#string">String</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>per_reporter_staleness_flat</strong></td>
<td valign="top">[<a href="#jsonobject">JSONObject</a>]</td>
<td>

The host's per-reporter staleness, flattened into an array.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top">[<a href="#string">String</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>groups</strong></td>
<td valign="top"><a href="#groups">Groups</a></td>
<td></td>
</tr>
</tbody>
</table>

### HostGroups

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>data</strong></td>
<td valign="top">[<a href="#groupinfo">GroupInfo</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#collectionmeta">CollectionMeta</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### HostSystemProfile

Lists unique system profile values.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>sap_system</strong></td>
<td valign="top"><a href="#booleanvalues">BooleanValues</a>!</td>
<td>

Lists unique values of the `sap_system` field

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top"><a href="#values_order_by">VALUES_ORDER_BY</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_how</td>
<td valign="top"><a href="#order_dir">ORDER_DIR</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sap_sids</strong></td>
<td valign="top"><a href="#stringvalues">StringValues</a>!</td>
<td>

Lists unique values of the `sap_sids` field

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">filter</td>
<td valign="top"><a href="#sapsidfilter">SapSidFilter</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top"><a href="#values_order_by">VALUES_ORDER_BY</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_how</td>
<td valign="top"><a href="#order_dir">ORDER_DIR</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>operating_system</strong></td>
<td valign="top"><a href="#operatingsystemvalues">operatingSystemValues</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_by</td>
<td valign="top"><a href="#values_order_by">VALUES_ORDER_BY</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order_how</td>
<td valign="top"><a href="#order_dir">ORDER_DIR</a></td>
<td></td>
</tr>
</tbody>
</table>

### HostTags

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>data</strong></td>
<td valign="top">[<a href="#taginfo">TagInfo</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#collectionmeta">CollectionMeta</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Hosts

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>data</strong></td>
<td valign="top">[<a href="#host">Host</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#collectionmeta">CollectionMeta</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### OperatingSystem

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>major</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>minor</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
</tbody>
</table>

### StringValueInfo

Represents a single String value. The `count` field indicates how many systems with the given value were returned by a query.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### StringValues

A list of String values together with count information

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>data</strong></td>
<td valign="top">[<a href="#stringvalueinfo">StringValueInfo</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#collectionmeta">CollectionMeta</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### StructuredTag

Structured representation of a tag

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>namespace</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>key</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### TagInfo

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>tag</strong></td>
<td valign="top"><a href="#structuredtag">StructuredTag</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Tags

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>data</strong></td>
<td valign="top">[<a href="#structuredtag">StructuredTag</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#collectionmeta">CollectionMeta</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### operatingSystemValueInfo

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#operatingsystem">OperatingSystem</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### operatingSystemValues

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>data</strong></td>
<td valign="top">[<a href="#operatingsystemvalueinfo">operatingSystemValueInfo</a>]!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#collectionmeta">CollectionMeta</a>!</td>
<td></td>
</tr>
</tbody>
</table>

## Inputs

### FilterAnsible

Filter by 'ansible' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>controller_version</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'controller_version' field of ansible

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hub_version</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'hub_version' field of ansible

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>catalog_worker_version</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'catalog_worker_version' field of ansible

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sso_version</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'sso_version' field of ansible

</td>
</tr>
</tbody>
</table>

### FilterBoolean

Basic filter for boolean fields.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>is</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Compares the document field with the provided value.
If `null` is provided then documents where the given field does not exist are returned.

</td>
</tr>
</tbody>
</table>

### FilterDiskDevices

Filter by 'disk_devices' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>device</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'device' field of disk_devices

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>label</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'label' field of disk_devices

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>mount_point</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'mount_point' field of disk_devices

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'type' field of disk_devices

</td>
</tr>
</tbody>
</table>

### FilterDnfModules

Filter by 'dnf_modules' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'name' field of dnf_modules

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stream</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'stream' field of dnf_modules

</td>
</tr>
</tbody>
</table>

### FilterGroup

Groups filter on a host

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#filterstringwithwildcardwithlowercase">FilterStringWithWildcardWithLowercase</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hasSome</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td></td>
</tr>
</tbody>
</table>

### FilterInstalledProducts

Filter by 'installed_products' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'name' field of installed_products

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'id' field of installed_products

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>status</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'status' field of installed_products

</td>
</tr>
</tbody>
</table>

### FilterInt

Timestamp field filter with support for common operations.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>eq</strong></td>
<td valign="top"><a href="#bigint">BigInt</a></td>
<td>

Equal to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lt</strong></td>
<td valign="top"><a href="#bigint">BigInt</a></td>
<td>

Less than

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lte</strong></td>
<td valign="top"><a href="#bigint">BigInt</a></td>
<td>

Less than or equal to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>gt</strong></td>
<td valign="top"><a href="#bigint">BigInt</a></td>
<td>

Greater than

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>gte</strong></td>
<td valign="top"><a href="#bigint">BigInt</a></td>
<td>

Greater than or equal to

</td>
</tr>
</tbody>
</table>

### FilterMssql

Filter by 'mssql' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'version' field of mssql

</td>
</tr>
</tbody>
</table>

### FilterNetworkInterfaces

Filter by 'network_interfaces' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>ipv4_addresses</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'ipv4_addresses' field of network_interfaces

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>ipv6_addresses</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'ipv6_addresses' field of network_interfaces

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>mtu</strong></td>
<td valign="top"><a href="#filterint">FilterInt</a></td>
<td>

Filter by 'mtu' field of network_interfaces

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>mac_address</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'mac_address' field of network_interfaces

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'name' field of network_interfaces

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>state</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'state' field of network_interfaces

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'type' field of network_interfaces

</td>
</tr>
</tbody>
</table>

### FilterOperatingSystem

Filter by 'operating_system' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>major</strong></td>
<td valign="top"><a href="#filterint">FilterInt</a></td>
<td>

Filter by 'major' field of operating_system

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>minor</strong></td>
<td valign="top"><a href="#filterint">FilterInt</a></td>
<td>

Filter by 'minor' field of operating_system

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'name' field of operating_system

</td>
</tr>
</tbody>
</table>

### FilterPerReporterStaleness

Per-reporter staleness filter.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>reporter</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stale_timestamp</strong></td>
<td valign="top"><a href="#filtertimestamp">FilterTimestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>last_check_in</strong></td>
<td valign="top"><a href="#filtertimestamp">FilterTimestamp</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>check_in_succeeded</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td></td>
</tr>
</tbody>
</table>

### FilterRhsm

Filter by 'rhsm' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'version' field of rhsm

</td>
</tr>
</tbody>
</table>

### FilterRpmOstreeDeployments

Filter by 'rpm_ostree_deployments' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'id' field of rpm_ostree_deployments

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>checksum</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'checksum' field of rpm_ostree_deployments

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>origin</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'origin' field of rpm_ostree_deployments

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>osname</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'osname' field of rpm_ostree_deployments

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'version' field of rpm_ostree_deployments

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>booted</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td>

Filter by 'booted' field of rpm_ostree_deployments

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>pinned</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td>

Filter by 'pinned' field of rpm_ostree_deployments

</td>
</tr>
</tbody>
</table>

### FilterSap

Filter by 'sap' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>sap_system</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td>

Filter by 'sap_system' field of sap

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sids</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'sids' field of sap

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>instance_number</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'instance_number' field of sap

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>version</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'version' field of sap

</td>
</tr>
</tbody>
</table>

### FilterString

Basic filter for string fields that allows filtering based on exact match.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>eq</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Compares the document field with the provided value.
If `null` is provided then documents where the given field does not exist are returned.

</td>
</tr>
</tbody>
</table>

### FilterStringWithRegex

String field filter that allows filtering based on exact match or using regular expression.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>eq</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Compares the document field with the provided value.
If `null` is provided then documents where the given field does not exist are returned.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>regex</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Matches the document field against the provided regular expression.

</td>
</tr>
</tbody>
</table>

### FilterStringWithWildcard

String field filter that allows filtering based on exact match or using wildcards.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>eq</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Compares the document field with the provided value.
If `null` is provided then documents where the given field does not exist are returned.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>matches</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Compares the document field with the provided value.
Wildcards may be used in the query (e.g. `ki*y`).
Two types of wildcard operators are supported:
* `?`, which matches any single character
* `*`, which can match zero or more characters, including an empty one

See [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html) for more details.

</td>
</tr>
</tbody>
</table>

### FilterStringWithWildcardWithLowercase

String field filter that allows filtering based on exact match or using wildcards.
In both cases the case of a letter can be ignored (case-insensitive matching) using the `_lc` suffixed operators.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>eq</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Compares the document field with the provided value.
If `null` is provided then documents where the given field does not exist are returned.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>eq_lc</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

This operator is like [FilterStringWithWildcard.eq](#filterstring) except that it performs case-insensitive matching.
Furthermore, unlike for `eq`, `null` is not an allowed value.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>matches</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Compares the document field with the provided value.
Wildcards may be used in the query (e.g. `ki*y`).
Two types of wildcard operators are supported:
* `?`, which matches any single character
* `*`, which can match zero or more characters, including an empty one

See [Elasticsearch documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-wildcard-query.html) for more details.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>matches_lc</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

This operator is like [FilterStringWithWildcard.matches](#filterstringwithwildcard) except that it performs case-insensitive matching.

</td>
</tr>
</tbody>
</table>

### FilterSystemPurpose

Filter by 'system_purpose' field of system profile

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>usage</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'usage' field of system_purpose

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>role</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'role' field of system_purpose

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sla</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'sla' field of system_purpose

</td>
</tr>
</tbody>
</table>

### FilterTag

Filters hosts by the presence of a host tag

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>namespace</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Tag namespace

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>key</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a>!</td>
<td>

Tag key

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Tag value

</td>
</tr>
</tbody>
</table>

### FilterTimestamp

Timestamp field filter with support for common operations.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>lt</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Less than

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lte</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Less than or equal to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>gt</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Greater than

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>gte</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Greater than or equal to

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>eq</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Equal

</td>
</tr>
</tbody>
</table>

### HostFilter

Defines criteria by which the hosts are filtered.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>AND</strong></td>
<td valign="top">[<a href="#hostfilter">HostFilter</a>!]</td>
<td>

Apply logical conjunction on the given filtering criteria

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>OR</strong></td>
<td valign="top">[<a href="#hostfilter">HostFilter</a>!]</td>
<td>

Apply logical disjunction on the given filtering criteria

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>NOT</strong></td>
<td valign="top"><a href="#hostfilter">HostFilter</a></td>
<td>

Negate the given filtering criteria

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by host id

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>insights_id</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by insights id

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>display_name</strong></td>
<td valign="top"><a href="#filterstringwithwildcardwithlowercase">FilterStringWithWildcardWithLowercase</a></td>
<td>

Filter by display_name

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fqdn</strong></td>
<td valign="top"><a href="#filterstringwithwildcardwithlowercase">FilterStringWithWildcardWithLowercase</a></td>
<td>

Filter by fqdn

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>provider_type</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by provider_type

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>provider_id</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by provider_id

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>modified_on</strong></td>
<td valign="top"><a href="#filtertimestamp">FilterTimestamp</a></td>
<td>

Filter by modified_on

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_system_update_method</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'system_update_method' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_mssql</strong></td>
<td valign="top"><a href="#filtermssql">FilterMssql</a></td>
<td>

Filter by 'mssql' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_ansible</strong></td>
<td valign="top"><a href="#filteransible">FilterAnsible</a></td>
<td>

Filter by 'ansible' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_system_purpose</strong></td>
<td valign="top"><a href="#filtersystempurpose">FilterSystemPurpose</a></td>
<td>

Filter by 'system_purpose' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_rhsm</strong></td>
<td valign="top"><a href="#filterrhsm">FilterRhsm</a></td>
<td>

Filter by 'rhsm' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_rpm_ostree_deployments</strong></td>
<td valign="top"><a href="#filterrpmostreedeployments">FilterRpmOstreeDeployments</a></td>
<td>

Filter by 'rpm_ostree_deployments' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_greenboot_fallback_detected</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td>

Filter by 'greenboot_fallback_detected' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_greenboot_status</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'greenboot_status' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_host_type</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'host_type' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_is_marketplace</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td>

Filter by 'is_marketplace' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_selinux_config_file</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'selinux_config_file' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_selinux_current_mode</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'selinux_current_mode' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_tuned_profile</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'tuned_profile' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_sap_version</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'sap_version' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_sap_instance_number</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'sap_instance_number' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_sap_sids</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'sap_sids' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_sap_system</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td>

Filter by 'sap_system' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_sap</strong></td>
<td valign="top"><a href="#filtersap">FilterSap</a></td>
<td>

Filter by 'sap' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_enabled_services</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'enabled_services' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_installed_services</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'installed_services' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_gpg_pubkeys</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'gpg_pubkeys' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_installed_packages</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'installed_packages' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_captured_date</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'captured_date' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_insights_egg_version</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'insights_egg_version' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_insights_client_version</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'insights_client_version' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_installed_products</strong></td>
<td valign="top"><a href="#filterinstalledproducts">FilterInstalledProducts</a></td>
<td>

Filter by 'installed_products' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_dnf_modules</strong></td>
<td valign="top"><a href="#filterdnfmodules">FilterDnfModules</a></td>
<td>

Filter by 'dnf_modules' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_cloud_provider</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'cloud_provider' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_satellite_managed</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td>

Filter by 'satellite_managed' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_katello_agent_running</strong></td>
<td valign="top"><a href="#filterboolean">FilterBoolean</a></td>
<td>

Filter by 'katello_agent_running' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_subscription_auto_attach</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'subscription_auto_attach' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_subscription_status</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'subscription_status' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_last_boot_time</strong></td>
<td valign="top"><a href="#filtertimestamp">FilterTimestamp</a></td>
<td>

Filter by 'last_boot_time' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_kernel_modules</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'kernel_modules' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_basearch</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'basearch' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_arch</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'arch' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_releasever</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'releasever' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_os_kernel_version</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'os_kernel_version' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_os_release</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'os_release' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_operating_system</strong></td>
<td valign="top"><a href="#filteroperatingsystem">FilterOperatingSystem</a></td>
<td>

Filter by 'operating_system' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_cpu_flags</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'cpu_flags' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_bios_version</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'bios_version' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_bios_vendor</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'bios_vendor' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_disk_devices</strong></td>
<td valign="top"><a href="#filterdiskdevices">FilterDiskDevices</a></td>
<td>

Filter by 'disk_devices' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_network_interfaces</strong></td>
<td valign="top"><a href="#filternetworkinterfaces">FilterNetworkInterfaces</a></td>
<td>

Filter by 'network_interfaces' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_infrastructure_vendor</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'infrastructure_vendor' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_infrastructure_type</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'infrastructure_type' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_system_memory_bytes</strong></td>
<td valign="top"><a href="#filterint">FilterInt</a></td>
<td>

Filter by 'system_memory_bytes' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_cores_per_socket</strong></td>
<td valign="top"><a href="#filterint">FilterInt</a></td>
<td>

Filter by 'cores_per_socket' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_number_of_sockets</strong></td>
<td valign="top"><a href="#filterint">FilterInt</a></td>
<td>

Filter by 'number_of_sockets' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_number_of_cpus</strong></td>
<td valign="top"><a href="#filterint">FilterInt</a></td>
<td>

Filter by 'number_of_cpus' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_cpu_model</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'cpu_model' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_rhc_config_state</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'rhc_config_state' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_rhc_client_id</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'rhc_client_id' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_owner_id</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'owner_id' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stale_timestamp</strong></td>
<td valign="top"><a href="#filtertimestamp">FilterTimestamp</a></td>
<td>

Filter by the stale_timestamp value

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tag</strong></td>
<td valign="top"><a href="#filtertag">FilterTag</a></td>
<td>

Filter by host tag. The tag namespace/key/value must match exactly what the host is tagged with

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>per_reporter_staleness</strong></td>
<td valign="top"><a href="#filterperreporterstaleness">FilterPerReporterStaleness</a></td>
<td>

Filter by per_reporter_staleness sub-fields

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>group</strong></td>
<td valign="top"><a href="#filtergroup">FilterGroup</a></td>
<td></td>
</tr>
</tbody>
</table>

### SapSidFilter

Defines the criteria by which sap_sids are filtered in the `hostSystemProfile` query.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>search</strong></td>
<td valign="top"><a href="#filterstringwithregex">FilterStringWithRegex</a></td>
<td>

Limits the aggregation to sap_sids that match the given search term.
The search term is a regular exression that operates on a string representation of a sap_sid.

</td>
</tr>
</tbody>
</table>

### TagAggregationFilter

Defines the criteria by which tags are filtered in the `hostTags` query.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>search</strong></td>
<td valign="top"><a href="#filterstringwithregex">FilterStringWithRegex</a></td>
<td>

Limits the aggregation to tags that match the given search term.
The search term is a regular exression that operates on a string representation of a tag.
The string representation has a form of "namespace/key=value" i.e. the segments are concatenated together using "=" and "/", respectively.
There is no expecing of the control characters in the segments.
As a result, "=" and "/" appear in every tag.

</td>
</tr>
</tbody>
</table>

## Enums

### HOSTS_ORDER_BY

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>display_name</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>modified_on</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>operating_system</strong></td>
<td></td>
</tr>
</tbody>
</table>

### HOST_GROUPS_ORDER_BY

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>group</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>count</strong></td>
<td></td>
</tr>
</tbody>
</table>

### HOST_TAGS_ORDER_BY

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>tag</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>count</strong></td>
<td></td>
</tr>
</tbody>
</table>

### ORDER_DIR

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>ASC</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>DESC</strong></td>
<td></td>
</tr>
</tbody>
</table>

### VALUES_ORDER_BY

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>value</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>count</strong></td>
<td></td>
</tr>
</tbody>
</table>

## Scalars

### BigInt

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

### JSON

### JSONObject

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

