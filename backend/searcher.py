import json
import time
import uuid

import weaviate.classes as wvc
from loguru import logger
from weaviate.collections.classes.aggregate import AggregateText, AggregateNumber

import backend.models as models
import backend.connection as connection

client = connection.get_client()
product_collection = client.collections.get("fashion")

multi_value_facets = ["tags", "colors"]


def get_product(product_id: uuid.UUID) -> models.ResponseProduct:
    hit = product_collection.query.fetch_object_by_id(product_id)
    return models.ResponseProduct(**hit.properties)


def search(search_request: models.SearchRequest) -> models.SearchResponse:
    unfiltered_agg_response = None

    filters = build_filters(search_request)

    start_time = time.time()
    search_response = execute_search(product_collection, search_request, filters)
    num_results = len(search_response.objects)
    if search_response and num_results > 0:
        hits_to_agg = len(search_response.objects)
        if search_request.size >= num_results:
            hits_to_agg: 10000

        agg_response = execute_aggregation(
            product_collection, search_request, filters, hits_to_agg
        )
        if search_request.filters:
            unfiltered_agg_response = execute_aggregation(
                product_collection, search_request, None, 10000
            )

        took = build_took(start_time)
        hits = build_hits(search_response)
        facets = build_facets(search_request, agg_response, unfiltered_agg_response)

        total_hits = (
            num_results
            if num_results < search_request.size
            else agg_response.total_count
        )

        return models.SearchResponse(
            query=search_request.query,
            session_id=search_request.session_id,
            total_hits=total_hits,
            took=took,
            hits=hits,
            facets=facets,
        )
    else:
        return models.SearchResponse(
            query=search_request.query,
            session_id=search_request.session_id,
            total_hits=0,
            took=0,
            selected_category="",
            hits=[],
            facets=[],
        )


def recommend(recommend_request: models.RecommendRequest) -> models.RecommendResponse:
    start_time = time.time()
    offset = (recommend_request.page - 1) * recommend_request.size
    search_response = product_collection.query.near_object(
        offset=1 + offset,
        near_object=recommend_request.product_id,
        limit=recommend_request.size,
        return_metadata=wvc.query.MetadataQuery(certainty=True),
    )
    hits = build_hits(search_response)
    took = build_took(start_time)

    return models.RecommendResponse(
        session_id=recommend_request.session_id, took=took, hits=hits
    )


def build_took(start_time):
    end_time = time.time()
    took = int((end_time - start_time) * 1000)
    return took


def build_sort(search_request):
    if (
        search_request.sort is None
        or search_request.sort.name == models.SortField.RELEVANCE
    ):
        return None

    sort_field_to_property_name = {
        models.SortField.POPULARITY: "rating",
        models.SortField.NAME: "name",
        models.SortField.PRICE: "price",
    }

    is_asc = search_request.sort.order == models.SortOrder.ASC
    property_name = sort_field_to_property_name.get(search_request.sort.name)

    return wvc.query.Sort.by_property(name=property_name, ascending=is_asc)


def execute_search(product_collection, search_request, filters):
    query = search_request.query
    size = search_request.size
    offset = (search_request.page - 1) * search_request.size
    search_type = search_request.type

    sort = build_sort(search_request)

    if query is not None and query != "":
        if search_type == models.SearchType.KEYWORD:
            return product_collection.query.bm25(
                query_properties=[
                    "name",
                    "description",
                    "category",
                    "subcategory",
                    "collection",
                    "reviews",
                ],
                query=query,
                limit=size,
                offset=offset,
                filters=filters,
                auto_limit=2,
                return_metadata=wvc.query.MetadataQuery(score=True, distance=True),
            )
        elif search_type == models.SearchType.VECTOR:
            return product_collection.query.near_text(
                query=query,
                limit=size,
                offset=offset,
                filters=filters,
                auto_limit=2,
                return_metadata=wvc.query.MetadataQuery(certainty=True, distance=True),
            )
        elif search_type == models.SearchType.HYBRID:
            return product_collection.query.hybrid(
                query_properties=[
                    "name",
                    "description",
                    "category",
                    "subcategory",
                    "collection",
                    "reviews",
                ],
                query=query,
                limit=size,
                offset=offset,
                alpha=0.7,
                filters=filters,
                auto_limit=2,
                return_metadata=wvc.query.MetadataQuery(score=True, explain_score=True),
            )
    else:
        return product_collection.query.fetch_objects(
            limit=size,
            offset=offset,
            filters=filters,
            return_metadata=wvc.query.MetadataQuery(certainty=True, distance=True),
            sort=sort,
        )


def execute_aggregation(product_collection, search_request, filters, number_of_hits):
    aggs = {
        "category": wvc.query.Metrics("category").text(
            top_occurrences_count=True, top_occurrences_value=True, min_occurrences=10
        ),
        "subcategory": wvc.query.Metrics("subcategory").text(
            top_occurrences_count=True, top_occurrences_value=True, min_occurrences=10
        ),
        "collection": wvc.query.Metrics("collection").text(
            top_occurrences_count=True, top_occurrences_value=True, min_occurrences=10
        ),
        "brand": wvc.query.Metrics("brand").text(
            top_occurrences_count=True, top_occurrences_value=True, min_occurrences=10
        ),
        "tags": wvc.query.Metrics("tags").text(
            top_occurrences_count=True, top_occurrences_value=True, min_occurrences=10
        ),
        "price": wvc.query.Metrics("price").number(maximum=True, minimum=True),
        "colors": wvc.query.Metrics("colors").text(
            top_occurrences_count=True, top_occurrences_value=True, min_occurrences=10
        ),
    }

    query = search_request.query
    if query is not None and query != "":
        return product_collection.aggregate.near_text(
            query=query,
            object_limit=number_of_hits,
            filters=filters,
            total_count=True,
            return_metrics=list(aggs.values()),
        )
    else:
        return product_collection.aggregate.over_all(
            filters=filters, total_count=True, return_metrics=list(aggs.values())
        )


