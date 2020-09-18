# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Objects](#objects)
    * [BooleanValueInfo](#booleanvalueinfo)
    * [BooleanValues](#booleanvalues)
    * [CollectionMeta](#collectionmeta)
    * [Host](#host)
    * [HostSystemProfile](#hostsystemprofile)
    * [HostTags](#hosttags)
    * [Hosts](#hosts)
    * [StringValueInfo](#stringvalueinfo)
    * [StringValues](#stringvalues)
    * [StructuredTag](#structuredtag)
    * [TagInfo](#taginfo)
    * [Tags](#tags)
  * [Inputs](#inputs)
    * [FilterBoolean](#filterboolean)
    * [FilterString](#filterstring)
    * [FilterStringWithRegex](#filterstringwithregex)
    * [FilterStringWithWildcard](#filterstringwithwildcard)
    * [FilterStringWithWildcardWithLowercase](#filterstringwithwildcardwithlowercase)
    * [FilterTag](#filtertag)
    * [FilterTimestamp](#filtertimestamp)
    * [HostFilter](#hostfilter)
    * [TagAggregationFilter](#tagaggregationfilter)
  * [Enums](#enums)
    * [HOSTS_ORDER_BY](#hosts_order_by)
    * [HOST_TAGS_ORDER_BY](#host_tags_order_by)
    * [ORDER_DIR](#order_dir)
    * [VALUES_ORDER_BY](#values_order_by)
  * [Scalars](#scalars)
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

By default the query operates on all known systems that are registered with the given account.
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

By default the query operates on all known systems that are registered with the given account.
This can be altered using `hostFilter` parameter.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">hostFilter</td>
<td valign="top"><a href="#hostfilter">HostFilter</a></td>
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

## Inputs

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
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by fqdn

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_arch</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'arch' field of system profile

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
<td colspan="2" valign="top"><strong>spf_os_kernel_version</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'os_kernel_version' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_infrastructure_type</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'infrastructure_type' field of system profile

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_infrastructure_vendor</strong></td>
<td valign="top"><a href="#filterstringwithwildcard">FilterStringWithWildcard</a></td>
<td>

Filter by 'infrastructure_vendor' field of system profile

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
<td colspan="2" valign="top"><strong>spf_sap_sids</strong></td>
<td valign="top"><a href="#filterstring">FilterString</a></td>
<td>

Filter by 'sap_sids' field of system profile

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
```

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

