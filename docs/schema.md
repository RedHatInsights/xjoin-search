# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Objects](#objects)
    * [CollectionMeta](#collectionmeta)
    * [Host](#host)
    * [HostTags](#hosttags)
    * [Hosts](#hosts)
    * [StructuredTag](#structuredtag)
    * [TagInfo](#taginfo)
    * [Tags](#tags)
  * [Inputs](#inputs)
    * [HostFilter](#hostfilter)
    * [TagAggregationFilter](#tagaggregationfilter)
    * [TagFilter](#tagfilter)
    * [TimestampFilter](#timestampfilter)
  * [Enums](#enums)
    * [HOSTS_ORDER_BY](#hosts_order_by)
    * [HOST_TAGS_ORDER_BY](#host_tags_order_by)
    * [ORDER_DIR](#order_dir)
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
</tbody>
</table>

## Objects

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
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>system_profile_facts</strong></td>
<td valign="top"><a href="#jsonobject">JSONObject</a></td>
<td>

EXPERIMENTAL - do not use!

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tags</strong></td>
<td valign="top"><a href="#tags">Tags</a></td>
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

### HostFilter

Defines criteria by which the hosts are filtered.

Some filters support wildcards.
Those that do can be used for exact matches (`fqdn: example.com`) or with wildcards (`fqdn: *.example.co?`)

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
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>OR</strong></td>
<td valign="top">[<a href="#hostfilter">HostFilter</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>NOT</strong></td>
<td valign="top"><a href="#hostfilter">HostFilter</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Filter by host id. This filter supports wildcards

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>insights_id</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Filter by insights id. This filter supports wildcards

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>display_name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Filter by display_name. This filter supports wildcards

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>fqdn</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Filter by fqdn. This filter supports wildcards

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_arch</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_os_release</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_os_kernel_version</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_infrastructure_type</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>spf_infrastructure_vendor</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stale_timestamp</strong></td>
<td valign="top"><a href="#timestampfilter">TimestampFilter</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tag</strong></td>
<td valign="top"><a href="#tagfilter">TagFilter</a></td>
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
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Defines a tag name filter.
A tag name filter is a regular exression that operates on percent-encoded tag namespace, key and value at the same time.
In order to match the query regular expression needs to match percent-encoded strings.

For example, to match tags with `Δwithčhars!` suffix the tag name query should look like:
```
{
    name: ".*%CE%94with%C4%8Dhars%21"
}
```

</td>
</tr>
</tbody>
</table>

### TagFilter

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

### TimestampFilter

Defines criteria by which the timestamp fields are filtered.

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
<td colspan="2" valign="top"><strong>lte</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>gte</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lt</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>gt</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
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