def build_hits(search_response):
    return [
        models.ResponseProduct(
            **hit.properties,
            score=(
                hit.metadata.distance
                if hit.metadata.distance is not None
                else (
                    hit.metadata.certainty
                    if hit.metadata.certainty is not None
                    else hit.metadata.score if hit.metadata.score is not None else 0
                )
            )
        )
        for hit in search_response.objects
    ]


def build_filters(search_request: models.SearchRequest):
    combined_filter = None

    for filter_item in search_request.filters:
        if isinstance(filter_item, models.TermFilter):
            current_filter = wvc.query.Filter.by_property(filter_item.name).equal(
                filter_item.value
            )
        elif isinstance(filter_item, models.TermsFilter):
            if filter_item.name in multi_value_facets:
                current_filter = wvc.query.Filter.by_property(
                    filter_item.name
                ).contains_all(filter_item.values)
            else:
                current_filter = wvc.query.Filter.by_property(
                    filter_item.name
                ).contains_any(filter_item.values)
        elif isinstance(filter_item, models.RangeFilter):
            gte_filter = wvc.query.Filter.by_property(
                filter_item.name
            ).greater_or_equal(filter_item.gte)
            lte_filter = wvc.query.Filter.by_property(filter_item.name).less_or_equal(
                filter_item.lte
            )
            current_filter = gte_filter & lte_filter
        else:
            current_filter = None

        combined_filter = (
            current_filter
            if combined_filter is None
            else combined_filter & current_filter
        )

    return combined_filter


def determine_status(search_request, facet_name, facet_item_value):
    for search_filter in search_request.filters:
        if search_filter.name == facet_name:
            if isinstance(search_filter, models.TermFilter):
                if search_filter.value == facet_item_value:
                    return models.FacetItemStatus.CLICKED
                else:
                    return models.FacetItemStatus.DISABLED
            elif isinstance(search_filter, models.TermsFilter):
                if facet_item_value in search_filter.values:
                    return models.FacetItemStatus.CLICKED
    return models.FacetItemStatus.CLICKABLE


def build_facets(search_request, agg_response, unfiltered_agg_response):
    facets = []
    if agg_response:
        for facet_name, value in agg_response.properties.items():
            if isinstance(value, AggregateText):
                if facet_name == "category" or facet_name == "subcategory":
                    values = []
                    value_strings = []
                    for facet_item in value.top_occurrences:
                        facet_value = models.FacetItemValue(
                            name=facet_item.value,
                            hits=facet_item.count,
                            status=determine_status(
                                search_request, facet_name, facet_item.value
                            ),
                        )
                        value_strings.append(facet_item.value)
                        values.append(facet_value)
                    facets.append(models.CategoryFacet(name=facet_name, values=values))
                elif facet_name == "collection":
                    values = [
                        models.FacetItemValue(
                            name=occurrence.value,
                            status=determine_status(
                                search_request, facet_name, occurrence.value
                            ),
                        )
                        for occurrence in value.top_occurrences
                    ]
                    facets.append(
                        models.CollectionFacet(name=facet_name, values=values)
                    )
                else:
                    values = []
                    value_strings = []
                    for facet_item in value.top_occurrences:
                        facet_value = models.FacetItemValue(
                            name=facet_item.value,
                            hits=facet_item.count,
                            status=determine_status(
                                search_request, facet_name, facet_item.value
                            ),
                        )
                        value_strings.append(facet_item.value)
                        values.append(facet_value)
                    if facet_name in multi_value_facets:
                        facets.append(models.TermsFacet(name=facet_name, values=values))
                    else:
                        facets.append(models.TermFacet(name=facet_name, values=values))
            elif isinstance(value, AggregateNumber):

                selected_lower = None
                selected_upper = None
                lower = value.minimum
                upper = value.maximum
                for filter_item in search_request.filters:
                    if (
                        isinstance(filter_item, models.RangeFilter)
                        and filter_item.name == facet_name
                    ):
                        selected_lower = filter_item.gte
                        selected_upper = filter_item.lte
                        lower = unfiltered_agg_response.properties.get("price").minimum
                        upper = unfiltered_agg_response.properties.get("price").maximum

                facets.append(
                    models.RangeFacet(
                        name=facet_name,
                        lower=lower,
                        upper=upper,
                        selected_lower=selected_lower,
                        selected_upper=selected_upper,
                    )
                )
    return facets


if __name__ == "__main__":
    response = search(
        models.SearchRequest(
            type=models.SearchType.HYBRID,
            query="yellow garden shirt",
            session_id=uuid.uuid4(),
            page=1,
            size=10,
            filters=[models.TermFilter(name="brand", value="NixNada")],
            sort=models.Sort(
                name=models.SortField.RELEVANCE, order=models.SortOrder.DESC
            ),
        )
    )

    logger.info(json.dumps(response.model_dump(mode="json")))
